"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const PLACES = [
  { name: "Downtown", lat: 40.7128, lng: -74.006 },
  { name: "Midtown", lat: 40.7549, lng: -73.984 },
  { name: "Brooklyn Heights", lat: 40.696, lng: -73.993 },
  { name: "Central Park Area", lat: 40.7829, lng: -73.9654 },
  { name: "Financial District", lat: 40.7075, lng: -74.0089 },
];

export function SearchBar({
  onSelect,
}: {
  onSelect: (lat: number, lng: number, name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = PLACES.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 shadow-lg">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search places..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      {open && query && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-white shadow-xl">
          {results.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                onSelect(p.lat, p.lng, p.name);
                setQuery(p.name);
                setOpen(false);
              }}
              className="block w-full px-4 py-2.5 text-left text-sm hover:bg-teal-50"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
