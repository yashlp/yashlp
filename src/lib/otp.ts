import { prisma } from "./db";

const OTP_TTL_MS = 10 * 60 * 1000;
export const DEMO_OTP = "123456";

export function generateOtp(): string {
  if (process.env.NODE_ENV !== "production") return DEMO_OTP;
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOtp(phone: string) {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.otpCode.deleteMany({ where: { phone } });
  await prisma.otpCode.create({ data: { phone, code, expiresAt } });

  return { code, expiresAt };
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const record = await prisma.otpCode.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return false;
  if (record.expiresAt < new Date()) return false;
  if (record.code !== code) return false;

  await prisma.otpCode.delete({ where: { id: record.id } });
  return true;
}
