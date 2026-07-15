import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/commerce/services/order.service";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";
import { checkoutSchema } from "@/lib/commerce/validators/customer";
import { isDemoPaymentAllowed } from "@/lib/commerce/checkout-pricing";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`checkout:${ip}`, 20, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const body = checkoutSchema.parse(await req.json());
    const customer = await getCommerceCustomer();

    if (body.paymentMethod === "demo" && !isDemoPaymentAllowed()) {
      return NextResponse.json(
        { error: "Demo payments are disabled. Use Razorpay online payment." },
        { status: 400 }
      );
    }

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
      items: body.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      paymentMethod: body.paymentMethod,
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
        status: order.status,
        paymentMethod: body.paymentMethod,
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
