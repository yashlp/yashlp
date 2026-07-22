import { Resend } from "resend";

export function isCommerceEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      (process.env.COMMERCE_FROM_EMAIL?.trim() || process.env.RESEND_FROM_EMAIL?.trim())
  );
}

function commerceFromAddress(): string {
  return (
    process.env.COMMERCE_FROM_EMAIL?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Only Aesthetics <hello@onlyaesthetics.in>"
  );
}

export async function sendCommerceEmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isCommerceEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[Commerce email] To: ${input.to}\n${input.text}`);
      return { ok: true };
    }
    return { ok: false, error: "Email service is not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: commerceFromAddress(),
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function sendSignupOtpEmail(email: string, code: string) {
  return sendCommerceEmail({
    to: email,
    subject: "Your Only Aesthetics verification code",
    text: `Your verification code is ${code}. It expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not request this, ignore this email.</p>`,
  });
}

export async function sendOrderConfirmationEmail(input: {
  to: string;
  name: string;
  orderNumber: string;
  totalInr: number;
}) {
  const total = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(input.totalInr);

  return sendCommerceEmail({
    to: input.to,
    subject: `Order confirmed — ${input.orderNumber}`,
    text: `Hi ${input.name},\n\nThank you for your order ${input.orderNumber} (${total}).\n\nWe'll email you when it ships.\n\n— Only Aesthetics`,
    html: `<p>Hi ${input.name},</p><p>Thank you for your order <strong>${input.orderNumber}</strong> (${total}).</p><p>We'll email you when it ships.</p><p>— Only Aesthetics</p>`,
  });
}

export async function sendAdminOtpEmail(email: string, code: string) {
  return sendCommerceEmail({
    to: email,
    subject: "Only Aesthetics admin sign-in code",
    text: `Your admin sign-in code is ${code}. It expires in 10 minutes.\n\nIf you did not try to sign in, ignore this email and change your password.`,
    html: `<p>Your admin sign-in code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not try to sign in, ignore this email and change your password.</p>`,
  });
}
