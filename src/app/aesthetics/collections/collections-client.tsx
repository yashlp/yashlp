"use client";

import { useMemo, useState } from "react";
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

type Props = {
  collections: Collection[];
};

export function CollectionsClient({ collections }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { results: productResults, loading: searchLoading, active: isSearching } = useLiveProductSearch(searchQuery);

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

  const visibleCollections = isSearching ? filteredCollections : collections;

  return (
    <ConsumerPage room="warm">
      <main className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <section className="relative overflow-hidden rounded-[1.75rem] px-1 pb-2 pt-1">
          <MorningLight />
          <SeasonalAccent />
          <p className="aes-gallery-eyebrow relative">Mood-based browsing</p>
          <h1 className="aes-gallery-title relative mt-3">Collections</h1>
          <p className="aes-gallery-lead relative mt-4">
            Curated rooms for every mood — calm mornings, creative nights, and everything between.
          </p>
        </section>

        <div className="mt-10 flex justify-start">
          <ProductSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search collections & products…"
            id="collections-search"
          />
        </div>

        {isSearching && (
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--aes-ink-muted)]">
            {searchLoading
              ? "Searching…"
              : `${filteredCollections.length} collection${filteredCollections.length === 1 ? "" : "s"}, ${productResults.length} product${productResults.length === 1 ? "" : "s"}`}
          </p>
        )}

        {!isSearching && collections.length === 0 ? (
          <EmptyState
            {...EMPTY_COPY.collections}
            actionHref="/aesthetics/shop"
            actionLabel="Browse the shop"
          />
        ) : isSearching && filteredCollections.length === 0 && productResults.length === 0 && !searchLoading ? (
          <EmptyState
            {...EMPTY_COPY.search}
            actionHref="/aesthetics/collections"
            actionLabel="View all collections"
          />
        ) : (
          <>
            {visibleCollections.length > 0 && (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCollections.map((c, i) => (
                  <CollectionCard key={c.id} collection={c} index={isSearching ? i + 1 : i} />
                ))}
              </div>
            )}

            {isSearching && productResults.length > 0 && (
              <section className="mt-16">
                <p className="aes-gallery-eyebrow">Matching products</p>
                <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
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
