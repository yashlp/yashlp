import { NextResponse } from "next/server";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const brands = await catalogService.getBrands();
    return NextResponse.json({ brands });
  } catch (error) {
    return commerceApiError(error);
  }
}
