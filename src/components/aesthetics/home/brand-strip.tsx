import Link from "next/link";
import { Badge } from "@/components/aesthetics/ui/badge";
import type { Brand } from "@/lib/aesthetics/types";

const GRADIENTS = [
  "from-blue-500 to-violet-600",
  "from-rose-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-fuchsia-500",
  "from-amber-500 to-rose-500",
  "from-cyan-500 to-blue-600",
];

export function BrandStrip({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;

  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="aes-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--aes-lavender)]">
            Independent makers
          </p>
          <h2 className="aes-display mt-2 text-4xl font-extrabold tracking-tight text-[var(--aes-ink)]">
            Brands we love
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/aesthetics/shop?brand=${brand.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-[var(--aes-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-xl font-bold text-white shadow-md`}
              >
                {brand.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="aes-display truncate text-lg font-bold text-[var(--aes-ink)]">{brand.name}</p>
                  {brand.verified && <Badge variant="sage">Verified</Badge>}
                </div>
                <p className="mt-0.5 truncate text-sm text-[var(--aes-ink-muted)]">{brand.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
