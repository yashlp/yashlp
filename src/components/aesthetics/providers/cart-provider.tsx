"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "oa_cart_v1";
const WISHLIST_STORAGE_KEY = "oa_wishlist_v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota / private mode — ignore
  }
}

function sanitizeCart(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const row = item as CartItem;
      return (
        typeof row.id === "string" &&
        typeof row.name === "string" &&
        typeof row.price === "number" &&
        typeof row.quantity === "number" &&
        row.quantity > 0
      );
    })
    .map((item) => ({ ...item, quantity: Math.min(99, Math.max(1, Math.floor(item.quantity))) }));
}

function sanitizeWishlist(items: unknown): Product[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is Product => {
    if (!item || typeof item !== "object") return false;
    const row = item as Product;
    return typeof row.id === "string" && typeof row.name === "string" && typeof row.price === "number";
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [prefs, setPrefs] = useState<PreferenceState>(createPreferenceState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(sanitizeCart(readJson(CART_STORAGE_KEY, [])));
    setWishlist(sanitizeWishlist(readJson(WISHLIST_STORAGE_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeJson(CART_STORAGE_KEY, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson(WISHLIST_STORAGE_KEY, wishlist);
  }, [wishlist, hydrated]);

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
      hydrated,
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
      hydrated,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const EMPTY_CART: CartContextValue = {
  cart: [],
  wishlist: [],
  prefs: createPreferenceState(),
  addToCart: () => undefined,
  removeFromCart: () => undefined,
  updateQuantity: () => undefined,
  clearCart: () => undefined,
  toggleWishlist: () => false,
  isWishlisted: () => false,
  recordPass: () => undefined,
  recordView: () => undefined,
  cartTotal: 0,
  cartCount: 0,
  hydrated: true,
};

export function useCart() {
  const ctx = useContext(CartContext);
  // Soft fallback — never crash nav/footer if provider is missing
  return ctx ?? EMPTY_CART;
}
