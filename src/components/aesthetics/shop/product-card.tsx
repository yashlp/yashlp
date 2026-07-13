"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/aesthetics/ui/badge";
import type { Product } from "@/lib/aesthetics/types";

const ACCENTS = [
  "from-blue-500/20 to-violet-500/10",
  "from-rose-500/20 to-orange-500/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-violet-500/20 to-fuchsia-500/10",
];

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  index?: number;
};

export function ProductCard({ product, priority, index = 0 }: ProductCardProps) {
  const brandName = product.brand?.name ?? "Independent";
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <Link href={`/aesthetics/product/${product.slug}`} className="group block">
      <article className="aes-card-editorial overflow-hidden">
        <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${accent}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--aes-ink)]/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {product.compareAtPrice && (
            <Badge variant="coral" className="absolute left-3 top-3">
              Sale
            </Badge>
          )}
          {product.newArrival && !product.compareAtPrice && (
            <Badge variant="sage" className="absolute left-3 top-3">
              New
            </Badge>
          )}

          <button
            type="button"
            className="absolute right-3 top-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4 text-[var(--aes-coral)]" />
          </button>

          <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
            <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-[var(--aes-ink)] shadow-md backdrop-blur-sm">
              ${product.price}
            </span>
          </div>
        </div>

        <div className="border-t border-[var(--aes-border)] bg-white p-4">
          <p className="aes-mono text-[10px] font-medium uppercase tracking-wider text-[var(--aes-ink-soft)]">
            {brandName}
          </p>
          <h3 className="aes-display mt-1 text-lg font-bold leading-tight text-[var(--aes-ink)] transition group-hover:text-[var(--aes-cobalt-bright)]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-[var(--aes-ink)]">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-[var(--aes-ink-soft)] line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
