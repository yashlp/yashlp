import Link from "next/link";
import { Star } from "lucide-react";

export function AboutBanner() {
  return (
    <section className="aes-bg-peach px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xl font-black leading-snug text-[var(--aes-ink)] sm:text-2xl md:text-3xl">
          Beautiful, intentional, feel-good objects that turn everyday rooms into rituals
        </h2>

        <div className="mt-6 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-[var(--aes-yellow-deep)] text-[var(--aes-yellow-deep)]" />
          ))}
          <span className="ml-2 text-sm font-bold text-[var(--aes-ink)]">Loved by design people</span>
        </div>

        <h4 className="mt-8 text-base font-bold leading-relaxed text-[var(--aes-ink)] sm:text-lg">
          Aesthetics isn&apos;t another store. It&apos;s a shortcut to taste — a cultural shift in how
          we discover makers, style our spaces, and celebrate the objects we keep.
        </h4>

        <Link href="/aesthetics/shop" className="aes-btn aes-btn-secondary mt-8 inline-flex px-8 py-3.5">
          About us
        </Link>
      </div>
    </section>
  );
}
