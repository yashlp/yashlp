import { Resend } from "resend";
import { getBrandSettings } from "@/lib/commerce/brand-settings";
import { DEFAULT_BRAND_NAME, DEFAULT_SUPPORT_EMAIL } from "@/lib/commerce/brand-defaults";
import { deliveryUpdateHtml, orderConfirmationHtml } from "@/lib/commerce/email-templates";

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

async function brandForEmail() {
  const brand = await getBrandSettings().catch(() => null);
  return {
    siteName: brand?.siteName || DEFAULT_BRAND_NAME,
    supportEmail: brand?.supportEmail || DEFAULT_SUPPORT_EMAIL,
    siteUrl: brand?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://onlyaesthetic.in",
  };
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
  const brand = await brandForEmail();
  return sendCommerceEmail({
    to: email,
    subject: `🔐 Your ${brand.siteName} verification code`,
    text: `Your verification code is ${code}. It expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
    html: `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f6f1ec;padding:24px;"><table style="max-width:480px;margin:0 auto;background:#fff;border-radius:14px;border:1px solid #eadfd4;padding:28px;"><tr><td><p style="margin:0;letter-spacing:0.2em;font-size:11px;text-transform:uppercase;color:#8a8278;">${brand.siteName}</p><h1 style="margin:12px 0;font-size:22px;color:#2c2825;">🔐 Verification code</h1><p style="font-size:32px;letter-spacing:0.2em;font-weight:700;color:#2c2825;">${code}</p><p style="color:#5c554e;">Expires in 10 minutes. If you did not request this, ignore this email.</p></td></tr></table></body></html>`,
  });
}

export async function sendOrderConfirmationEmail(input: {
  to: string;
  name: string;
  orderNumber: string;
  totalInr: number;
  itemSummary?: string;
  shippingAddress?: string;
}) {
  const brand = await brandForEmail();
  const total = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(input.totalInr);

  const tpl = orderConfirmationHtml({
    brand,
    name: input.name,
    orderNumber: input.orderNumber,
    total,
    itemSummary: input.itemSummary,
    shippingAddress: input.shippingAddress,
  });

  return sendCommerceEmail({
    to: input.to,
    subject: tpl.subject,
    text: tpl.text,
    html: tpl.html,
  });
}

export async function sendAdminOtpEmail(email: string, code: string) {
  const brand = await brandForEmail();
  return sendCommerceEmail({
    to: email,
    subject: `🔐 ${brand.siteName} admin sign-in code`,
    text: `Your admin sign-in code is ${code}. It expires in 10 minutes.\n\nIf you did not try to sign in, ignore this email and change your password.`,
    html: `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f6f1ec;padding:24px;"><table style="max-width:480px;margin:0 auto;background:#fff;border-radius:14px;border:1px solid #eadfd4;padding:28px;"><tr><td><p style="margin:0;letter-spacing:0.2em;font-size:11px;text-transform:uppercase;color:#8a8278;">${brand.siteName} Admin</p><h1 style="margin:12px 0;font-size:22px;color:#2c2825;">🔐 Sign-in code</h1><p style="font-size:32px;letter-spacing:0.2em;font-weight:700;color:#2c2825;">${code}</p><p style="color:#5c554e;">Expires in 10 minutes. If this wasn't you, change your password.</p></td></tr></table></body></html>`,
  });
}

export async function sendShipmentEmail(input: {
  to: string;
  name: string;
  orderNumber: string;
  courier: string;
  trackingNumber: string;
}) {
  return sendDeliveryUpdateEmail({
    to: input.to,
    name: input.name,
    orderNumber: input.orderNumber,
    status: "SHIPPED",
    courier: input.courier,
    trackingNumber: input.trackingNumber,
  });
}

export async function sendDeliveryUpdateEmail(input: {
  to: string;
  name: string;
  orderNumber: string;
  status: "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED";
  courier?: string;
  trackingNumber?: string;
}) {
  const brand = await brandForEmail();
  const tpl = deliveryUpdateHtml({
    brand,
    name: input.name,
    orderNumber: input.orderNumber,
    status: input.status,
    courier: input.courier,
    trackingNumber: input.trackingNumber,
  });

  return sendCommerceEmail({
    to: input.to,
    subject: tpl.subject,
    text: tpl.text,
    html: tpl.html,
  });
}
