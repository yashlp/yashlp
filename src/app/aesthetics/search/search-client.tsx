"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { ProductSearchBar } from "@/components/aesthetics/shop/product-search-bar";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import type { Product } from "@/lib/aesthetics/types";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState<Product[]>([]);
  const { cartCount } = useCart();

  useEffect(() => {
    setQuery(initial);
  }, [initial]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/commerce/products?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => setResults(d.products || []))
        .catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <ConsumerPage cartCount={cartCount} tint="sand">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="aes-joy-title-lower text-[var(--aes-ink)]">search</h1>
        <div className="mt-8 flex justify-center">
          <ProductSearchBar initialQuery={query} className="max-w-2xl" />
        </div>
        {query && (
          <p className="mt-6 text-center text-xs font-bold uppercase tracking-wider text-[var(--aes-ink-muted)]">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
          ))}
        </div>
      </main>
    </ConsumerPage>
  );
}
