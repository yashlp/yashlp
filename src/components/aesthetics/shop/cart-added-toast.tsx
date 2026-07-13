"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { formatInr } from "@/lib/aesthetics/format-inr";

type Props = {
  message: string | null;
  onClear: () => void;
};

export function CartAddedToast({ message, onClear }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(onClear, 2200);
    return () => clearTimeout(t);
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[400] -translate-x-1/2 animate-[aes-toast-in_0.35s_ease-out]">
      <div className="flex items-center gap-3 rounded-full bg-[var(--aes-ink)] px-5 py-3 text-sm font-medium text-white shadow-xl">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--aes-pink)]">
          <Check className="h-4 w-4" />
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}

export function formatCartToast(productName: string, price: number) {
  return `${productName} added · ${formatInr(price)}`;
}
