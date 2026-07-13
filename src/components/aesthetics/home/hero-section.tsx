import Link from "next/link";
import type { Product } from "@/lib/aesthetics/types";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
];

type HeroSectionProps = {
  products?: Product[];
};

export function HeroSection({ products = [] }: HeroSectionProps) {
  const heroItems =
    products.length > 0
      ? products.slice(0, 5)
      : FALLBACK_IMAGES.map((src, i) => ({
          id: `fallback-${i}`,
          name: "Curated object",
          images: [src],
        }));

  return (
    <section className="aes-bg-hero px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
      <div className="mx-auto max-w-5xl text-center">
        <div className="aes-animate-fade-up">
          <BrandLogo variant="hero" />
        </div>

        <p
          className="aes-animate-fade-up mx-auto mt-6 max-w-lg text-sm leading-relaxed text-[var(--aes-ink-muted)] sm:text-base"
          style={{ animationDelay: "0.18s" }}
        >
          Curated objects for intentional living — shipped across India with care.
        </p>

        <div className="aes-animate-fade-up mt-10" style={{ animationDelay: "0.25s" }}>
          <Link href="/aesthetics/shop" className="aes-btn aes-btn-primary px-10 py-4 text-xs">
            Shop now
          </Link>
        </div>

        <div
          className="aes-animate-fade-up mx-auto mt-14 flex max-w-4xl items-end justify-center gap-3 sm:mt-20 sm:gap-5"
          style={{ animationDelay: "0.35s" }}
        >
          {heroItems.map((item, i) => (
            <div key={item.id} className="flex-1" style={{ marginTop: i % 2 === 0 ? "0" : "1.5rem" }}>
              <div className="mx-auto aspect-[3/4] w-full max-w-[140px] overflow-hidden rounded-2xl sm:max-w-[180px]">
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
