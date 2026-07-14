"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PickableProduct = {
  id: string;
  name: string;
  slug?: string;
  status?: string;
};

type Props = {
  products: PickableProduct[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
};

export function CollectionProductPicker({ products, selectedIds, onChange, disabled }: Props) {
  const [query, setQuery] = useState("");

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedProducts = useMemo(
    () =>
      selectedIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as PickableProduct[],
    [selectedIds, products]
  );

  const available = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => !selectedSet.has(p.id))
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.slug || "").toLowerCase().includes(q)
      )
      .slice(0, 40);
  }, [products, selectedSet, query]);

  function add(id: string) {
    if (selectedSet.has(id) || disabled) return;
    onChange([...selectedIds, id]);
  }

  function remove(id: string) {
    if (disabled) return;
    onChange(selectedIds.filter((x) => x !== id));
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--aes-charcoal)]">
          In this collection
          <span className="ml-2 text-xs font-normal text-[var(--aes-charcoal-muted)]">
            {selectedProducts.length} product{selectedProducts.length === 1 ? "" : "s"}
          </span>
        </p>
        {selectedProducts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--aes-border)] bg-white/50 px-4 py-6 text-center text-sm text-[var(--aes-charcoal-muted)]">
            No products yet — search and add from the catalogue below.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--aes-border)] overflow-hidden rounded-xl border border-[var(--aes-border)] bg-white">
            {selectedProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 px-3 py-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--aes-ivory)] text-[10px] font-bold text-[var(--aes-charcoal-muted)]">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--aes-ink)]">{p.name}</p>
                  {p.slug && (
                    <p className="truncate text-[11px] text-[var(--aes-charcoal-muted)]">/{p.slug}</p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => remove(p.id)}
                  className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg text-[var(--aes-charcoal-muted)] hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  aria-label={`Remove ${p.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-[var(--aes-charcoal)]">Add products</p>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--aes-dusty)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalogue by name…"
            disabled={disabled}
            className="aes-input w-full pl-10"
          />
        </div>
        <ul className="max-h-56 overflow-y-auto rounded-xl border border-[var(--aes-border)] bg-white">
          {available.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-[var(--aes-charcoal-muted)]">
              {query.trim() ? "No matching products left to add." : "All products are already in this collection."}
            </li>
          ) : (
            available.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => add(p.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-[var(--aes-ivory)] disabled:opacity-50"
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--aes-ivory)] text-[var(--aes-royal)]">
                    <Plus className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--aes-ink)]">{p.name}</p>
                    {p.status && (
                      <p className="text-[11px] uppercase tracking-wider text-[var(--aes-charcoal-muted)]">
                        {p.status}
                      </p>
                    )}
                  </div>
                  <Check className="h-4 w-4 opacity-0" aria-hidden />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
