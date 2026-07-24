import type { Metadata } from "next";
import { PolicyPageView } from "@/components/aesthetics/content/policy-page";

export const metadata: Metadata = {
  title: "Shipping & Returns | Only Aesthetic",
  description: "Delivery timelines, free shipping threshold, and return/refund policy for Only Aesthetic.",
};

export default function ShippingPage() {
  return <PolicyPageView contentKey="shipping_returns" />;
}
