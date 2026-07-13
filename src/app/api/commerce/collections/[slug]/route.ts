import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { commerceApiError } from "@/lib/commerce/api-utils";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const collection = await catalogService.getCollectionBySlug(slug);
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    return NextResponse.json({ collection });
  } catch (error) {
    return commerceApiError(error);
  }
}
