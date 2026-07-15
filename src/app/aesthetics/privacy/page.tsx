import type { Metadata } from "next";
import { PolicyPageView } from "@/components/aesthetics/content/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Only Aesthetics",
  description: "How Only Aesthetics collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return <PolicyPageView contentKey="privacy" />;
}
