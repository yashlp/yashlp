import { prisma } from "@/lib/db";
import { startOfDay, subDays } from "date-fns";

function isLowStock(stock: number, minStock: number) {
  return stock <= (minStock > 0 ? minStock : 5);
}

export const businessHealthService = {
  async getSnapshot() {
    const now = new Date();
    const todayStart = startOfDay(now);
    const yesterdayStart = startOfDay(subDays(now, 1));
    const waitingCutoff = subDays(now, 1);

    const [
      todayOrders,
      yesterdayOrders,
      products,
      delayedOrders,
      failedPayments,
      ratingAgg,
      customers,
      collections,
      orderItems,
    ] = await Promise.all([
      prisma.commerceOrder.findMany({
        where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } },
        include: { items: { include: { product: { select: { purchaseCost: true } } } } },
      }),
      prisma.commerceOrder.findMany({
        where: {
          createdAt: { gte: yesterdayStart, lt: todayStart },
          status: { not: "CANCELLED" },
        },
        include: { items: { include: { product: { select: { purchaseCost: true } } } } },
      }),
      prisma.commerceProduct.findMany({
        where: { status: { not: "ARCHIVED" } },
        select: {
          id: true,
          name: true,
          stock: true,
          minStock: true,
          purchaseCost: true,
          price: true,
          status: true,
          rating: true,
        },
      }),
      prisma.commerceOrder.count({
        where: {
          status: { in: ["PENDING", "CONFIRMED", "PACKED"] },
          createdAt: { lte: waitingCutoff },
        },
      }),
      prisma.commercePayment.count({ where: { status: { in: ["FAILED", "CANCELLED"] } } }),
      prisma.commerceProduct.aggregate({
        where: { status: "PUBLISHED", reviewCount: { gt: 0 } },
        _avg: { rating: true },
      }),
      prisma.commerceCustomer.findMany({
        select: { id: true, createdAt: true, _count: { select: { orders: true } } },
      }),
      prisma.commerceCollection.findMany({
        where: { isPublished: true },
        include: {
          products: {
            include: { product: { select: { id: true } } },
          },
        },
      }),
      prisma.commerceOrderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true, total: true },
      }),
    ]);

    const revenueToday = todayOrders.reduce((s, o) => s + o.total, 0);
    const revenueYesterday = yesterdayOrders.reduce((s, o) => s + o.total, 0);
    const cogsToday = todayOrders.reduce(
      (s, o) =>
        s + o.items.reduce((is, item) => is + (item.product.purchaseCost || 0) * item.quantity, 0),
      0
    );
    const profitMargin =
      revenueToday > 0 ? Math.round(((revenueToday - cogsToday) / revenueToday) * 1000) / 10 : 0;

    const published = products.filter((p) => p.status === "PUBLISHED");
    const lowStock = published.filter((p) => isLowStock(p.stock, p.minStock)).length;
    const salesMap = new Map(orderItems.map((i) => [i.productId, i._sum.quantity || 0]));
    const deadStock = published.filter((p) => p.stock > 0 && (salesMap.get(p.id) || 0) === 0).length;

    const newCustomers = customers.filter((c) => c._count.orders <= 1).length;
    const returningCustomers = customers.filter((c) => c._count.orders > 1).length;

    const productRevenue = new Map(orderItems.map((i) => [i.productId, i._sum.total || 0]));
    let bestCollection = { title: "—", revenue: 0 };
    for (const col of collections) {
      const rev = col.products.reduce(
        (s, cp) => s + (productRevenue.get(cp.product.id) || 0),
        0
      );
      if (rev > bestCollection.revenue) bestCollection = { title: col.title, revenue: rev };
    }

    const worstProducts = published
      .map((p) => ({
        id: p.id,
        name: p.name,
        sold: salesMap.get(p.id) || 0,
        stock: p.stock,
        rating: p.rating,
      }))
      .sort((a, b) => a.sold - b.sold || b.stock - a.stock)
      .slice(0, 5);

    return {
      revenueToday,
      revenueYesterday,
      revenueDeltaPct:
        revenueYesterday > 0
          ? Math.round(((revenueToday - revenueYesterday) / revenueYesterday) * 100)
          : revenueToday > 0
            ? 100
            : 0,
      profitMargin,
      inventoryAtRisk: { lowStock, deadStock },
      ordersDelayed: delayedOrders,
      failedPayments,
      averageRating: Math.round((ratingAgg._avg.rating || 0) * 10) / 10,
      customers: { new: newCustomers, returning: returningCustomers },
      bestCollection,
      worstProducts,
    };
  },
};
