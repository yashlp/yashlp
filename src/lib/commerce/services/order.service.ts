import { prisma } from "@/lib/db";
import { ORDER_STATUSES } from "../constants";
import { sendOrderConfirmationEmail } from "../commerce-email";
import { ensureGuestCustomer } from "../guest-customer";

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
      line1: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
    customerId?: string;
  }) {
    const pricedItems = await this.priceItems(input.items);
    const subtotal = pricedItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const tax = input.tax ?? 0;
    const shipping = Math.max(0, input.shipping);
    const total = subtotal + shipping + tax;

    const status = input.paymentMethod === "razorpay" ? "PENDING" : "CONFIRMED";

    const customerId =
      input.customerId ||
      (await ensureGuestCustomer({
        name: input.guest.name,
        email: input.guest.email,
        phone: input.guest.phone,
        line1: input.guest.line1,
        line2: input.guest.line2,
        city: input.guest.city,
        state: input.guest.state,
        postalCode: input.guest.postalCode,
        country: input.guest.country,
      }));

    const order = await prisma.commerceOrder.create({
      data: {
        orderNumber: orderNumber(),
        customerId,
        status,
        subtotal,
        tax,
        shipping,
        total,
        currency: "INR",
        shippingAddress: input.guest.shippingAddress,
        shippingCity: input.guest.city?.trim() || null,
        shippingState: input.guest.state?.trim() || null,
        customerNotes: `Guest: ${input.guest.name}\nEmail: ${input.guest.email}\nPhone: ${input.guest.phone}`,
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
      const emailResult = await sendOrderConfirmationEmail({
        to: input.guest.email,
        name: input.guest.name,
        orderNumber: order.orderNumber,
        totalInr: order.total,
        shippingAddress: input.guest.shippingAddress,
      });
      if (!emailResult.ok) {
        console.error("[order-confirm-email]", order.orderNumber, emailResult.error);
      }
    }

    return order;
  },

  resolveCustomerContact(order: {
    customerNotes?: string | null;
    customer?: { email?: string | null; name?: string | null; phone?: string | null } | null;
  }) {
    const notes = order.customerNotes || "";
    const emailFromNotes =
      notes.match(/^Email:\s*(.+)$/im)?.[1]?.trim() ||
      notes.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0] ||
      null;
    const nameFromNotes =
      notes.match(/^Guest:\s*(.+)$/im)?.[1]?.trim() ||
      notes.match(/Guest:\s*([^|\n]+)/)?.[1]?.trim() ||
      null;
    const phoneFromNotes = notes.match(/^Phone:\s*(.+)$/im)?.[1]?.trim() || null;

    return {
      email: order.customer?.email || emailFromNotes || null,
      name: order.customer?.name || nameFromNotes || "there",
      phone: order.customer?.phone || phoneFromNotes || null,
    };
  },

  async sendConfirmationForOrder(orderId: string) {
    const order = await prisma.commerceOrder.findUnique({
      where: { id: orderId },
      include: {
        customer: { select: CUSTOMER_SAFE_SELECT },
        items: { include: { product: { select: { name: true, sku: true } } } },
      },
    });
    if (!order) return { ok: false as const, error: "Order not found" };

    const contact = this.resolveCustomerContact(order);
    if (!contact.email) return { ok: false as const, error: "No customer email on order" };

    const itemSummary = order.items
      .map((item) => {
        const label = item.product?.name || item.productId;
        return `• ${label} × ${item.quantity}`;
      })
      .join("\n");

    const result = await sendOrderConfirmationEmail({
      to: contact.email,
      name: contact.name,
      orderNumber: order.orderNumber,
      totalInr: order.total,
      itemSummary,
      shippingAddress: order.shippingAddress || undefined,
    });

    if (!result.ok) {
      console.error("[order-confirm-email]", order.orderNumber, result.error);
    }
    return result;
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
    if (order.status !== "PENDING") {
      // Already cleared (e.g. browser verify + webhook race) — do not re-send email
      return { order, emailSent: false as const, alreadyConfirmed: true as const };
    }

    const pending = order.payments.find((p) => p.status === "PENDING");
    let metadata = pending?.metadata || null;
    try {
      const parsed = metadata ? (JSON.parse(metadata) as Record<string, unknown>) : {};
      metadata = JSON.stringify({
        ...parsed,
        razorpayPaymentId: providerPaymentId,
      });
    } catch {
      metadata = JSON.stringify({ razorpayPaymentId: providerPaymentId });
    }

    await prisma.commercePayment.updateMany({
      where: { orderId, status: "PENDING" },
      data: { status: "SUCCESS", providerPaymentId, metadata },
    });

    await prisma.commerceOrder.update({
      where: { id: orderId },
      data: { status: "CONFIRMED" },
    });

    await this.decrementStock(orderId);
    const confirmed = await this.getById(orderId);
    if (!confirmed) {
      return { order, emailSent: false as const, alreadyConfirmed: false as const };
    }

    const emailResult = await this.sendConfirmationForOrder(orderId);
    return {
      order: confirmed,
      emailSent: emailResult.ok,
      alreadyConfirmed: false as const,
      emailError: emailResult.ok ? undefined : emailResult.error,
    };
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
        customer: { select: CUSTOMER_SAFE_SELECT },
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
        customer: { select: CUSTOMER_SAFE_SELECT },
        payments: true,
        refunds: true,
        returns: true,
      },
    });
  },
};
