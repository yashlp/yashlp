import Link from "next/link";
import { Badge } from "@/components/aesthetics/ui/badge";
import type { Brand } from "@/lib/aesthetics/types";

const COLORS = ["bg-pink-500", "bg-violet-500", "bg-orange-500", "bg-teal-500", "bg-yellow-500"];

export function BrandStrip({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;

  return (
    <section className="bg-[var(--aes-yellow)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="aes-section-title text-center text-[var(--aes-ink)]">Brands we love</h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-[var(--aes-ink-muted)]">
          Independent makers, verified quality
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {brands.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/aesthetics/shop?brand=${brand.slug}`}
              className="group flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${COLORS[i % COLORS.length]} text-sm font-bold text-white`}
              >
                {brand.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[var(--aes-ink)]">{brand.name}</p>
                {brand.verified && <Badge variant="sage">Verified</Badge>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
