import type { PricingMarket } from "@/lib/report-pricing";

export type PaymentProvider = "razorpay" | "stripe";

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY);
}

export function isPaymentsConfigured(): boolean {
  return isRazorpayConfigured() || isStripeConfigured();
}

export function getRazorpayKeyId(): string {
  const key = process.env.RAZORPAY_KEY_ID;
  if (!key) throw new Error("RAZORPAY_KEY_ID is not configured");
  return key;
}

export function getRazorpayKeySecret(): string {
  const key = process.env.RAZORPAY_KEY_SECRET;
  if (!key) throw new Error("RAZORPAY_KEY_SECRET is not configured");
  return key;
}

export function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return key;
}

export function getStripePublishableKey(): string {
  const key = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) throw new Error("STRIPE_PUBLISHABLE_KEY is not configured");
  return key;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://yashlp.vercel.app";
}

/** India → Razorpay (INR). International → Stripe (USD) when configured, else Razorpay INR. */
export function resolvePaymentProvider(market: PricingMarket): PaymentProvider {
  if (market === "india") {
    if (!isRazorpayConfigured()) {
      throw new Error("Razorpay is not configured for India payments");
    }
    return "razorpay";
  }
  if (isStripeConfigured()) return "stripe";
  if (isRazorpayConfigured()) return "razorpay";
  throw new Error("No payment provider configured for international checkout");
}
