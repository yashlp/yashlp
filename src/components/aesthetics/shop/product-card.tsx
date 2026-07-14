"use client";

import { useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Badge } from "@/components/aesthetics/ui/badge";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { useWishlistAuth } from "@/components/aesthetics/shop/use-wishlist-auth";
import { useAddToBagFly } from "@/components/aesthetics/motion/add-to-bag-fly";
import { useNoticeOptional } from "@/components/aesthetics/motion/notice-provider";
import {
  AES_LUXURY,
  bookmarkRibbon,
  cardHover,
  productLift,
  quickAddReveal,
} from "@/lib/aesthetics/motion";
import { formatInr } from "@/lib/aesthetics/format-inr";
import type { Product } from "@/lib/aesthetics/types";
import { cn } from "@/lib/utils";
import { useAesReducedMotion } from "@/components/aesthetics/motion/use-reduced-motion";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  index?: number;
  quickAdd?: boolean;
  variant?: "joy" | "grid";
};

function WishlistRibbon({
  wishlisted,
  onToggle,
}: {
  wishlisted: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className="absolute right-3 top-0 z-10 flex h-11 w-9 items-start justify-center"
      aria-label={wishlisted ? "Remove from favourites" : "Save to favourites"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {wishlisted ? (
          <motion.span
            key="on"
            variants={bookmarkRibbon}
            initial="initial"
            animate="animate"
            exit="exit"
            className="aes-wishlist-ribbon"
            style={{ background: AES_LUXURY }}
          />
        ) : (
          <motion.span
            key="off"
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            className="aes-wishlist-ribbon aes-wishlist-ribbon--idle"
          />
        )}
      </AnimatePresence>
    </button>
  );
}

function ProductImage({
  product,
  priority,
  className = "aspect-[4/5]",
  onWishlist,
  wishlisted,
  dimOnHover,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
  onWishlist: () => void;
  wishlisted: boolean;
  dimOnHover?: boolean;
}) {
  const reduced = useAesReducedMotion();

  return (
    <div
      className={cn(
        "group/img relative overflow-hidden rounded-2xl",
        dimOnHover && "aes-gallery-spotlight",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={product.images[0]}
        alt={product.name}
        className="h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        draggable={false}
        variants={reduced ? undefined : productLift}
      />
      <WishlistRibbon wishlisted={wishlisted} onToggle={onWishlist} />
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
  const { flyToBag } = useAddToBagFly();
  const notice = useNoticeOptional();
  const cardRef = useRef<HTMLElement>(null);
  const reduced = useAesReducedMotion();
  const wishlisted = isWishlisted(product.id);

  function onAddToCart(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    const from =
      (e?.currentTarget as HTMLElement | undefined) ??
      (cardRef.current?.querySelector("img") as HTMLElement | null);
    addToCart(product);
    flyToBag(product.images[0], from);
    notice?.pushNotice("Added to Shopping Bag", "bag");
  }

  function onWishlist() {
    const saved = handleWishlist(product);
    if (saved) notice?.pushNotice("Saved to Wishlist", "wishlist");
  }

  if (variant === "joy") {
    return (
      <>
        <motion.article
          ref={cardRef as React.RefObject<HTMLElement>}
          className="group w-[200px] sm:w-[220px]"
          initial="rest"
          whileHover={reduced ? undefined : "hover"}
          animate="rest"
        >
          <Link href={`/aesthetics/product/${product.slug}`} className="block">
            <ProductImage
              product={product}
              priority={priority}
              onWishlist={onWishlist}
              wishlisted={wishlisted}
              dimOnHover
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
        </motion.article>
        {authModal}
      </>
    );
  }

  return (
    <>
      <motion.article
        ref={cardRef as React.RefObject<HTMLElement>}
        className="aes-gallery-product-card group"
        variants={reduced ? undefined : cardHover}
        initial="rest"
        whileHover={reduced ? undefined : "hover"}
        animate="rest"
      >
        <Link href={`/aesthetics/product/${product.slug}`} className="block">
          <ProductImage
            product={product}
            priority={priority}
            className="aspect-[4/5] rounded-none"
            onWishlist={onWishlist}
            wishlisted={wishlisted}
            dimOnHover
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
              <motion.button
                type="button"
                onClick={onAddToCart}
                className="aes-joy-quickadd max-w-[200px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                variants={reduced ? undefined : quickAddReveal}
              >
                <Plus className="h-3 w-3" />
                Quick add
              </motion.button>
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
      </motion.article>
      {authModal}
    </>
  );
}
