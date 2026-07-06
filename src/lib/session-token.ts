import { createHmac, timingSafeEqual } from "crypto";
import { getSessionSecret } from "./env";

export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export function createSessionToken(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const payload = `${userId}:${exp}`;
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = sign(payload);
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const [userId, expStr] = payload.split(":");
  const exp = Number(expStr);
  if (!userId || !Number.isFinite(exp)) return null;
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

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}
