import { prisma } from "@/lib/db";
import { ORDER_STATUSES } from "../constants";

function orderNumber() {
  return `AES-${Date.now().toString(36).toUpperCase()}`;
}

type OrderStatus = (typeof ORDER_STATUSES)[number];

const STATUS_FLOW: Record<string, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["READY_TO_SHIP", "CANCELLED"],
  READY_TO_SHIP: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY", "DELIVERED"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  RETURNED: ["REFUNDED"],
};

export const orderService = {
  async listAdmin(filters?: { status?: string }) {
    return prisma.commerceOrder.findMany({
      where: filters?.status ? { status: filters.status } : undefined,
      include: {
        customer: true,
        items: { include: { product: { select: { name: true, sku: true } } } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  },

  async listForCustomer(customerId: string) {
    return prisma.commerceOrder.findMany({
      where: { customerId },
      include: {
        items: { include: { product: { select: { name: true, slug: true } } } },
        payments: true,
        returns: true,
        refunds: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async createGuestOrder(input: {
    items: { productId: string; quantity: number; unitPrice: number }[];
    subtotal: number;
    tax?: number;
    shipping: number;
    total: number;
    paymentMethod: "cod" | "razorpay" | "demo";
    giftWrap?: boolean;
    giftWrapFee?: number;
    giftMessage?: string;
    customerNotes?: string;
    guest: {
      name: string;
      email: string;
      phone: string;
      shippingAddress: string;
    };
    customerId?: string;
  }) {
    for (const item of input.items) {
      const product = await prisma.commerceProduct.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Product not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
    }

    const status = input.paymentMethod === "razorpay" ? "PENDING" : "CONFIRMED";
    const giftWrap = Boolean(input.giftWrap);
    const giftWrapFee = giftWrap ? input.giftWrapFee ?? 3 : 0;
    const guestLine = `Guest: ${input.guest.name} | ${input.guest.email} | ${input.guest.phone}`;
    const notes = [guestLine, input.customerNotes?.trim()].filter(Boolean).join("\n");
    const internalParts = [
      giftWrap ? `GIFT WRAP (+₹${giftWrapFee})` : null,
      input.giftMessage?.trim() ? `Gift message: ${input.giftMessage.trim()}` : null,
    ].filter(Boolean);

    const order = await prisma.commerceOrder.create({
      data: {
        orderNumber: orderNumber(),
        customerId: input.customerId,
        status,
        subtotal: input.subtotal,
        tax: input.tax ?? 0,
        shipping: input.shipping,
        total: input.total,
        currency: "INR",
        shippingAddress: input.guest.shippingAddress,
        customerNotes: notes,
        giftWrap,
        giftWrapFee,
        giftMessage: input.giftMessage?.trim() || null,
        internalNotes: internalParts.length ? internalParts.join("\n") : null,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
        payments: {
          create: {
            amount: input.total,
            currency: "INR",
            status: input.paymentMethod === "razorpay" ? "PENDING" : "SUCCESS",
            provider: input.paymentMethod,
          },
        },
      },
      include: { items: true, payments: true },
    });

    if (status === "CONFIRMED") {
      await this.decrementStock(order.id);
    }

    return order;
  },

  async decrementStock(orderId: string) {
    const items = await prisma.commerceOrderItem.findMany({ where: { orderId } });
    for (const item of items) {
      await prisma.commerceProduct.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  },

  async restock(orderId: string) {
    const items = await prisma.commerceOrderItem.findMany({ where: { orderId } });
    for (const item of items) {
      await prisma.commerceProduct.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  },

  async confirmPayment(orderId: string, providerPaymentId: string) {
    const order = await prisma.commerceOrder.findUniqueOrThrow({
      where: { id: orderId },
      include: { payments: true },
    });
    if (order.status !== "PENDING") return order;

    await prisma.commercePayment.updateMany({
      where: { orderId, status: "PENDING" },
      data: { status: "SUCCESS", providerPaymentId },
    });

    await prisma.commerceOrder.update({
      where: { id: orderId },
      data: { status: "CONFIRMED" },
    });

    await this.decrementStock(orderId);
    return this.getById(orderId);
  },

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    meta?: { courier?: string; trackingNumber?: string; internalNotes?: string }
  ) {
    const order = await prisma.commerceOrder.findUniqueOrThrow({ where: { id: orderId } });
    const allowed = STATUS_FLOW[order.status] || [];
    if (!allowed.includes(status) && order.status !== status) {
      throw new Error(`Cannot transition from ${order.status} to ${status}`);
    }

    if (status === "CANCELLED" && ["CONFIRMED", "PACKED"].includes(order.status)) {
      await this.restock(orderId);
    }

    return prisma.commerceOrder.update({
      where: { id: orderId },
      data: {
        status,
        courier: meta?.courier ?? order.courier,
        trackingNumber: meta?.trackingNumber ?? order.trackingNumber,
        internalNotes: meta?.internalNotes ?? order.internalNotes,
      },
      include: {
        items: { include: { product: true } },
        customer: true,
        payments: true,
        refunds: true,
        returns: true,
      },
    });
  },

  async getById(id: string) {
    return prisma.commerceOrder.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        customer: true,
        payments: true,
        refunds: true,
        returns: true,
      },
    });
  },
};
