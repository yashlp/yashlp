import type { Metadata } from "next";
import { PolicyPageView } from "@/components/aesthetics/content/policy-page";

export const metadata: Metadata = {
  title: "Terms of Service | Only Aesthetic",
  description: "Terms for shopping at Only Aesthetic.",
};

export default function TermsPage() {
  return <PolicyPageView contentKey="terms" />;
}
