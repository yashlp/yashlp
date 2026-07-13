import { NextRequest, NextResponse } from "next/server";
import { collectionAdminService } from "@/lib/commerce/services/collection-admin.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  productIds: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const collections = await withAdminAuth("content:read", () => collectionAdminService.list());
    return NextResponse.json({ collections });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const collection = await withAdminAuth("content:write", () => collectionAdminService.create(body));
    return NextResponse.json({ collection }, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}
