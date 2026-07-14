import { NextResponse } from "next/server";
import { dashboardService } from "@/lib/commerce/services/dashboard.service";
import { actionCenterService } from "@/lib/commerce/services/action-center.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const data = await withAdminAuth("dashboard:read", async () => {
      const [stats, actionCenter] = await Promise.all([
        dashboardService.getStats(),
        actionCenterService.getAlerts(),
      ]);
      return { ...stats, actionCenter };
    });
    return NextResponse.json(data);
  } catch (error) {
    return commerceApiError(error);
  }
}
