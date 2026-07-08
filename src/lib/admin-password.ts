import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getSessionSecret } from "./env";

const ADMIN_COOKIE = "civiclens_admin_unlock";
const ADMIN_UNLOCK_MAX_AGE_SEC = 60 * 60 * 8; // 8 hours
const SCRYPT_KEYLEN = 32;

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function hashAdminPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `s2$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function verifyAdminPassword(password: string, storedHash: string | null | undefined): boolean {
  if (!storedHash) return false;
  const [scheme, saltB64, hashB64] = storedHash.split("$");
  if (scheme !== "s2" || !saltB64 || !hashB64) return false;

  try {
    const salt = Buffer.from(saltB64, "base64url");
    const expected = Buffer.from(hashB64, "base64url");
    const actual = scryptSync(password, salt, expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createAdminUnlockToken(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_UNLOCK_MAX_AGE_SEC;
  const payload = `${userId}:${exp}:admin`;
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = sign(payload);
  return `${payloadB64}.${sig}`;
}

export function verifyAdminUnlockToken(token: string): string | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const [userId, expStr, scope] = payload.split(":");
  const exp = Number(expStr);
  if (!userId || !Number.isFinite(exp) || scope !== "admin") return null;
  if (exp < Math.floor(Date.now() / 1000)) return null;

  const expected = sign(payload);
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  return userId;
}

export async function setAdminUnlockSession(userId: string): Promise<void> {
  const token = createAdminUnlockToken(userId);
  const cookieStore = await cookies();
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    process.env.FORCE_SECURE_COOKIES === "true";
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: ADMIN_UNLOCK_MAX_AGE_SEC,
    path: "/",
  });
}

export async function clearAdminUnlockSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminUnlocked(userId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminUnlockToken(token) === userId;
}

