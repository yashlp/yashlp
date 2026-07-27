import { prisma } from "@/lib/db";
import { verifyPassword } from "./password";
import {
  createAdminSession,
  destroyAdminSession,
  getRequestMeta,
  type CommerceAdminUser,
} from "./admin-session";
import { sendAdminOtpEmail } from "./commerce-email";

const OTP_EXPIRY_MIN = 10;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

function isAdminOtpRequired(adminMfaEnabled: boolean) {
  if (process.env.COMMERCE_ADMIN_REQUIRE_OTP === "false") return false;
  if (process.env.COMMERCE_ADMIN_REQUIRE_OTP === "true" || adminMfaEnabled) return true;
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

async function assertNotLockedOut(email: string) {
  const recentFails = await prisma.commerceLoginAttempt.count({
    where: {
      email,
      success: false,
      createdAt: { gte: new Date(Date.now() - LOCKOUT_WINDOW_MS) },
    },
  });
  if (recentFails >= MAX_FAILED_ATTEMPTS) {
    throw new Error("Too many failed attempts. Try again in 15 minutes.");
  }
}

export async function logLoginAttempt(
  email: string,
  success: boolean,
  adminId?: string,
  reason?: string
) {
  const meta = await getRequestMeta();
  await prisma.commerceLoginAttempt.create({
    data: {
      email: email.toLowerCase(),
      adminId,
      success,
      reason,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    },
  });
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ requiresOtp: true; adminId: string } | { requiresOtp: false; admin: CommerceAdminUser }> {
  const normalized = email.toLowerCase().trim();
  await assertNotLockedOut(normalized);

  const admin = await prisma.commerceAdmin.findUnique({ where: { email: normalized } });

  if (!admin || !admin.isActive) {
    await logLoginAttempt(normalized, false, undefined, "invalid_credentials");
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    await logLoginAttempt(normalized, false, admin.id, "invalid_password");
    throw new Error("Invalid email or password");
  }

  if (isAdminOtpRequired(admin.mfaEnabled)) {
    await createAdminOtp(admin.id);
    return { requiresOtp: true, adminId: admin.id };
  }

  const meta = await getRequestMeta();
  await prisma.commerceAdmin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date(), lastLoginIp: meta.ipAddress },
  });
  await createAdminSession(admin.id, meta);
  await logLoginAttempt(normalized, true, admin.id);

  return {
    requiresOtp: false,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      mfaEnabled: admin.mfaEnabled,
    },
  };
}

export async function createAdminOtp(adminId: string) {
  const admin = await prisma.commerceAdmin.findUniqueOrThrow({ where: { id: adminId } });
  const allowDemo =
    process.env.ALLOW_DEMO_OTP === "true" && process.env.NODE_ENV !== "production";
  const code = allowDemo ? "123456" : String(Math.floor(100000 + Math.random() * 900000));

  await prisma.commerceAdminOtp.create({
    data: {
      adminId,
      code,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000),
    },
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(`[Commerce Admin OTP] ${admin.email}: ${code}`);
  }

  const sent = await sendAdminOtpEmail(admin.email, code);
  if (!sent.ok && process.env.NODE_ENV === "production") {
    throw new Error(`Could not send admin OTP email: ${sent.error}`);
  }
}

export async function verifyAdminOtp(adminId: string, code: string): Promise<CommerceAdminUser> {
  const otp = await prisma.commerceAdminOtp.findFirst({
    where: {
      adminId,
      code,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) throw new Error("Invalid or expired OTP");

  await prisma.commerceAdminOtp.update({
    where: { id: otp.id },
    data: { usedAt: new Date() },
  });

  const admin = await prisma.commerceAdmin.findUniqueOrThrow({ where: { id: adminId } });
  const meta = await getRequestMeta();

  await prisma.commerceAdmin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date(), lastLoginIp: meta.ipAddress, mfaEnabled: true },
  });
  await createAdminSession(admin.id, meta);
  await logLoginAttempt(admin.email, true, admin.id, "otp_verified");

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    mfaEnabled: true,
  };
}

export async function adminLogout() {
  await destroyAdminSession();
}
