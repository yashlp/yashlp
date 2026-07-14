"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { ProductSearchBar } from "@/components/aesthetics/shop/product-search-bar";
import { useLiveProductSearch } from "@/components/aesthetics/shop/use-live-product-search";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { EmptyState, EMPTY_COPY } from "@/components/aesthetics/motion";
import { scoreProduct } from "@/lib/aesthetics/preferences";
import { FILTER_MOODS, FILTER_STYLES, SHOP_BY_ROOMS } from "@/lib/aesthetics/shop-constants";
import type { Product, ProductCategory } from "@/lib/aesthetics/types";
import { cn } from "@/lib/utils";

type CategoryOption = { id: ProductCategory | "all"; label: string };

type Facets = {
  minPrice: string;
  maxPrice: string;
  brand: string;
  color: string;
  material: string;
  room: string;
  style: string;
  mood: string;
  minRating: string;
  availability: string;
};

const EMPTY_FACETS: Facets = {
  minPrice: "",
  maxPrice: "",
  brand: "",
  color: "",
  material: "",
  room: "",
  style: "",
  mood: "",
  minRating: "",
  availability: "",
};

export function ShopClient() {
  const searchParams = useSearchParams();
  const { prefs, cartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([{ id: "all", label: "All" }]);
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [facets, setFacets] = useState<Facets>(() => ({
    ...EMPTY_FACETS,
    room: searchParams.get("room") || "",
  }));
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { results: searchResults, loading: searchLoading, active: isSearching } = useLiveProductSearch(searchQuery);

  useEffect(() => {
    const room = searchParams.get("room");
    if (room) setFacets((f) => ({ ...f, room }));
  }, [searchParams]);

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
    Object.entries(facets).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    fetch(`/api/commerce/products?${params}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, facets, isSearching]);

  const sorted = useMemo(() => {
    if (prefs.totalInteractions === 0) return products;
    return [...products].sort((a, b) => scoreProduct(b, prefs) - scoreProduct(a, prefs));
  }, [products, prefs]);

  const displayProducts = isSearching ? searchResults : sorted;
  const showLoading = isSearching ? searchLoading : loading;

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand?.slug) set.add(p.brand.slug);
    });
    return [...set];
  }, [products]);

  return (
    <ConsumerPage cartCount={cartCount} room="ivory">
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6">
        <div className="max-w-2xl">
          <p className="aes-gallery-eyebrow">The shop</p>
          <h1 className="aes-gallery-title mt-3">Shop the entire collection</h1>
          <p className="aes-gallery-lead mt-4">
            Premium objects with generous space to breathe — browse by mood, room, or search for a feeling.
          </p>
          <div className="mt-8">
            <ProductSearchBar value={searchQuery} onChange={setSearchQuery} id="shop-search" />
          </div>
          {isSearching && (
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--gallery-muted,#6f6a63)]">
              {searchLoading
                ? "Searching…"
                : `${displayProducts.length} matching product${displayProducts.length === 1 ? "" : "s"}`}
            </p>
          )}
        </div>

        {!isSearching && (
          <>
            <div className="mb-6 mt-10 flex flex-wrap gap-2">
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

            <details className="mb-10 rounded-2xl border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] p-4 open:pb-5">
              <summary className="cursor-pointer text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-ink,#1e1e1c)]">
                Better filters — price, brand, room, style & more
              </summary>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <input
                  className="aes-input"
                  type="number"
                  placeholder="Min price"
                  value={facets.minPrice}
                  onChange={(e) => setFacets({ ...facets, minPrice: e.target.value })}
                />
                <input
                  className="aes-input"
                  type="number"
                  placeholder="Max price"
                  value={facets.maxPrice}
                  onChange={(e) => setFacets({ ...facets, maxPrice: e.target.value })}
                />
                <input
                  className="aes-input"
                  placeholder="Brand"
                  value={facets.brand}
                  onChange={(e) => setFacets({ ...facets, brand: e.target.value })}
                  list="shop-brands"
                />
                <datalist id="shop-brands">
                  {brands.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
                <input
                  className="aes-input"
                  placeholder="Color"
                  value={facets.color}
                  onChange={(e) => setFacets({ ...facets, color: e.target.value })}
                />
                <input
                  className="aes-input"
                  placeholder="Material"
                  value={facets.material}
                  onChange={(e) => setFacets({ ...facets, material: e.target.value })}
                />
                <select
                  className="aes-input"
                  value={facets.room}
                  onChange={(e) => setFacets({ ...facets, room: e.target.value })}
                >
                  <option value="">Room</option>
                  {SHOP_BY_ROOMS.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <select
                  className="aes-input"
                  value={facets.style}
                  onChange={(e) => setFacets({ ...facets, style: e.target.value })}
                >
                  <option value="">Style</option>
                  {FILTER_STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  className="aes-input"
                  value={facets.mood}
                  onChange={(e) => setFacets({ ...facets, mood: e.target.value })}
                >
                  <option value="">Mood</option>
                  {FILTER_MOODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  className="aes-input"
                  value={facets.minRating}
                  onChange={(e) => setFacets({ ...facets, minRating: e.target.value })}
                >
                  <option value="">Rating</option>
                  <option value="4">4★ & up</option>
                  <option value="3">3★ & up</option>
                </select>
                <select
                  className="aes-input"
                  value={facets.availability}
                  onChange={(e) => setFacets({ ...facets, availability: e.target.value })}
                >
                  <option value="">Availability</option>
                  <option value="in_stock">In stock</option>
                </select>
                <button
                  type="button"
                  className="text-left text-xs font-bold uppercase tracking-[0.14em] text-[var(--gallery-blue,#2c5aa0)]"
                  onClick={() => setFacets(EMPTY_FACETS)}
                >
                  Clear filters
                </button>
              </div>
            </details>
          </>
        )}

        {showLoading ? (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aes-skeleton aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <EmptyState
            {...(isSearching ? EMPTY_COPY.search : EMPTY_COPY.products)}
            actionHref="/aesthetics/collections"
            actionLabel="Browse collections"
          />
        ) : (
          <div
            className={`${isSearching ? "mt-10" : ""} grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4`}
          >
            {displayProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} index={i} quickAdd variant="grid" />
            ))}
          </div>
        )}
      </main>
    </ConsumerPage>
  );
}
