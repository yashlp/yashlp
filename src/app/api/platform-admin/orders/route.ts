import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const orders = await withAdminAuth("orders:read", async () => {
      return prisma.commerceOrder.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { customer: true, items: { include: { product: true } } },
      });
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return commerceApiError(error);
  }
}
