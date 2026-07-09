import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizePhone } from "@/lib/auth";
import { getAdminPhones } from "@/lib/admin";
import { rateLimitKey, rateLimitResponse } from "@/lib/api-security";
import { sendOtp } from "@/lib/otp";

const schema = z.object({
  phone: z.string().min(10),
});

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "send-otp", 10, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { phone: raw } = schema.parse(body);
    const phone = normalizePhone(raw);

    if (getAdminPhones().includes(phone)) {
      return NextResponse.json(
        { error: "Use the admin sign-in page at /admin/login for this number." },
        { status: 403 }
      );
    }

    const phoneLimited = rateLimitKey("send-otp-phone", phone, 3, 15 * 60 * 1000);
    if (phoneLimited) return phoneLimited;

    await sendOtp(phone);

    return NextResponse.json({
      ok: true,
      phone,
      message: "Verification code sent",
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
