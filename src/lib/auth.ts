import { cookies } from "next/headers";
import { prisma } from "./db";
import { createSessionToken, SESSION_MAX_AGE_SEC, verifySessionToken } from "./session-token";

const SESSION_COOKIE = "civiclens_session";

export type SessionUser = {
  id: string;
  phone: string;
  name: string;
  nameChangeCount: number;
  reputation: number;
  reliabilityScore: number;
  role: string;
  countryCode: string | null;
  legalProfile: string | null;
  termsAcceptedAt: Date | null;
  termsVersion: string | null;
};

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) throw new Error("Enter a valid phone number");
  return `+${digits}`;
}

export async function createSession(userId: string) {
  const token = createSessionToken(userId);
  const cookieStore = await cookies();
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    process.env.FORCE_SECURE_COOKIES === "true";
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SEC,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = verifySessionToken(token);
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      name: true,
      nameChangeCount: true,
      reputation: true,
      reliabilityScore: true,
      role: true,
      countryCode: true,
      legalProfile: true,
      termsAcceptedAt: true,
      termsVersion: true,
    },
  });

  return user;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
