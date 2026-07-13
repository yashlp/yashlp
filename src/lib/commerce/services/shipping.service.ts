import { prisma } from "@/lib/db";
import { orderService } from "./order.service";

export const COURIERS = ["Shiprocket", "Delhivery", "BlueDart", "DTDC", "Manual"] as const;

export const shippingService = {
  async listPending() {
    return prisma.commerceOrder.findMany({
      where: { status: { in: ["CONFIRMED", "PACKED", "READY_TO_SHIP"] } },
      include: {
        customer: true,
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

  async assignShipping(
    orderId: string,
    input: { courier: string; trackingNumber: string; markShipped?: boolean }
  ) {
    const status = input.markShipped ? "SHIPPED" : "READY_TO_SHIP";
    return orderService.updateStatus(orderId, status, {
      courier: input.courier,
      trackingNumber: input.trackingNumber,
    });
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
