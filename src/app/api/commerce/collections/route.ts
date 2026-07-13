import { NextResponse } from "next/server";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const collections = await catalogService.getCollections();
    return NextResponse.json({ collections });
  } catch (error) {
    return commerceApiError(error);
  }
}
