import crypto from "crypto";
import Razorpay from "razorpay";
import { getRazorpayKeyId, getRazorpayKeySecret } from "./config";

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
  return expected === input.signature;
}
