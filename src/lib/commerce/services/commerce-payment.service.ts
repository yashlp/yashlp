import { prisma } from "@/lib/db";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { isRazorpayConfigured, getRazorpayKeyId } from "@/lib/payments/config";
import { orderService } from "./order.service";

function parseMetadata(raw: string | null | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "string") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export const commercePaymentService = {
  isRazorpayEnabled: isRazorpayConfigured,

  async createRazorpayCheckout(orderId: string) {
    if (!isRazorpayConfigured()) throw new Error("Razorpay is not configured");

    const order = await prisma.commerceOrder.findUniqueOrThrow({
      where: { id: orderId },
      include: { payments: true },
    });

    if (order.status !== "PENDING") throw new Error("Order is not awaiting payment");

    const amountMinor = Math.round(order.total * 100);
    const rzOrder = await createRazorpayOrder({
      amountMinor,
      currency: "INR",
      receipt: order.orderNumber,
      notes: { commerceOrderId: order.id },
    });

    await prisma.commercePayment.updateMany({
      where: { orderId, status: "PENDING" },
      data: {
        provider: "razorpay",
        metadata: JSON.stringify({
          razorpayOrderId: rzOrder.id,
          amountMinor: String(amountMinor),
        }),
      },
    });

    return {
      keyId: getRazorpayKeyId(),
      razorpayOrderId: rzOrder.id,
      amount: amountMinor,
      currency: "INR",
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  },

  async verifyRazorpayPayment(input: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const valid = verifyRazorpaySignature({
      orderId: input.razorpayOrderId,
      paymentId: input.razorpayPaymentId,
      signature: input.razorpaySignature,
    });
    if (!valid) throw new Error("Invalid payment signature");

    const payment = await prisma.commercePayment.findFirst({
      where: { orderId: input.orderId, status: "PENDING", provider: "razorpay" },
    });
    if (!payment) throw new Error("No pending payment found for this order");

    const meta = parseMetadata(payment.metadata);
    if (!meta.razorpayOrderId || meta.razorpayOrderId !== input.razorpayOrderId) {
      throw new Error("Payment does not match this order");
    }

    return orderService.confirmPayment(input.orderId, input.razorpayPaymentId);
  },

  async confirmFromWebhook(input: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    commerceOrderId?: string;
  }) {
    const pending = await prisma.commercePayment.findFirst({
      where: {
        status: "PENDING",
        provider: "razorpay",
        OR: [
          ...(input.commerceOrderId ? [{ orderId: input.commerceOrderId }] : []),
          { metadata: { contains: input.razorpayOrderId } },
        ],
      },
    });

    if (!pending) {
      // Idempotent — already confirmed
      const existing = await prisma.commercePayment.findFirst({
        where: { providerPaymentId: input.razorpayPaymentId, status: "SUCCESS" },
      });
      if (existing) return orderService.getById(existing.orderId);
      throw new Error("Pending payment not found for webhook");
    }

    const meta = parseMetadata(pending.metadata);
    if (meta.razorpayOrderId && meta.razorpayOrderId !== input.razorpayOrderId) {
      throw new Error("Webhook order mismatch");
    }

    return orderService.confirmPayment(pending.orderId, input.razorpayPaymentId);
  },

  async listAdmin() {
    return prisma.commercePayment.findMany({
      include: { order: { select: { orderNumber: true, status: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  },

  async dailyRevenue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const agg = await prisma.commercePayment.aggregate({
      where: { status: "SUCCESS", createdAt: { gte: today } },
      _sum: { amount: true },
      _count: true,
    });
    return { revenue: agg._sum.amount || 0, count: agg._count };
  },
};
