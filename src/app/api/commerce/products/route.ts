import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/commerce/services/product.service";
import { searchProducts } from "@/lib/commerce/product-search";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const search = searchParams.get("q") || undefined;

    if (search) {
      const all = await productService.listPublished({ limit: 200 });
      const filtered = searchProducts(all, search, limit || 50);
      return NextResponse.json({ products: filtered });
    }

    const products = await productService.listPublished({
      categorySlug: category,
      featured: featured || undefined,
      limit,
    });
    return NextResponse.json({ products });
  } catch (error) {
    return commerceApiError(error);
  }
}
