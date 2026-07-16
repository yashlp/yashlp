import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { loginWithEmail } from "@/lib/commerce/customer-auth";
import { customerEmailLoginSchema } from "@/lib/commerce/validators/customer";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`commerce-login:${ip}`, 12, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${limited.retryAfterSec}s.` },
      { status: 429 }
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
