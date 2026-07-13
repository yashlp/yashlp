"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/aesthetics/types";
import {
  createPreferenceState,
  recordInteraction,
  type PreferenceState,
} from "@/lib/aesthetics/preferences";

type CartContextValue = {
  cart: Product[];
  wishlist: Product[];
  prefs: PreferenceState;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  recordPass: (product: Product) => void;
  recordView: (product: Product, seconds: number) => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [prefs, setPrefs] = useState<PreferenceState>(createPreferenceState);

  const addToCart = useCallback((product: Product) => {
    setCart((c) => (c.some((p) => p.id === product.id) ? c : [...c, product]));
    setPrefs((p) => recordInteraction(p, product, "cart"));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((c) => c.filter((p) => p.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((w) => {
      const exists = w.some((p) => p.id === product.id);
      if (exists) return w.filter((p) => p.id !== product.id);
      setPrefs((p) => recordInteraction(p, product, "wishlist"));
      return [...w, product];
    });
  }, []);

  const recordPass = useCallback((product: Product) => {
    setPrefs((p) => recordInteraction(p, product, "pass"));
  }, []);

  const recordView = useCallback((product: Product, seconds: number) => {
    setPrefs((p) => recordInteraction(p, product, "view", seconds));
  }, []);

  const cartTotal = useMemo(() => cart.reduce((s, p) => s + p.price, 0), [cart]);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      prefs,
      addToCart,
      removeFromCart,
      clearCart,
      toggleWishlist,
      recordPass,
      recordView,
      cartTotal,
      cartCount: cart.length,
    }),
    [cart, wishlist, prefs, addToCart, removeFromCart, clearCart, toggleWishlist, recordPass, recordView, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
