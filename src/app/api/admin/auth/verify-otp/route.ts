import { NextRequest, NextResponse } from "next/server";
import { verifyAdminOtp } from "@/lib/commerce/admin-auth";
import { adminOtpSchema } from "@/lib/commerce/validators";
import { commerceApiError } from "@/lib/commerce/api-utils";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`admin_otp:${ip}`, 20, 15 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many OTP attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const body = adminOtpSchema.parse(await req.json());
    const admin = await verifyAdminOtp(body.adminId, body.code);
    return NextResponse.json({ admin });
  } catch (error) {
    return commerceApiError(error);
  }
}
