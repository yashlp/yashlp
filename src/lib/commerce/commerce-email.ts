import { Resend } from "resend";
import { getBrandSettings } from "@/lib/commerce/brand-settings";
import { DEFAULT_BRAND_NAME, DEFAULT_SUPPORT_EMAIL } from "@/lib/commerce/brand-defaults";

export function isCommerceEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      (process.env.COMMERCE_FROM_EMAIL?.trim() || process.env.RESEND_FROM_EMAIL?.trim())
  );
}

function commerceFromAddress(siteName?: string, supportEmail?: string): string {
  const configured =
    process.env.COMMERCE_FROM_EMAIL?.trim() || process.env.RESEND_FROM_EMAIL?.trim();
  if (configured) return configured;
  const name = siteName || DEFAULT_BRAND_NAME;
  const email = supportEmail || DEFAULT_SUPPORT_EMAIL;
  return `${name} <${email}>`;
}

export async function sendCommerceEmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const brand = await getBrandSettings().catch(() => null);
  const replyTo = input.replyTo || brand?.supportEmail || DEFAULT_SUPPORT_EMAIL;

  if (!isCommerceEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[Commerce email] To: ${input.to} Reply-To: ${replyTo}\n${input.text}`);
      return { ok: true };
    }
    return { ok: false, error: "Email service is not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: commerceFromAddress(brand?.siteName, brand?.supportEmail),
    to: input.to,
    replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function sendSignupOtpEmail(email: string, code: string) {
  const brand = await getBrandSettings().catch(() => null);
  const name = brand?.siteName || DEFAULT_BRAND_NAME;
  return sendCommerceEmail({
    to: email,
    subject: `Your ${name} verification code`,
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
  const brand = await getBrandSettings().catch(() => null);
  const siteName = brand?.siteName || DEFAULT_BRAND_NAME;
  const support = brand?.supportEmail || DEFAULT_SUPPORT_EMAIL;
  const total = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(input.totalInr);

  return sendCommerceEmail({
    to: input.to,
    subject: `Order confirmed — ${input.orderNumber}`,
    text: `Hi ${input.name},\n\nThank you for your order ${input.orderNumber} (${total}).\n\nWe'll email you when it ships.\nQuestions? ${support}\n\n— ${siteName}`,
    html: `<p>Hi ${input.name},</p><p>Thank you for your order <strong>${input.orderNumber}</strong> (${total}).</p><p>We'll email you when it ships.</p><p>Questions? <a href="mailto:${support}">${support}</a></p><p>— ${siteName}</p>`,
  });
}

export async function sendAdminOtpEmail(email: string, code: string) {
  const brand = await getBrandSettings().catch(() => null);
  const name = brand?.siteName || DEFAULT_BRAND_NAME;
  return sendCommerceEmail({
    to: email,
    subject: `${name} admin sign-in code`,
    text: `Your admin sign-in code is ${code}. It expires in 10 minutes.\n\nIf you did not try to sign in, ignore this email and change your password.`,
    html: `<p>Your admin sign-in code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not try to sign in, ignore this email and change your password.</p>`,
  });
}
