import { prisma } from "@/lib/db";
import { orderService } from "./order.service";

export const COURIERS = ["Shiprocket", "Delhivery", "BlueDart", "DTDC", "Manual"] as const;

const CUSTOMER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  emailVerified: true,
  createdAt: true,
} as const;

export const shippingService = {
  async listPending() {
    return prisma.commerceOrder.findMany({
      where: { status: { in: ["CONFIRMED", "PACKED", "READY_TO_SHIP"] } },
      include: {
        customer: { select: CUSTOMER_SAFE_SELECT },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
  },

  async listShipped() {
    return prisma.commerceOrder.findMany({
      where: { status: { in: ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"] } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  },

  /**
   * Advance through STATUS_FLOW one step at a time so label/ship actions
   * work from CONFIRMED or PACKED without illegal jumps.
   */
  async assignShipping(
    orderId: string,
    input: { courier: string; trackingNumber: string; markShipped?: boolean }
  ) {
    let order = await prisma.commerceOrder.findUniqueOrThrow({ where: { id: orderId } });

    if (order.status === "CONFIRMED") {
      await orderService.updateStatus(orderId, "PACKED");
      order = await prisma.commerceOrder.findUniqueOrThrow({ where: { id: orderId } });
    }

    if (order.status === "PACKED") {
      await orderService.updateStatus(orderId, "READY_TO_SHIP", {
        courier: input.courier,
        trackingNumber: input.trackingNumber,
      });
      order = await prisma.commerceOrder.findUniqueOrThrow({ where: { id: orderId } });
    }

    if (input.markShipped) {
      if (order.status === "READY_TO_SHIP") {
        return orderService.updateStatus(orderId, "SHIPPED", {
          courier: input.courier,
          trackingNumber: input.trackingNumber,
        });
      }
      throw new Error(`Cannot mark shipped from ${order.status}`);
    }

    if (order.status === "READY_TO_SHIP") {
      return orderService.updateStatus(orderId, "READY_TO_SHIP", {
        courier: input.courier,
        trackingNumber: input.trackingNumber,
      });
    }

    throw new Error(`Cannot assign shipping from ${order.status}`);
  },

  /** Stub for Shiprocket/Delhivery — returns mock label URL when API keys not set */
  async generateLabel(orderId: string, courier: string) {
    const order = await prisma.commerceOrder.findUniqueOrThrow({ where: { id: orderId } });
    const hasShiprocket = Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
    const hasDelhivery = Boolean(process.env.DELHIVERY_API_TOKEN);

    if (courier === "Shiprocket" && hasShiprocket) {
      // Production: call Shiprocket API
      return { labelUrl: null, message: "Shiprocket API integration ready — configure credentials" };
    }
    if (courier === "Delhivery" && hasDelhivery) {
      return { labelUrl: null, message: "Delhivery API integration ready — configure credentials" };
    }

    const mockTracking = `TRK${order.orderNumber.replace(/-/g, "")}`;
    await this.assignShipping(orderId, {
      courier,
      trackingNumber: mockTracking,
      markShipped: true,
    });

    return {
      labelUrl: `/api/admin/shipping/${orderId}/label`,
      trackingNumber: mockTracking,
      message: "Demo label generated (connect Shiprocket/Delhivery API keys for live labels)",
    };
  },
};
