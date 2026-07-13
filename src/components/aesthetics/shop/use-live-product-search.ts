"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/aesthetics/types";

const DEBOUNCE_MS = 200;

/** Debounced product search — updates as the user types, no submit required. */
export function useLiveProductSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      setActive(false);
      return;
    }

    setActive(true);
    setLoading(true);
    const timer = window.setTimeout(() => {
      fetch(`/api/commerce/products?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setResults(d.products || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query]);

  return { results, loading, active };
}
