import type { CommerceBrand, CommerceCategory, CommerceCollection, CommerceProduct, CommerceProductMedia, CommerceSeller } from "@prisma/client";
import type { Brand, Collection, Product, ProductCategory, ProductMood, ProductTag } from "@/lib/aesthetics/types";

type ProductWithRelations = CommerceProduct & {
  brand: CommerceBrand;
  category: CommerceCategory;
  media: CommerceProductMedia[];
  seller?: CommerceSeller;
};

export function mapProduct(p: ProductWithRelations): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brandId: p.brandId,
    brand: mapBrand(p.brand),
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    category: p.category.slug as ProductCategory,
    tags: parseJsonArray<ProductTag>(p.tags),
    mood: (p.mood as ProductMood) || "calm",
    materials: parseJsonArray<string>(p.materials),
    colors: parseJsonArray<string>(p.colors),
    dimensions: p.dimensions || undefined,
    vibe: p.shortDescription || "",
    description: p.description,
    images: p.media.filter((m) => m.type === "IMAGE").sort((a, b) => a.sortOrder - b.sortOrder).map((m) => m.url),
    video: p.media.find((m) => m.type === "VIDEO")?.url,
    inStock: p.stock > 0 && p.status !== "OUT_OF_STOCK",
    rating: p.rating,
    reviewCount: p.reviewCount,
    featured: p.isFeatured,
    newArrival: p.isNewArrival,
  };
}

export function mapBrand(b: CommerceBrand): Brand {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    tagline: b.tagline || "",
    instagram: undefined,
    logo: b.logoUrl ?? undefined,
    verified: b.verified,
  };
}

export function mapCollection(
  c: CommerceCollection & { products?: { product: ProductWithRelations; sortOrder: number }[] }
): Collection & { products?: Product[] } {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description || "",
    image: c.imageUrl || "",
    productIds: c.products?.map((cp) => cp.product.id) || [],
    featured: c.isFeatured,
    products: c.products?.sort((a, b) => a.sortOrder - b.sortOrder).map((cp) => mapProduct(cp.product)),
  };
}

export function mapCategory(c: CommerceCategory) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    imageUrl: c.imageUrl,
    parentId: c.parentId,
    sortOrder: c.sortOrder,
    isFeatured: c.isFeatured,
    isHidden: c.isHidden,
  };
}

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return raw.split(",").map((s) => s.trim()).filter(Boolean) as T[];
  }
}

export function toJsonArray(values: string[] | undefined): string | undefined {
  if (!values?.length) return undefined;
  return JSON.stringify(values);
}
