"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/aesthetics/ui/badge";
import { getBrand } from "@/lib/aesthetics/brands";
import type { Product } from "@/lib/aesthetics/types";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority }: ProductCardProps) {
  const brand = getBrand(product.brandId);

  return (
    <Link href={`/aesthetics/product/${product.slug}`} className="group block">
      <article className="aes-card overflow-hidden p-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--aes-ivory-deep)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            loading={priority ? "eager" : "lazy"}
            draggable={false}
          />
          {product.compareAtPrice && (
            <Badge variant="royal" className="absolute left-3 top-3">
              Sale
            </Badge>
          )}
          {product.newArrival && !product.compareAtPrice && (
            <Badge variant="royal" className="absolute left-3 top-3">
              New
            </Badge>
          )}
          <button
            type="button"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-md backdrop-blur-sm transition group-hover:opacity-100"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4 text-[var(--aes-royal)]" />
          </button>
        </div>
        <div className="p-4">
          <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
            {brand?.name}
          </p>
          <h3 className="mt-1 font-medium leading-snug text-[var(--aes-charcoal)] group-hover:text-[var(--aes-royal)]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-[var(--aes-charcoal)]">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-[var(--aes-charcoal-muted)] line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
