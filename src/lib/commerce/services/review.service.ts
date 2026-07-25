import { prisma } from "@/lib/db";

async function refreshProductRating(productId: string) {
  const approved = await prisma.commerceReview.findMany({
    where: { productId, status: "APPROVED" },
    select: { rating: true },
  });
  const reviewCount = approved.length;
  const rating =
    reviewCount === 0
      ? 0
      : Math.round((approved.reduce((s, r) => s + r.rating, 0) / reviewCount) * 10) / 10;

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

  /** Approved reviews for homepage marquee — includes product image */
  async listStorefront(limit = 24) {
    const reviews = await prisma.commerceReview.findMany({
      where: { status: "APPROVED" },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            media: {
              where: { type: "IMAGE" },
              orderBy: { sortOrder: "asc" },
              take: 1,
              select: { url: true },
            },
          },
        },
        customer: { select: { name: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      customerName: r.customer?.name?.trim() || "Customer",
      productName: r.product.name,
      productSlug: r.product.slug,
      productImage: r.product.media[0]?.url || null,
      createdAt: r.createdAt,
    }));
  },

  async listForProduct(productId: string) {
    return prisma.commerceReview.findMany({
      where: { productId, status: "APPROVED" },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },

  async create(input: {
    productId: string;
    customerId: string;
    rating: number;
    title?: string;
    body: string;
  }) {
    const rating = Math.min(5, Math.max(1, Math.round(input.rating)));
    const body = input.body.trim();
    if (body.length < 10) throw new Error("Review must be at least 10 characters");

    const product = await prisma.commerceProduct.findUnique({ where: { id: input.productId } });
    if (!product || product.status !== "PUBLISHED") throw new Error("Product not found");

    const purchased = await prisma.commerceOrder.findFirst({
      where: {
        customerId: input.customerId,
        status: { in: ["DELIVERED", "SHIPPED", "OUT_FOR_DELIVERY", "CONFIRMED", "PACKED", "READY_TO_SHIP"] },
        items: { some: { productId: input.productId } },
        payments: { some: { status: "SUCCESS" } },
      },
      select: { id: true },
    });

    const review = await prisma.commerceReview.create({
      data: {
        productId: input.productId,
        customerId: input.customerId,
        rating,
        title: input.title?.trim() || null,
        body,
        status: "PENDING",
        verifiedPurchase: Boolean(purchased),
      },
    });

    return review;
  },

  async update(id: string, data: { status?: string; adminReply?: string; isFeatured?: boolean }) {
    const existing = await prisma.commerceReview.findUniqueOrThrow({ where: { id } });
    const updated = await prisma.commerceReview.update({
      where: { id },
      data,
      include: { product: { select: { name: true } } },
    });

    if (data.status && data.status !== existing.status) {
      await refreshProductRating(existing.productId);
    }

    return updated;
  },
};
