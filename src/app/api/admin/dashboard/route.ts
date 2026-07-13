import { NextResponse } from "next/server";
import { dashboardService } from "@/lib/commerce/services/dashboard.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const stats = await withAdminAuth("dashboard:read", async () => {
      return dashboardService.getStats();
    });
    return NextResponse.json(stats);
  } catch (error) {
    return commerceApiError(error);
  }
}
