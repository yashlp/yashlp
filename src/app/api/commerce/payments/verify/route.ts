import { NextRequest, NextResponse } from "next/server";
import { commercePaymentService } from "@/lib/commerce/services/commerce-payment.service";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`pay_verify:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    if (
      !body?.orderId ||
      !body?.razorpayOrderId ||
      !body?.razorpayPaymentId ||
      !body?.razorpaySignature
    ) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    const order = await commercePaymentService.verifyRazorpayPayment({
      orderId: String(body.orderId),
      razorpayOrderId: String(body.razorpayOrderId),
      razorpayPaymentId: String(body.razorpayPaymentId),
      razorpaySignature: String(body.razorpaySignature),
    });
    return NextResponse.json({ order, success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
