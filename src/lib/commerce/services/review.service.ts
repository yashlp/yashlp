import { prisma } from "@/lib/db";

export const reviewService = {
  async list(filters?: { status?: string }) {
    return prisma.commerceReview.findMany({
      where: filters?.status ? { status: filters.status } : undefined,
      include: {
        product: { select: { name: true, slug: true } },
        customer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  },

  async update(id: string, data: { status?: string; adminReply?: string; isFeatured?: boolean }) {
    return prisma.commerceReview.update({
      where: { id },
      data,
      include: { product: { select: { name: true } } },
    });
  },
};
