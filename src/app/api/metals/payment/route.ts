import { NextResponse } from "next/server";
import { z } from "zod";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { getRazorpayKeyId, isRazorpayConfigured } from "@/lib/payments/config";

function isDemoPaymentAllowed() {
  return process.env.ALLOW_DEMO_PAYMENT === "true" || process.env.NODE_ENV !== "production";
}

export async function GET() {
  return NextResponse.json({
    razorpay: isRazorpayConfigured(),
    demo: isDemoPaymentAllowed(),
    keyId: isRazorpayConfigured() ? getRazorpayKeyId() : null,
  });
}

const createSchema = z.object({
  amountInr: z.number().positive(),
  order: z.object({
    grade: z.string(),
    shape: z.string(),
    sizeMm: z.string().optional(),
    lengthMm: z.string().optional(),
    quantityPieces: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const body = createSchema.parse(await req.json());

    if (!isRazorpayConfigured()) {
      if (!isDemoPaymentAllowed()) {
        return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
      }
      return NextResponse.json({
        demo: true,
        amount: body.amountInr * 100,
        message: "Demo payment — order recorded",
      });
    }

    const receipt = `jm_${Date.now()}`;
    const rzOrder = await createRazorpayOrder({
      amountMinor: Math.round(body.amountInr * 100),
      currency: "INR",
      receipt,
      notes: {
        grade: body.order.grade,
        shape: body.order.shape,
        size: body.order.sizeMm ?? "",
        length: body.order.lengthMm ?? "",
        qty: body.order.quantityPieces ?? "",
        name: body.order.name ?? "",
        phone: body.order.phone ?? "",
        email: body.order.email ?? "",
      },
    });

    return NextResponse.json({
      demo: false,
      keyId: getRazorpayKeyId(),
      razorpayOrderId: rzOrder.id,
      amount: rzOrder.amount,
      currency: rzOrder.currency,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

const verifySchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function PUT(req: Request) {
  try {
    const data = verifySchema.parse(await req.json());
    const ok = verifyRazorpaySignature({
      orderId: data.razorpayOrderId,
      paymentId: data.razorpayPaymentId,
      signature: data.razorpaySignature,
    });
    if (!ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
