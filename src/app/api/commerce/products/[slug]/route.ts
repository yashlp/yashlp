import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/commerce/services/product.service";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { commerceApiError } from "@/lib/commerce/api-utils";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const product = await productService.getBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const related = await productService.getRelated(
      product.id,
      product.category,
      product.tags
    );

    const brand = await catalogService.getBrandById(product.brandId);

    return NextResponse.json({ product, brand, related });
  } catch (error) {
    return commerceApiError(error);
  }
}
