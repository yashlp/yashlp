import { NextResponse } from "next/server";
import { analyticsService } from "@/lib/commerce/services/analytics.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const stats = await withAdminAuth("analytics:read", () => analyticsService.getStats());
    return NextResponse.json({ stats });
  } catch (error) {
    return commerceApiError(error);
  }
}
