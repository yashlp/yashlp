import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/aesthetics/ui/button";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    alt: "Ceramic vessel",
    accent: "var(--aes-cobalt)",
    rotate: "-6deg",
    top: "8%",
    left: "4%",
  },
  {
    src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    alt: "Jewelry",
    accent: "var(--aes-coral)",
    rotate: "4deg",
    top: "18%",
    right: "6%",
  },
  {
    src: "https://images.unsplash.com/photo-1602874801006-4f8a22944a3a?w=800&q=80",
    alt: "Candles",
    accent: "var(--aes-lavender)",
    rotate: "-3deg",
    bottom: "12%",
    left: "12%",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-6 sm:px-6 sm:pb-16 sm:pt-10 lg:pb-24">
      <div className="relative mx-auto max-w-7xl">
        {/* Floating art cards — desktop */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {HERO_IMAGES.map((img) => (
            <div
              key={img.src}
              className="aes-animate-float absolute w-36 overflow-hidden rounded-2xl border-2 border-white shadow-2xl xl:w-44"
              style={{
                top: img.top,
                bottom: img.bottom,
                left: img.left,
                right: img.right,
                transform: `rotate(${img.rotate})`,
                animationDelay: `${HERO_IMAGES.indexOf(img) * 0.8}s`,
                boxShadow: `0 20px 60px color-mix(in srgb, ${img.accent} 25%, transparent)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="aspect-[3/4] w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="relative mx-auto max-w-4xl text-center lg:py-16">
          <div className="aes-animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--aes-border)] bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[var(--aes-lavender)]" />
            <span className="aes-mono text-[10px] uppercase tracking-[0.25em] text-[var(--aes-ink-muted)]">
              Art & design marketplace · 2026
            </span>
          </div>

          <h1
            className="aes-animate-fade-up aes-display text-[clamp(2.75rem,8vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--aes-ink)]"
            style={{ animationDelay: "0.1s" }}
          >
            Collect what
            <br />
            <span className="aes-gradient-text">moves you</span>
          </h1>

          <p
            className="aes-serif aes-animate-fade-up mx-auto mt-6 max-w-lg text-xl italic leading-relaxed text-[var(--aes-ink-muted)] sm:text-2xl"
            style={{ animationDelay: "0.2s" }}
          >
            A colourful curated world of independent makers, objects, and stories — shop like a gallery, scroll like a dream.
          </p>

          <div
            className="aes-animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/aesthetics/shop">
              <Button size="lg" className="min-w-[180px] gap-2">
                Explore shop
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/aesthetics/discover">
              <Button variant="secondary" size="lg" className="min-w-[180px]">
                Discover mode
              </Button>
            </Link>
          </div>

          {/* Color chips */}
          <div className="aes-animate-fade-up mt-12 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.4s" }}>
            {[
              { label: "Ceramics", class: "aes-chip-cobalt" },
              { label: "Wearables", class: "aes-chip-coral" },
              { label: "Wellness", class: "aes-chip-sage" },
              { label: "Lighting", class: "aes-chip-lavender" },
            ].map(({ label, class: cls }) => (
              <Link key={label} href="/aesthetics/shop" className={`aes-chip ${cls}`}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile image strip */}
        <div className="mt-10 flex gap-3 overflow-x-auto pb-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {HERO_IMAGES.map((img) => (
            <div
              key={img.src}
              className="w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-lg"
              style={{ boxShadow: `0 12px 32px color-mix(in srgb, ${img.accent} 20%, transparent)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="aspect-[3/4] w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
