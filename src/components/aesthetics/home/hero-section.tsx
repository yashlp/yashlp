import Link from "next/link";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";
import { HangingNoteBoard } from "@/components/aesthetics/home/hanging-note-board";
import { ShopMoodGallery } from "@/components/aesthetics/home/shop-mood-gallery";

export function HeroSection() {
  return (
    <section className="aes-bg-hero aes-hero relative px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-10">
      <HangingNoteBoard />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="aes-animate-fade-up aes-hero-brand">
          <BrandLogo variant="hero" />
        </div>

        <p
          className="aes-animate-fade-up mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[var(--aes-ink-muted)] sm:mt-6 sm:text-base"
          style={{ animationDelay: "0.18s" }}
        >
          Curated objects for intentional living — shipped across India with care.
        </p>

        <div className="aes-animate-fade-up mt-8 sm:mt-10" style={{ animationDelay: "0.25s" }}>
          <Link href="/aesthetics/shop" className="aes-btn aes-btn-primary px-10 py-4 text-xs">
            Shop now
          </Link>
        </div>

        <ShopMoodGallery />
      </div>
    </section>
  );
}
