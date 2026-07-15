import { NextRequest, NextResponse } from "next/server";
import { commercePaymentService } from "@/lib/commerce/services/commerce-payment.service";
import { isRazorpayConfigured } from "@/lib/payments/config";
import { isDemoPaymentAllowed } from "@/lib/commerce/checkout-pricing";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET() {
  return NextResponse.json({
    razorpay: isRazorpayConfigured(),
    /** COD permanently disabled — online only. */
    cod: false,
    onlineOnly: true,
    demoPayments: isDemoPaymentAllowed(),
    currency: "INR",
  });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`pay_create:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }
    const checkout = await commercePaymentService.createRazorpayCheckout(orderId);
    return NextResponse.json(checkout);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment init failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
