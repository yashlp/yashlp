import { prisma } from "@/lib/db";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { isRazorpayConfigured, getRazorpayKeyId } from "@/lib/payments/config";
import { orderService } from "./order.service";

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
      data: { providerPaymentId: rzOrder.id, metadata: JSON.stringify({ razorpayOrderId: rzOrder.id }) },
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

    return orderService.confirmPayment(input.orderId, input.razorpayPaymentId);
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
