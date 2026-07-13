import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";

const HERO_PRODUCTS = [
  {
    src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
    alt: "Curated ceramics",
    className: "top-8 right-[8%] w-44 rotate-6 aes-animate-float",
    delay: "0s",
  },
  {
    src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80",
    alt: "Wellness objects",
    className: "bottom-16 left-[6%] w-40 -rotate-4 aes-animate-float",
    delay: "1s",
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    alt: "Artisan vessel",
    className: "bottom-24 right-[18%] w-36 rotate-3 aes-animate-float hidden sm:block",
    delay: "2s",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative z-10 text-center lg:text-left">
            <h1 className="aes-display aes-animate-fade-up text-[clamp(3rem,10vw,6.5rem)] text-[var(--aes-ink)]">
              Curated
              <br />
              design objects
              <br />
              <span className="aes-gradient-text">&amp; wellness</span>
            </h1>

            <p
              className="aes-animate-fade-up mx-auto mt-6 max-w-md text-base leading-relaxed text-[var(--aes-ink-muted)] sm:text-lg lg:mx-0"
              style={{ animationDelay: "0.15s" }}
            >
              Crafted for those who want to live beautifully and savor joyful moments — shop like a
              gallery, scroll like a dream.
            </p>

            <div
              className="aes-animate-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
              style={{ animationDelay: "0.25s" }}
            >
              <Link href="/aesthetics/shop">
                <Button size="lg" className="min-w-[180px]">
                  Shop now
                </Button>
              </Link>
              <Link href="/aesthetics/discover">
                <Button variant="secondary" size="lg" className="min-w-[180px]">
                  Discover mode
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--aes-pink)]/20 via-[var(--aes-lavender)]/15 to-[var(--aes-yellow)]/25 blur-2xl" />
            {HERO_PRODUCTS.map((img) => (
              <div
                key={img.src}
                className={`absolute overflow-hidden rounded-3xl border-4 border-white shadow-2xl ${img.className}`}
                style={{ animationDelay: img.delay }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="aspect-square w-full object-cover" />
              </div>
            ))}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--aes-pink)] px-6 py-3 text-center shadow-xl">
              <p className="aes-display text-4xl text-white">Æ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
