import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/commerce/services/order.service";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";
import { checkoutSchema } from "@/lib/commerce/validators/customer";
import { GIFT_WRAP_FEE } from "@/lib/aesthetics/gift-wrap";
import { prisma } from "@/lib/db";

const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 49;

export async function POST(req: NextRequest) {
  try {
    const body = checkoutSchema.parse(await req.json());
    const customer = await getCommerceCustomer();

    const subtotal = body.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const giftWrap = Boolean(body.giftWrap);
    const giftWrapFee = giftWrap ? GIFT_WRAP_FEE : 0;
    const tax = Math.round(subtotal * GST_RATE * 100) / 100;
    const total = subtotal + shipping + tax + giftWrapFee;

    const shippingAddress = [
      body.name,
      body.line1,
      body.line2,
      `${body.city}${body.state ? `, ${body.state}` : ""} ${body.postalCode}`,
      body.country,
      `Phone: ${body.phone}`,
      `Email: ${body.email}`,
    ]
      .filter(Boolean)
      .join("\n");

    const order = await orderService.createGuestOrder({
      items: body.items,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod: body.paymentMethod,
      giftWrap,
      giftWrapFee,
      giftMessage: body.giftMessage,
      customerNotes: body.customerNotes,
      guest: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        shippingAddress,
      },
      customerId: customer?.id,
    });

    try {
      await prisma.commerceAnalyticsEvent.create({
        data: {
          type: "PURCHASE",
          customerId: customer?.id,
          metadata: JSON.stringify({ orderId: order.id, total }),
        },
      });
    } catch {
      /* analytics table may not be migrated yet */
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        paymentMethod: body.paymentMethod,
        giftWrap: order.giftWrap,
        guest: { name: body.name, email: body.email, phone: body.phone },
        address: {
          line1: body.line1,
          line2: body.line2,
          city: body.city,
          state: body.state,
          postalCode: body.postalCode,
          country: body.country,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
