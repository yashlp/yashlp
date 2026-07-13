"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  placeholder?: string;
  className?: string;
  initialQuery?: string;
};

export function ProductSearchBar({
  placeholder = "Search products… e.g. scent, journal, cozy",
  className = "",
  initialQuery = "",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/aesthetics/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={submit} className={`relative w-full max-w-xl ${className}`}>
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[var(--aes-border)] bg-white py-3 pl-5 pr-12 text-sm text-[var(--aes-ink)] shadow-sm outline-none transition focus:border-[var(--aes-pink)] focus:ring-2 focus:ring-[var(--aes-pink)]/20"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--aes-ink)] text-white transition hover:bg-[var(--aes-pink)]"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
