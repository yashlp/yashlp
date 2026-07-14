"use client";

import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { Badge } from "@/components/aesthetics/ui/badge";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { useWishlistAuth } from "@/components/aesthetics/shop/use-wishlist-auth";
import { formatInr } from "@/lib/aesthetics/format-inr";
import type { Product } from "@/lib/aesthetics/types";
import { cn } from "@/lib/utils";

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
  onWishlist,
  wishlisted,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
  onWishlist: () => void;
  wishlisted: boolean;
}) {
  return (
    <div className={`group/img relative overflow-hidden rounded-2xl ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-full w-full object-cover transition duration-500 group-hover/img:scale-[1.03]"
        loading={priority ? "eager" : "lazy"}
        draggable={false}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onWishlist();
        }}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--aes-ink)] shadow-sm transition hover:scale-105 hover:bg-white"
        aria-label={wishlisted ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart className={cn("h-4 w-4", wishlisted && "fill-[var(--aes-pink)] text-[var(--aes-pink)]")} />
      </button>
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
  const { handleWishlist, isWishlisted, authModal } = useWishlistAuth();
  const wishlisted = isWishlisted(product.id);

  function onAddToCart() {
    addToCart(product);
  }

  if (variant === "joy") {
    return (
      <>
        <article className="group w-[200px] sm:w-[220px]">
          <Link href={`/aesthetics/product/${product.slug}`} className="block">
            <ProductImage
              product={product}
              priority={priority}
              onWishlist={() => handleWishlist(product)}
              wishlisted={wishlisted}
            />
          </Link>

          <div className="mt-4 text-center">
            <Link href={`/aesthetics/product/${product.slug}`}>
              <h3 className="text-sm font-bold text-[var(--aes-ink)] transition group-hover:text-[var(--aes-pink)]">
                {product.name}
              </h3>
            </Link>
            {quickAdd && (
              <button type="button" onClick={onAddToCart} className="aes-joy-quickadd mt-3">
                <Plus className="h-3 w-3" />
                Quick add
              </button>
            )}
          </div>
        </article>
        {authModal}
      </>
    );
  }

  return (
    <>
      <article className="aes-gallery-product-card group">
        <Link href={`/aesthetics/product/${product.slug}`} className="block">
          <ProductImage
            product={product}
            priority={priority}
            className="aspect-[4/5] rounded-none"
            onWishlist={() => handleWishlist(product)}
            wishlisted={wishlisted}
          />
        </Link>

        <div className="flex flex-col gap-2 px-4 py-4 text-center">
          <Link href={`/aesthetics/product/${product.slug}`}>
            <h3 className="text-sm font-medium tracking-wide text-[var(--aes-ink)] transition group-hover:text-[var(--aes-pink)]">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-[var(--aes-ink)]">{formatInr(product.price)}</span>
            {quickAdd ? (
              <button type="button" onClick={onAddToCart} className="aes-joy-quickadd max-w-[200px]">
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
      {authModal}
    </>
  );
}
