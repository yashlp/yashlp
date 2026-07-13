import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/commerce/services/product.service";
import { productCreateSchema } from "@/lib/commerce/validators";
import { writeAuditLog } from "@/lib/commerce/audit";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const products = await withAdminAuth("products:read", async () => {
      return productService.listAdmin({
        status: searchParams.get("status") || undefined,
        approvalStatus: searchParams.get("approval") || undefined,
        search: searchParams.get("q") || undefined,
      });
    });
    return NextResponse.json({ products });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = productCreateSchema.parse(await req.json());
    const result = await withAdminAuth("products:write", async (admin) => {
      const product = await productService.create(body);
      await writeAuditLog(admin.id, "CREATE", "PRODUCT", product.id, { name: product.name });
      return product;
    });
    return NextResponse.json({ product: result }, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}
