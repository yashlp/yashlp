import { prisma } from "@/lib/db";
import { startOfMonth, subMonths } from "date-fns";
import { extractOrderCity } from "@/lib/commerce/order-city";

export const analyticsService = {
  async getStats() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    const [orders, lastMonthOrders, products, orderItems, customers, cityOrders] = await Promise.all([
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
      totalCustomers: customers.length,
      topCities,
      cityInsights: {
        citiesTracked: citiesWithData,
        ordersWithCity: cityOrderTotal,
        ordersMissingCity: Math.max(0, unknownCityOrders),
        sampleSize: cityOrders.length,
      },
    };
  },
};
