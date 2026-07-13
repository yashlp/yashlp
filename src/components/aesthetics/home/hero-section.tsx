import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/aesthetics/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--aes-dusty-light) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--aes-royal-light) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="aes-mono mb-4 text-[11px] uppercase tracking-[0.35em] text-[var(--aes-dusty)]">
          Curated marketplace
        </p>
        <h1 className="aes-display text-5xl font-semibold italic leading-[1.05] tracking-tight text-[var(--aes-charcoal)] sm:text-6xl lg:text-7xl">
          Shop your aesthetic
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--aes-charcoal-muted)]">
          Discover beautiful products from independent brands. Browse classically, or immerse yourself in Discover mode.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/aesthetics/shop">
            <Button size="lg">Explore Shop</Button>
          </Link>
          <Link href="/aesthetics/discover">
            <Button variant="secondary" size="lg" className="gap-2">
              Discover Mode
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
