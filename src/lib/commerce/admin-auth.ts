import { prisma } from "@/lib/db";
import { verifyPassword } from "./password";
import {
  createAdminSession,
  destroyAdminSession,
  getRequestMeta,
  type CommerceAdminUser,
} from "./admin-session";

const OTP_EXPIRY_MIN = 10;
const MAX_FAILED_ATTEMPTS = 5;

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

  const recentFails = await prisma.commerceLoginAttempt.count({
    where: {
      email: normalized,
      success: false,
      createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
    },
  });
  if (recentFails >= MAX_FAILED_ATTEMPTS) {
    throw new Error("Too many failed attempts. Try again in 15 minutes.");
  }

  if (admin.mfaEnabled || process.env.COMMERCE_ADMIN_REQUIRE_OTP === "true") {
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
  const code =
    process.env.ALLOW_DEMO_OTP === "true"
      ? "123456"
      : String(Math.floor(100000 + Math.random() * 900000));

  await prisma.commerceAdminOtp.create({
    data: {
      adminId,
      code,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000),
    },
  });

  // Production: send email via Resend
  if (process.env.NODE_ENV === "development") {
    console.info(`[Commerce Admin OTP] ${code}`);
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
    data: { lastLoginAt: new Date(), lastLoginIp: meta.ipAddress },
  });
  await createAdminSession(admin.id, meta);
  await logLoginAttempt(admin.email, true, admin.id, "otp_verified");

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    mfaEnabled: admin.mfaEnabled,
  };
}

export async function adminLogout() {
  await destroyAdminSession();
}
