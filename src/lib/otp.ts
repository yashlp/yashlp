import { prisma } from "./db";
import { isDemoOtpAllowed, isProduction, isSmsConfigured } from "./env";
import { rateLimit } from "./rate-limit";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_VERIFY_FAILURES = 5;
const VERIFY_LOCKOUT_MS = 15 * 60 * 1000;
export const DEMO_OTP = "123456";

const verifyFailures = new Map<string, { count: number; lockedUntil: number }>();

export function generateOtp(): string {
  if (isDemoOtpAllowed()) return DEMO_OTP;
  return String(Math.floor(100000 + Math.random() * 900000));
}

function isPhoneLocked(phone: string): boolean {
  const entry = verifyFailures.get(phone);
  if (!entry) return false;
  if (Date.now() < entry.lockedUntil) return true;
  verifyFailures.delete(phone);
  return false;
}

function recordVerifyFailure(phone: string): void {
  const entry = verifyFailures.get(phone) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_VERIFY_FAILURES) {
    entry.lockedUntil = Date.now() + VERIFY_LOCKOUT_MS;
    entry.count = 0;
  }
  verifyFailures.set(phone, entry);
}

function clearVerifyFailures(phone: string): void {
  verifyFailures.delete(phone);
}

export async function sendOtp(phone: string) {
  if (isProduction() && !isSmsConfigured()) {
    if (!isDemoOtpAllowed()) {
      throw new Error("SMS verification is not configured. Contact support.");
    }
  }

  const sendLimit = rateLimit(`otp-send:${phone}`, 3, 15 * 60 * 1000);
  if (!sendLimit.ok) {
    throw new Error("Too many code requests. Please wait before trying again.");
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.otpCode.deleteMany({ where: { phone } });
  await prisma.otpCode.create({ data: { phone, code, expiresAt } });

  if (isProduction() && isSmsConfigured()) {
    await dispatchSms(phone, code);
  }

  return { code, expiresAt };
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  if (isPhoneLocked(phone)) return false;

  if (isProduction() && code === DEMO_OTP && !isDemoOtpAllowed()) {
    recordVerifyFailure(phone);
    return false;
  }

  const record = await prisma.otpCode.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    recordVerifyFailure(phone);
    return false;
  }
  if (record.expiresAt < new Date()) {
    recordVerifyFailure(phone);
    return false;
  }
  if (record.code !== code) {
    recordVerifyFailure(phone);
    return false;
  }

  await prisma.otpCode.delete({ where: { id: record.id } });
  clearVerifyFailures(phone);
  return true;
}

async function dispatchSms(phone: string, code: string): Promise<void> {
  const provider = process.env.SMS_PROVIDER;
  const apiKey = process.env.SMS_API_KEY;

  if (!provider || !apiKey) return;

  // Provider-specific integration point — wire Twilio, MSG91, etc. here.
  console.info(`[SMS:${provider}] OTP dispatched to ${phone.slice(0, 4)}****`);
  void code;
}
