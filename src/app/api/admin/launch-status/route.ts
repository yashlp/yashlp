import { NextResponse } from "next/server";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import {
  getCommerceLaunchStatus,
  isCommerceLaunchReady,
} from "@/lib/commerce/commerce-launch-status";
import { getSiteUrl } from "@/lib/payments/config";

export async function GET() {
  try {
    const payload = await withAdminAuth("settings:read", async () => {
      const checks = getCommerceLaunchStatus();
      return {
        checks,
        ready: isCommerceLaunchReady(),
        siteUrl: getSiteUrl(),
        youMustDo: checks.filter((c) => c.youMustDo).map((c) => ({ id: c.id, label: c.label, detail: c.detail })),
      };
    });
    return NextResponse.json(payload);
  } catch (error) {
    return commerceApiError(error);
  }
}
