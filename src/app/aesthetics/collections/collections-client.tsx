"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { CollectionCard } from "@/components/aesthetics/home/collection-card";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { ProductSearchBar } from "@/components/aesthetics/shop/product-search-bar";
import { useLiveProductSearch } from "@/components/aesthetics/shop/use-live-product-search";
import {
  MorningLight,
  SeasonalAccent,
  EmptyState,
  EMPTY_COPY,
} from "@/components/aesthetics/motion";
import type { Collection } from "@/lib/aesthetics/types";

type CategoryCard = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number;
};

type Props = {
  collections: Collection[];
};

export function CollectionsClient({ collections }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const { results: productResults, loading: searchLoading, active: isSearching } = useLiveProductSearch(searchQuery);

  useEffect(() => {
    fetch("/api/commerce/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const filteredCollections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return collections;
    return collections.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.description?.toLowerCase().includes(q) ?? false) ||
        c.slug.toLowerCase().includes(q)
    );
  }, [collections, searchQuery]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description?.toLowerCase().includes(q) ?? false)
    );
  }, [categories, searchQuery]);

  const visibleCollections = isSearching ? filteredCollections : collections;
  const visibleCategories = isSearching ? filteredCategories : categories;

  return (
    <ConsumerPage room="warm">
      <main className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <section className="relative rounded-[1.75rem] px-3 pb-2 pt-2 sm:px-4">
          <MorningLight />
          <SeasonalAccent />
          <p className="aes-gallery-eyebrow relative z-[1]">Shop by category</p>
          <h1 className="aes-gallery-title relative z-[1] mt-3">Browse categories</h1>
          <p className="aes-gallery-lead relative z-[1] mt-4">
            Pick a category to explore products — Home, Lighting, Wellness, and more.
          </p>
        </section>

        <div className="mt-10 flex justify-start">
          <ProductSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search categories & products…"
            id="collections-search"
          />
        </div>

        {isSearching && (
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--aes-ink-muted)]">
            {searchLoading
              ? "Searching…"
              : `${filteredCategories.length} categor${filteredCategories.length === 1 ? "y" : "ies"}, ${productResults.length} product${productResults.length === 1 ? "" : "s"}`}
          </p>
        )}

        {!isSearching && categories.length === 0 && collections.length === 0 ? (
          <EmptyState
            {...EMPTY_COPY.collections}
            actionHref="/aesthetics/shop"
            actionLabel="Browse the shop"
          />
        ) : isSearching &&
          filteredCategories.length === 0 &&
          filteredCollections.length === 0 &&
          productResults.length === 0 &&
          !searchLoading ? (
          <EmptyState
            {...EMPTY_COPY.search}
            actionHref="/aesthetics/collections"
            actionLabel="View all categories"
          />
        ) : (
          <>
            {visibleCategories.length > 0 && (
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCategories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/aesthetics/shop?category=${encodeURIComponent(c.slug)}`}
                    className="group block rounded-[1.25rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] p-6 shadow-[var(--gallery-shadow,0_2px_16px_rgba(30,30,28,0.05))] transition hover:border-[var(--gallery-ink,#1e1e1c)]"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gallery-muted,#6f6a63)]">
                      Category
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-wide text-[var(--gallery-ink,#1e1e1c)] sm:text-2xl">
                      {c.name}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--gallery-muted,#6f6a63)]">
                      {c.productCount ?? 0} product{(c.productCount ?? 0) === 1 ? "" : "s"}
                    </p>
                    <span className="mt-5 inline-block text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-ink,#1e1e1c)] transition group-hover:translate-x-0.5">
                      Explore →
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {visibleCollections.length > 0 && (
              <section className="mt-16">
                <p className="aes-gallery-eyebrow">Curated collections</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleCollections.map((c, i) => (
                    <CollectionCard key={c.id} collection={c} index={isSearching ? i + 1 : i} />
                  ))}
                </div>
              </section>
            )}

            {isSearching && productResults.length > 0 && (
              <section className="mt-16">
                <p className="aes-gallery-eyebrow">Matching products</p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                  {productResults.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </ConsumerPage>
  );
}
