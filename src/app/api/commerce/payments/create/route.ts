import { NextRequest, NextResponse } from "next/server";
import { commercePaymentService } from "@/lib/commerce/services/commerce-payment.service";
import { isRazorpayConfigured } from "@/lib/payments/config";

function isDemoPaymentAllowed() {
  return process.env.ALLOW_DEMO_PAYMENT === "true" && process.env.NODE_ENV !== "production";
}

export async function GET() {
  return NextResponse.json({
    razorpay: isRazorpayConfigured(),
    demo: isDemoPaymentAllowed(),
    cod: false,
    currency: "INR",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });
    const checkout = await commercePaymentService.createRazorpayCheckout(orderId);
    return NextResponse.json(checkout);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment init failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
