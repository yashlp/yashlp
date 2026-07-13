import { NextRequest, NextResponse } from "next/server";
import { couponService } from "@/lib/commerce/services/coupon.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(2),
  description: z.string().optional(),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.number().positive(),
  minOrderValue: z.number().optional(),
  maxUses: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    const coupons = await withAdminAuth("marketing:read", () => couponService.list());
    return NextResponse.json({ coupons });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const coupon = await withAdminAuth("marketing:write", () => couponService.create(body));
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}
