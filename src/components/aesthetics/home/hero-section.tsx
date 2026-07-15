import Link from "next/link";
import type { Product } from "@/lib/aesthetics/types";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";
import { HangingNoteBoard } from "@/components/aesthetics/home/hanging-note-board";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
];

type HeroSectionProps = {
  products?: Product[];
};

export function HeroSection({ products = [] }: HeroSectionProps) {
  const source =
    products.length > 0
      ? products
      : FALLBACK_IMAGES.map((src, i) => ({
          id: `fallback-${i}`,
          name: "Curated object",
          images: [src],
        }));

  /** Phones: 3 images; tablets+: up to 5 */
  const heroItemsMobile = source.slice(0, 3);
  const heroItemsDesktop = source.slice(0, 5);

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

        {/* Mobile gallery — 3 clear tiles */}
        <div
          className="aes-animate-fade-up mx-auto mt-12 flex max-w-md items-end justify-center gap-3 sm:hidden"
          style={{ animationDelay: "0.35s" }}
        >
          {heroItemsMobile.map((item, i) => (
            <div key={item.id} className="flex-1" style={{ marginTop: i === 1 ? "0" : "1rem" }}>
              <div className="mx-auto aspect-[3/4] w-full max-w-[120px] overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
              </div>
            </div>
          ))}
        </div>

        {/* Tablet / desktop gallery */}
        <div
          className="aes-animate-fade-up mx-auto mt-14 hidden max-w-4xl items-end justify-center gap-3 sm:flex sm:mt-20 sm:gap-5"
          style={{ animationDelay: "0.35s" }}
        >
          {heroItemsDesktop.map((item, i) => (
            <div key={item.id} className="flex-1" style={{ marginTop: i % 2 === 0 ? "0" : "1.5rem" }}>
              <div className="mx-auto aspect-[3/4] w-full max-w-[140px] overflow-hidden rounded-2xl md:max-w-[180px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
