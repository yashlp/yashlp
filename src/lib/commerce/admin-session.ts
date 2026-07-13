import { createHash, randomBytes } from "crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/db";

const ADMIN_SESSION_COOKIE = "aes_admin_session";
const SESSION_HOURS = 8;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function createAdminSession(
  adminId: string,
  meta?: { userAgent?: string; ipAddress?: string; deviceLabel?: string }
) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);

  await prisma.commerceAdminSession.create({
    data: {
      adminId,
      tokenHash: hashToken(token),
      userAgent: meta?.userAgent,
      ipAddress: meta?.ipAddress,
      deviceLabel: meta?.deviceLabel,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    process.env.FORCE_SECURE_COOKIES === "true";

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    maxAge: SESSION_HOURS * 60 * 60,
    path: "/",
  });

  return token;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await prisma.commerceAdminSession.updateMany({
      where: { tokenHash: hashToken(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export type CommerceAdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  mfaEnabled: boolean;
};

export async function getCommerceAdmin(): Promise<CommerceAdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.commerceAdminSession.findFirst({
    where: {
      tokenHash: hashToken(token),
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      admin: {
        select: { id: true, email: true, name: true, role: true, mfaEnabled: true, isActive: true },
      },
    },
  });

  if (!session?.admin?.isActive) return null;
  return session.admin;
}

export async function requireCommerceAdmin(): Promise<CommerceAdminUser> {
  const admin = await getCommerceAdmin();
  if (!admin) throw new CommerceAuthError("Admin authentication required");
  return admin;
}

export class CommerceAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommerceAuthError";
  }
}

export async function getRequestMeta() {
  const h = await headers();
  return {
    ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined,
    userAgent: h.get("user-agent") || undefined,
  };
}
