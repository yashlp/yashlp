import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { AboutValuesSection } from "@/components/aesthetics/home/about-banner";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";

export const metadata = { title: "About us" };

const DETAILS = [
  "Details matter",
  "Small-batch makers",
  "Maker-vetted",
  "Mood-first edits",
  "Ships with care",
];

export default function AboutPage() {
  return (
    <ConsumerPage tint="warm">
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <BrandLogo variant="hero" />
          <p className="mx-auto mt-5 max-w-xl text-[11px] tracking-wide text-[var(--aes-ink-muted)] sm:text-xs">
            {DETAILS.join(" · ")}
          </p>
        </div>

        <div className="aes-panel mt-12 p-8 sm:p-10">
          <p className="text-base leading-relaxed text-[var(--aes-ink-muted)] sm:text-lg">
            We are a direct-to-consumer brand based in India, curating objects from independent makers
            for homes that value intention over excess. Every product is selected for material quality,
            thoughtful design, and the mood it brings to your space.
          </p>
          <p className="mt-6 text-base leading-relaxed text-[var(--aes-ink-muted)]">
            From slow mornings with pour-over ceramics to evening wind-down with lavender room mist —
            our edits help you build rituals, not clutter. All prices are in Indian Rupees (₹) and we
            ship pan-India.
          </p>
        </div>

        <AboutValuesSection />
      </main>
    </ConsumerPage>
  );
}
