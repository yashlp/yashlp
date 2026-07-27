import { NextRequest, NextResponse } from "next/server";
import { adminLogin } from "@/lib/commerce/admin-auth";
import { adminLoginSchema } from "@/lib/commerce/validators";
import { commerceApiError } from "@/lib/commerce/api-utils";
import { rateLimitResponse } from "@/lib/api-security";

export async function POST(req: NextRequest) {
  const limited = rateLimitResponse(req, "admin-auth-login", 10, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = adminLoginSchema.parse(await req.json());
    const result = await adminLogin(body.email, body.password);
    return NextResponse.json(result);
  } catch (error) {
    return commerceApiError(error);
  }
}
