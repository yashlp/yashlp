import { NextRequest, NextResponse } from "next/server";
import { commercePaymentService } from "@/lib/commerce/services/commerce-payment.service";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpay";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * Razorpay server→server webhook — preferred source of truth for payment capture.
 * Configure in Razorpay Dashboard → Webhooks → payment.captured
 * Secret: RAZORPAY_WEBHOOK_SECRET
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`rz_webhook:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";
    if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            notes?: Record<string, string>;
          };
        };
      };
    };

    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      const razorpayPaymentId = payment?.id;
      const razorpayOrderId = payment?.order_id;
      const commerceOrderId = payment?.notes?.commerceOrderId;

      if (razorpayPaymentId && razorpayOrderId) {
        await commercePaymentService.confirmFromWebhook({
          razorpayOrderId,
          razorpayPaymentId,
          commerceOrderId,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    console.error("[razorpay webhook]", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
