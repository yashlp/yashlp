import { NextRequest, NextResponse } from "next/server";
import { returnService } from "@/lib/commerce/services/return.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";

const approveSchema = z.object({
  action: z.enum(["approve", "reject", "refund"]),
  id: z.string(),
  refundAmount: z.number().optional(),
  adminNotes: z.string().optional(),
  refundId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const status = new URL(req.url).searchParams.get("status") || undefined;
    const returns = await withAdminAuth("refunds:read", () => returnService.list({ status }));
    return NextResponse.json({ returns });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = approveSchema.parse(await req.json());
    if (body.action === "approve") {
      await withAdminAuth("refunds:write", () =>
        returnService.approve(body.id, body.refundAmount || 0, body.adminNotes)
      );
    } else if (body.action === "reject") {
      await withAdminAuth("refunds:write", () => returnService.reject(body.id, body.adminNotes));
    } else if (body.action === "refund" && body.refundId) {
      await withAdminAuth("refunds:write", () => returnService.processRefund(body.refundId!));
    }
    const returns = await returnService.list();
    return NextResponse.json({ returns });
  } catch (error) {
    return commerceApiError(error);
  }
}
