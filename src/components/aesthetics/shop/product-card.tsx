"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/aesthetics/ui/badge";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import type { Product } from "@/lib/aesthetics/types";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  index?: number;
  quickAdd?: boolean;
  variant?: "joy" | "grid";
};

function ProductImage({
  product,
  priority,
  className = "aspect-[4/5]",
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        loading={priority ? "eager" : "lazy"}
        draggable={false}
      />
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
    </div>
  );
}

export function ProductCard({
  product,
  priority,
  quickAdd = false,
  variant = "joy",
}: ProductCardProps) {
  const { addToCart } = useCart();

  if (variant === "joy") {
    return (
      <article className="group w-[200px] sm:w-[220px]">
        <Link href={`/aesthetics/product/${product.slug}`} className="block">
          <ProductImage product={product} priority={priority} />
        </Link>

        <div className="mt-4 text-center">
          <Link href={`/aesthetics/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-[var(--aes-ink)] transition group-hover:text-[var(--aes-pink)]">
              {product.name}
            </h3>
          </Link>
          {quickAdd && (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="aes-joy-quickadd mt-3"
            >
              <Plus className="h-3 w-3" />
              Quick add
            </button>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      <Link href={`/aesthetics/product/${product.slug}`} className="block">
        <ProductImage product={product} priority={priority} />
      </Link>

      <div className="mt-4 flex flex-col gap-2 text-center">
        <Link href={`/aesthetics/product/${product.slug}`}>
          <h3 className="text-sm font-bold text-[var(--aes-ink)] transition group-hover:text-[var(--aes-pink)]">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold text-[var(--aes-ink)]">₹{product.price.toLocaleString("en-IN")}</span>
          {quickAdd ? (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="aes-joy-quickadd max-w-[200px]"
            >
              <Plus className="h-3 w-3" />
              Quick add
            </button>
          ) : (
            <Link
              href={`/aesthetics/product/${product.slug}`}
              className="text-[10px] font-bold uppercase tracking-wider text-[var(--aes-pink)] hover:underline"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
