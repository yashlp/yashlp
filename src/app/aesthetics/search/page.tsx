"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { Input } from "@/components/aesthetics/ui/input";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { PRODUCTS } from "@/lib/aesthetics/products";
import { getBrand } from "@/lib/aesthetics/brands";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { cartCount } = useCart();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => {
      const brand = getBrand(p.brandId);
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        brand?.name.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <>
      <ConsumerNav cartCount={cartCount} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="aes-display text-4xl font-semibold italic text-[var(--aes-charcoal)]">Search</h1>
        <div className="relative mt-8 max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--aes-dusty)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, moods..."
            className="pl-12"
            autoFocus
          />
        </div>
        {query && (
          <p className="aes-mono mt-4 text-xs uppercase tracking-wider text-[var(--aes-dusty)]">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
        )}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {query && results.length === 0 && (
          <p className="mt-12 text-center text-[var(--aes-charcoal-muted)]">
            No matches. Try &ldquo;ceramic&rdquo;, &ldquo;calm&rdquo;, or a brand name.
          </p>
        )}
      </main>
      <ConsumerFooter />
    </>
  );
}
