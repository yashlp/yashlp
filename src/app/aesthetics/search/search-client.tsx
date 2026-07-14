"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { ProductSearchBar } from "@/components/aesthetics/shop/product-search-bar";
import { useLiveProductSearch } from "@/components/aesthetics/shop/use-live-product-search";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { EmptyState, EMPTY_COPY } from "@/components/aesthetics/motion";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [query, setQuery] = useState(initial);
  const { results, loading, active } = useLiveProductSearch(query);
  const { cartCount } = useCart();

  useEffect(() => {
    setQuery(initial);
  }, [initial]);

  return (
    <ConsumerPage cartCount={cartCount} room="ivory">
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="aes-gallery-eyebrow">Find a piece</p>
        <h1 className="aes-gallery-title mt-3">Search</h1>
        <div className="mt-8 flex justify-center">
          <ProductSearchBar value={query} onChange={setQuery} className="max-w-2xl" id="search-page-input" />
        </div>
        {active && (
          <p className="mt-6 text-center text-xs font-bold uppercase tracking-wider text-[var(--aes-ink-muted)]">
            {loading ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""} for “${query.trim()}”`}
          </p>
        )}
        {!active && (
          <p className="mt-6 text-center text-sm text-[var(--aes-ink-muted)]">
            Start typing to see matching products instantly.
          </p>
        )}
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
          ))}
        </div>
        {active && !loading && results.length === 0 && (
          <EmptyState
            {...EMPTY_COPY.search}
            actionHref="/aesthetics/shop"
            actionLabel="Browse the shop"
          />
        )}
      </main>
    </ConsumerPage>
  );
}
