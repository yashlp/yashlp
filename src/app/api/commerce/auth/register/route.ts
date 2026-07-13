import { NextRequest, NextResponse } from "next/server";
import { registerCustomer } from "@/lib/commerce/customer-auth";
import { customerRegisterSchema } from "@/lib/commerce/validators/customer";

export async function POST(req: NextRequest) {
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
