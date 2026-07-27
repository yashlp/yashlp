import { prisma } from "@/lib/db";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subDays } from "date-fns";
import { extractOrderCity } from "@/lib/commerce/order-city";

function sumOrders(where: object) {
  return prisma.commerceOrder.aggregate({
    where,
    _sum: { total: true },
    _count: true,
  });
}

function isLowStock(stock: number, minStock: number) {
  return stock <= (minStock > 0 ? minStock : 5);
}

export const dashboardService = {
  async getStats() {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);
    const yearStart = startOfYear(now);

    const yesterdayStart = subDays(todayStart, 1);

    const [
      today,
      yesterday,
      week,
      month,
      year,
      pendingOrders,
      ordersToPack,
      ordersPacked,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      refundRequests,
      returnRequests,
      activeCustomers,
      activeSuppliers,
      products,
      topProducts,
      topProductsToday,
      recentOrders,
      topCategories,
      failedPayments,
      pendingReviews,
      todayOrdersWithItems,
    ] = await Promise.all([
      sumOrders({ createdAt: { gte: todayStart }, status: { not: "CANCELLED" } }),
      sumOrders({
        createdAt: { gte: yesterdayStart, lt: todayStart },
        status: { not: "CANCELLED" },
      }),
      sumOrders({ createdAt: { gte: weekStart }, status: { not: "CANCELLED" } }),
      sumOrders({ createdAt: { gte: monthStart }, status: { not: "CANCELLED" } }),
      sumOrders({ createdAt: { gte: yearStart }, status: { not: "CANCELLED" } }),
      prisma.commerceOrder.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } }),
      prisma.commerceOrder.count({ where: { status: "CONFIRMED" } }),
      prisma.commerceOrder.count({ where: { status: "PACKED" } }),
      prisma.commerceOrder.count({ where: { status: { in: ["SHIPPED", "OUT_FOR_DELIVERY"] } } }),
      prisma.commerceOrder.count({ where: { status: "DELIVERED" } }),
      prisma.commerceOrder.count({ where: { status: "CANCELLED" } }),
      prisma.commerceRefund.count({ where: { status: "PENDING" } }),
      prisma.commerceReturn.count({ where: { status: "REQUESTED" } }),
      prisma.commerceCustomer.count({ where: { status: "ACTIVE" } }),
      prisma.commerceSupplier.count({ where: { status: "ACTIVE" } }),
      prisma.commerceProduct.findMany({
        where: { status: { not: "ARCHIVED" } },
        select: { stock: true, purchaseCost: true, minStock: true, status: true },
      }),
      prisma.commerceOrderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.commerceOrderItem.groupBy({
        by: ["productId"],
        where: {
          order: {
            createdAt: { gte: todayStart },
            status: { not: "CANCELLED" },
          },
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 1,
      }),
      prisma.commerceOrder.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              status: true,
            },
          },
        },
      }),
      prisma.commerceOrderItem.groupBy({
        by: ["productId"],
        _sum: { total: true },
        orderBy: { _sum: { total: "desc" } },
        take: 20,
      }),
      prisma.commercePayment.count({
        where: { status: "FAILED", createdAt: { gte: todayStart } },
      }),
      prisma.commerceReview.count({
        where: { status: "PENDING" },
      }),
      prisma.commerceOrder.findMany({
        where: {
          createdAt: { gte: todayStart },
          status: { not: "CANCELLED" },
        },
        include: {
          items: {
            include: {
              product: { select: { purchaseCost: true } },
            },
          },
        },
      }),
    ]);

    const published = products.filter((p) => p.status === "PUBLISHED");
    const lowStock = published.filter((p) => isLowStock(p.stock, p.minStock)).length;
    const inventoryValue = products.reduce(
      (sum, p) => sum + (p.purchaseCost ? p.stock * p.purchaseCost : 0),
      0
    );

    const topProductIds = topProducts.map((t) => t.productId);
    const topProductDetails = await prisma.commerceProduct.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, slug: true },
    });
    const bestSellerTodayId = topProductsToday[0]?.productId;
    const bestSellerToday = bestSellerTodayId
      ? await prisma.commerceProduct.findUnique({
          where: { id: bestSellerTodayId },
          select: { id: true, name: true, slug: true },
        })
      : null;

    const categoryProducts = await prisma.commerceProduct.findMany({
      where: { id: { in: topCategories.map((c) => c.productId) } },
      select: { id: true, category: { select: { name: true, slug: true } } },
    });
    const categoryTotals = new Map<string, { name: string; revenue: number }>();
    for (const row of topCategories) {
      const cat = categoryProducts.find((p) => p.id === row.productId)?.category;
      if (!cat) continue;
      const existing = categoryTotals.get(cat.slug) || { name: cat.name, revenue: 0 };
      existing.revenue += row._sum.total || 0;
      categoryTotals.set(cat.slug, existing);
    }
    const bestCategories = [...categoryTotals.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

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

    const recentForCities = await prisma.commerceOrder.findMany({
      where: { status: { not: "CANCELLED" } },
      select: { shippingCity: true, shippingAddress: true, total: true },
      orderBy: { createdAt: "desc" },
      take: 1000,
    });
    const cityMap = new Map<string, { city: string; orders: number; revenue: number }>();
    for (const order of recentForCities) {
      const city = extractOrderCity(order);
      if (!city) continue;
      const existing = cityMap.get(city) || { city, orders: 0, revenue: 0 };
      existing.orders += 1;
      existing.revenue += order.total;
      cityMap.set(city, existing);
    }
    const topCities = [...cityMap.values()]
      .sort((a, b) => b.orders - a.orders || b.revenue - a.revenue)
      .slice(0, 5);

    const todayRevenue = today._sum.total || 0;
    const yesterdayRevenue = yesterday._sum.total || 0;
    const revenueVsYesterdayPct =
      yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;

    const todayCogs = todayOrdersWithItems.reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (itemSum, item) => itemSum + (item.product.purchaseCost || 0) * item.quantity,
          0
        ),
      0
    );
    const todayProfit = todayRevenue - todayCogs;
    const lowStockTop5 = (
      await prisma.commerceProduct.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, name: true, stock: true, minStock: true, slug: true },
      })
    )
      .filter((p) => isLowStock(p.stock, p.minStock))
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    return {
      sales: {
        today: todayRevenue,
        week: week._sum.total || 0,
        month: month._sum.total || 0,
        year: year._sum.total || 0,
      },
      orders: {
        today: today._count,
        week: week._count,
        month: month._count,
        pending: pendingOrders,
        toPack: ordersToPack,
        packed: ordersPacked,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      refunds: { pending: refundRequests },
      returns: { pending: returnRequests },
      inventory: { value: inventoryValue, lowStock },
      users: { customers: activeCustomers, suppliers: activeSuppliers },
      topProducts: topProductDetails.map((p) => ({
        ...p,
        sold: topProducts.find((t) => t.productId === p.id)?._sum.quantity || 0,
      })),
      bestCategories,
      topCities,
      taskWidgets: {
        newOrdersToday: today._count,
        ordersAwaitingPacking: ordersToPack,
        ordersAwaitingPickup: ordersPacked,
        todayProfit,
        bestSellerToday: bestSellerToday
          ? {
              ...bestSellerToday,
              sold: topProductsToday[0]?._sum.quantity || 0,
            }
          : null,
        lowStockTop5,
        failedPayments,
        newReviewsAwaitingApproval: pendingReviews,
        revenueVsYesterdayPct,
      },
      chart: last7Days,
      recentOrders,
    };
  },
};
