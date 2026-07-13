import { prisma } from "@/lib/db";

function isLowStock(stock: number, minStock: number) {
  const threshold = minStock > 0 ? minStock : 5;
  return stock <= threshold;
}

export const inventoryService = {
  async list(filters?: { lowStock?: boolean; search?: string }) {
    const products = await prisma.commerceProduct.findMany({
      where: {
        ...(filters?.search && {
          OR: [
            { name: { contains: filters.search } },
            { sku: { contains: filters.search } },
            { barcode: { contains: filters.search } },
          ],
        }),
      },
      include: {
        brand: { select: { name: true } },
        supplier: { select: { id: true, brandName: true } },
        category: { select: { name: true } },
      },
      orderBy: { stock: "asc" },
    });

    const mapped = products.map((p) => ({
      ...p,
      profitMargin:
        p.purchaseCost && p.purchaseCost > 0
          ? Math.round(((p.price - p.purchaseCost) / p.price) * 100)
          : null,
      reorderLevel: p.minStock,
      isLowStock: isLowStock(p.stock, p.minStock),
    }));

    return filters?.lowStock ? mapped.filter((p) => p.isLowStock) : mapped;
  },

  async getSummary() {
    const products = await prisma.commerceProduct.findMany({
      where: { status: { not: "ARCHIVED" } },
      select: { stock: true, purchaseCost: true, minStock: true, status: true },
    });

    const published = products.filter((p) => p.status === "PUBLISHED");
    const lowStockAlerts = published.filter((p) => isLowStock(p.stock, p.minStock)).length;
    const inventoryValue = products.reduce(
      (sum, p) => sum + (p.purchaseCost ? p.stock * p.purchaseCost : 0),
      0
    );
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

    return {
      totalSkus: products.length,
      lowStockAlerts,
      inventoryValue,
      totalUnits,
    };
  },
};
