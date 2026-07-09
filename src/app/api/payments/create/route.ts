import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { resolveReportProductId } from "@/lib/report-demo-data";
import { getLocalizedReportPrice, resolvePricingMarket } from "@/lib/report-pricing";
import { createPendingPurchase } from "@/lib/payments/access";
import {
  getRazorpayKeyId,
  getStripePublishableKey,
  isPaymentsConfigured,
  resolvePaymentProvider,
} from "@/lib/payments/config";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";

const schema = z.object({
  productId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  placeName: z.string().optional(),
  countryCode: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to purchase a report" }, { status: 401 });
  }

  if (!isPaymentsConfigured()) {
    return NextResponse.json(
      {
        error:
          "Payments are not configured on this server. Add Razorpay or Stripe keys in Vercel environment variables.",
      },
      { status: 503 }
    );
  }

  try {
    const data = schema.parse(await req.json());
    const resolvedId = resolveReportProductId(data.productId);
    if (!resolvedId) {
      return NextResponse.json({ error: "Invalid report product" }, { status: 400 });
    }

    const market = resolvePricingMarket({
      areaLat: data.latitude,
      areaLng: data.longitude,
      countryCode: data.countryCode,
    });
    const price = getLocalizedReportPrice(resolvedId, market);
    const provider = resolvePaymentProvider(market);

    const amountMinor =
      price.currency === "INR" ? Math.round(price.amount * 100) : Math.round(price.amount * 100);

    if (provider === "razorpay") {
      const receipt = `rpt_${user.id.slice(0, 8)}_${Date.now()}`.slice(0, 40);
      const order = await createRazorpayOrder({
        amountMinor,
        currency: price.currency,
        receipt,
        notes: {
          userId: user.id,
          productId: resolvedId,
          lat: String(data.latitude),
          lng: String(data.longitude),
          placeName: data.placeName ?? "",
        },
      });

      await createPendingPurchase({
        userId: user.id,
        productId: resolvedId,
        lat: data.latitude,
        lng: data.longitude,
        placeName: data.placeName,
        amount: amountMinor,
        currency: price.currency,
        provider: "razorpay",
        providerOrderId: order.id,
      });

      return NextResponse.json({
        provider: "razorpay",
        keyId: getRazorpayKeyId(),
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        productName: resolvedId,
        formattedAmount: price.formatted,
      });
    }

    const checkoutPath = `/reports/checkout/${resolvedId}`;
    const query = new URLSearchParams({
      lat: String(data.latitude),
      lng: String(data.longitude),
      place: data.placeName ?? "",
    });
    if (data.countryCode) query.set("country", data.countryCode);

    const session = await createStripeCheckoutSession({
      amountMinor,
      currency: "usd",
      productName: `CivicLens Report — ${resolvedId}`,
      userId: user.id,
      productId: resolvedId,
      lat: data.latitude,
      lng: data.longitude,
      placeName: data.placeName,
      successPath: `/reports/view/${resolvedId}?${query.toString()}`,
      cancelPath: `${checkoutPath}?${query.toString()}`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start Stripe checkout" }, { status: 500 });
    }

    await createPendingPurchase({
      userId: user.id,
      productId: resolvedId,
      lat: data.latitude,
      lng: data.longitude,
      placeName: data.placeName,
      amount: amountMinor,
      currency: "USD",
      provider: "stripe",
      providerOrderId: session.id,
    });

    return NextResponse.json({
      provider: "stripe",
      publishableKey: getStripePublishableKey(),
      sessionId: session.id,
      checkoutUrl: session.url,
      formattedAmount: price.formatted,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Payment setup failed" }, { status: 500 });
  }
}
