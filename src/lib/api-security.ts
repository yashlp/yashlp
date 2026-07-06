import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "./rate-limit";

export function rateLimitResponse(
  req: Request,
  bucket: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const ip = getClientIp(req);
  const result = rateLimit(`${bucket}:${ip}`, limit, windowMs);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfterSec) },
      }
    );
  }
  return null;
}

export function rateLimitKey(
  bucket: string,
  key: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const result = rateLimit(`${bucket}:${key}`, limit, windowMs);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfterSec) },
      }
    );
  }
  return null;
}
