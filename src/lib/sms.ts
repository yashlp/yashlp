type SmsDispatchResult = { ok: true } | { ok: false; error: string };

export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Prefer 91XXXXXXXXXX for Indian mobiles (MSG91). */
export function smsMobile(phone: string): string {
  const d = digitsOnly(phone);
  if (d.length === 10) return `91${d}`;
  if (d.startsWith("0") && d.length === 11) return `91${d.slice(1)}`;
  return d;
}

function msg91AuthKey(): string | null {
  return process.env.SMS_API_KEY?.trim() || null;
}

function msg91Sender(): string {
  return process.env.SMS_SENDER_ID?.trim() || "ONLYAE";
}

export function isMsg91Configured(): boolean {
  return (process.env.SMS_PROVIDER ?? "").toLowerCase() === "msg91" && Boolean(msg91AuthKey());
}

/** MSG91 legacy SendOTP API — customer / admin OTP codes. */
async function sendMsg91Otp(phone: string, code: string): Promise<SmsDispatchResult> {
  const authKey = msg91AuthKey();
  if (!authKey) return { ok: false, error: "SMS_API_KEY is not configured" };

  const mobile = smsMobile(phone);
  const sender = msg91Sender();
  const flowId = process.env.SMS_FLOW_OTP?.trim();

  // Prefer Flow template when configured (DLT-friendly)
  if (flowId) {
    return sendMsg91Flow({
      templateId: flowId,
      mobile,
      vars: {
        otp: code,
        OTP: code,
        var1: code,
        VAR1: code,
      },
    });
  }

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
    return { ok: false, error: `MSG91 OTP request failed (${res.status})` };
  }

  const body = (await res.json().catch(() => null)) as { type?: string; message?: string } | null;
  if (body?.type === "success") return { ok: true };

  return {
    ok: false,
    error: body?.message ?? "MSG91 did not accept the OTP request",
  };
}

/** MSG91 Flow / template SMS (transactional). */
export async function sendMsg91Flow(input: {
  templateId: string;
  mobile: string;
  vars?: Record<string, string>;
}): Promise<SmsDispatchResult> {
  const authKey = msg91AuthKey();
  if (!authKey) return { ok: false, error: "SMS_API_KEY is not configured" };
  if (!input.templateId.trim()) return { ok: false, error: "MSG91 template id is missing" };

  const payload = {
    template_id: input.templateId.trim(),
    short_url: "0",
    recipients: [
      {
        mobiles: smsMobile(input.mobile),
        ...(input.vars || {}),
      },
    ],
    sender: msg91Sender(),
  };

  const res = await fetch("https://control.msg91.com/api/v5/flow/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authkey: authKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const body = (await res.json().catch(() => null)) as {
    type?: string;
    message?: string;
  } | null;

  if (!res.ok) {
    return {
      ok: false,
      error: body?.message || `MSG91 Flow request failed (${res.status})`,
    };
  }

  if (body?.type && body.type !== "success") {
    return { ok: false, error: body.message || "MSG91 Flow rejected the request" };
  }

  return { ok: true };
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

export async function sendTransactionalSms(input: {
  templateEnvKey: string;
  phone: string;
  vars: Record<string, string>;
}): Promise<SmsDispatchResult> {
  if (!isMsg91Configured()) {
    return { ok: false, error: "MSG91 is not configured" };
  }

  const templateId = process.env[input.templateEnvKey]?.trim();
  if (!templateId) {
    return {
      ok: false,
      error: `${input.templateEnvKey} is not set — create the MSG91 Flow template and add the id`,
    };
  }

  return sendMsg91Flow({
    templateId,
    mobile: input.phone,
    vars: input.vars,
  });
}
