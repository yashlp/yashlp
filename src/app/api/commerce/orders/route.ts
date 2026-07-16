import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/commerce/services/order.service";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";
import { checkoutSchema } from "@/lib/commerce/validators/customer";

const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 49;

function isDemoPaymentAllowed() {
  return process.env.ALLOW_DEMO_PAYMENT === "true" && process.env.NODE_ENV !== "production";
}

export async function POST(req: NextRequest) {
  try {
    const body = checkoutSchema.parse(await req.json());

    if (body.paymentMethod === "demo" && !isDemoPaymentAllowed()) {
      return NextResponse.json(
        { error: "Online payment is required. Please complete payment via Razorpay." },
        { status: 400 }
      );
    }

    if (body.country.toUpperCase() !== "IN") {
      return NextResponse.json(
        { error: "Only Aesthetics currently ships within India." },
        { status: 400 }
      );
    }

    const customer = await getCommerceCustomer();

    const subtotal = body.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = Math.round(subtotal * GST_RATE * 100) / 100;
    const total = subtotal + shipping + tax;

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
