import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import type { Product } from "@/lib/aesthetics/types";

type ProductRowProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
  accent?: "cobalt" | "coral" | "lavender" | "sage";
};

const ACCENT_STYLES = {
  cobalt: "from-blue-600/10 to-transparent border-blue-200/50",
  coral: "from-rose-500/10 to-transparent border-rose-200/50",
  lavender: "from-violet-500/10 to-transparent border-violet-200/50",
  sage: "from-emerald-500/10 to-transparent border-emerald-200/50",
};

export function ProductRow({ title, subtitle, products, href, accent = "cobalt" }: ProductRowProps) {
  const style = ACCENT_STYLES[accent];

  return (
    <section className={`px-4 py-14 sm:px-6 ${products.length ? "" : "hidden"}`}>
      <div className={`mx-auto max-w-7xl rounded-3xl border bg-gradient-to-b p-6 sm:p-10 ${style}`}>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="aes-display text-3xl font-extrabold tracking-tight text-[var(--aes-ink)] sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="aes-serif mt-2 text-lg italic text-[var(--aes-ink-muted)]">{subtitle}</p>
            )}
          </div>
          {href && (
            <Link
              href={href}
              className="group hidden items-center gap-2 rounded-full bg-[var(--aes-ink)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-105 sm:flex"
            >
              View all
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
