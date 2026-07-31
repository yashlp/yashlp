"use client";

import Link from "next/link";
import { formatInr } from "@/lib/aesthetics/format-inr";
import type { Product } from "@/lib/aesthetics/types";

type Props = {
  products: Product[];
};

/** Left→right auto-scroll of live products under Shop now — each tile opens the product page. */
export function ShopNowProducts({ products }: Props) {
  if (!products.length) return null;

  const loop = products.length === 1 ? [...products, ...products, ...products, ...products] : [...products, ...products];

  return (
    <div
      className="aes-animate-fade-up relative mx-auto mt-12 w-full max-w-6xl overflow-hidden sm:mt-14"
      style={{ animationDelay: "0.32s" }}
      aria-label="Shop products"
    >
      <p className="mb-5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--aes-ink-muted)] sm:mb-6 sm:text-[11px]">
        In the shop
      </p>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[var(--aes-cream,#faf6f1)] to-transparent sm:w-14" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[var(--aes-cream,#faf6f1)] to-transparent sm:w-14" />

        <div className="oa-products-marquee flex w-max gap-3 sm:gap-4">
          {loop.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              href={`/aesthetics/product/${product.slug}`}
              className="group relative w-[148px] shrink-0 overflow-hidden rounded-2xl bg-[var(--aes-cream-deep,#f3eee8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--aes-royal)] sm:w-[180px]"
            >
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0] || "/oa/placeholder-product.jpg"}
                  alt={product.name}
                  width={360}
                  height={450}
                  loading={i < 4 ? "eager" : "lazy"}
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-3 py-3 text-center">
                <p className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--aes-ink)] transition group-hover:text-[var(--aes-pink)] sm:text-sm">
                  {product.name}
                </p>
                <p className="mt-1 text-xs font-medium text-[var(--aes-ink-muted)]">{formatInr(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
