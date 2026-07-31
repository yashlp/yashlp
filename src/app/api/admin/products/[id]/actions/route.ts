import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/commerce/services/product.service";
import { writeAuditLog } from "@/lib/commerce/audit";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { revalidateStorefrontCatalog } from "@/lib/commerce/revalidate-storefront";

type Props = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { action } = await req.json();

    const product = await withAdminAuth("products:approve", async (admin) => {
      let result;
      if (action === "approve") result = await productService.approve(id);
      else if (action === "reject") result = await productService.reject(id);
      else if (action === "duplicate") result = await productService.duplicate(id);
      else throw new Error("Invalid action");

      await writeAuditLog(admin.id, action.toUpperCase(), "PRODUCT", id);
      return result;
    });

    revalidateStorefrontCatalog();
    return NextResponse.json({ product });
  } catch (error) {
    return commerceApiError(error);
  }
}
