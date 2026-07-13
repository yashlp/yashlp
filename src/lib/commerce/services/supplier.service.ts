import { prisma } from "@/lib/db";
import type { z } from "zod";
import type { supplierSchema } from "../validators/supplier";

export type SupplierInput = z.infer<typeof supplierSchema>;

function serializeSupplier(data: SupplierInput) {
  const { bankDetails, productCategories, documents, email, ...rest } = data;
  return {
    ...rest,
    email: email || null,
    bankDetails: bankDetails ? JSON.stringify(bankDetails) : undefined,
    productCategories: productCategories ? JSON.stringify(productCategories) : undefined,
    documents: documents ? JSON.stringify(documents) : undefined,
  };
}

export const supplierService = {
  async list() {
    return prisma.commerceSupplier.findMany({
      orderBy: { brandName: "asc" },
      include: {
        _count: { select: { products: true, purchaseOrders: true } },
      },
    });
  },

  async getById(id: string) {
    return prisma.commerceSupplier.findUnique({
      where: { id },
      include: {
        products: { select: { id: true, name: true, sku: true, stock: true } },
        purchaseOrders: {
          orderBy: { orderDate: "desc" },
          take: 10,
          include: { lines: true },
        },
      },
    });
  },

  async create(data: SupplierInput) {
    return prisma.commerceSupplier.create({ data: serializeSupplier(data) });
  },

  async update(id: string, data: Partial<SupplierInput>) {
    return prisma.commerceSupplier.update({
      where: { id },
      data: serializeSupplier(data as SupplierInput),
    });
  },
};
