import type { Metadata } from "next";
import { PolicyPageView } from "@/components/aesthetics/content/policy-page";

export const metadata: Metadata = {
  title: "FAQ | Only Aesthetic",
  description: "Answers about checkout, shipping, pre-orders, returns, and payments.",
};

export default function FaqPage() {
  return <PolicyPageView contentKey="faqs" />;
}
