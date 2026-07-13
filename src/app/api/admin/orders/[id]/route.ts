import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/commerce/services/order.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/commerce/constants";

const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  courier: z.string().optional(),
  trackingNumber: z.string().optional(),
  internalNotes: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await withAdminAuth("orders:read", () => orderService.getById(id));
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = statusSchema.parse(await req.json());
    const order = await withAdminAuth("orders:write", () =>
      orderService.updateStatus(id, body.status, {
        courier: body.courier,
        trackingNumber: body.trackingNumber,
        internalNotes: body.internalNotes,
      })
    );
    return NextResponse.json({ order });
  } catch (error) {
    return commerceApiError(error);
  }
}
