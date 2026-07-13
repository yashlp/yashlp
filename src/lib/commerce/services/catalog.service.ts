import { prisma } from "@/lib/db";
import { mapBrand, mapCollection, mapProduct } from "../mappers";

export const catalogService = {
  async getHomepageData() {
    const [featured, newArrivals, collections, brands] = await Promise.all([
      prisma.commerceProduct.findMany({
        where: { status: "PUBLISHED", approvalStatus: "APPROVED", isFeatured: true },
        include: { brand: true, category: true, media: true },
        take: 8,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.commerceProduct.findMany({
        where: { status: "PUBLISHED", approvalStatus: "APPROVED", isNewArrival: true },
        include: { brand: true, category: true, media: true },
        take: 8,
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
    ]);

    return {
      featured: featured.map(mapProduct),
      newArrivals: newArrivals.map(mapProduct),
      collections: collections.map((c) => mapCollection(c)),
      brands: brands.map(mapBrand),
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
