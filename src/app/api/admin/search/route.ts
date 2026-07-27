import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() || "";
    if (q.length < 2) return NextResponse.json({ results: [] });

    const results = await withAdminAuth("orders:read", async () => {
      const [orders, products, customers, suppliers] = await Promise.all([
        prisma.commerceOrder.findMany({
          where: { orderNumber: { contains: q, mode: "insensitive" } },
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, orderNumber: true, status: true },
        }),
        prisma.commerceProduct.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
          select: { id: true, name: true, sku: true },
        }),
        prisma.commerceCustomer.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
          select: { id: true, name: true, email: true },
        }),
        prisma.commerceSupplier.findMany({
          where: {
            OR: [
              { brandName: { contains: q, mode: "insensitive" } },
              { contactPerson: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
          select: { id: true, brandName: true },
        }),
      ]);

      return [
        ...orders.map((o) => ({
          id: `order:${o.id}`,
          label: `${o.orderNumber} · ${o.status}`,
          href: `/admin/orders/${o.id}`,
          type: "Order",
        })),
        ...products.map((p) => ({
          id: `product:${p.id}`,
          label: `${p.name}${p.sku ? ` · ${p.sku}` : ""}`,
          href: `/admin/products/${p.id}/edit`,
          type: "Product",
        })),
        ...customers.map((c) => ({
          id: `customer:${c.id}`,
          label: `${c.name || c.email || "Customer"}${c.email ? ` · ${c.email}` : ""}`,
          href: "/admin/customers",
          type: "Customer",
        })),
        ...suppliers.map((s) => ({
          id: `supplier:${s.id}`,
          label: s.brandName,
          href: `/admin/suppliers/${s.id}`,
          type: "Supplier",
        })),
      ].slice(0, 16);
    });

    return NextResponse.json({ results });
  } catch (error) {
    return commerceApiError(error);
  }
}
