"use client";

import { useState } from "react";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { AuthModal } from "@/components/aesthetics/auth/auth-modal";
import type { Product } from "@/lib/aesthetics/types";

export function useWishlistAuth(redirectTo = "/aesthetics/wishlist") {
  const { customer, loading } = useCustomer();
  const { toggleWishlist, isWishlisted } = useCart();
  const [authOpen, setAuthOpen] = useState(false);

  function handleWishlist(product: Product) {
    if (loading) return;
    if (!customer) {
      setAuthOpen(true);
      return;
    }
    toggleWishlist(product);
  }

  const authModal = (
    <AuthModal
      open={authOpen}
      onClose={() => setAuthOpen(false)}
      title="Sign in to save favourites"
      subtitle="Create an account or sign in to add items to your wishlist."
      redirectTo={redirectTo}
    />
  );

  return { handleWishlist, isWishlisted, authModal, customer };
}
