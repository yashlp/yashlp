import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { orderService } from "@/lib/commerce/services/order.service";

export const runtime = "nodejs";

/**
 * Razorpay payment webhook — backup when the browser never hits /verify.
 * Dashboard → Webhooks:
 *   URL: https://onlyaesthetic.in/api/commerce/payments/razorpay-webhook
 *   Events: payment.captured
 *   Secret → RAZORPAY_WEBHOOK_SECRET on Vercel
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    console.error("[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          status?: string;
          notes?: { commerceOrderId?: string };
        };
      };
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload.event;
  if (event !== "payment.captured" && event !== "order.paid") {
    return NextResponse.json({ ok: true, ignored: event });
  }

  const payment = payload.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id;
  const razorpayPaymentId = payment?.id;
  const commerceOrderIdFromNotes = payment?.notes?.commerceOrderId;

  if (!razorpayPaymentId) {
    return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
  }

  let orderId = commerceOrderIdFromNotes || null;

  if (!orderId && razorpayOrderId) {
    const match = await prisma.commercePayment.findFirst({
      where: {
        OR: [
          { providerPaymentId: razorpayOrderId },
          { providerPaymentId: razorpayPaymentId },
          { metadata: { contains: razorpayOrderId } },
        ],
      },
      select: { orderId: true },
      orderBy: { createdAt: "desc" },
    });
    orderId = match?.orderId || null;
  }

  if (!orderId) {
    console.warn("[razorpay-webhook] No commerce order for payment", razorpayPaymentId);
    return NextResponse.json({ ok: true, matched: false });
  }

  const existing = await prisma.commerceOrder.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });

  if (!existing) {
    return NextResponse.json({ ok: true, matched: false });
  }

  if (existing.status === "CONFIRMED" || existing.status === "SHIPPED" || existing.status === "DELIVERED") {
    return NextResponse.json({ ok: true, alreadyPaid: true, orderId: existing.id });
  }

  try {
    const result = await orderService.confirmPayment(orderId, razorpayPaymentId);
    return NextResponse.json({
      ok: true,
      orderId,
      emailSent: result.emailSent,
      alreadyConfirmed: result.alreadyConfirmed,
      emailError: result.emailError,
    });
  } catch (error) {
    console.error("[razorpay-webhook] confirmPayment failed", error);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
