"use client";

import { useEffect, useMemo, useState } from "react";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { ProductSearchBar } from "@/components/aesthetics/shop/product-search-bar";
import { useLiveProductSearch } from "@/components/aesthetics/shop/use-live-product-search";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { EmptyState, EMPTY_COPY } from "@/components/aesthetics/motion";
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
  const [searchQuery, setSearchQuery] = useState("");
  const { results: searchResults, loading: searchLoading, active: isSearching } = useLiveProductSearch(searchQuery);

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
    if (isSearching) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    fetch(`/api/commerce/products?${params}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, isSearching]);

  const sorted = useMemo(() => {
    if (prefs.totalInteractions === 0) return products;
    return [...products].sort((a, b) => scoreProduct(b, prefs) - scoreProduct(a, prefs));
  }, [products, prefs]);

  const displayProducts = isSearching ? searchResults : sorted;
  const showLoading = isSearching ? searchLoading : loading;

  return (
    <ConsumerPage cartCount={cartCount} room="ivory">
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6">
        <div className="max-w-2xl">
          <p className="aes-gallery-eyebrow">The shop</p>
          <h1 className="aes-gallery-title mt-3">Shop the entire collection</h1>
          <p className="aes-gallery-lead mt-4">
            Premium objects with generous space to breathe — browse by mood, or search for a feeling.
          </p>
          <div className="mt-8">
            <ProductSearchBar value={searchQuery} onChange={setSearchQuery} id="shop-search" />
          </div>
          {isSearching && (
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--gallery-muted,#6f6a63)]">
              {searchLoading ? "Searching…" : `${displayProducts.length} matching product${displayProducts.length === 1 ? "" : "s"}`}
            </p>
          )}
        </div>

        {!isSearching && (
          <div className="mb-12 mt-10 flex flex-wrap gap-2">
            {categories.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300",
                  category === id
                    ? "bg-[var(--gallery-ink,#1e1e1c)] text-white"
                    : "border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] text-[var(--gallery-muted,#6f6a63)] hover:border-[var(--gallery-blue,#2c5aa0)] hover:text-[var(--gallery-blue,#2c5aa0)]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {showLoading ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aes-skeleton aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <EmptyState
            {...(isSearching ? EMPTY_COPY.search : EMPTY_COPY.products)}
            actionHref="/aesthetics/shop"
            actionLabel="Browse shop"
          />
        ) : (
          <div className={`${isSearching ? "mt-10" : ""} grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-4`}>
            {displayProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} index={i} quickAdd variant="grid" />
            ))}
          </div>
        )}
      </main>
    </ConsumerPage>
  );
}
