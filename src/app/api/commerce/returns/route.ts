import { NextRequest, NextResponse } from "next/server";
import { returnService } from "@/lib/commerce/services/return.service";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(),
  reason: z.string().min(1),
  type: z.enum(["REFUND", "REPLACEMENT"]).optional(),
  condition: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const customer = await getCommerceCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/db");
    const order = await prisma.commerceOrder.findUnique({ where: { id: body.orderId } });
    if (!order || order.customerId !== customer.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const ret = await returnService.createRequest(body);
    return NextResponse.json({ return: ret }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Return request failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
