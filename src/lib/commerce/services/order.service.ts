import { prisma } from "@/lib/db";
import { ORDER_STATUSES } from "../constants";
import { sendOrderConfirmationEmail, sendDeliveryUpdateEmail } from "../commerce-email";

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

const CUSTOMER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  emailVerified: true,
  createdAt: true,
} as const;

const RESTOCK_FROM_STATUSES = new Set(["CONFIRMED", "PACKED", "READY_TO_SHIP"]);

async function hasSuccessfulPayment(orderId: string) {
  const paid = await prisma.commercePayment.findFirst({
    where: { orderId, status: "SUCCESS" },
    select: { id: true },
  });
  return Boolean(paid);
}

export const orderService = {
  async listAdmin(filters?: { status?: string }) {
    return prisma.commerceOrder.findMany({
      where: filters?.status ? { status: filters.status } : undefined,
      include: {
        customer: { select: CUSTOMER_SAFE_SELECT },
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

  /** Resolve catalog prices from DB — never trust client unitPrice. */
  async priceItems(items: { productId: string; quantity: number }[]) {
    const priced: { productId: string; quantity: number; unitPrice: number }[] = [];
    for (const item of items) {
      const product = await prisma.commerceProduct.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error("Product not found");
      if (product.status !== "PUBLISHED" || product.approvalStatus !== "APPROVED") {
        throw new Error(`${product.name} is not available for purchase`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      priced.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }
    return priced;
  },

  async createGuestOrder(input: {
    items: { productId: string; quantity: number; unitPrice?: number }[];
    subtotal?: number;
    tax?: number;
    shipping: number;
    total?: number;
    paymentMethod: "cod" | "razorpay" | "demo";
    guest: {
      name: string;
      email: string;
      phone: string;
      shippingAddress: string;
      city?: string;
      state?: string;
    };
    customerId?: string;
  }) {
    const pricedItems = await this.priceItems(input.items);
    const subtotal = pricedItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const tax = input.tax ?? 0;
    const shipping = Math.max(0, input.shipping);
    const total = subtotal + shipping + tax;

    const status = input.paymentMethod === "razorpay" ? "PENDING" : "CONFIRMED";

    const order = await prisma.commerceOrder.create({
      data: {
        orderNumber: orderNumber(),
        customerId: input.customerId,
        status,
        subtotal,
        tax,
        shipping,
        total,
        currency: "INR",
        shippingAddress: input.guest.shippingAddress,
        shippingCity: input.guest.city?.trim() || null,
        shippingState: input.guest.state?.trim() || null,
        customerNotes: `Guest: ${input.guest.name} | ${input.guest.email} | ${input.guest.phone}`,
        items: {
          create: pricedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
        payments: {
          create: {
            amount: total,
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
      void sendOrderConfirmationEmail({
        to: input.guest.email,
        name: input.guest.name,
        orderNumber: order.orderNumber,
        totalInr: order.total,
      });
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
    const confirmed = await this.getById(orderId);
    if (!confirmed) return order;

    const emailMatch = confirmed.customerNotes?.match(/[\w.+-]+@[\w.-]+\.\w+/);
    const guestEmail = emailMatch?.[0];
    const guestName = confirmed.customerNotes?.match(/Guest:\s*([^|]+)/)?.[1]?.trim();
    const to = confirmed.customer?.email || guestEmail;
    const name = confirmed.customer?.name || guestName || "there";

    if (to) {
      void sendOrderConfirmationEmail({
        to,
        name,
        orderNumber: confirmed.orderNumber,
        totalInr: confirmed.total,
      });
    }

    return confirmed;
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

    // Never confirm unpaid Razorpay orders from admin — that skips payment and stock accounting.
    if (status === "CONFIRMED" && order.status === "PENDING") {
      if (!(await hasSuccessfulPayment(orderId))) {
        throw new Error("Cannot confirm unpaid order. Complete payment first.");
      }
      await this.decrementStock(orderId);
    }

    // Only restock when inventory was actually reserved (successful payment path).
    if (status === "CANCELLED" && RESTOCK_FROM_STATUSES.has(order.status)) {
      if (await hasSuccessfulPayment(orderId)) {
        await this.restock(orderId);
      }
    }

    const updated = await prisma.commerceOrder.update({
      where: { id: orderId },
      data: {
        status,
        courier: meta?.courier ?? order.courier,
        trackingNumber: meta?.trackingNumber ?? order.trackingNumber,
        internalNotes: meta?.internalNotes ?? order.internalNotes,
      },
      include: {
        items: { include: { product: true } },
        customer: { select: CUSTOMER_SAFE_SELECT },
        payments: true,
        refunds: true,
        returns: true,
      },
    });

    // Shipped email is sent from shipping.service; OFD + delivered use the shared template here
    if (status === "OUT_FOR_DELIVERY" || status === "DELIVERED") {
      const notes = updated.customerNotes || "";
      const email =
        updated.customer?.email ||
        notes.match(/^Email:\s*(.+)$/im)?.[1]?.trim() ||
        notes.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0] ||
        null;
      const name =
        updated.customer?.name ||
        notes.match(/^Guest:\s*(.+)$/im)?.[1]?.trim() ||
        notes.match(/Guest:\s*([^|\n]+)/)?.[1]?.trim() ||
        "there";
      if (email) {
        void sendDeliveryUpdateEmail({
          to: email,
          name,
          orderNumber: updated.orderNumber,
          status,
          courier: updated.courier || undefined,
          trackingNumber: updated.trackingNumber || undefined,
        }).catch((err) => console.error("[delivery-email]", updated.orderNumber, err));
      }
    }

    return updated;
  },

  async getById(id: string) {
    return prisma.commerceOrder.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        customer: { select: CUSTOMER_SAFE_SELECT },
        payments: true,
        refunds: true,
        returns: true,
      },
    });
  },
};
