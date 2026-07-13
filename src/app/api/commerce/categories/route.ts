import { NextResponse } from "next/server";
import { categoryService } from "@/lib/commerce/services/category.service";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const categories = await categoryService.listPublic();
    return NextResponse.json({ categories });
  } catch (error) {
    return commerceApiError(error);
  }
}
