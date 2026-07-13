"use client";

import { useMemo, useState } from "react";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { FILTER_OPTIONS, PRODUCTS } from "@/lib/aesthetics/products";
import { scoreProduct } from "@/lib/aesthetics/preferences";
import type { Product } from "@/lib/aesthetics/types";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const { prefs, cartCount } = useCart();
  const [category, setCategory] = useState<Product["category"] | "all">("all");

  const products = useMemo(() => {
    const base =
      category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
    if (prefs.totalInteractions > 0) {
      return [...base].sort((a, b) => scoreProduct(b, prefs) - scoreProduct(a, prefs));
    }
    return base;
  }, [category, prefs]);

  return (
    <>
      <ConsumerNav cartCount={cartCount} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <p className="aes-mono text-[10px] uppercase tracking-[0.3em] text-[var(--aes-dusty)]">
            Classic shopping
          </p>
          <h1 className="aes-display mt-2 text-4xl font-semibold italic text-[var(--aes-charcoal)]">
            Shop
          </h1>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={cn(
                "aes-mono rounded-full px-4 py-2 text-[11px] uppercase tracking-wider transition",
                category === id
                  ? "bg-[var(--aes-royal)] text-white"
                  : "border border-[var(--aes-border)] text-[var(--aes-charcoal-muted)] hover:border-[var(--aes-royal)]/20"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      </main>
      <ConsumerFooter />
    </>
  );
}
