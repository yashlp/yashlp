"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "E", "S", "T", "H", "E", "T", "I", "C", "S"];
const SKIP_KEY = "oa_brand_loader_seen";

export function BrandLoader() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    // Skip loader after first visit / reduced motion / tiny screens preferring speed
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SKIP_KEY) === "1";
    if (reduced || seen) {
      setDone(true);
      return;
    }

    const show = requestAnimationFrame(() => setVisible(true));
    let letter = 0;
    const interval = window.setInterval(() => {
      setActiveIndex(letter);
      letter += 1;
      if (letter >= LETTERS.length) window.clearInterval(interval);
    }, 55);

    // Always clear — never leave a blank cover over the app on slow mobile JS
    const hide = window.setTimeout(() => {
      setDone(true);
      try {
        sessionStorage.setItem(SKIP_KEY, "1");
      } catch {
        // ignore
      }
    }, 1200);

    const failsafe = window.setTimeout(() => setDone(true), 2200);

    return () => {
      cancelAnimationFrame(show);
      window.clearInterval(interval);
      window.clearTimeout(hide);
      window.clearTimeout(failsafe);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[500] flex items-center justify-center bg-[var(--aes-bg-base)] px-4 transition-opacity duration-400",
        visible ? "opacity-100" : "opacity-0"
      )}
      aria-hidden
      style={{ pointerEvents: "none" }}
    >
      <div className="aes-brand-lockup aes-brand-lockup-hero max-w-full">
        <span className="aes-brand-only">only</span>
        <span className="aes-brand-wordmark inline-flex flex-wrap justify-center">
          {LETTERS.map((letter, i) => (
            <span key={`${letter}-${i}`}>
              {i > 0 ? "\u00a0" : ""}
              <span
                className={cn("transition-opacity duration-300", i <= activeIndex ? "opacity-100" : "opacity-0")}
              >
                {letter}
              </span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
