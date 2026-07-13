import { NextRequest, NextResponse } from "next/server";
import { verifyAdminOtp } from "@/lib/commerce/admin-auth";
import { adminOtpSchema } from "@/lib/commerce/validators";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = adminOtpSchema.parse(await req.json());
    const admin = await verifyAdminOtp(body.adminId, body.code);
    return NextResponse.json({ admin });
  } catch (error) {
    return commerceApiError(error);
  }
}
