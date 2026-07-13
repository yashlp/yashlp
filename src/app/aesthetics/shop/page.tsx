"use client";

import Link from "next/link";
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
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
        <div className="py-10 text-center">
          <h1 className="aes-joy-title-lower text-[var(--aes-ink)]">shop the entire collection</h1>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={cn(
                "rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                category === id
                  ? "bg-[var(--aes-ink)] text-white"
                  : "border border-[var(--aes-ink)] text-[var(--aes-ink)] hover:bg-[var(--aes-ink)] hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aes-skeleton aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="py-20 text-center text-[var(--aes-charcoal-muted)]">
            No products available right now. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {sorted.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} index={i} quickAdd variant="grid" />
            ))}
          </div>
        )}

        <section className="mt-20 text-center">
          <h2 className="aes-section-title text-[var(--aes-ink)]">Bundle &amp; SAVE</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-[var(--aes-ink-muted)]">
            Why pick one? Build your cart with a little something for every feeling.
          </p>
          <Link href="/aesthetics/cart" className="aes-btn aes-btn-primary mt-8 inline-flex px-10 py-4">
            View cart
          </Link>
        </section>
      </main>
      <ConsumerFooter />
    </>
  );
}
