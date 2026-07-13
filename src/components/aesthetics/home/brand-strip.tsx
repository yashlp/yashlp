import Link from "next/link";
import { Badge } from "@/components/aesthetics/ui/badge";
import type { Brand } from "@/lib/aesthetics/types";

export function BrandStrip({ brands }: { brands: Brand[] }) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="aes-mono text-[10px] uppercase tracking-[0.3em] text-[var(--aes-dusty)]">
            Independent
          </p>
          <h2 className="aes-display mt-2 text-3xl font-semibold italic text-[var(--aes-charcoal)]">
            Brands we love
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/aesthetics/shop?brand=${brand.slug}`}
              className="aes-card flex items-center gap-4 p-5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgba(27,79,156,0.06)]">
                <span className="aes-display text-xl font-semibold italic text-[var(--aes-royal)]">
                  {brand.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-[var(--aes-charcoal)]">{brand.name}</p>
                  {brand.verified && <Badge variant="royal">Verified</Badge>}
                </div>
                <p className="mt-0.5 truncate text-sm text-[var(--aes-charcoal-muted)]">
                  {brand.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
