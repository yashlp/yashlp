"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "E", "S", "T", "H", "E", "T", "I", "C", "S"];

export function BrandLoader() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    let letter = 0;
    const interval = setInterval(() => {
      setActiveIndex(letter);
      letter += 1;
      if (letter >= LETTERS.length) clearInterval(interval);
    }, 70);

    const hide = setTimeout(() => setDone(true), 1600);

    return () => {
      cancelAnimationFrame(show);
      clearInterval(interval);
      clearTimeout(hide);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[var(--aes-bg-base)] transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0"
      )}
      aria-hidden
    >
      <span className="aes-brand-only mb-3 text-sm">only</span>
      <div className="flex gap-[0.35em] sm:gap-[0.45em]">
        {LETTERS.map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            className={cn(
              "aes-brand-wordmark text-2xl sm:text-4xl transition-opacity duration-300",
              i <= activeIndex ? "opacity-100" : "opacity-0"
            )}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
