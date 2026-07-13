import { NextRequest, NextResponse } from "next/server";
import { commercePaymentService } from "@/lib/commerce/services/commerce-payment.service";
import { isRazorpayConfigured } from "@/lib/payments/config";

export async function GET() {
  return NextResponse.json({
    razorpay: isRazorpayConfigured(),
    cod: true,
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
