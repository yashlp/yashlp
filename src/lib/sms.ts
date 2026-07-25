type SmsDispatchResult = { ok: true } | { ok: false; error: string };

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** MSG91 legacy SendOTP API — sends our generated OTP via SMS. */
async function sendMsg91Otp(phone: string, code: string): Promise<SmsDispatchResult> {
  const authKey = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER_ID ?? "ONLYAE";
  if (!authKey) return { ok: false, error: "SMS_API_KEY is not configured" };

  const mobile = digitsOnly(phone);
  const params = new URLSearchParams({
    authkey: authKey,
    mobile,
    otp: code,
    otp_length: String(code.length),
    sender,
  });

  const res = await fetch(`https://api.msg91.com/api/sendotp.php?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return { ok: false, error: `MSG91 request failed (${res.status})` };
  }

  const body = (await res.json().catch(() => null)) as { type?: string; message?: string } | null;
  if (body?.type === "success") return { ok: true };

  return {
    ok: false,
    error: body?.message ?? "MSG91 did not accept the OTP request",
  };
}

export async function sendSmsOtp(phone: string, code: string): Promise<SmsDispatchResult> {
  const provider = (process.env.SMS_PROVIDER ?? "").toLowerCase();

  switch (provider) {
    case "msg91":
      return sendMsg91Otp(phone, code);
    default:
      return { ok: false, error: `Unsupported SMS provider: ${provider || "(none)"}` };
  }
}
