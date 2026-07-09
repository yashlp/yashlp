import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { markReportPurchasePaid } from "@/lib/payments/access";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { getPaidStripeSession } from "@/lib/payments/stripe";

const razorpaySchema = z.object({
  provider: z.literal("razorpay"),
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
  productId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  placeName: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
});

const stripeSchema = z.object({
  provider: z.literal("stripe"),
  sessionId: z.string(),
});

const schema = z.discriminatedUnion("provider", [razorpaySchema, stripeSchema]);

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const data = schema.parse(await req.json());

    if (data.provider === "razorpay") {
      const valid = verifyRazorpaySignature({
        orderId: data.orderId,
        paymentId: data.paymentId,
        signature: data.signature,
      });
      if (!valid) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }

      await markReportPurchasePaid({
        userId: user.id,
        productId: data.productId,
        lat: data.latitude,
        lng: data.longitude,
        placeName: data.placeName,
        amount: data.amount,
        currency: data.currency,
        provider: "razorpay",
        providerOrderId: data.orderId,
        providerPaymentId: data.paymentId,
      });

      return NextResponse.json({ ok: true, paid: true });
    }

    const session = await getPaidStripeSession(data.sessionId);
    if (!session || session.metadata?.userId !== user.id) {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const productId = session.metadata.productId;
    const lat = parseFloat(session.metadata.lat);
    const lng = parseFloat(session.metadata.lng);
    const paymentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? session.id;

    await markReportPurchasePaid({
      userId: user.id,
      productId,
      lat,
      lng,
      placeName: session.metadata.placeName || null,
      amount: session.amount_total ?? 0,
      currency: (session.currency ?? "usd").toUpperCase(),
      provider: "stripe",
      providerOrderId: session.id,
      providerPaymentId: paymentId,
    });

    return NextResponse.json({ ok: true, paid: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
