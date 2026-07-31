import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/commerce/services/product.service";
import { productUpdateSchema } from "@/lib/commerce/validators";
import { writeAuditLog } from "@/lib/commerce/audit";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { revalidateStorefrontCatalog } from "@/lib/commerce/revalidate-storefront";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const product = await withAdminAuth("products:read", async () => {
      return productService.getAdminById(id);
    });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = productUpdateSchema.parse(await req.json());
    const product = await withAdminAuth("products:write", async (admin) => {
      const updated = await productService.update(id, body);
      await writeAuditLog(admin.id, "UPDATE", "PRODUCT", id, body as Record<string, unknown>);
      return updated;
    });
    revalidateStorefrontCatalog();
    return NextResponse.json({ product });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await withAdminAuth("products:write", async (admin) => {
      await productService.delete(id);
      await writeAuditLog(admin.id, "DELETE", "PRODUCT", id);
    });
    revalidateStorefrontCatalog();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return commerceApiError(error);
  }
}
