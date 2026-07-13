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

export function ProductRow({ title, subtitle, products, href }: ProductRowProps) {
  return (
    <section className={`px-6 py-24 sm:px-8 ${products.length ? "" : "hidden"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-[var(--aes-border)] pb-8">
          <div className="max-w-2xl">
            <h2 className="aes-display text-4xl text-[var(--aes-ink)] sm:text-5xl">{title}</h2>
            {subtitle && (
              <p className="aes-serif mt-4 text-lg italic leading-relaxed text-[var(--aes-ink-muted)]">
                {subtitle}
              </p>
            )}
          </div>
          {href && (
            <Link
              href={href}
              className="group hidden shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--aes-forest)] transition hover:text-[var(--aes-forest-deep)] sm:flex"
            >
              View all
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
