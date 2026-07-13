import { NextRequest, NextResponse } from "next/server";
import { contentService } from "@/lib/commerce/services/content.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";

const schema = z.object({
  key: z.string().min(1),
  type: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET() {
  try {
    const pages = await withAdminAuth("content:read", () => contentService.list());
    return NextResponse.json({ pages });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const page = await withAdminAuth("content:write", (admin) =>
      contentService.upsert({ ...body, updatedBy: admin.id })
    );
    return NextResponse.json({ page });
  } catch (error) {
    return commerceApiError(error);
  }
}
