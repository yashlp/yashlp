import { prisma } from "@/lib/db";
import { ORDER_STATUSES } from "../constants";
import { isDemoPaymentAllowed, priceCheckoutItems } from "../checkout-pricing";

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
    items: { productId: string; quantity: number }[];
    paymentMethod: "razorpay" | "demo";
    guest: {
      name: string;
      email: string;
      phone: string;
      shippingAddress: string;
    };
    customerId?: string;
  }) {
    if (input.paymentMethod !== "razorpay" && input.paymentMethod !== "demo") {
      throw new Error("Online payment required. Cash on delivery is not available.");
    }
    if (input.paymentMethod === "demo" && !isDemoPaymentAllowed()) {
      throw new Error("Demo payments are disabled. Configure Razorpay for live checkout.");
    }

    const priced = await priceCheckoutItems(input.items);
    const status = input.paymentMethod === "razorpay" ? "PENDING" : "CONFIRMED";

    const order = await prisma.$transaction(async (tx) => {
      for (const line of priced.lines) {
        const product = await tx.commerceProduct.findUnique({ where: { id: line.productId } });
        if (!product) throw new Error("Product not found");
        if (product.stock < line.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        if (status === "CONFIRMED") {
          const locked = await tx.commerceProduct.updateMany({
            where: { id: line.productId, stock: { gte: line.quantity } },
            data: { stock: { decrement: line.quantity } },
          });
          if (locked.count === 0) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
        }
      }

      return tx.commerceOrder.create({
        data: {
          orderNumber: orderNumber(),
          customerId: input.customerId,
          status,
          subtotal: priced.subtotal,
          tax: priced.tax,
          shipping: priced.shipping,
          total: priced.total,
          currency: "INR",
          shippingAddress: input.guest.shippingAddress,
          customerNotes: `Guest: ${input.guest.name} | ${input.guest.email} | ${input.guest.phone}`,
          items: {
            create: priced.lines.map((line) => ({
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              total: line.total,
            })),
          },
          payments: {
            create: {
              amount: priced.total,
              currency: "INR",
              status: input.paymentMethod === "razorpay" ? "PENDING" : "SUCCESS",
              provider: input.paymentMethod,
            },
          },
        },
        include: { items: true, payments: true },
      });
    });

    return order;
  },

  async decrementStock(orderId: string) {
    const items = await prisma.commerceOrderItem.findMany({ where: { orderId } });
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const updated = await tx.commerceProduct.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error("Insufficient stock while confirming payment");
        }
      }
    });
  },

  async restock(orderId: string) {
    const items = await prisma.commerceOrderItem.findMany({ where: { orderId } });
    await prisma.$transaction(
      items.map((item) =>
        prisma.commerceProduct.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      )
    );
  },

  async confirmPayment(orderId: string, providerPaymentId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.commerceOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: { payments: true },
      });
      if (order.status !== "PENDING") {
        return tx.commerceOrder.findUniqueOrThrow({
          where: { id: orderId },
          include: {
            items: { include: { product: true } },
            customer: true,
            payments: true,
            refunds: true,
            returns: true,
          },
        });
      }

      const reused = await tx.commercePayment.findFirst({
        where: {
          providerPaymentId,
          status: "SUCCESS",
          NOT: { orderId },
        },
      });
      if (reused) throw new Error("Payment already applied to another order");

      await tx.commercePayment.updateMany({
        where: { orderId, status: "PENDING" },
        data: { status: "SUCCESS", providerPaymentId },
      });

      await tx.commerceOrder.update({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
      });

      const items = await tx.commerceOrderItem.findMany({ where: { orderId } });
      for (const item of items) {
        const updated = await tx.commerceProduct.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error("Insufficient stock while confirming payment");
        }
      }

      return tx.commerceOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: {
          items: { include: { product: true } },
          customer: true,
          payments: true,
          refunds: true,
          returns: true,
        },
      });
    });
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
