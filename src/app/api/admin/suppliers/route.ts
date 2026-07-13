import { NextRequest, NextResponse } from "next/server";
import { supplierService } from "@/lib/commerce/services/supplier.service";
import { supplierSchema } from "@/lib/commerce/validators/supplier";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const suppliers = await withAdminAuth("suppliers:read", () => supplierService.list());
    return NextResponse.json({ suppliers });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = supplierSchema.parse(await req.json());
    const supplier = await withAdminAuth("suppliers:write", () => supplierService.create(body));
    return NextResponse.json({ supplier }, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}
