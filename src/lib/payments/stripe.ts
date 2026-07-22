import Stripe from "stripe";
import { getSiteUrl, getStripeSecretKey } from "./config";

export function getStripeClient() {
  return new Stripe(getStripeSecretKey());
}

export async function createStripeCheckoutSession(input: {
  amountMinor: number;
  currency: "usd";
  productName: string;
  userId: string;
  productId: string;
  lat: number;
  lng: number;
  placeName?: string | null;
  successPath: string;
  cancelPath: string;
}) {
  const stripe = getStripeClient();
  const siteUrl = getSiteUrl();

  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.currency,
          unit_amount: input.amountMinor,
          product_data: {
            name: input.productName,
            description: input.placeName ?? "CivicLens intelligence report",
          },
        },
      },
    ],
    metadata: {
      userId: input.userId,
      productId: input.productId,
      lat: String(input.lat),
      lng: String(input.lng),
      placeName: input.placeName ?? "",
    },
    success_url: (() => {
      // successPath may already include ?lat=&lng= — always append session_id correctly.
      const joiner = input.successPath.includes("?") ? "&" : "?";
      return `${siteUrl}${input.successPath}${joiner}session_id={CHECKOUT_SESSION_ID}`;
    })(),
    cancel_url: `${siteUrl}${input.cancelPath}`,
  });
}

export async function getPaidStripeSession(sessionId: string) {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return null;
  return session;
}
