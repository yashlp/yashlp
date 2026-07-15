import { prisma } from "@/lib/db";

async function recalculateProductRating(productId: string) {
  const approved = await prisma.commerceReview.findMany({
    where: { productId, status: "APPROVED" },
    select: { rating: true },
  });
  const reviewCount = approved.length;
  const rating =
    reviewCount === 0
      ? 0
      : Math.round((approved.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10;

  await prisma.commerceProduct.update({
    where: { id: productId },
    data: { rating, reviewCount },
  });
}

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

  async listForProduct(productId: string, opts?: { featuredOnly?: boolean; limit?: number }) {
    return prisma.commerceReview.findMany({
      where: {
        productId,
        status: "APPROVED",
        ...(opts?.featuredOnly ? { isFeatured: true } : {}),
      },
      include: {
        customer: { select: { name: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: opts?.limit ?? 50,
    });
  },

  async listCustomerPhotos(limit = 12) {
    return prisma.commerceReview.findMany({
      where: {
        status: "APPROVED",
        imageUrl: { not: null },
      },
      include: {
        product: { select: { name: true, slug: true } },
        customer: { select: { name: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
  },

  async create(data: {
    productId: string;
    customerId: string;
    rating: number;
    title?: string;
    body?: string;
    imageUrl?: string;
  }) {
    const product = await prisma.commerceProduct.findFirst({
      where: { id: data.productId, status: "PUBLISHED", approvalStatus: "APPROVED" },
      select: { id: true },
    });
    if (!product) throw new Error("Product not found");

    const verifiedPurchase = Boolean(
      await prisma.commerceOrderItem.findFirst({
        where: {
          productId: data.productId,
          order: {
            customerId: data.customerId,
            payments: { some: { status: "PAID" } },
          },
        },
        select: { id: true },
      })
    );

    return prisma.commerceReview.create({
      data: {
        productId: data.productId,
        customerId: data.customerId,
        rating: data.rating,
        title: data.title,
        body: data.body,
        imageUrl: data.imageUrl,
        verifiedPurchase,
        status: "PENDING",
      },
      include: {
        product: { select: { name: true, slug: true } },
        customer: { select: { name: true, email: true } },
      },
    });
  },

  async update(
    id: string,
    data: { status?: string; adminReply?: string; isFeatured?: boolean; isPinned?: boolean; imageUrl?: string }
  ) {
    const review = await prisma.commerceReview.update({
      where: { id },
      data,
      include: { product: { select: { name: true, id: true } } },
    });
    if (data.status) {
      await recalculateProductRating(review.productId);
    }
    return review;
  },

  async analytics() {
    const [total, pending, approved, featured, pinned, withImages, avg] = await Promise.all([
      prisma.commerceReview.count(),
      prisma.commerceReview.count({ where: { status: "PENDING" } }),
      prisma.commerceReview.count({ where: { status: "APPROVED" } }),
      prisma.commerceReview.count({ where: { isFeatured: true } }),
      prisma.commerceReview.count({ where: { isPinned: true } }),
      prisma.commerceReview.count({ where: { imageUrl: { not: null } } }),
      prisma.commerceReview.aggregate({
        where: { status: "APPROVED" },
        _avg: { rating: true },
      }),
    ]);
    return {
      total,
      pending,
      approved,
      featured,
      pinned,
      withImages,
      averageRating: Math.round((avg._avg.rating || 0) * 10) / 10,
    };
  },

  async delete(id: string) {
    const review = await prisma.commerceReview.delete({
      where: { id },
      select: { productId: true },
    });
    await recalculateProductRating(review.productId);
    return { ok: true };
  },
};
