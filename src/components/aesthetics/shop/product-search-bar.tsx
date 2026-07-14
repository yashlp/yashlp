"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SEARCH_MOOD_CHIPS } from "@/lib/aesthetics/shop-constants";
import { getRecentlyViewed, type RecentProduct } from "@/lib/aesthetics/recently-viewed";
import { formatInr } from "@/lib/aesthetics/format-inr";
import { cn } from "@/lib/utils";

type Suggestion = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  brand?: string;
};

type Props = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (query: string) => void;
  initialQuery?: string;
  id?: string;
  showMoodChips?: boolean;
  showRecent?: boolean;
};

export function ProductSearchBar({
  placeholder = "Search products… e.g. scent, journal, cozy",
  className = "",
  value: controlledValue,
  onChange,
  initialQuery = "",
  id = "product-search",
  showMoodChips = true,
  showRecent = true,
}: Props) {
  const [internalQuery, setInternalQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recent, setRecent] = useState<RecentProduct[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalQuery;

  useEffect(() => {
    if (!isControlled) setInternalQuery(initialQuery);
  }, [initialQuery, isControlled]);

  useEffect(() => {
    if (showRecent) setRecent(getRecentlyViewed());
  }, [showRecent, open]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      setLoadingSuggest(true);
      fetch(`/api/commerce/products?q=${encodeURIComponent(q)}&suggest=true`)
        .then((r) => r.json())
        .then((d) => setSuggestions(d.suggestions || []))
        .catch(() => setSuggestions([]))
        .finally(() => setLoadingSuggest(false));
    }, 180);
    return () => clearTimeout(t);
  }, [query]);

  function handleChange(next: string) {
    if (!isControlled) setInternalQuery(next);
    onChange?.(next);
    setOpen(true);
  }

  function applyChip(chip: string) {
    handleChange(chip);
  }

  const showPanel =
    open &&
    (suggestions.length > 0 ||
      loadingSuggest ||
      (showRecent && recent.length > 0 && query.trim().length < 2) ||
      query.trim().length >= 2);

  return (
    <div ref={wrapRef} className={cn("relative w-full max-w-xl", className)}>
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="aes-input w-full !rounded-full py-3 pl-5 pr-12 text-sm shadow-sm"
      />
      <span
        className="pointer-events-none absolute right-4 top-3.5 flex h-9 w-9 items-center justify-center text-[var(--aes-ink-muted)]"
        aria-hidden
      >
        <Search className="h-4 w-4" />
      </span>

      {showMoodChips && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SEARCH_MOOD_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => applyChip(chip)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition",
                query.toLowerCase() === chip.toLowerCase()
                  ? "border-[var(--gallery-ink,#1e1e1c)] bg-[var(--gallery-ink,#1e1e1c)] text-white"
                  : "border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] text-[var(--gallery-muted,#6f6a63)] hover:border-[var(--gallery-blue,#2c5aa0)]"
              )}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {showPanel && (
        <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-2xl border border-[var(--gallery-border,#ddd7cf)] bg-white shadow-lg">
          {query.trim().length < 2 && showRecent && recent.length > 0 && (
            <div className="border-b border-[var(--gallery-border,#ddd7cf)] p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-muted,#6f6a63)]">
                Recently viewed
              </p>
              <ul className="space-y-1">
                {recent.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/aesthetics/product/${p.slug}`}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[var(--gallery-bg-secondary,#ece8e1)]"
                      onClick={() => setOpen(false)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                      <span className="flex-1 text-sm text-[var(--gallery-ink,#1e1e1c)]">{p.name}</span>
                      <span className="text-xs text-[var(--gallery-muted,#6f6a63)]">{formatInr(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {query.trim().length >= 2 && (
            <div className="p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-muted,#6f6a63)]">
                {loadingSuggest ? "Suggesting…" : "Suggestions"}
              </p>
              {suggestions.length === 0 && !loadingSuggest ? (
                <p className="px-2 py-3 text-sm text-[var(--gallery-muted,#6f6a63)]">No matches yet</p>
              ) : (
                <ul className="space-y-1">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/aesthetics/product/${s.slug}`}
                        className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[var(--gallery-bg-secondary,#ece8e1)]"
                        onClick={() => {
                          handleChange(s.name);
                          setOpen(false);
                        }}
                      >
                        {s.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.image} alt="" className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                        )}
                        <span className="flex-1">
                          <span className="block text-sm text-[var(--gallery-ink,#1e1e1c)]">{s.name}</span>
                          {s.brand && (
                            <span className="text-xs text-[var(--gallery-muted,#6f6a63)]">{s.brand}</span>
                          )}
                        </span>
                        <span className="text-xs text-[var(--gallery-muted,#6f6a63)]">{formatInr(s.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
