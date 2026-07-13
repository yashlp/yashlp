import { prisma } from "@/lib/db";

export const collectionAdminService = {
  async list() {
    return prisma.commerceCollection.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          include: { product: { select: { id: true, name: true, slug: true } } },
          orderBy: { sortOrder: "asc" },
        },
        _count: { select: { products: true } },
      },
    });
  },

  async create(data: {
    title: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isFeatured?: boolean;
    isPublished?: boolean;
    sortOrder?: number;
    productIds?: string[];
  }) {
    return prisma.commerceCollection.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? true,
        sortOrder: data.sortOrder ?? 0,
        products: data.productIds?.length
          ? {
              create: data.productIds.map((productId, i) => ({
                productId,
                sortOrder: i,
              })),
            }
          : undefined,
      },
      include: { products: { include: { product: true } } },
    });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      description: string;
      imageUrl: string;
      isFeatured: boolean;
      isPublished: boolean;
      sortOrder: number;
      productIds: string[];
    }>
  ) {
    const { productIds, ...rest } = data;

    if (productIds) {
      await prisma.commerceCollectionProduct.deleteMany({ where: { collectionId: id } });
      await prisma.commerceCollectionProduct.createMany({
        data: productIds.map((productId, i) => ({
          collectionId: id,
          productId,
          sortOrder: i,
        })),
      });
    }

    return prisma.commerceCollection.update({
      where: { id },
      data: rest,
      include: {
        products: { include: { product: true }, orderBy: { sortOrder: "asc" } },
      },
    });
  },

  async delete(id: string) {
    await prisma.commerceCollection.delete({ where: { id } });
  },
};
