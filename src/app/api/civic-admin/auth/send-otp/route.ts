import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/api-security";
import { getPrimaryAdminPhone } from "@/lib/admin-phone";
import { sendOtp } from "@/lib/otp";
import { isDemoOtpAllowed } from "@/lib/env";

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "admin-send-otp", 5, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const phone = getPrimaryAdminPhone();
    await sendOtp(phone);

    return NextResponse.json({
      ok: true,
      message: "Admin verification code sent",
      demoHint: isDemoOtpAllowed() ? "Demo code: 123456" : undefined,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not send admin code";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
