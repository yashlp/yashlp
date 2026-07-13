import { NextRequest, NextResponse } from "next/server";
import { inventoryService } from "@/lib/commerce/services/inventory.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lowStock = searchParams.get("lowStock") === "true";
    const search = searchParams.get("search") || undefined;

    const [items, summary] = await withAdminAuth("inventory:read", async () =>
      Promise.all([
        inventoryService.list({ lowStock, search }),
        inventoryService.getSummary(),
      ])
    );

    return NextResponse.json({ items, summary });
  } catch (error) {
    return commerceApiError(error);
  }
}
