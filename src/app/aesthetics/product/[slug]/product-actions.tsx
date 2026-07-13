"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/aesthetics/ui/button";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import type { Product } from "@/lib/aesthetics/types";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, cart } = useCart();
  const inCart = cart.some((p) => p.id === product.id);

  return (
    <div className="mt-8 flex gap-3">
      <Button
        className="flex-1 gap-2"
        onClick={() => addToCart(product)}
        disabled={inCart}
      >
        <ShoppingBag className="h-4 w-4" />
        {inCart ? "In cart" : "Add to cart"}
      </Button>
      <Button variant="secondary" className="px-4" onClick={() => toggleWishlist(product)} aria-label="Wishlist">
        <Heart className="h-5 w-5" />
      </Button>
    </div>
  );
}
