"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/aesthetics/types";
import {
  createPreferenceState,
  recordInteraction,
  type PreferenceState,
} from "@/lib/aesthetics/preferences";
import { formatCartToast } from "@/components/aesthetics/shop/cart-added-toast";

type CartContextValue = {
  cart: Product[];
  wishlist: Product[];
  prefs: PreferenceState;
  cartToast: string | null;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => boolean;
  isWishlisted: (id: string) => boolean;
  recordPass: (product: Product) => void;
  recordView: (product: Product, seconds: number) => void;
  clearCartToast: () => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [prefs, setPrefs] = useState<PreferenceState>(createPreferenceState);
  const [cartToast, setCartToast] = useState<string | null>(null);

  const addToCart = useCallback((product: Product) => {
    setCart((c) => {
      if (c.some((p) => p.id === product.id)) return c;
      setCartToast(formatCartToast(product.name, product.price));
      return [...c, product];
    });
    setPrefs((p) => recordInteraction(p, product, "cart"));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((c) => c.filter((p) => p.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    let added = false;
    setWishlist((w) => {
      const exists = w.some((p) => p.id === product.id);
      if (exists) return w.filter((p) => p.id !== product.id);
      added = true;
      setPrefs((p) => recordInteraction(p, product, "wishlist"));
      return [...w, product];
    });
    return added;
  }, []);

  const isWishlisted = useCallback(
    (id: string) => wishlist.some((p) => p.id === id),
    [wishlist]
  );

  const recordPass = useCallback((product: Product) => {
    setPrefs((p) => recordInteraction(p, product, "pass"));
  }, []);

  const recordView = useCallback((product: Product, seconds: number) => {
    setPrefs((p) => recordInteraction(p, product, "view", seconds));
  }, []);

  const clearCartToast = useCallback(() => setCartToast(null), []);

  const cartTotal = useMemo(() => cart.reduce((s, p) => s + p.price, 0), [cart]);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      prefs,
      cartToast,
      addToCart,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      recordPass,
      recordView,
      clearCartToast,
      cartTotal,
      cartCount: cart.length,
    }),
    [
      cart,
      wishlist,
      prefs,
      cartToast,
      addToCart,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      recordPass,
      recordView,
      clearCartToast,
      cartTotal,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
