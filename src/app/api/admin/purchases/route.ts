import { NextRequest, NextResponse } from "next/server";
import { purchaseService } from "@/lib/commerce/services/purchase.service";
import { purchaseOrderSchema } from "@/lib/commerce/validators/supplier";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const purchaseOrders = await withAdminAuth("purchases:read", () => purchaseService.list());
    return NextResponse.json({ purchaseOrders });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = purchaseOrderSchema.parse(await req.json());
    const purchaseOrder = await withAdminAuth("purchases:write", () => purchaseService.create(body));
    return NextResponse.json({ purchaseOrder }, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}
