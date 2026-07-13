import { NextRequest, NextResponse } from "next/server";
import { verifyPhoneOtp } from "@/lib/commerce/customer-auth";
import { customerPhoneVerifySchema } from "@/lib/commerce/validators/customer";

export async function POST(req: NextRequest) {
  try {
    const body = customerPhoneVerifySchema.parse(await req.json());
    const customer = await verifyPhoneOtp(body.phone, body.code);
    return NextResponse.json({
      customer: { id: customer.id, email: customer.email, name: customer.name, phone: customer.phone },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
