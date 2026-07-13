import { NextRequest, NextResponse } from "next/server";
import { purchaseService } from "@/lib/commerce/services/purchase.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const purchaseOrder = await withAdminAuth("purchases:read", () => purchaseService.getById(id));
    if (!purchaseOrder) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ purchaseOrder });
  } catch (error) {
    return commerceApiError(error);
  }
}

const receiveSchema = z.object({
  lineId: z.string(),
  quantityReceived: z.number().int().min(0),
  quantityDamaged: z.number().int().min(0).optional(),
});

const paymentSchema = z.object({
  paymentStatus: z.enum(["PENDING", "PARTIAL", "PAID"]),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.lineId) {
      const data = receiveSchema.parse(body);
      const purchaseOrder = await withAdminAuth("purchases:write", () =>
        purchaseService.receiveLine(data.lineId, data.quantityReceived, data.quantityDamaged ?? 0)
      );
      return NextResponse.json({ purchaseOrder });
    }

    if (body.paymentStatus) {
      const data = paymentSchema.parse(body);
      const purchaseOrder = await withAdminAuth("purchases:write", () =>
        purchaseService.updatePaymentStatus(id, data.paymentStatus)
      );
      return NextResponse.json({ purchaseOrder });
    }

    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  } catch (error) {
    return commerceApiError(error);
  }
}
