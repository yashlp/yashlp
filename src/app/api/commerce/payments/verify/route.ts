import { NextRequest, NextResponse } from "next/server";
import { commercePaymentService } from "@/lib/commerce/services/commerce-payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await commercePaymentService.verifyRazorpayPayment({
      orderId: body.orderId,
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
    });
    if (!result.emailSent && result.emailError) {
      console.error("[payments/verify] confirmation email failed", result.emailError);
    }
    return NextResponse.json({
      order: result.order,
      success: true,
      emailSent: result.emailSent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
