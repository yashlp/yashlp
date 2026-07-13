import { prisma } from "@/lib/db";
import { mapProduct } from "../mappers";
import { toJsonArray } from "../mappers";
import type { z } from "zod";
import type { productCreateSchema, productUpdateSchema } from "../validators";

const productInclude = {
  brand: true,
  category: true,
  media: true,
  seller: true,
} as const;

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export const productService = {
  async listPublished(filters?: { categorySlug?: string; featured?: boolean; limit?: number }) {
    const products = await prisma.commerceProduct.findMany({
      where: {
        status: "PUBLISHED",
        approvalStatus: "APPROVED",
        ...(filters?.categorySlug && { category: { slug: filters.categorySlug } }),
        ...(filters?.featured && { isFeatured: true }),
      },
      include: productInclude,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: filters?.limit,
    });
    return products.map(mapProduct);
  },

  async listAdmin(filters?: { status?: string; approvalStatus?: string; search?: string }) {
    return prisma.commerceProduct.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.approvalStatus && { approvalStatus: filters.approvalStatus }),
        ...(filters?.search && {
          OR: [
            { name: { contains: filters.search } },
            { slug: { contains: filters.search } },
            { sku: { contains: filters.search } },
          ],
        }),
      },
      include: productInclude,
      orderBy: { updatedAt: "desc" },
    });
  },

  async getBySlug(slug: string, publicOnly = true) {
    const product = await prisma.commerceProduct.findUnique({
      where: { slug },
      include: productInclude,
    });
    if (!product) return null;
    if (publicOnly && (product.status !== "PUBLISHED" || product.approvalStatus !== "APPROVED")) {
      return null;
    }
    return mapProduct(product);
  },

  async getById(id: string) {
    const product = await prisma.commerceProduct.findUnique({
      where: { id },
      include: productInclude,
    });
    return product ? mapProduct(product) : null;
  },

  async getRelated(productId: string, categorySlug: string, tags: string[], limit = 4) {
    const products = await prisma.commerceProduct.findMany({
      where: {
        id: { not: productId },
        status: "PUBLISHED",
        approvalStatus: "APPROVED",
        OR: [
          { category: { slug: categorySlug } },
          ...(tags[0] ? [{ tags: { contains: tags[0] } }] : []),
        ],
      },
      include: productInclude,
      take: limit,
    });
    return products.map(mapProduct);
  },

  async create(data: ProductCreateInput) {
    const { images, materials, tags, colors, specifications, purchaseDate, ...rest } = data;
    const product = await prisma.commerceProduct.create({
      data: {
        ...rest,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        materials: toJsonArray(materials),
        tags: toJsonArray(tags),
        colors: toJsonArray(colors),
        specifications: specifications ? JSON.stringify(specifications) : undefined,
        approvalStatus: rest.approvalStatus || "PENDING",
        status: rest.status || "DRAFT",
        publishedAt: rest.status === "PUBLISHED" ? new Date() : undefined,
        media: images?.length
          ? {
              create: images.map((url, i) => ({
                type: "IMAGE",
                url,
                sortOrder: i,
              })),
            }
          : undefined,
      },
      include: productInclude,
    });
    return mapProduct(product);
  },

  async getAdminById(id: string) {
    return prisma.commerceProduct.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        seller: true,
        supplier: true,
        media: { orderBy: { sortOrder: "asc" } },
      },
    });
  },

  async update(id: string, data: ProductUpdateInput) {
    const { images, videos, materials, tags, colors, specifications, purchaseDate, ...rest } = data;

    if (images || videos) {
      await prisma.commerceProductMedia.deleteMany({ where: { productId: id } });
      const mediaRows = [
        ...(images?.map((url, i) => ({ productId: id, type: "IMAGE" as const, url, sortOrder: i })) || []),
        ...(videos?.map((url, i) => ({
          productId: id,
          type: "VIDEO" as const,
          url,
          sortOrder: (images?.length || 0) + i,
        })) || []),
      ];
      if (mediaRows.length) {
        await prisma.commerceProductMedia.createMany({ data: mediaRows });
      }
    }

    const product = await prisma.commerceProduct.update({
      where: { id },
      data: {
        ...rest,
        ...(materials !== undefined && { materials: toJsonArray(materials) }),
        ...(tags !== undefined && { tags: toJsonArray(tags) }),
        ...(colors !== undefined && { colors: toJsonArray(colors) }),
        ...(specifications !== undefined && {
          specifications: JSON.stringify(specifications),
        }),
        ...(purchaseDate !== undefined && {
          purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        }),
        ...(rest.status === "PUBLISHED" && { publishedAt: new Date() }),
      },
      include: productInclude,
    });
    return mapProduct(product);
  },

  async delete(id: string) {
    await prisma.commerceProduct.delete({ where: { id } });
  },

  async approve(id: string) {
    return this.update(id, { approvalStatus: "APPROVED", status: "PUBLISHED" });
  },

  async reject(id: string) {
    return this.update(id, { approvalStatus: "REJECTED", status: "HIDDEN" });
  },

  async duplicate(id: string) {
    const original = await prisma.commerceProduct.findUnique({
      where: { id },
      include: { media: true },
    });
    if (!original) throw new Error("Product not found");

    const slug = `${original.slug}-copy-${Date.now()}`;
    const copy = await prisma.commerceProduct.create({
      data: {
        sellerId: original.sellerId,
        brandId: original.brandId,
        categoryId: original.categoryId,
        name: `${original.name} (Copy)`,
        slug,
        description: original.description,
        shortDescription: original.shortDescription,
        price: original.price,
        compareAtPrice: original.compareAtPrice,
        stock: original.stock,
        materials: original.materials,
        tags: original.tags,
        colors: original.colors,
        mood: original.mood,
        status: "DRAFT",
        approvalStatus: "PENDING",
        media: {
          create: original.media.map((m) => ({
            type: m.type,
            url: m.url,
            altText: m.altText,
            sortOrder: m.sortOrder,
          })),
        },
      },
      include: productInclude,
    });
    return mapProduct(copy);
  },
};
