import { prisma } from "@/lib/db";

export const customerCrmService = {
  async list(search?: string) {
    const customers = await prisma.commerceCustomer.findMany({
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        _count: { select: { orders: true, reviews: true } },
        orders: {
          where: { status: { not: "CANCELLED" } },
          select: { total: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return customers.map((c) => {
      const lifetimeValue = c.orders.reduce((s, o) => s + o.total, 0);
      const orderCount = c.orders.length;
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: c.status,
        loyaltyPoints: c.loyaltyPoints,
        loyaltyLevel: c.loyaltyLevel,
        createdAt: c.createdAt,
        orderCount,
        lifetimeValue,
        averageSpend: orderCount > 0 ? lifetimeValue / orderCount : 0,
        reviewCount: c._count.reviews,
      };
    });
  },

  async getProfile(id: string) {
    const customer = await prisma.commerceCustomer.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: { include: { product: { select: { name: true, slug: true, category: true } } } },
            payments: true,
            returns: true,
            refunds: true,
          },
          take: 50,
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          include: { product: { select: { name: true, slug: true } } },
          take: 50,
        },
      },
    });
    if (!customer) return null;

    const paidOrders = customer.orders.filter((o) => o.status !== "CANCELLED");
    const lifetimeValue = paidOrders.reduce((s, o) => s + o.total, 0);
    const averageSpend = paidOrders.length ? lifetimeValue / paidOrders.length : 0;

    const categoryCount = new Map<string, number>();
    for (const order of paidOrders) {
      for (const item of order.items) {
        const cat = item.product.category?.name || "Other";
        categoryCount.set(cat, (categoryCount.get(cat) || 0) + item.quantity);
      }
    }
    const favouriteCategories = [...categoryCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const wishlistEvents = await prisma.commerceAnalyticsEvent.findMany({
      where: { customerId: id, type: "WISHLIST" },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const wishlistProductIds = [
      ...new Set(wishlistEvents.map((e) => e.productId).filter(Boolean) as string[]),
    ];
    const wishlistProducts = wishlistProductIds.length
      ? await prisma.commerceProduct.findMany({
          where: { id: { in: wishlistProductIds } },
          select: { id: true, name: true, slug: true, price: true },
        })
      : [];

    const returns = paidOrders.flatMap((o) =>
      o.returns.map((r) => ({
        ...r,
        orderNumber: o.orderNumber,
      }))
    );

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        loyaltyPoints: customer.loyaltyPoints,
        loyaltyLevel: customer.loyaltyLevel,
        notes: customer.notes,
        createdAt: customer.createdAt,
        addresses: customer.addresses,
      },
      metrics: {
        orderCount: paidOrders.length,
        lifetimeValue,
        averageSpend,
        reviewCount: customer.reviews.length,
        returnCount: returns.length,
      },
      favouriteCategories,
      orders: paidOrders,
      wishlist: wishlistProducts,
      returns,
      reviews: customer.reviews,
    };
  },
};
