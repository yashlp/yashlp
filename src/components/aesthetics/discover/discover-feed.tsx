"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, ShoppingBag, Sparkles } from "lucide-react";
import { DiscoverCard } from "./discover-card";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { PRODUCTS, FILTER_OPTIONS } from "@/lib/aesthetics/products";
import { getAestheticProfile, rankProducts } from "@/lib/aesthetics/preferences";
import type { Product } from "@/lib/aesthetics/types";
import { cn } from "@/lib/utils";

export function DiscoverFeed() {
  const { prefs, cartCount } = useCart();
  const [category, setCategory] = useState<Product["category"] | "all">("all");
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const feed = useMemo(
    () => rankProducts(PRODUCTS, prefs, category === "all" ? undefined : category),
    [prefs, category]
  );

  const { topTags, matchPercent } = getAestheticProfile(prefs);

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, feed.length - 1));
    el.scrollTo({ top: clamped * el.clientHeight, behavior: "smooth" });
    setIndex(clamped);
  }, [feed.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollTop / el.clientHeight));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIndex(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [category]);

  return (
    <div className="relative h-dvh overflow-hidden bg-[var(--aes-ivory)]">
      {/* Header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 pt-[max(0.75rem,var(--aes-safe-top))]">
        <div className="pointer-events-auto flex items-center justify-between px-4">
          <Link href="/aesthetics" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md">
            <ArrowLeft className="h-5 w-5 text-[var(--aes-charcoal)]" />
          </Link>
          <div className="text-center">
            <p className="aes-display text-lg font-semibold italic text-[var(--aes-charcoal)]">Discover</p>
            {matchPercent > 0 && (
              <p className="aes-mono text-[9px] uppercase tracking-wider text-[var(--aes-dusty)]">
                {matchPercent}% match · {topTags.join(" · ")}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Link href="/aesthetics/shop" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md" aria-label="Shop view">
              <LayoutGrid className="h-5 w-5 text-[var(--aes-charcoal)]" />
            </Link>
            <Link href="/aesthetics/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md">
              <ShoppingBag className="h-5 w-5 text-[var(--aes-charcoal)]" />
              {cartCount > 0 && (
                <span className="aes-mono absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--aes-royal)] text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="pointer-events-auto mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTER_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={cn(
                "aes-mono shrink-0 rounded-full px-4 py-2 text-[10px] uppercase tracking-wider transition",
                category === id
                  ? "bg-[var(--aes-royal)] text-white shadow-md"
                  : "border border-[var(--aes-border)] bg-white/80 text-[var(--aes-charcoal-muted)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="aes-discover-scroll h-full overflow-y-auto pt-[max(7.5rem,calc(var(--aes-safe-top)+6.5rem))]"
      >
        {feed.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <Sparkles className="mb-4 h-10 w-10 text-[var(--aes-royal)]" />
            <h2 className="aes-display text-2xl font-semibold italic">Your feed is complete</h2>
            <p className="mt-2 text-sm text-[var(--aes-charcoal-muted)]">
              We learned your aesthetic. Browse the shop for more.
            </p>
            <Link href="/aesthetics/shop" className="aes-btn aes-btn-primary mt-6 px-6 py-3 text-sm">
              Browse shop
            </Link>
          </div>
        ) : (
          feed.map((product, i) => (
            <DiscoverCard
              key={product.id}
              product={product}
              isActive={i === index}
              onNext={() => scrollToIndex(i + 1)}
              onPrev={() => scrollToIndex(i - 1)}
            />
          ))
        )}
      </div>
    </div>
  );
}
