import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const PROMOS = [
  {
    title: "New arrivals",
    subtitle: "Fresh from independent studios",
    href: "/aesthetics/shop?sort=new",
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
  },
  {
    title: "Wellness edit",
    subtitle: "Objects for mindful living",
    href: "/aesthetics/shop",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
  },
  {
    title: "Discover mode",
    subtitle: "Immersive full-screen browsing",
    href: "/aesthetics/discover",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
  },
];

export function PromoSection() {
  return (
    <section className="bg-[var(--aes-sand)] px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="aes-label">Psst… here&apos;s a treat from us</p>
          <h2 className="aes-display mt-3 text-4xl text-[var(--aes-ink)] sm:text-5xl">
            Exclusive treats
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROMOS.map((promo) => (
            <Link
              key={promo.title}
              href={promo.href}
              className="group relative block overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--aes-forest-deep)]/90 via-[var(--aes-forest-deep)]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="aes-label text-[var(--aes-gold-soft)]">{promo.subtitle}</p>
                  <h3 className="aes-display mt-2 text-3xl text-[var(--aes-sand)]">{promo.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--aes-sand)]/80 transition group-hover:text-[var(--aes-gold-soft)]">
                    Explore
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
