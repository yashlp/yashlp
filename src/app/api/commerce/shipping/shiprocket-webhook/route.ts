import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orderService } from "@/lib/commerce/services/order.service";
import { mapShiprocketStatusToOrderStatus } from "@/lib/commerce/shiprocket";

/**
 * Shiprocket tracking webhook.
 * Configure in Shiprocket panel → Settings → API → Webhooks
 * URL: https://YOUR_DOMAIN/api/commerce/shipping/shiprocket-webhook
 *
 * Optional shared secret: SHIPROCKET_WEBHOOK_SECRET (matched against header x-api-key or ?secret=)
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SHIPROCKET_WEBHOOK_SECRET?.trim();
    if (secret) {
      const headerKey = req.headers.get("x-api-key") || req.headers.get("x-shiprocket-secret");
      const querySecret = req.nextUrl.searchParams.get("secret");
      if (headerKey !== secret && querySecret !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = (await req.json()) as Record<string, unknown>;
    const orderNumber = String(
      body.order_id || body.orderId || body.sr_order_id || body.channel_order_id || ""
    ).trim();
    const awb = String(body.awb || body.awb_code || body.awb_code_status || "").trim() || null;
    const currentStatus = String(
      body.current_status || body.shipment_status || body.status || body.current_status_id || ""
    ).trim();

    if (!orderNumber && !awb) {
      return NextResponse.json({ error: "Missing order_id / awb" }, { status: 400 });
    }

    const order = await prisma.commerceOrder.findFirst({
      where: {
        OR: [
          ...(orderNumber ? [{ orderNumber }] : []),
          ...(awb ? [{ trackingNumber: awb }] : []),
          ...(orderNumber
            ? [{ internalNotes: { contains: `ShiprocketOrder=${orderNumber}` } }]
            : []),
        ],
      },
    });

    if (!order) {
      return NextResponse.json({ ok: true, matched: false });
    }

    const mapped = mapShiprocketStatusToOrderStatus(currentStatus);
    const updates: { courier?: string; trackingNumber?: string } = {};
    if (awb && awb !== order.trackingNumber) updates.trackingNumber = awb;
    if (body.courier_name) updates.courier = String(body.courier_name);

    if (mapped && mapped !== order.status) {
      // Only advance forward in the delivery pipeline
      const rank: Record<string, number> = {
        SHIPPED: 1,
        OUT_FOR_DELIVERY: 2,
        DELIVERED: 3,
      };
      const currentRank = rank[order.status] ?? 0;
      const nextRank = rank[mapped] ?? 0;
      if (nextRank >= currentRank) {
        // Walk status machine step-by-step when needed
        if (order.status === "READY_TO_SHIP" && mapped === "SHIPPED") {
          await orderService.updateStatus(order.id, "SHIPPED", updates);
        } else if (order.status === "SHIPPED" && mapped === "OUT_FOR_DELIVERY") {
          await orderService.updateStatus(order.id, "OUT_FOR_DELIVERY", updates);
        } else if (
          (order.status === "SHIPPED" || order.status === "OUT_FOR_DELIVERY") &&
          mapped === "DELIVERED"
        ) {
          if (order.status === "SHIPPED") {
            await orderService.updateStatus(order.id, "OUT_FOR_DELIVERY", updates);
          }
          await orderService.updateStatus(order.id, "DELIVERED", updates);
        } else if (
          ["CONFIRMED", "PACKED", "READY_TO_SHIP"].includes(order.status) &&
          (mapped === "SHIPPED" || mapped === "OUT_FOR_DELIVERY" || mapped === "DELIVERED")
        ) {
          // Fast-forward via READY_TO_SHIP → SHIPPED then optional later states
          if (order.status === "CONFIRMED") await orderService.updateStatus(order.id, "PACKED");
          const mid = await prisma.commerceOrder.findUniqueOrThrow({ where: { id: order.id } });
          if (mid.status === "PACKED") {
            await orderService.updateStatus(order.id, "READY_TO_SHIP", {
              courier: updates.courier || order.courier || "Shiprocket",
              trackingNumber: updates.trackingNumber || order.trackingNumber || awb || undefined,
            });
          }
          await orderService.updateStatus(order.id, "SHIPPED", updates);
          if (mapped === "OUT_FOR_DELIVERY" || mapped === "DELIVERED") {
            await orderService.updateStatus(order.id, "OUT_FOR_DELIVERY", updates);
          }
          if (mapped === "DELIVERED") {
            await orderService.updateStatus(order.id, "DELIVERED", updates);
          }
        }
      }
    } else if (Object.keys(updates).length) {
      await prisma.commerceOrder.update({ where: { id: order.id }, data: updates });
    }

    return NextResponse.json({ ok: true, matched: true, orderId: order.id, status: mapped });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
