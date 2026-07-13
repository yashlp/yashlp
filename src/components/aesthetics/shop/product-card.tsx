"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/aesthetics/ui/badge";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import type { Product } from "@/lib/aesthetics/types";

const PEDESTAL_COLORS = [
  "var(--aes-pedestal-1)",
  "var(--aes-pedestal-2)",
  "var(--aes-pedestal-3)",
  "var(--aes-pedestal-4)",
  "var(--aes-pedestal-5)",
];

const CARD_BG = [
  "bg-[var(--aes-pedestal-1)]",
  "bg-[var(--aes-pedestal-2)]",
  "bg-[var(--aes-pedestal-3)]",
  "bg-[var(--aes-pedestal-4)]",
  "bg-[var(--aes-pedestal-5)]",
];

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  index?: number;
  quickAdd?: boolean;
  variant?: "joy" | "grid";
};

export function ProductCard({
  product,
  priority,
  index = 0,
  quickAdd = false,
  variant = "joy",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const pedestalColor = PEDESTAL_COLORS[index % PEDESTAL_COLORS.length];
  const bg = CARD_BG[index % CARD_BG.length];

  if (variant === "joy") {
    return (
      <article className="group w-[200px] sm:w-[220px]">
        <Link href={`/aesthetics/product/${product.slug}`} className="block">
          <div
            className="aes-joy-pedestal"
            style={{ background: pedestalColor }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]}
              alt={product.name}
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
        <div className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${bg}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            draggable={false}
          />
          {product.compareAtPrice && (
            <Badge variant="coral" className="absolute left-4 top-4">
              Sale
            </Badge>
          )}
          {product.newArrival && !product.compareAtPrice && (
            <Badge variant="sage" className="absolute left-4 top-4">
              New
            </Badge>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-2 text-center">
        <Link href={`/aesthetics/product/${product.slug}`}>
          <h3 className="text-sm font-bold text-[var(--aes-ink)] transition group-hover:text-[var(--aes-pink)]">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold text-[var(--aes-ink)]">${product.price}</span>
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
