"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/aesthetics/ui/badge";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import type { Product } from "@/lib/aesthetics/types";

const CARD_BG = [
  "bg-gradient-to-br from-pink-100 to-rose-50",
  "bg-gradient-to-br from-orange-100 to-amber-50",
  "bg-gradient-to-br from-violet-100 to-purple-50",
  "bg-gradient-to-br from-teal-100 to-cyan-50",
  "bg-gradient-to-br from-yellow-100 to-amber-50",
];

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  index?: number;
  quickAdd?: boolean;
};

export function ProductCard({ product, priority, index = 0, quickAdd = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const bg = CARD_BG[index % CARD_BG.length];

  return (
    <article className="group flex flex-col">
      <Link href={`/aesthetics/product/${product.slug}`} className="block">
        <div className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${bg}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover p-6 transition duration-500 group-hover:scale-105"
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

      <div className="mt-4 flex flex-col gap-2">
        <Link href={`/aesthetics/product/${product.slug}`}>
          <h3 className="text-base font-bold text-[var(--aes-ink)] transition group-hover:text-[var(--aes-pink)]">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-[var(--aes-ink)]">${product.price}</span>
          {quickAdd ? (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="flex items-center gap-1 rounded-full bg-[var(--aes-ink)] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[var(--aes-pink)]"
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
