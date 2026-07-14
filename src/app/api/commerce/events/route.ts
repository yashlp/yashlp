import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";

const schema = z.object({
  type: z.enum(["PAGE_VIEW", "PRODUCT_VIEW", "ADD_TO_CART", "BEGIN_CHECKOUT", "PURCHASE", "WISHLIST"]),
  productId: z.string().optional(),
  path: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

/** Lightweight storefront analytics beacon (no auth required). */
export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const customer = await getCommerceCustomer();
    await prisma.commerceAnalyticsEvent.create({
      data: {
        type: body.type,
        productId: body.productId,
        path: body.path,
        sessionId: body.sessionId,
        customerId: customer?.id,
        metadata: body.metadata ? JSON.stringify(body.metadata) : undefined,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
