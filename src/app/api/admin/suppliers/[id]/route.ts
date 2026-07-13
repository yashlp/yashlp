import { NextRequest, NextResponse } from "next/server";
import { supplierService } from "@/lib/commerce/services/supplier.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supplier = await withAdminAuth("suppliers:read", () => supplierService.getById(id));
    if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ supplier });
  } catch (error) {
    return commerceApiError(error);
  }
}
