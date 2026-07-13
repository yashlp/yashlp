import Link from "next/link";
import { Badge } from "@/components/aesthetics/ui/badge";
import type { Brand } from "@/lib/aesthetics/types";

export function BrandStrip({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;

  return (
    <section className="aes-dark-section px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="aes-label text-[var(--aes-gold-soft)]">Independent makers</p>
          <h2 className="aes-display mt-3 text-4xl text-[var(--aes-sand)] sm:text-5xl">
            Brands we love
          </h2>
        </div>
        <div className="grid gap-px bg-[var(--aes-border-light)] sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/aesthetics/shop?brand=${brand.slug}`}
              className="group flex items-center gap-5 bg-[var(--aes-forest-deep)] p-8 transition hover:bg-[var(--aes-forest)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--aes-border-light)] text-lg font-medium text-[var(--aes-gold-soft)]">
                {brand.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="aes-display truncate text-xl text-[var(--aes-sand)]">{brand.name}</p>
                  {brand.verified && <Badge variant="sage">Verified</Badge>}
                </div>
                <p className="mt-1 truncate text-sm text-[var(--aes-sand)]/60">{brand.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
