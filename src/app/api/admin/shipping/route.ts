import { NextRequest, NextResponse } from "next/server";
import { shippingService } from "@/lib/commerce/services/shipping.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";

export async function GET() {
  try {
    const [pending, shipped] = await withAdminAuth("shipping:read", async () =>
      Promise.all([shippingService.listPending(), shippingService.listShipped()])
    );
    return NextResponse.json({ pending, shipped });
  } catch (error) {
    return commerceApiError(error);
  }
}

const assignSchema = z.object({
  orderId: z.string(),
  courier: z.string(),
  trackingNumber: z.string().optional(),
  generateLabel: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = assignSchema.parse(await req.json());
    const result = await withAdminAuth("shipping:write", async () => {
      if (body.generateLabel) {
        return shippingService.generateLabel(body.orderId, body.courier);
      }
      return shippingService.assignShipping(body.orderId, {
        courier: body.courier,
        trackingNumber: body.trackingNumber || "",
        markShipped: Boolean(body.trackingNumber),
      });
    });
    return NextResponse.json({ result });
  } catch (error) {
    return commerceApiError(error);
  }
}
