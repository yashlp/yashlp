import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { AboutContent } from "@/components/aesthetics/about/about-content";

export const metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <ConsumerPage room="editorial">
      <AboutContent />
    </ConsumerPage>
  );
}
