import { prisma } from "@/lib/db";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subDays } from "date-fns";

function sumOrders(where: object) {
  return prisma.commerceOrder.aggregate({
    where,
    _sum: { total: true },
    _count: true,
  });
}

export const dashboardService = {
  async getStats() {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);
    const yearStart = startOfYear(now);

    const [
      today,
      week,
      month,
      year,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      refundRequests,
      activeCustomers,
      activeSellers,
      lowStock,
      topProducts,
      recentOrders,
    ] = await Promise.all([
      sumOrders({ createdAt: { gte: todayStart }, status: { not: "CANCELLED" } }),
      sumOrders({ createdAt: { gte: weekStart }, status: { not: "CANCELLED" } }),
      sumOrders({ createdAt: { gte: monthStart }, status: { not: "CANCELLED" } }),
      sumOrders({ createdAt: { gte: yearStart }, status: { not: "CANCELLED" } }),
      prisma.commerceOrder.count({ where: { status: "PENDING" } }),
      prisma.commerceOrder.count({ where: { status: "DELIVERED" } }),
      prisma.commerceOrder.count({ where: { status: "CANCELLED" } }),
      prisma.commerceRefund.count({ where: { status: "PENDING" } }),
      prisma.commerceCustomer.count({ where: { status: "ACTIVE" } }),
      prisma.commerceSeller.count({ where: { status: "APPROVED" } }),
      prisma.commerceProduct.count({
        where: { stock: { lte: 5 }, status: "PUBLISHED" },
      }),
      prisma.commerceOrderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.commerceOrder.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { customer: true },
      }),
    ]);

    const topProductIds = topProducts.map((t) => t.productId);
    const topProductDetails = await prisma.commerceProduct.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, slug: true },
    });

    const last7Days = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const day = subDays(todayStart, 6 - i);
        const next = subDays(todayStart, 5 - i);
        return sumOrders({
          createdAt: { gte: day, lt: i === 6 ? now : next },
          status: { not: "CANCELLED" },
        }).then((r) => ({
          date: day.toISOString().slice(0, 10),
          revenue: r._sum.total || 0,
          orders: r._count,
        }));
      })
    );

    return {
      sales: {
        today: today._sum.total || 0,
        week: week._sum.total || 0,
        month: month._sum.total || 0,
        year: year._sum.total || 0,
      },
      orders: {
        today: today._count,
        week: week._count,
        month: month._count,
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      refunds: { pending: refundRequests },
      users: { customers: activeCustomers, sellers: activeSellers },
      alerts: { lowStock },
      topProducts: topProductDetails.map((p) => ({
        ...p,
        sold: topProducts.find((t) => t.productId === p.id)?._sum.quantity || 0,
      })),
      chart: last7Days,
      recentOrders,
    };
  },
};
