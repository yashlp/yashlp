import Link from "next/link";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";

export default function IndiaOnlyPage() {
  return (
    <ConsumerPage room="calm">
      <main className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16">
        <div className="aes-hero-brand mx-auto">
          <BrandLogo variant="hero" href="/aesthetics" />
        </div>

        <p className="aes-gallery-eyebrow mt-10">India only</p>
        <h1 className="aes-gallery-title mt-3 text-balance">Only Aesthetic is available in India</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--aes-ink-muted)]">
          We currently serve customers across India only. If you are browsing from outside India, check back when we
          expand.
        </p>

        <div className="mt-8">
          <Link href="/aesthetics/shop" className="aes-btn aes-btn-primary px-10 py-4 text-xs">
            Shop now
          </Link>
        </div>

        <p className="mt-10 text-xs text-[var(--aes-ink-soft)]">
          Visiting from India?{" "}
          <Link href="/aesthetics" className="underline">
            Continue to the store
          </Link>
        </p>
      </main>
    </ConsumerPage>
  );
}
