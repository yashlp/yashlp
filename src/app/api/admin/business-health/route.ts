import { NextResponse } from "next/server";
import { businessHealthService } from "@/lib/commerce/services/business-health.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const snapshot = await withAdminAuth("analytics:read", () => businessHealthService.getSnapshot());
    return NextResponse.json({ snapshot });
  } catch (error) {
    return commerceApiError(error);
  }
}
