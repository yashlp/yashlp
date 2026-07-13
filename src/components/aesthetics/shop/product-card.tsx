"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/aesthetics/ui/badge";
import type { Product } from "@/lib/aesthetics/types";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  index?: number;
};

export function ProductCard({ product, priority }: ProductCardProps) {
  const brandName = product.brand?.name ?? "Independent";

  return (
    <Link href={`/aesthetics/product/${product.slug}`} className="group block">
      <article>
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--aes-sand-deep)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--aes-forest-deep)]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

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
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-white/30 bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--aes-ink-soft)]">
            {brandName}
          </p>
          <h3 className="aes-display mt-1 text-xl leading-tight text-[var(--aes-ink)] transition group-hover:text-[var(--aes-forest)]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-medium text-[var(--aes-ink)]">${product.price}</span>
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
