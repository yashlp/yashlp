import { NextRequest, NextResponse } from "next/server";
import { adminLogin } from "@/lib/commerce/admin-auth";
import { adminLoginSchema } from "@/lib/commerce/validators";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = adminLoginSchema.parse(await req.json());
    const result = await adminLogin(body.email, body.password);
    return NextResponse.json(result);
  } catch (error) {
    return commerceApiError(error);
  }
}
