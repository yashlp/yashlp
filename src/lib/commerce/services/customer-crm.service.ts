import { prisma } from "@/lib/db";

/** Admin CRM over the same CommerceCustomer rows created by the storefront. */
export const customerCrmService = {
  async list(search?: string) {
    const q = search?.trim();
    const customers = await prisma.commerceCustomer.findMany({
      where: q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
              { name: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        addresses: { where: { isDefault: true }, take: 1 },
        _count: { select: { orders: true, reviews: true } },
        orders: {
          select: { id: true, total: true, status: true, createdAt: true, orderNumber: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return customers.map((c) => {
      const paidOrders = c.orders.filter((o) => !["CANCELLED", "PENDING"].includes(o.status));
      const lifetimeValue = paidOrders.reduce((s, o) => s + o.total, 0);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: c.status,
        loyaltyLevel: c.loyaltyLevel,
        loyaltyPoints: c.loyaltyPoints,
        notes: c.notes,
        createdAt: c.createdAt,
        orderCount: c._count.orders,
        reviewCount: c._count.reviews,
        lifetimeValue: Math.round(lifetimeValue * 100) / 100,
        latestOrders: c.orders,
        defaultAddress: c.addresses[0] || null,
      };
    });
  },

  async getById(id: string) {
    const customer = await prisma.commerceCustomer.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          include: {
            items: { include: { product: { select: { name: true, sku: true } } } },
            payments: true,
            returns: true,
          },
          orderBy: { createdAt: "desc" },
        },
        reviews: {
          include: { product: { select: { name: true, slug: true } } },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });
    if (!customer) return null;

    const lifetimeValue = customer.orders
      .filter((o) => !["CANCELLED", "PENDING"].includes(o.status))
      .reduce((s, o) => s + o.total, 0);

    return { ...customer, lifetimeValue: Math.round(lifetimeValue * 100) / 100 };
  },

  async updateNotes(id: string, notes: string) {
    return prisma.commerceCustomer.update({
      where: { id },
      data: { notes },
      select: { id: true, notes: true, updatedAt: true },
    });
  },
};
