"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: Props) {
  const safe = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const current = safe[active] || safe[0];

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[1.5rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] text-sm text-[var(--gallery-muted,#6f6a63)]">
        No photos yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] shadow-[var(--gallery-shadow,0_2px_16px_rgba(30,30,28,0.05))]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current}
          alt={name}
          className="mx-auto max-h-[min(72vh,640px)] w-full object-contain object-center"
        />
      </div>

      {safe.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5">
          {safe.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={cn(
                "aspect-square overflow-hidden rounded-xl border bg-[var(--gallery-card,#fcfbf8)] transition",
                i === active
                  ? "border-[var(--gallery-ink,#1e1e1c)] ring-1 ring-[var(--gallery-ink,#1e1e1c)]"
                  : "border-[var(--gallery-border,#ddd7cf)] hover:border-[var(--gallery-muted,#6f6a63)]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-contain object-center" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
