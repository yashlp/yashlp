import { cookies } from "next/headers";
import { prisma } from "./db";

const SESSION_COOKIE = "civiclens_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type SessionUser = {
  id: string;
  phone: string;
  name: string;
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
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      name: true,
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
