import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/commerce/services/product.service";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const search = searchParams.get("q") || undefined;

    if (search) {
      const all = await productService.listPublished({ limit: 100 });
      const q = search.toLowerCase();
      const filtered = all.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
      return NextResponse.json({ products: filtered.slice(0, limit || 50) });
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
