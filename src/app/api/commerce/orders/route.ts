import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/commerce/services/order.service";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";
import { checkoutSchema } from "@/lib/commerce/validators/customer";
import {
  computeShippingFee,
  computeTax,
  getShippingConfig,
} from "@/lib/commerce/shipping-config";
import { prisma } from "@/lib/db";

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
    if (body.paymentMethod === "cod") {
      const codSetting = await prisma.commerceSetting.findUnique({ where: { key: "cod_enabled" } });
      const codEnabled = codSetting ? codSetting.value.toLowerCase() === "true" : true;
      if (!codEnabled) {
        return NextResponse.json({ error: "Cash on Delivery is currently unavailable." }, { status: 400 });
      }
    }

    if (body.country.toUpperCase() !== "IN") {
      return NextResponse.json(
        { error: "Only Aesthetic currently ships within India." },
        { status: 400 }
      );
    }

    const customer = await getCommerceCustomer();
    const shippingConfig = await getShippingConfig();

    // Prices come from the catalog — never from the client payload.
    const pricedItems = await orderService.priceItems(
      body.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
    );
    const subtotal = pricedItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shipping = computeShippingFee(subtotal, shippingConfig);
    const tax = computeTax(subtotal, shippingConfig);
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
      items: pricedItems,
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
        line1: body.line1,
        line2: body.line2,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
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
