"use client";

import { useRef } from "react";
import { Bookmark, ShoppingBag } from "lucide-react";
import { Button } from "@/components/aesthetics/ui/button";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { useWishlistAuth } from "@/components/aesthetics/shop/use-wishlist-auth";
import { useAddToBagFly } from "@/components/aesthetics/motion/add-to-bag-fly";
import { useNoticeOptional } from "@/components/aesthetics/motion/notice-provider";
import { AES_LUXURY } from "@/lib/aesthetics/motion";
import type { Product } from "@/lib/aesthetics/types";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const { handleWishlist, isWishlisted, authModal } = useWishlistAuth();
  const { flyToBag } = useAddToBagFly();
  const notice = useNoticeOptional();
  const btnRef = useRef<HTMLButtonElement>(null);
  const inCart = cart.some((p) => p.id === product.id);
  const wishlisted = isWishlisted(product.id);

  function onAdd() {
    if (inCart) return;
    addToCart(product);
    flyToBag(product.images[0], btnRef.current);
    notice?.pushNotice("Added to Shopping Bag", "bag");
  }

  function onWishlist() {
    const saved = handleWishlist(product);
    if (saved) notice?.pushNotice("Saved to Wishlist", "wishlist");
  }

  return (
    <>
      <div className="mt-8 flex gap-3">
        <Button ref={btnRef} className="flex-1 gap-2" onClick={onAdd} disabled={inCart}>
          <ShoppingBag className="h-4 w-4" />
          {inCart ? "In bag" : "Add to bag"}
        </Button>
        <Button
          variant="secondary"
          className="px-4"
          onClick={onWishlist}
          aria-label={wishlisted ? "Remove from favourites" : "Save to favourites"}
        >
          <Bookmark
            className={cn("h-5 w-5")}
            style={wishlisted ? { color: AES_LUXURY, fill: AES_LUXURY } : undefined}
          />
        </Button>
      </div>
      {authModal}
    </>
  );
}
