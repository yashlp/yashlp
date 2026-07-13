import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/commerce/services/category.service";
import { categorySchema } from "@/lib/commerce/validators";
import { writeAuditLog } from "@/lib/commerce/audit";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const categories = await withAdminAuth("categories:read", async () => {
      return categoryService.listAdmin();
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = categorySchema.parse(await req.json());
    const category = await withAdminAuth("categories:write", async (admin) => {
      const created = await categoryService.create(body);
      await writeAuditLog(admin.id, "CREATE", "CATEGORY", created.id, { name: created.name });
      return created;
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}
