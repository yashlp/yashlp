import { prisma } from "@/lib/db";
import { mapBrand, mapCollection, mapProduct } from "../mappers";

const published = { status: "PUBLISHED" as const, approvalStatus: "APPROVED" as const };
const productInclude = { brand: true, category: true, media: true } as const;

export const catalogService = {
  async getHomepageData() {
    const [featured, trending, editorsPicks, completeSetups, collections, brands, customerPhotos] =
      await Promise.all([
        prisma.commerceProduct.findMany({
          where: { ...published, isFeatured: true },
          include: productInclude,
          take: 8,
          orderBy: { updatedAt: "desc" },
        }),
        prisma.commerceProduct.findMany({
          where: { ...published, OR: [{ isTrending: true }, { isBestseller: true }] },
          include: productInclude,
          take: 8,
          orderBy: { rating: "desc" },
        }),
        prisma.commerceProduct.findMany({
          where: { ...published, isRecommended: true },
          include: productInclude,
          take: 8,
          orderBy: { updatedAt: "desc" },
        }),
        prisma.commerceCollection.findMany({
          where: { isPublished: true },
          orderBy: { sortOrder: "asc" },
          take: 4,
          include: {
            products: {
              take: 1,
              include: { product: { include: productInclude } },
              orderBy: { sortOrder: "asc" },
            },
          },
        }),
        prisma.commerceCollection.findMany({
          where: { isPublished: true, isFeatured: true },
          orderBy: { sortOrder: "asc" },
          take: 6,
        }),
        prisma.commerceBrand.findMany({
          where: { verified: true },
          take: 12,
          orderBy: { name: "asc" },
        }),
        prisma.commerceReview.findMany({
          where: { status: "APPROVED", imageUrl: { not: null } },
          include: {
            product: { select: { name: true, slug: true } },
            customer: { select: { name: true } },
          },
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          take: 8,
        }),
      ]);

    return {
      featured: featured.map(mapProduct),
      trending: trending.map(mapProduct),
      editorsPicks: editorsPicks.map(mapProduct),
      /** @deprecated use trending / editorsPicks */
      newArrivals: trending.map(mapProduct),
      completeSetups: completeSetups.map((c) => mapCollection(c)),
      collections: collections.map((c) => mapCollection(c)),
      brands: brands.map(mapBrand),
      customerPhotos,
    };
  },

  async getCollections() {
    const collections = await prisma.commerceCollection.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
    return collections.map((c) => mapCollection(c));
  },

  async getCollectionBySlug(slug: string) {
    const collection = await prisma.commerceCollection.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            product: { include: { brand: true, category: true, media: true } },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    return collection ? mapCollection(collection) : null;
  },

  async getBrands() {
    const brands = await prisma.commerceBrand.findMany({ orderBy: { name: "asc" } });
    return brands.map(mapBrand);
  },

  async getBrandById(id: string) {
    const brand = await prisma.commerceBrand.findUnique({ where: { id } });
    return brand ? mapBrand(brand) : null;
  },
};
