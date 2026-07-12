"use client";

import { Film, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/aesthetic-demo/products";
import { FILTER_OPTIONS } from "@/lib/aesthetic-demo/products";
import type { ViewMode } from "./aesthetic-app";

type FilterBarProps = {
  active: ProductCategory | "all";
  onChange: (id: ProductCategory | "all") => void;
  matchPercent: number;
  topVibes: string[];
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
};

export function FilterBar({
  active,
  onChange,
  matchPercent,
  topVibes,
  view,
  onViewChange,
}: FilterBarProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="pointer-events-auto px-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold italic tracking-tight text-[#0a1628]">
              Aesthetic
            </h1>
            <p className="aesthetic-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7cbb]/80">
              {view === "reel" ? "reel mode" : "shop mode"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {matchPercent > 0 && (
              <div className="hidden rounded-full border border-[#1b3a6b]/10 bg-[#fffef7]/90 px-3 py-1.5 backdrop-blur-md xs:block">
                <p className="aesthetic-mono text-[9px] uppercase tracking-wider text-[#4a7cbb]">
                  match
                </p>
                <p className="text-right text-base font-semibold leading-none text-[#1b3a6b]">
                  {matchPercent}%
                </p>
              </div>
            )}

            {/* View toggle */}
            <div className="flex rounded-full border border-[#1b3a6b]/10 bg-[#fffef7]/90 p-0.5 backdrop-blur-md">
              <button
                type="button"
                onClick={() => onViewChange("reel")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                  view === "reel"
                    ? "bg-[#1b3a6b] text-[#fffef7] shadow-md"
                    : "text-[#4a7cbb]/60 hover:text-[#1b3a6b]"
                )}
                aria-label="Reel view"
                title="Reel view"
              >
                <Film className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewChange("shop")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                  view === "shop"
                    ? "bg-[#1b3a6b] text-[#fffef7] shadow-md"
                    : "text-[#4a7cbb]/60 hover:text-[#1b3a6b]"
                )}
                aria-label="Shop view"
                title="Shop view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTER_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "aesthetic-mono shrink-0 rounded-full px-4 py-2 text-[11px] uppercase tracking-wider transition-all duration-200",
                active === id
                  ? "bg-[#1b3a6b] text-[#fffef7] shadow-lg shadow-[#1b3a6b]/20"
                  : "border border-[#1b3a6b]/12 bg-[#fffef7]/80 text-[#1b3a6b]/70 backdrop-blur-sm hover:border-[#4a7cbb]/30"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {topVibes.length > 0 && view === "reel" && (
          <p className="aesthetic-mono mt-2 text-[10px] text-[#4a7cbb]/70">
            learning: {topVibes.join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}
