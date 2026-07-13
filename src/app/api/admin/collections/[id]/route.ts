import { NextRequest, NextResponse } from "next/server";
import { collectionAdminService } from "@/lib/commerce/services/collection-admin.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  productIds: z.array(z.string()).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = schema.parse(await req.json());
    const collection = await withAdminAuth("content:write", () => collectionAdminService.update(id, body));
    return NextResponse.json({ collection });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await withAdminAuth("content:write", () => collectionAdminService.delete(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return commerceApiError(error);
  }
}
