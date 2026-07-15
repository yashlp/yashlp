import { NextRequest, NextResponse } from "next/server";
import { adminLogin } from "@/lib/commerce/admin-auth";
import { adminLoginSchema } from "@/lib/commerce/validators";
import { commerceApiError } from "@/lib/commerce/api-utils";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`admin_login:${ip}`, 12, 15 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const body = adminLoginSchema.parse(await req.json());
    const result = await adminLogin(body.email, body.password);
    return NextResponse.json(result);
  } catch (error) {
    return commerceApiError(error);
  }
}
