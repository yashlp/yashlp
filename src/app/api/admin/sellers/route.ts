import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

/** Marketplace seller records used for brand FK on products (D2C: brand display names). */
export async function GET() {
  try {
    const sellers = await withAdminAuth("products:read", async () => {
      return prisma.commerceSeller.findMany({
        include: { brands: { select: { id: true, name: true } } },
        orderBy: { businessName: "asc" },
      });
    });
    return NextResponse.json({ sellers });
  } catch (error) {
    return commerceApiError(error);
  }
}
