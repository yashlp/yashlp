import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/commerce/services/product.service";
import { searchProducts } from "@/lib/commerce/product-search";
import { commerceApiError } from "@/lib/commerce/api-utils";
import type { Product } from "@/lib/aesthetics/types";

function num(v: string | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function applyFacetFilters(products: Product[], params: URLSearchParams): Product[] {
  let next = products;
  const room = params.get("room");
  const style = params.get("style");
  const mood = params.get("mood");
  const color = params.get("color");
  const material = params.get("material");
  const brand = params.get("brand");
  const minPrice = num(params.get("minPrice"));
  const maxPrice = num(params.get("maxPrice"));
  const minRating = num(params.get("minRating"));
  const inStock = params.get("availability") === "in_stock" || params.get("inStock") === "true";
  const bestseller = params.get("bestseller") === "true";

  if (room) next = next.filter((p) => p.room?.toLowerCase() === room.toLowerCase());
  if (style) next = next.filter((p) => p.style?.toLowerCase() === style.toLowerCase());
  if (mood) next = next.filter((p) => p.mood?.toLowerCase() === mood.toLowerCase() || p.tags.some((t) => t.toLowerCase().includes(mood.toLowerCase())));
  if (color) next = next.filter((p) => p.colors.some((c) => c.toLowerCase().includes(color.toLowerCase())));
  if (material) next = next.filter((p) => p.materials.some((m) => m.toLowerCase().includes(material.toLowerCase())));
  if (brand) next = next.filter((p) => p.brand?.slug === brand || p.brand?.name.toLowerCase() === brand.toLowerCase());
  if (minPrice != null) next = next.filter((p) => p.price >= minPrice);
  if (maxPrice != null) next = next.filter((p) => p.price <= maxPrice);
  if (minRating != null) next = next.filter((p) => p.rating >= minRating);
  if (inStock) next = next.filter((p) => p.inStock);
  if (bestseller) next = next.filter((p) => p.isBestseller);
  return next;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const search = searchParams.get("q") || undefined;
    const suggest = searchParams.get("suggest") === "true";

    if (search) {
      const all = await productService.listPublished({ limit: 200 });
      let filtered = searchProducts(all, search, suggest ? 8 : limit || 50);
      filtered = applyFacetFilters(filtered, searchParams);
      if (suggest) {
        return NextResponse.json({
          suggestions: filtered.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            image: p.images[0],
            brand: p.brand?.name,
          })),
        });
      }
      return NextResponse.json({ products: filtered });
    }

    const products = await productService.listPublished({
      categorySlug: category,
      featured: featured || undefined,
      trending: searchParams.get("trending") === "true" || undefined,
      bestseller: searchParams.get("bestseller") === "true" || undefined,
      recommended: searchParams.get("recommended") === "true" || undefined,
      room: searchParams.get("room") || undefined,
      style: searchParams.get("style") || undefined,
      mood: searchParams.get("mood") || undefined,
      brandSlug: searchParams.get("brand") || undefined,
      color: searchParams.get("color") || undefined,
      material: searchParams.get("material") || undefined,
      minPrice: num(searchParams.get("minPrice")),
      maxPrice: num(searchParams.get("maxPrice")),
      minRating: num(searchParams.get("minRating")),
      inStock:
        searchParams.get("availability") === "in_stock" || searchParams.get("inStock") === "true"
          ? true
          : undefined,
      limit,
    });
    return NextResponse.json({ products });
  } catch (error) {
    return commerceApiError(error);
  }
}
