import { prisma } from "@/lib/db";
import { orderService } from "./order.service";
import { sendShipmentEmail } from "@/lib/commerce/commerce-email";
import {
  createShiprocketShipment,
  isShiprocketConfigured,
  parseShippingAddressBlob,
} from "@/lib/commerce/shiprocket";

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
        const updated = await orderService.updateStatus(orderId, "SHIPPED", {
          courier: input.courier,
          trackingNumber: input.trackingNumber,
        });
        await notifyShipment(orderId).catch(() => undefined);
        return updated;
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

  /**
   * Create a courier shipment.
   * - Shiprocket: live API when SHIPROCKET_EMAIL + SHIPROCKET_PASSWORD are set
   * - Otherwise: demo AWB for staging (not production-safe without keys)
   */
  async generateLabel(orderId: string, courier: string) {
    const order = await prisma.commerceOrder.findUniqueOrThrow({
      where: { id: orderId },
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        items: { include: { product: { select: { name: true, sku: true } } } },
      },
    });

    if (["CANCELLED", "REFUNDED", "DELIVERED"].includes(order.status)) {
      throw new Error(`Cannot create shipment for status ${order.status}`);
    }

    const selected = courier || "Shiprocket";

    if (selected === "Shiprocket" && isShiprocketConfigured()) {
      const address = parseShippingAddressBlob(order.shippingAddress, {
        city: order.shippingCity,
        state: order.shippingState,
        name: order.customer?.name || undefined,
        email: order.customer?.email || undefined,
        phone: order.customer?.phone || undefined,
      });

      const paymentMethod = "Prepaid" as const;

      const result = await createShiprocketShipment({
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        subtotal: order.subtotal,
        paymentMethod,
        address,
        items: order.items.map((item) => ({
          name: item.product.name,
          sku: item.product.sku || undefined,
          units: item.quantity,
          sellingPrice: item.unitPrice,
        })),
      });

      const tracking =
        result.awb ||
        (result.shipmentId ? `SR-${result.shipmentId}` : `SR-${order.orderNumber}`);

      const noteBits = [
        order.internalNotes,
        result.shiprocketOrderId ? `ShiprocketOrder=${result.shiprocketOrderId}` : null,
        result.shipmentId ? `ShipmentId=${result.shipmentId}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      await prisma.commerceOrder.update({
        where: { id: orderId },
        data: { internalNotes: noteBits || order.internalNotes },
      });

      await this.assignShipping(orderId, {
        courier: result.courierName || "Shiprocket",
        trackingNumber: tracking,
        markShipped: true,
      });

      return {
        labelUrl: result.labelUrl,
        trackingNumber: tracking,
        courier: result.courierName || "Shiprocket",
        shiprocketOrderId: result.shiprocketOrderId,
        shipmentId: result.shipmentId,
        message: result.awb
          ? `Shiprocket shipment created. AWB ${result.awb}`
          : "Shiprocket order created — AWB may assign after courier pickup is scheduled in Shiprocket panel",
      };
    }

    if (selected === "Shiprocket" && !isShiprocketConfigured()) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          "Shiprocket credentials missing. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD on Vercel."
        );
      }
    }

    if (selected === "Delhivery" && process.env.DELHIVERY_API_TOKEN) {
      throw new Error(
        "Delhivery direct API is not wired yet — use Shiprocket (recommended) or enter tracking manually."
      );
    }

    const mockTracking = `TRK${order.orderNumber.replace(/-/g, "").slice(0, 18)}`;
    await this.assignShipping(orderId, {
      courier: selected,
      trackingNumber: mockTracking,
      markShipped: true,
    });

    return {
      labelUrl: null,
      trackingNumber: mockTracking,
      courier: selected,
      message:
        "Demo tracking generated. Connect Shiprocket (SHIPROCKET_EMAIL + SHIPROCKET_PASSWORD) for live labels.",
    };
  },
};

async function notifyShipment(orderId: string) {
  const order = await prisma.commerceOrder.findUnique({
    where: { id: orderId },
    include: { customer: { select: { name: true, email: true } } },
  });
  if (!order?.trackingNumber) return;

  const address = parseShippingAddressBlob(order.shippingAddress, {
    name: order.customer?.name || undefined,
    email: order.customer?.email || undefined,
  });
  const to = address.email || order.customer?.email;
  if (!to) return;

  await sendShipmentEmail({
    to,
    name: address.name || order.customer?.name || "there",
    orderNumber: order.orderNumber,
    courier: order.courier || "Courier",
    trackingNumber: order.trackingNumber,
  });
}
