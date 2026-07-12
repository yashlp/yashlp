"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ShoppingBag, Sparkles } from "lucide-react";
import { ReelCard } from "./reel-card";
import { FilterBar } from "./filter-bar";
import { CartSheet } from "./cart-sheet";
import { ShopGrid } from "./shop-grid";
import {
  AESTHETIC_PRODUCTS,
  type AestheticProduct,
  type ProductCategory,
} from "@/lib/aesthetic-demo/products";
import {
  createPreferenceState,
  getMatchPercent,
  getTopVibes,
  rankProducts,
  recordSwipe,
  type PreferenceState,
} from "@/lib/aesthetic-demo/preferences";

export type ViewMode = "reel" | "shop";

type Toast = { id: number; message: string; type: "like" | "pass" };

export function AestheticApp() {
  const [view, setView] = useState<ViewMode>("reel");
  const [prefs, setPrefs] = useState<PreferenceState>(createPreferenceState);
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [cart, setCart] = useState<AestheticProduct[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const toastId = useRef(0);

  const feed = useMemo(
    () => rankProducts(AESTHETIC_PRODUCTS, prefs, category),
    [prefs, category]
  );

  const shopProducts = useMemo(() => {
    const pool =
      category === "all"
        ? AESTHETIC_PRODUCTS
        : AESTHETIC_PRODUCTS.filter((p) => p.category === category);
    return [...pool].sort(
      (a, b) =>
        (prefs.likedIds.includes(b.id) ? 1 : 0) - (prefs.likedIds.includes(a.id) ? 1 : 0) ||
        feed.findIndex((p) => p.id === a.id) - feed.findIndex((p) => p.id === b.id)
    );
  }, [category, feed, prefs.likedIds]);

  const cartIds = useMemo(() => new Set(cart.map((p) => p.id)), [cart]);
  const topVibes = useMemo(() => getTopVibes(prefs), [prefs]);
  const matchPercent = useMemo(() => getMatchPercent(prefs), [prefs]);

  const showToast = useCallback((message: string, type: "like" | "pass") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1800);
  }, []);

  const handleLike = useCallback(
    (product: AestheticProduct) => {
      setPrefs((p) => recordSwipe(p, product, "like"));
      if (!cartIds.has(product.id)) {
        setCart((c) => [...c, product]);
      }
      showToast(`${product.name} added`, "like");
    },
    [cartIds, showToast]
  );

  const handlePass = useCallback(
    (product: AestheticProduct) => {
      setPrefs((p) => recordSwipe(p, product, "pass"));
      showToast("Not your vibe — noted", "pass");
    },
    [showToast]
  );

  const handleCategoryChange = useCallback((id: ProductCategory | "all") => {
    setCategory(id);
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || view !== "reel") return;

    const onScroll = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      setActiveIndex(idx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [view]);

  useEffect(() => {
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [category, view]);

  const cartTotal = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#fffef7]">
      <div
        className="aesthetic-blob pointer-events-none absolute -left-20 top-32 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #7eb8da 0%, transparent 70%)" }}
      />
      <div
        className="aesthetic-blob-delay pointer-events-none absolute -right-16 bottom-40 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #1b3a6b 0%, transparent 70%)" }}
      />

      <FilterBar
        active={category}
        onChange={handleCategoryChange}
        matchPercent={matchPercent}
        topVibes={topVibes}
        view={view}
        onViewChange={setView}
      />

      {/* Cart */}
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="absolute right-4 top-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#1b3a6b]/10 bg-[#fffef7]/90 shadow-lg backdrop-blur-md transition active:scale-95"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-5 w-5 text-[#1b3a6b]" />
        {cart.length > 0 && (
          <span className="aesthetic-mono absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1b3a6b] px-1 text-[10px] text-[#fffef7]">
            {cart.length}
          </span>
        )}
      </button>

      {/* Content */}
      {view === "reel" ? (
        <div
          ref={scrollRef}
          className="aesthetic-reel-scroll h-full overflow-y-auto pt-[max(9.5rem,calc(env(safe-area-inset-top)+8.5rem))]"
        >
          {feed.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <Sparkles className="mb-4 h-10 w-10 text-[#4a7cbb]" />
              <h2 className="text-2xl font-semibold italic text-[#1b3a6b]">You&apos;ve seen it all</h2>
              <p className="aesthetic-mono mt-2 text-xs text-[#4a7cbb]/70">
                Algorithm learned {topVibes.join(", ") || "your taste"}. Check your cart or switch to shop view.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setView("shop")}
                  className="aesthetic-mono rounded-full border border-[#1b3a6b]/15 px-6 py-3 text-xs uppercase tracking-wider text-[#1b3a6b]"
                >
                  Browse shop
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrefs(createPreferenceState());
                    setCategory("all");
                  }}
                  className="aesthetic-mono rounded-full bg-[#1b3a6b] px-6 py-3 text-xs uppercase tracking-wider text-[#fffef7]"
                >
                  Reset feed
                </button>
              </div>
            </div>
          ) : (
            feed.map((product, i) => (
              <ReelCard
                key={product.id}
                product={product}
                isActive={i === activeIndex}
                onSwipe={(action) =>
                  action === "like" ? handleLike(product) : handlePass(product)
                }
              />
            ))
          )}
        </div>
      ) : (
        <div className="h-full overflow-y-auto pt-[max(9.5rem,calc(env(safe-area-inset-top)+8.5rem))]">
          <ShopGrid
            products={shopProducts}
            cartIds={cartIds}
            onAdd={handleLike}
            onPass={handlePass}
            topVibes={topVibes}
          />
        </div>
      )}

      {/* View hint when in shop mode first time - subtle footer pill */}
      {view === "shop" && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <p className="aesthetic-mono rounded-full border border-[#1b3a6b]/8 bg-[#fffef7]/80 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#4a7cbb]/60 backdrop-blur-sm">
            classic browse mode
          </p>
        </div>
      )}

      {/* Toasts */}
      <div className="pointer-events-none absolute bottom-24 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="aesthetic-toast aesthetic-mono rounded-full border border-[#1b3a6b]/10 bg-[#fffef7]/95 px-5 py-2.5 text-xs uppercase tracking-wider shadow-xl backdrop-blur-md"
            style={{ color: t.type === "like" ? "#1b3a6b" : "#8a7355" }}
          >
            {t.message}
          </div>
        ))}
      </div>

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        total={cartTotal}
        onRemove={(id) => setCart((c) => c.filter((p) => p.id !== id))}
      />
    </div>
  );
}
