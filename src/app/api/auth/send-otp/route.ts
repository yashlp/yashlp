import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizePhone } from "@/lib/auth";
import { sendOtp } from "@/lib/otp";

const schema = z.object({
  phone: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone: raw } = schema.parse(body);
    const phone = normalizePhone(raw);

    await sendOtp(phone);

    return NextResponse.json({
      ok: true,
      phone,
      message: "Verification code sent",
      demoHint: process.env.NODE_ENV !== "production" ? "Demo code: 123456" : undefined,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
