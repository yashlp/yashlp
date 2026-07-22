"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/aesthetics/types";
import {
  createPreferenceState,
  recordInteraction,
  type PreferenceState,
} from "@/lib/aesthetics/preferences";

export type CartItem = Product & { quantity: number };

type CartContextValue = {
  cart: CartItem[];
  wishlist: Product[];
  prefs: PreferenceState;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => boolean;
  isWishlisted: (id: string) => boolean;
  recordPass: (product: Product) => void;
  recordView: (product: Product, seconds: number) => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [prefs, setPrefs] = useState<PreferenceState>(createPreferenceState);

  const addToCart = useCallback((product: Product) => {
    setCart((c) => {
      const existing = c.find((p) => p.id === product.id);
      if (existing) {
        return c.map((p) =>
          p.id === product.id ? { ...p, ...product, quantity: p.quantity + 1 } : p
        );
      }
      return [...c, { ...product, quantity: 1 }];
    });
    setPrefs((p) => recordInteraction(p, product, "cart"));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((c) => c.filter((p) => p.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((c) => {
      if (quantity <= 0) return c.filter((p) => p.id !== id);
      return c.map((p) => (p.id === id ? { ...p, quantity } : p));
    });
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

  const cartTotal = useMemo(
    () => cart.reduce((s, p) => s + p.price * p.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(() => cart.reduce((s, p) => s + p.quantity, 0), [cart]);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      prefs,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      recordPass,
      recordView,
      cartTotal,
      cartCount,
    }),
    [
      cart,
      wishlist,
      prefs,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      recordPass,
      recordView,
      cartTotal,
      cartCount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
