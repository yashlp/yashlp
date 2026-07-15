import { NextRequest, NextResponse } from "next/server";
import { loginWithEmail } from "@/lib/commerce/customer-auth";
import { customerEmailLoginSchema } from "@/lib/commerce/validators/customer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`customer_login:${ip}`, 15, 15 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const body = customerEmailLoginSchema.parse(await req.json());
    const customer = await loginWithEmail(body.email, body.password);
    return NextResponse.json({
      customer: { id: customer.id, email: customer.email, name: customer.name, phone: customer.phone },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
