"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  placeholder?: string;
  className?: string;
  /** Controlled value — pair with onChange for live search */
  value?: string;
  onChange?: (query: string) => void;
  initialQuery?: string;
  id?: string;
};

export function ProductSearchBar({
  placeholder = "Search products… e.g. scent, journal, cozy",
  className = "",
  value: controlledValue,
  onChange,
  initialQuery = "",
  id = "product-search",
}: Props) {
  const [internalQuery, setInternalQuery] = useState(initialQuery);
  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalQuery;

  useEffect(() => {
    if (!isControlled) setInternalQuery(initialQuery);
  }, [initialQuery, isControlled]);

  function handleChange(next: string) {
    if (!isControlled) setInternalQuery(next);
    onChange?.(next);
  }

  return (
    <div className={`relative w-full max-w-xl ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="aes-input w-full !rounded-full py-3 pl-5 pr-12 text-sm shadow-sm"
      />
      <span
        className="pointer-events-none absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[var(--aes-ink-muted)]"
        aria-hidden
      >
        <Search className="h-4 w-4" />
      </span>
    </div>
  );
}
