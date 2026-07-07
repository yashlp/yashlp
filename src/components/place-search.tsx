"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Globe, MapPin, X } from "lucide-react";
import { countrySelectOptions, getCountryName } from "@/lib/countries";
import type { GeocodePlace } from "@/lib/geocode";
import { LEGAL_COUNTRY_KEY } from "@/lib/constants";
import { useDebouncedValue } from "@/lib/use-debounce";
import { SearchInput } from "@/components/search-input";

export function PlaceSearch({
  onSelect,
  selectedPlace,
  onClear,
  label = "Where is this?",
  hint = "City, neighbourhood, state, or pincode / postal code",
  className,
}: {
  onSelect: (place: GeocodePlace) => void;
  selectedPlace?: GeocodePlace | null;
  onClear?: () => void;
  label?: string;
  hint?: string;
  className?: string;
}) {
  const [countryCode, setCountryCode] = useState("IN");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodePlace[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(LEGAL_COUNTRY_KEY) : null;
    if (stored && stored !== "INT") setCountryCode(stored);
    else {
      fetch("/api/legal/detect")
        .then((r) => r.json())
        .then((d: { countryCode?: string }) => {
          if (d.countryCode && d.countryCode !== "INT") setCountryCode(d.countryCode);
        })
        .catch(() => {});
    }
  }, []);

  const search = useCallback(
    async (q: string, country: string, signal: AbortSignal) => {
      if (q.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({ q });
        if (country && country !== "INT") params.set("country", country);
        const res = await fetch(`/api/geocode?${params}`, { signal });
        const data = await res.json();
        setResults(data.results ?? []);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    search(debouncedQuery, countryCode, controller.signal);
    return () => controller.abort();
  }, [debouncedQuery, countryCode, search]);

  const countries = countrySelectOptions();

  if (selectedPlace) {
    return (
      <div className={className}>
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Selected location
            </p>
            <p className="mt-0.5 text-sm font-medium text-stone-800">{selectedPlace.name}</p>
            {selectedPlace.postcode && (
              <p className="text-xs text-stone-500">Pincode / postal: {selectedPlace.postcode}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onClear?.();
              setQuery("");
            }}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-white hover:text-stone-600"
            aria-label="Clear location"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="text-sm font-medium text-stone-700">{label}</label>
      <p className="mt-0.5 text-xs text-stone-400">{hint}</p>

      <div className="mt-2 flex items-stretch gap-2">
        <div
          className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-orange-200 bg-white px-2.5 py-2 shadow-sm sm:px-3"
          title={getCountryName(countryCode)}
        >
          <Globe className="h-4 w-4 shrink-0 text-orange-500" aria-hidden />
          <select
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setOpen(true);
            }}
            className="w-11 cursor-pointer appearance-none border-0 bg-transparent py-0.5 text-sm font-semibold text-stone-800 outline-none sm:w-12"
            aria-label="Country"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code} title={c.name}>
                {c.code === "INT" ? "All" : c.code}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none h-3.5 w-3.5 shrink-0 text-stone-400" aria-hidden />
        </div>
        <div className="relative min-w-0 flex-1">
          <SearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            loading={loading}
            placeholder={
              countryCode === "IN"
                ? "Mumbai, Bandra, Maharashtra, 400050…"
                : "City, area, state, or postal code…"
            }
          />
          {open && query.length >= 2 && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-orange-100 bg-white shadow-xl">
              {results.map((p) => (
                <button
                  key={`${p.lat}-${p.lng}-${p.name}`}
                  type="button"
                  onMouseDown={() => {
                    onSelect(p);
                    setQuery(p.name.split(",")[0] ?? p.name);
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-3 border-b border-orange-50 px-4 py-3 text-left text-sm last:border-0 hover:bg-orange-50"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span>
                    <span className="line-clamp-2 text-stone-700">{p.name}</span>
                    {(p.postcode || p.city) && (
                      <span className="mt-0.5 block text-xs text-stone-400">
                        {[p.city, p.state, p.postcode].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
          {open && query.length >= 2 && !loading && results.length === 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-stone-500 shadow-xl">
              No places found — try a nearby city name or pincode.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
