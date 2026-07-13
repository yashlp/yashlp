import { NextResponse } from "next/server";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const data = await catalogService.getHomepageData();
    return NextResponse.json(data);
  } catch (error) {
    return commerceApiError(error);
  }
}
