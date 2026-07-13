"use client";

import { useMemo, useState } from "react";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { CollectionCard } from "@/components/aesthetics/home/collection-card";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { ProductSearchBar } from "@/components/aesthetics/shop/product-search-bar";
import { useLiveProductSearch } from "@/components/aesthetics/shop/use-live-product-search";
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

  return (
    <ConsumerPage tint="sand">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="aes-joy-title-lower text-[var(--aes-ink)]">collections</h1>
        <p className="mt-3 max-w-lg text-sm text-[var(--aes-ink-muted)]">
          Curated edits for every mood — calm mornings, creative nights, and everything between.
        </p>
        <div className="mt-8 flex justify-center">
          <ProductSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search collections & products…"
            id="collections-search"
          />
        </div>

        {isSearching && (
          <p className="mt-4 text-center text-xs font-bold uppercase tracking-wider text-[var(--aes-ink-muted)]">
            {searchLoading
              ? "Searching…"
              : `${filteredCollections.length} collection${filteredCollections.length === 1 ? "" : "s"}, ${productResults.length} product${productResults.length === 1 ? "" : "s"}`}
          </p>
        )}

        {!isSearching && collections.length === 0 ? (
          <p className="mt-12 text-[var(--aes-ink-muted)]">No collections published yet.</p>
        ) : isSearching && filteredCollections.length === 0 && productResults.length === 0 && !searchLoading ? (
          <p className="mt-12 text-center text-[var(--aes-ink-muted)]">
            No matches for &ldquo;{searchQuery.trim()}&rdquo;.
          </p>
        ) : (
          <>
            {(!isSearching || filteredCollections.length > 0) && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(isSearching ? filteredCollections : collections).map((c, i) => (
                  <CollectionCard key={c.id} collection={c} index={i} />
                ))}
              </div>
            )}

            {isSearching && productResults.length > 0 && (
              <section className="mt-14">
                <h2 className="aes-joy-title-lower mb-6 text-lg text-[var(--aes-ink)]">matching products</h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
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
