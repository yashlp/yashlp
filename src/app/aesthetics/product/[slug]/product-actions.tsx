"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/aesthetics/ui/button";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { useWishlistAuth } from "@/components/aesthetics/shop/use-wishlist-auth";
import type { Product } from "@/lib/aesthetics/types";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const { handleWishlist, isWishlisted, authModal } = useWishlistAuth();
  const inCart = cart.some((p) => p.id === product.id);
  const wishlisted = isWishlisted(product.id);

  return (
    <>
      <div className="mt-8 flex gap-3">
        <Button className="flex-1 gap-2" onClick={() => addToCart(product)} disabled={inCart}>
          <ShoppingBag className="h-4 w-4" />
          {inCart ? "In cart" : "Add to cart"}
        </Button>
        <Button
          variant="secondary"
          className="px-4"
          onClick={() => handleWishlist(product)}
          aria-label="Favourites"
        >
          <Heart className={cn("h-5 w-5", wishlisted && "fill-[var(--aes-pink)] text-[var(--aes-pink)]")} />
        </Button>
      </div>
      {authModal}
    </>
  );
}
