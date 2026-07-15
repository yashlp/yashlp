import crypto from "crypto";
import Razorpay from "razorpay";
import { getRazorpayKeyId, getRazorpayKeySecret } from "./config";

function timingSafeEqualHex(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function getRazorpayClient() {
  return new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: getRazorpayKeySecret(),
  });
}

export async function createRazorpayOrder(input: {
  amountMinor: number;
  currency: "INR" | "USD";
  receipt: string;
  notes: Record<string, string>;
}) {
  const client = getRazorpayClient();
  return client.orders.create({
    amount: input.amountMinor,
    currency: input.currency,
    receipt: input.receipt,
    notes: input.notes,
  });
}

export function verifyRazorpaySignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const body = `${input.orderId}|${input.paymentId}`;
  const expected = crypto
    .createHmac("sha256", getRazorpayKeySecret())
    .update(body)
    .digest("hex");
  return timingSafeEqualHex(expected, input.signature || "");
}

export function verifyRazorpayWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  if (!secret) {
    console.error("[razorpay] RAZORPAY_WEBHOOK_SECRET is not set");
    return false;
  }
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeEqualHex(expected, signature || "");
}
