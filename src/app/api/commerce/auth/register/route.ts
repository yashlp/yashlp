import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { registerCustomer } from "@/lib/commerce/customer-auth";
import { customerRegisterSchema } from "@/lib/commerce/validators/customer";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`commerce-register:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${limited.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const body = customerRegisterSchema.parse(await req.json());
    const customer = await registerCustomer(body);
    return NextResponse.json({
      customer: { id: customer.id, email: customer.email, name: customer.name, phone: customer.phone },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
