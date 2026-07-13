import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="Serene wellness retreat"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[var(--aes-gradient-hero)]" />
      <div className="aes-grain absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-32 sm:px-8 sm:pb-36">
        <p
          className="aes-label aes-animate-fade-up text-[var(--aes-gold-soft)]"
          style={{ animationDelay: "0.1s" }}
        >
          Unwind, restore, and reconnect
        </p>

        <h1
          className="aes-display aes-animate-fade-up mt-6 max-w-4xl text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] text-[var(--aes-sand)]"
          style={{ animationDelay: "0.2s" }}
        >
          Aesthetics, your luxury wellness and design retreat
        </h1>

        <p
          className="aes-serif aes-animate-fade-up mt-6 max-w-xl text-xl italic leading-relaxed text-[var(--aes-sand)]/80 sm:text-2xl"
          style={{ animationDelay: "0.35s" }}
        >
          Imagine a sanctuary where timeless craft blends seamlessly with modern living — all designed to nurture your well-being.
        </p>

        <div
          className="aes-animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "0.5s" }}
        >
          <Link href="/aesthetics/shop">
            <Button size="lg" variant="light" className="min-w-[200px]">
              Shop the collection
            </Button>
          </Link>
          <Link href="/aesthetics/discover">
            <Button size="lg" variant="light" className="min-w-[200px] opacity-80">
              Discover mode
            </Button>
          </Link>
        </div>
      </div>

      <div
        className="aes-scroll-indicator aes-label aes-animate-fade-up absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center text-[var(--aes-sand)]/60"
        style={{ animationDelay: "0.7s" }}
      >
        Scroll
      </div>
    </section>
  );
}
