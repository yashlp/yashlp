import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";

const IMAGE =
  "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1600&q=80";

export function TranquilitySection() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMAGE}
        alt="Step into tranquility"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--aes-forest-deep)]/90 via-[var(--aes-forest-deep)]/60 to-transparent" />

      <div className="relative z-10 flex min-h-[70vh] items-center px-6 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-lg">
            <p className="aes-label text-[var(--aes-gold-soft)]">Step into tranquility</p>
            <h2 className="aes-display mt-4 text-4xl leading-tight text-[var(--aes-sand)] sm:text-5xl">
              Serene objects designed to soothe your mind and body
            </h2>
            <p className="aes-serif mt-6 text-lg italic leading-relaxed text-[var(--aes-sand)]/75">
              From deeply calming aromatics to sculptural ceramics — each piece is chosen to create a haven of relaxation in your home.
            </p>
            <Link href="/aesthetics/collections" className="mt-10 inline-block">
              <Button variant="light" size="lg">
                Explore collections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
