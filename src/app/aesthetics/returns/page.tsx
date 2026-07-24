import type { Metadata } from "next";
import { PolicyPageView } from "@/components/aesthetics/content/policy-page";

export const metadata: Metadata = {
  title: "Shipping & Returns | Only Aesthetic",
  description: "Return and refund policy for Only Aesthetic orders.",
};

/** Same policy surface as /aesthetics/shipping — linked as Shipping & Returns. */
export default function ReturnsPage() {
  return <PolicyPageView contentKey="shipping_returns" />;
}
