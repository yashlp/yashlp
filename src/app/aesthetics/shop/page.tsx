"use client";

import { useEffect, useMemo, useState } from "react";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { scoreProduct } from "@/lib/aesthetics/preferences";
import type { Product, ProductCategory } from "@/lib/aesthetics/types";
import { cn } from "@/lib/utils";

type CategoryOption = { id: ProductCategory | "all"; label: string };

export default function ShopPage() {
  const { prefs, cartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([{ id: "all", label: "All" }]);
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/commerce/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.categories?.length) {
          setCategories([
            { id: "all", label: "All" },
            ...d.categories.map((c: { slug: string; name: string }) => ({
              id: c.slug as ProductCategory,
              label: c.name,
            })),
          ]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    fetch(`/api/commerce/products?${params}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category]);

  const sorted = useMemo(() => {
    if (prefs.totalInteractions === 0) return products;
    return [...products].sort((a, b) => scoreProduct(b, prefs) - scoreProduct(a, prefs));
  }, [products, prefs]);

  return (
    <>
      <ConsumerNav cartCount={cartCount} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--aes-border)] bg-gradient-to-br from-blue-50 via-white to-rose-50 p-8 sm:p-12">
          <div className="relative z-10">
            <p className="aes-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--aes-coral)]">
              Classic shopping
            </p>
            <h1 className="aes-display mt-3 text-4xl font-extrabold tracking-tight text-[var(--aes-ink)] sm:text-5xl">
              The shop
            </h1>
            <p className="aes-serif mt-3 max-w-lg text-lg italic text-[var(--aes-ink-muted)]">
              Browse our full catalogue of curated art, design, and objects.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-violet-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-rose-200/50 blur-3xl" />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
                category === id
                  ? "bg-[var(--aes-ink)] text-white shadow-lg"
                  : "border border-[var(--aes-border)] bg-white text-[var(--aes-ink-muted)] hover:border-violet-300 hover:text-[var(--aes-ink)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aes-skeleton aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="py-20 text-center text-[var(--aes-charcoal-muted)]">
            No products yet. Add catalog items from the{" "}
            <a href="/platform-admin/login" className="text-[var(--aes-royal)] underline">
              admin panel
            </a>
            .
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {sorted.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} index={i} />
            ))}
          </div>
        )}
      </main>
      <ConsumerFooter />
    </>
  );
}
