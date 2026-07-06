"use client";

import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  loading = false,
  onFocus,
  onBlur,
  autoFocus,
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-3 shadow-sm",
        className
      )}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
        ) : (
          <Search className="h-4 w-4 text-orange-400" />
        )}
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-stone-800 outline-none placeholder:text-stone-400"
      />
    </div>
  );
}
