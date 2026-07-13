import Link from "next/link";
import type { Product } from "@/lib/aesthetics/types";

const PEDESTAL_COLORS = [
  "var(--aes-pedestal-1)",
  "var(--aes-pedestal-2)",
  "var(--aes-pedestal-3)",
  "var(--aes-pedestal-4)",
  "var(--aes-pedestal-5)",
];

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
    <section className="aes-bg-hero px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-10">
      <div className="mx-auto max-w-5xl text-center">
        <p className="aes-tagline-band aes-animate-fade-up mb-6">
          <span>always curated</span>
          <span>joyfully bold</span>
          <span>effortlessly stylish</span>
        </p>

        <h1 className="aes-joy-title aes-animate-fade-up text-[var(--aes-ink)]">
          curated design
          <br />
          objectS &amp;
          <br />
          wellness
        </h1>

        <p
          className="aes-animate-fade-up mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[var(--aes-ink-muted)] sm:text-base"
          style={{ animationDelay: "0.1s" }}
        >
          For people who want spaces that feel alive — independent makers, mood-matched edits,
          and zero algorithm fatigue.
        </p>

        <div className="aes-animate-fade-up mt-8" style={{ animationDelay: "0.2s" }}>
          <Link href="/aesthetics/shop" className="aes-btn aes-btn-primary px-10 py-4 text-xs">
            Shop now
          </Link>
        </div>

        <div
          className="aes-animate-fade-up mx-auto mt-12 flex max-w-4xl items-end justify-center gap-3 sm:mt-16 sm:gap-5"
          style={{ animationDelay: "0.3s" }}
        >
          {heroItems.map((item, i) => (
            <div
              key={item.id}
              className="flex-1"
              style={{ marginTop: i % 2 === 0 ? "0" : "1.5rem" }}
            >
              <div
                className="aes-joy-pedestal mx-auto w-full max-w-[140px] sm:max-w-[180px]"
                style={{ background: PEDESTAL_COLORS[i % PEDESTAL_COLORS.length] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.images[0]} alt={item.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
