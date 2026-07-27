import { prisma } from "@/lib/db";
import { startOfMonth, subMonths } from "date-fns";
import { extractOrderCity } from "@/lib/commerce/order-city";

export const analyticsService = {
  async getStats() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    const [orders, lastMonthOrders, products, orderItems, customers, cityOrders, allMonthOrders, refunds] = await Promise.all([
      prisma.commerceOrder.findMany({
        where: { status: { notIn: ["CANCELLED"] }, createdAt: { gte: monthStart } },
        include: { items: { include: { product: { select: { purchaseCost: true } } } } },
      }),
      prisma.commerceOrder.aggregate({
        where: { status: { notIn: ["CANCELLED"] }, createdAt: { gte: lastMonthStart, lt: monthStart } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.commerceProduct.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, name: true, stock: true, purchaseCost: true, price: true },
      }),
      prisma.commerceOrderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true, total: true },
      }),
      prisma.commerceCustomer.findMany({
        select: { id: true, _count: { select: { orders: true } } },
      }),
      prisma.commerceOrder.findMany({
        where: { status: { notIn: ["CANCELLED"] } },
        select: {
          total: true,
          shippingCity: true,
          shippingAddress: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 2000,
      }),
      prisma.commerceOrder.findMany({
        where: { createdAt: { gte: monthStart } },
        select: { id: true, status: true },
      }),
      prisma.commerceRefund.findMany({
        where: { createdAt: { gte: monthStart } },
        select: { status: true, amount: true },
      }),
    ]);

    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const gstCollected = orders.reduce((s, o) => s + o.tax, 0);
    const cogs = orders.reduce(
      (s, o) =>
        s +
        o.items.reduce((is, item) => is + (item.product.purchaseCost || 0) * item.quantity, 0),
      0
    );
    const grossProfit = revenue - cogs;
    const orderCount = orders.length;
    const aov = orderCount > 0 ? revenue / orderCount : 0;

    const lastMonthRevenue = lastMonthOrders._sum.total || 0;
    const monthlyGrowth =
      lastMonthRevenue > 0 ? Math.round(((revenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;

    const salesMap = new Map(orderItems.map((i) => [i.productId, i._sum.quantity || 0]));
    const bestSelling = products
      .map((p) => ({ ...p, sold: salesMap.get(p.id) || 0 }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    const slowMoving = products
      .filter((p) => p.stock > 5 && (salesMap.get(p.id) || 0) < 2)
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10);

    const repeatCustomers = customers.filter((c) => c._count.orders > 1).length;
    const repeatRate = customers.length > 0 ? Math.round((repeatCustomers / customers.length) * 100) : 0;
    const conversionRate =
      allMonthOrders.length > 0
        ? Math.round((orders.length / allMonthOrders.length) * 1000) / 10
        : 0;

    const cityMap = new Map<string, { city: string; orders: number; revenue: number }>();
    for (const order of cityOrders) {
      const city = extractOrderCity(order);
      if (!city) continue;
      const existing = cityMap.get(city) || { city, orders: 0, revenue: 0 };
      existing.orders += 1;
      existing.revenue += order.total;
      cityMap.set(city, existing);
    }

    const topCities = [...cityMap.values()]
      .sort((a, b) => b.orders - a.orders || b.revenue - a.revenue)
      .slice(0, 15);

    const cityOrderTotal = topCities.reduce((s, c) => s + c.orders, 0);
    const citiesWithData = cityMap.size;
    const unknownCityOrders = cityOrders.length - [...cityMap.values()].reduce((s, c) => s + c.orders, 0);

    const monthOrderItems = await prisma.commerceOrderItem.findMany({
      where: { order: { createdAt: { gte: monthStart }, status: { not: "CANCELLED" } } },
      include: {
        product: {
          select: {
            supplier: { select: { id: true, brandName: true } },
            collectionItems: { select: { collection: { select: { id: true, title: true } } } },
          },
        },
      },
    });
    const byCollection = new Map<string, { name: string; revenue: number }>();
    const bySupplier = new Map<string, { name: string; revenue: number }>();
    for (const item of monthOrderItems) {
      for (const ci of item.product.collectionItems) {
        const key = ci.collection.id;
        const prev = byCollection.get(key) || { name: ci.collection.title, revenue: 0 };
        prev.revenue += item.total;
        byCollection.set(key, prev);
      }
      if (item.product.supplier) {
        const key = item.product.supplier.id;
        const prev = bySupplier.get(key) || { name: item.product.supplier.brandName, revenue: 0 };
        prev.revenue += item.total;
        bySupplier.set(key, prev);
      }
    }
    const salesByCollection = [...byCollection.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);
    const salesBySupplier = [...bySupplier.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

    const refundRequested = refunds.filter((r) => r.status === "PENDING").length;
    const refundProcessed = refunds.filter((r) => r.status === "APPROVED" || r.status === "COMPLETED").length;
    const refundAmount = refunds.reduce((sum, r) => sum + r.amount, 0);

    return {
      revenue,
      grossProfit,
      gstCollected,
      orderCount,
      aov,
      monthlyGrowth,
      bestSelling,
      slowMoving,
      repeatRate,
      repeatCustomers,
      conversionRate,
      totalCustomers: customers.length,
      topCities,
      salesByCollection,
      salesBySupplier,
      refundAnalysis: {
        requested: refundRequested,
        processed: refundProcessed,
        amount: refundAmount,
      },
      cityInsights: {
        citiesTracked: citiesWithData,
        ordersWithCity: cityOrderTotal,
        ordersMissingCity: Math.max(0, unknownCityOrders),
        sampleSize: cityOrders.length,
      },
    };
  },
};
