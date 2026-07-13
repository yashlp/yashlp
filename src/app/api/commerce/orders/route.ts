import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/commerce/services/order.service";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";
import { checkoutSchema } from "@/lib/commerce/validators/customer";

export async function POST(req: NextRequest) {
  try {
    const body = checkoutSchema.parse(await req.json());
    const customer = await getCommerceCustomer();

    const subtotal = body.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shipping = subtotal >= 75 ? 0 : 8;
    const total = subtotal + shipping;

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
      shipping,
      total,
      guest: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        shippingAddress,
      },
      customerId: customer?.id,
    });

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
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
