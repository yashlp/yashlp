"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Loader2, MapPin } from "lucide-react";

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
      <div className="flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-3 shadow-lg shadow-orange-100/50">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
        ) : (
          <Search className="h-4 w-4 text-orange-400" />
        )}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="Search any city, street, or place worldwide..."
          className="flex-1 bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
        />
      </div>
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
              className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm hover:bg-orange-50"
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
