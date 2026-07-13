"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { Input } from "@/components/aesthetics/ui/input";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import type { Product } from "@/lib/aesthetics/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const { cartCount } = useCart();

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
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <ConsumerPage cartCount={cartCount} tint="sand">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="aes-joy-title-lower text-[var(--aes-ink)]">search</h1>
        <div className="relative mt-8 max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--aes-ink-soft)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, moods..."
            className="pl-12"
            autoFocus
          />
        </div>
        {query && (
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[var(--aes-ink-muted)]">
            {results.length} result{results.length !== 1 ? "s" : ""}
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
