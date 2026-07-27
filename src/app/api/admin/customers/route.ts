import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const customers = await withAdminAuth("orders:read", async () => {
      const rows = await prisma.commerceCustomer.findMany({
        orderBy: { updatedAt: "desc" },
        take: 200,
        include: {
          addresses: true,
          _count: { select: { orders: true, addresses: true } },
          orders: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { createdAt: true, total: true, orderNumber: true },
          },
        },
      });

      return Promise.all(
        rows.map(async (c) => {
          const agg = await prisma.commerceOrder.aggregate({
            where: { customerId: c.id, status: { not: "CANCELLED" } },
            _sum: { total: true },
          });
          return {
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            status: c.status,
            createdAt: c.createdAt,
            lifetimeSpend: agg._sum.total || 0,
            totalOrders: c._count.orders,
            lastOrderAt: c.orders[0]?.createdAt || null,
            lastOrderNumber: c.orders[0]?.orderNumber || null,
            addressCount: c._count.addresses,
            addresses: c.addresses,
            wishlistCount: 0,
            supportTicketCount: 0,
            isBlocked: c.status === "BLOCKED",
          };
        })
      );
    });
    return NextResponse.json({ customers });
  } catch (error) {
    return commerceApiError(error);
  }
}
