import { prisma } from "@/lib/db";
import { startOfDay, subHours, addDays, endOfDay } from "date-fns";

export type ActionAlert = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  href: string;
  count?: number;
};

function isLowStock(stock: number, minStock: number) {
  return stock <= (minStock > 0 ? minStock : 5);
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const actionCenterService = {
  async getAlerts(): Promise<ActionAlert[]> {
    const now = new Date();
    const todayStart = startOfDay(now);
    const waitingCutoff = subHours(now, 24);
    const tomorrowEnd = endOfDay(addDays(now, 1));

    const [
      lowStockProducts,
      supplierDue,
      staleOrders,
      pendingReviews,
      failedPayments,
      endingCampaigns,
      pendingReturns,
      giftWrapOrders,
    ] = await Promise.all([
      safe(
        () =>
          prisma.commerceProduct.findMany({
            where: { status: "PUBLISHED" },
            select: { id: true, stock: true, minStock: true },
          }),
        []
      ),
      safe(
        () =>
          prisma.commercePurchaseOrder.count({
            where: {
              paymentStatus: { in: ["PENDING", "PARTIAL"] },
              OR: [
                { expectedDelivery: { lte: endOfDay(now) } },
                { orderDate: { lte: todayStart } },
              ],
            },
          }),
        0
      ),
      safe(
        () =>
          prisma.commerceOrder.count({
            where: {
              status: { in: ["PENDING", "CONFIRMED"] },
              createdAt: { lte: waitingCutoff },
            },
          }),
        0
      ),
      safe(() => prisma.commerceReview.count({ where: { status: "PENDING" } }), 0),
      safe(
        () => prisma.commercePayment.count({ where: { status: { in: ["FAILED", "CANCELLED"] } } }),
        0
      ),
      safe(
        () =>
          prisma.commerceCampaign.count({
            where: {
              status: { in: ["ACTIVE", "SCHEDULED"] },
              endsAt: { gte: todayStart, lte: tomorrowEnd },
            },
          }),
        0
      ),
      safe(() => prisma.commerceReturn.count({ where: { status: "REQUESTED" } }), 0),
      safe(
        () =>
          prisma.commerceOrder.count({
            where: { giftWrap: true, status: { in: ["PENDING", "CONFIRMED", "PACKED"] } },
          }),
        0
      ),
    ]);

    const lowStock = lowStockProducts.filter((p) => isLowStock(p.stock, p.minStock)).length;
    const alerts: ActionAlert[] = [];

    if (lowStock > 0) {
      alerts.push({
        id: "low-stock",
        severity: "warning",
        title: `Low Stock (${lowStock})`,
        detail: "SKUs at or below reorder level — restock before stockouts.",
        href: "/admin/inventory",
        count: lowStock,
      });
    }

    if (supplierDue > 0) {
      alerts.push({
        id: "supplier-pay",
        severity: "critical",
        title: `Supplier Payment Due (${supplierDue})`,
        detail: "Purchase orders with outstanding payment need attention today.",
        href: "/admin/purchases",
        count: supplierDue,
      });
    }

    if (staleOrders > 0) {
      alerts.push({
        id: "stale-orders",
        severity: "warning",
        title: `${staleOrders} Orders Waiting 24+ Hours`,
        detail: "Orders still pending/confirmed past a day — pack or cancel.",
        href: "/admin/orders",
        count: staleOrders,
      });
    }

    if (pendingReviews > 0) {
      alerts.push({
        id: "reviews",
        severity: "warning",
        title: `${pendingReviews} Reviews Awaiting Approval`,
        detail: "Moderate new reviews before they go live.",
        href: "/admin/reviews",
        count: pendingReviews,
      });
    }

    if (failedPayments > 0) {
      alerts.push({
        id: "failed-pay",
        severity: "critical",
        title: `${failedPayments} Failed Payment${failedPayments === 1 ? "" : "s"}`,
        detail: "Payment attempts failed — follow up or retry with customers.",
        href: "/admin/payments",
        count: failedPayments,
      });
    }

    if (endingCampaigns > 0) {
      alerts.push({
        id: "campaigns",
        severity: "info",
        title: `Marketing Campaign Ending Tomorrow (${endingCampaigns})`,
        detail: "Active/scheduled campaigns ending within 24 hours.",
        href: "/admin/marketing",
        count: endingCampaigns,
      });
    }

    if (pendingReturns > 0) {
      alerts.push({
        id: "returns",
        severity: "warning",
        title: `${pendingReturns} Return${pendingReturns === 1 ? "" : "s"} to Review`,
        detail: "Customer return requests awaiting approve/reject.",
        href: "/admin/returns",
        count: pendingReturns,
      });
    }

    if (giftWrapOrders > 0) {
      alerts.push({
        id: "gift-wrap",
        severity: "info",
        title: `${giftWrapOrders} Gift Wrap Order${giftWrapOrders === 1 ? "" : "s"}`,
        detail: "Open orders requested gift wrap — check packing notes.",
        href: "/admin/orders",
        count: giftWrapOrders,
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        id: "all-clear",
        severity: "info",
        title: "All clear for now",
        detail: "No critical operational alerts. Keep an eye on inventory and new orders.",
        href: "/admin/business-health",
      });
    }

    const rank = { critical: 0, warning: 1, info: 2 };
    return alerts.sort((a, b) => rank[a.severity] - rank[b.severity]);
  },
};
