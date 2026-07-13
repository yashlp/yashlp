import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";

export function AboutBanner() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="aes-label">About us</p>
        <h2 className="mt-4 text-2xl font-bold leading-snug text-[var(--aes-ink)] sm:text-3xl">
          Clean, curated, feel-good objects that enhance joyful moments
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--aes-ink-muted)]">
          Aesthetics isn&apos;t just another marketplace. It&apos;s a cultural shift in how we shop,
          shop, and celebrate independent design — with AI that learns your taste as you browse.
        </p>
        <Link href="/aesthetics/shop" className="mt-8 inline-block">
          <Button variant="secondary">About us</Button>
        </Link>
      </div>
    </section>
  );
}
