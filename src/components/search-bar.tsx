"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { SearchInput } from "@/components/search-input";

type GeocodeResult = { name: string; lat: number; lng: number };

export function SearchBar({
  onSelect,
}: {
  onSelect: (lat: number, lng: number, name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 400);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <div className="relative">
      <SearchInput
        value={query}
        onChange={(v) => {
          setQuery(v);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        loading={loading}
        placeholder="Search city, street, or place..."
        className="shadow-lg shadow-orange-100/50"
      />
      {open && query.length >= 2 && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl">
          {results.map((p) => (
            <button
              key={`${p.lat}-${p.lng}`}
              onMouseDown={() => {
                onSelect(p.lat, p.lng, p.name);
                setQuery(p.name.split(",")[0]);
                setOpen(false);
              }}
              className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-orange-50"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
              <span className="line-clamp-2 text-stone-700">{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
