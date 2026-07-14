import { NextRequest, NextResponse } from "next/server";
import { reviewService } from "@/lib/commerce/services/review.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const status = new URL(req.url).searchParams.get("status") || undefined;
    const reviews = await withAdminAuth("reviews:read", () => reviewService.list({ status }));
    return NextResponse.json({ reviews });
  } catch (error) {
    return commerceApiError(error);
  }
}

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "APPROVED", "HIDDEN"]).optional(),
  adminReply: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = updateSchema.parse(await req.json());
    const { id, ...data } = body;
    const review = await withAdminAuth("reviews:write", () => reviewService.update(id, data));
    return NextResponse.json({ review });
  } catch (error) {
    return commerceApiError(error);
  }
}

const deleteSchema = z.object({ id: z.string() });

export async function DELETE(req: NextRequest) {
  try {
    const body = deleteSchema.parse(await req.json());
    await withAdminAuth("reviews:write", () => reviewService.delete(body.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return commerceApiError(error);
  }
}
