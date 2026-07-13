import { prisma } from "@/lib/db";

export const couponService = {
  async list() {
    return prisma.commerceCoupon.findMany({ orderBy: { createdAt: "desc" } });
  },

  async create(data: {
    code: string;
    description?: string;
    discountType: string;
    discountValue: number;
    minOrderValue?: number;
    maxUses?: number;
    isActive?: boolean;
    startsAt?: string;
    expiresAt?: string;
  }) {
    return prisma.commerceCoupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderValue: data.minOrderValue,
        maxUses: data.maxUses,
        isActive: data.isActive ?? true,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  },

  async update(id: string, data: Partial<{ isActive: boolean; description: string }>) {
    return prisma.commerceCoupon.update({ where: { id }, data });
  },

  async delete(id: string) {
    await prisma.commerceCoupon.delete({ where: { id } });
  },
};
