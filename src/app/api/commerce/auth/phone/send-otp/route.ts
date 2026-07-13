import { NextRequest, NextResponse } from "next/server";
import { sendPhoneOtp } from "@/lib/commerce/customer-auth";
import { customerPhoneOtpSchema } from "@/lib/commerce/validators/customer";

export async function POST(req: NextRequest) {
  try {
    const body = customerPhoneOtpSchema.parse(await req.json());
    const result = await sendPhoneOtp(body.phone);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send code";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
