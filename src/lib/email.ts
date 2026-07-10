import { Resend } from "resend";

export function isResendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.RESEND_FROM_EMAIL?.trim() &&
      process.env.SUPPORT_EMAIL_TO?.trim()
  );
}

export async function sendSupportEmail(input: {
  fromName: string;
  fromPhone: string;
  subject: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isResendConfigured()) {
    return { ok: false, error: "Email is not configured on this server" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.SUPPORT_EMAIL_TO!;
  const from = process.env.RESEND_FROM_EMAIL!;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: process.env.SUPPORT_REPLY_TO ?? undefined,
    subject: `[CivicLens] ${input.subject}`,
    text: `From: ${input.fromName} (${input.fromPhone})\n\n${input.message}`,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
