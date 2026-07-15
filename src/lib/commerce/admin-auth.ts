import { createHash } from "crypto";
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
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex");
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

  const requireOtp = admin.mfaEnabled || process.env.COMMERCE_ADMIN_REQUIRE_OTP === "true";

  if (requireOtp) {
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
  const allowDemoOtp =
    process.env.ALLOW_DEMO_OTP === "true" && process.env.NODE_ENV !== "production";
  const code = allowDemoOtp
    ? "123456"
    : String(Math.floor(100000 + Math.random() * 900000));

  await prisma.commerceAdminOtp.create({
    data: {
      adminId,
      // Store hash in `code` column — never keep plaintext OTPs.
      code: hashOtp(code),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000),
    },
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(`[Commerce Admin OTP] ${code}`);
  } else if (!process.env.RESEND_API_KEY && !process.env.COMMERCE_ADMIN_OTP_WEBHOOK) {
    console.warn(
      "[Commerce Admin OTP] Generated for admin but no email delivery configured (RESEND_API_KEY)."
    );
  }

  // Optional delivery hooks (configure one for production MFA)
  const webhook = process.env.COMMERCE_ADMIN_OTP_WEBHOOK;
  if (webhook) {
    const admin = await prisma.commerceAdmin.findUnique({ where: { id: adminId } });
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "admin_otp",
          email: admin?.email,
          code,
          expiresInMinutes: OTP_EXPIRY_MIN,
        }),
      });
    } catch (err) {
      console.error("[Commerce Admin OTP] webhook delivery failed", err);
    }
  }
}

export async function verifyAdminOtp(adminId: string, code: string): Promise<CommerceAdminUser> {
  const admin = await prisma.commerceAdmin.findUnique({ where: { id: adminId } });
  if (!admin) throw new Error("Invalid or expired OTP");

  await assertNotLockedOut(admin.email);

  const otp = await prisma.commerceAdminOtp.findFirst({
    where: {
      adminId,
      code: hashOtp(code),
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    await logLoginAttempt(admin.email, false, adminId, "invalid_otp");
    throw new Error("Invalid or expired OTP");
  }

  await prisma.commerceAdminOtp.update({
    where: { id: otp.id },
    data: { usedAt: new Date() },
  });

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
