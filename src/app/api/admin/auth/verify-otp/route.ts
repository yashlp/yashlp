import { NextRequest, NextResponse } from "next/server";
import { verifyAdminOtp } from "@/lib/commerce/admin-auth";
import { adminOtpSchema } from "@/lib/commerce/validators";
import { commerceApiError } from "@/lib/commerce/api-utils";
import { rateLimitResponse } from "@/lib/api-security";

export async function POST(req: NextRequest) {
  const limited = rateLimitResponse(req, "admin-auth-verify-otp", 10, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = adminOtpSchema.parse(await req.json());
    const admin = await verifyAdminOtp(body.adminId, body.code);
    return NextResponse.json({ admin });
  } catch (error) {
    return commerceApiError(error);
  }
}
