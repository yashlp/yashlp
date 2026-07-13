import { NextRequest, NextResponse } from "next/server";
import { loginWithEmail } from "@/lib/commerce/customer-auth";
import { customerEmailLoginSchema } from "@/lib/commerce/validators/customer";

export async function POST(req: NextRequest) {
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
