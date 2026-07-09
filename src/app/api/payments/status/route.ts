import { NextResponse } from "next/server";
import { isPaymentsConfigured, isRazorpayConfigured, isStripeConfigured } from "@/lib/payments/config";

export async function GET() {
  return NextResponse.json({
    paymentsConfigured: isPaymentsConfigured(),
    razorpay: isRazorpayConfigured(),
    stripe: isStripeConfigured(),
  });
}
