/**
 * Professional HTML email layouts for Only Aesthetic (Resend).
 * Uses email-safe inline CSS + Unicode symbols (no external image deps).
 */

export type EmailBrand = {
  siteName: string;
  supportEmail: string;
  siteUrl?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(input: {
  brand: EmailBrand;
  preheader: string;
  badge: string;
  title: string;
  greeting: string;
  bodyHtml: string;
  details?: { label: string; value: string }[];
  footerNote?: string;
}): string {
  const site = escapeHtml(input.brand.siteName);
  const support = escapeHtml(input.brand.supportEmail);
  const siteUrl = escapeHtml(input.brand.siteUrl || "https://onlyaesthetic.in");
  const rows = (input.details || [])
    .map(
      (d) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #efe8e1;font-size:13px;color:#8a8278;width:38%;vertical-align:top;">${escapeHtml(d.label)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #efe8e1;font-size:14px;color:#2c2825;font-weight:600;vertical-align:top;">${escapeHtml(d.value)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f1ec;font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1ec;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eadfd4;">
          <tr>
            <td style="background:linear-gradient(135deg,#2c2825 0%,#4a3f3a 100%);padding:28px 28px 24px;text-align:center;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#f0d9c8;">${site}</p>
              <p style="margin:14px 0 0;font-size:28px;line-height:1;color:#ffffff;">${input.badge}</p>
              <h1 style="margin:12px 0 0;font-size:22px;line-height:1.35;font-weight:normal;color:#ffffff;">${escapeHtml(input.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#2c2825;">
              <p style="margin:0 0 14px;font-size:16px;line-height:1.5;">${escapeHtml(input.greeting)}</p>
              <div style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#5c554e;">${input.bodyHtml}</div>
              ${
                rows
                  ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 20px;border-top:1px solid #efe8e1;">${rows}</table>`
                  : ""
              }
              ${
                input.footerNote
                  ? `<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#5c554e;">${escapeHtml(input.footerNote)}</p>`
                  : ""
              }
              <p style="margin:0 0 6px;font-size:14px;color:#5c554e;">Need help?</p>
              <p style="margin:0 0 22px;font-size:14px;">
                <a href="mailto:${support}" style="color:#b56b7a;text-decoration:none;font-weight:600;">✉ ${support}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 24px;background:#faf7f3;border-top:1px solid #efe8e1;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8a8278;">✦ Details matter · Ships with care ✦</p>
              <p style="margin:10px 0 0;font-size:12px;color:#8a8278;">
                <a href="${siteUrl}" style="color:#8a8278;text-decoration:underline;">${siteUrl.replace(/^https?:\/\//, "")}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function orderConfirmationHtml(input: {
  brand: EmailBrand;
  name: string;
  orderNumber: string;
  total: string;
  itemSummary?: string;
  shippingAddress?: string;
}): { subject: string; text: string; html: string } {
  const subject = `✓ Order confirmed — ${input.orderNumber} · ${input.brand.siteName}`;
  const text = [
    `Hi ${input.name},`,
    ``,
    `✓ Thank you — your payment is confirmed.`,
    `Order: ${input.orderNumber}`,
    `Total: ${input.total}`,
    input.itemSummary ? `\nItems:\n${input.itemSummary}` : "",
    input.shippingAddress ? `\nShip to:\n${input.shippingAddress}` : "",
    ``,
    `We'll email you when your order ships.`,
    `Questions? ${input.brand.supportEmail}`,
    ``,
    `— ${input.brand.siteName}`,
  ]
    .filter(Boolean)
    .join("\n");

  const itemsBlock = input.itemSummary?.trim()
    ? `<p style="margin:0 0 8px;"><strong>Items</strong></p><p style="margin:0;white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#5c554e;">${escapeHtml(input.itemSummary.trim())}</p>`
    : "";
  const shipBlock = input.shippingAddress?.trim()
    ? `<p style="margin:14px 0 8px;"><strong>Ship to</strong></p><p style="margin:0;white-space:pre-wrap;font-size:14px;color:#5c554e;">${escapeHtml(input.shippingAddress.trim())}</p>`
    : "";

  const html = layout({
    brand: input.brand,
    preheader: `Payment confirmed for ${input.orderNumber} (${input.total})`,
    badge: "✓",
    title: "Purchase confirmed",
    greeting: `Hi ${input.name},`,
    bodyHtml: `<p style="margin:0 0 12px;">Thank you for shopping with <strong>${escapeHtml(input.brand.siteName)}</strong>. Your payment is clear and your order is confirmed.</p>${itemsBlock}${shipBlock}`,
    details: [
      { label: "Order number", value: input.orderNumber },
      { label: "Amount paid", value: input.total },
      { label: "Status", value: "✓ Confirmed" },
    ],
    footerNote: "We'll notify you by email when your order ships.",
  });

  return { subject, text, html };
}

export function deliveryUpdateHtml(input: {
  brand: EmailBrand;
  name: string;
  orderNumber: string;
  status: "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED";
  courier?: string;
  trackingNumber?: string;
}): { subject: string; text: string; html: string } {
  const copy =
    input.status === "SHIPPED"
      ? {
          badge: "✈",
          title: "Your order is on the way",
          statusLabel: "✈ Shipped",
          body: "Good news — your order has left our studio and is heading to you.",
          subjectVerb: "has shipped",
          footer: "Track your parcel with the details below. Reply anytime if you need help.",
        }
      : input.status === "OUT_FOR_DELIVERY"
        ? {
            badge: "🚚",
            title: "Out for delivery today",
            statusLabel: "🚚 Out for delivery",
            body: "Your order is out for delivery and should reach you soon.",
            subjectVerb: "is out for delivery",
            footer: "Please keep your phone nearby for the courier.",
          }
        : {
            badge: "✦",
            title: "Delivered — enjoy",
            statusLabel: "✦ Delivered",
            body: "Your order has been delivered. We hope you love every detail.",
            subjectVerb: "was delivered",
            footer: "If anything isn't right, email customer care and we'll help.",
          };

  const subject = `${copy.badge} Order ${input.orderNumber} ${copy.subjectVerb} · ${input.brand.siteName}`;
  const details: { label: string; value: string }[] = [
    { label: "Order number", value: input.orderNumber },
    { label: "Status", value: copy.statusLabel },
  ];
  if (input.courier) details.push({ label: "Courier", value: input.courier });
  if (input.trackingNumber) details.push({ label: "Tracking", value: input.trackingNumber });

  const trackLine = [
    input.courier ? `Courier: ${input.courier}` : null,
    input.trackingNumber ? `Tracking: ${input.trackingNumber}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const text = [
    `Hi ${input.name},`,
    ``,
    copy.body,
    `Order: ${input.orderNumber}`,
    trackLine,
    ``,
    copy.footer,
    `Questions? ${input.brand.supportEmail}`,
    ``,
    `— ${input.brand.siteName}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = layout({
    brand: input.brand,
    preheader: `${copy.title} — ${input.orderNumber}`,
    badge: copy.badge,
    title: copy.title,
    greeting: `Hi ${input.name},`,
    bodyHtml: `<p style="margin:0;">${escapeHtml(copy.body)}</p>`,
    details,
    footerNote: copy.footer,
  });

  return { subject, text, html };
}
