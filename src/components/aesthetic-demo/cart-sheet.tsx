"use client";

import { X } from "lucide-react";
import type { AestheticProduct } from "@/lib/aesthetic-demo/products";

type CartSheetProps = {
  open: boolean;
  onClose: () => void;
  items: AestheticProduct[];
  total: number;
  onRemove: (id: string) => void;
};

export function CartSheet({ open, onClose, items, total, onRemove }: CartSheetProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[#0a1628]/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-x-0 bottom-0 z-50 max-h-[75dvh] overflow-hidden rounded-t-[2rem] border-t border-[#1b3a6b]/10 bg-[#fffef7] shadow-2xl"
        style={{ animation: "slide-up-in 0.35s ease" }}
      >
        <div className="flex items-center justify-between border-b border-[#ebe4d8] px-6 py-4">
          <div>
            <p className="aesthetic-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7cbb]">
              your picks
            </p>
            <h3 className="text-xl font-semibold italic text-[#0a1628]">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1b3a6b]/10"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-[#1b3a6b]" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(75dvh - 140px)" }}>
          {items.length === 0 ? (
            <p className="py-8 text-center italic text-[#4a7cbb]/60">
              Swipe right on reels you love — they land here.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="aesthetic-mono text-[9px] uppercase tracking-wider text-[#4a7cbb]">
                      {item.brand}
                    </p>
                    <p className="truncate font-semibold text-[#0a1628]">{item.name}</p>
                    <p className="text-lg text-[#1b3a6b]">${item.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="shrink-0 self-start rounded-full px-2 py-1 text-xs text-[#8a7355] hover:bg-[#f5f0e8]"
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#ebe4d8] px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="mb-3 flex justify-between">
              <span className="aesthetic-mono text-xs uppercase tracking-wider text-[#4a7cbb]">
                total
              </span>
              <span className="text-2xl font-semibold text-[#0a1628]">${total}</span>
            </div>
            <button
              type="button"
              className="aesthetic-mono w-full rounded-2xl bg-[#1b3a6b] py-4 text-xs uppercase tracking-[0.2em] text-[#fffef7] shadow-lg shadow-[#1b3a6b]/25 transition active:scale-[0.98]"
            >
              Checkout — demo
            </button>
          </div>
        )}
      </div>
    </>
  );
}
