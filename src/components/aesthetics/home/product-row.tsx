import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import type { Product } from "@/lib/aesthetics/types";

type ProductRowProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
};

export function ProductRow({ title, subtitle, products, href }: ProductRowProps) {
  return (
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="aes-display text-3xl font-semibold italic text-[var(--aes-charcoal)] sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-[var(--aes-charcoal-muted)]">{subtitle}</p>
            )}
          </div>
          {href && (
            <Link
              href={href}
              className="aes-mono hidden items-center gap-1 text-xs uppercase tracking-wider text-[var(--aes-royal)] sm:flex"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
