import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/commerce/services/category.service";
import { categorySchema } from "@/lib/commerce/validators";
import { writeAuditLog } from "@/lib/commerce/audit";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = categorySchema.partial().parse(await req.json());
    const category = await withAdminAuth("categories:write", async (admin) => {
      const updated = await categoryService.update(id, body);
      await writeAuditLog(admin.id, "UPDATE", "CATEGORY", id);
      return updated;
    });
    return NextResponse.json({ category });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await withAdminAuth("categories:write", async (admin) => {
      await categoryService.delete(id);
      await writeAuditLog(admin.id, "DELETE", "CATEGORY", id);
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return commerceApiError(error);
  }
}
