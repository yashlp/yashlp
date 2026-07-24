"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SKIP_KEY = "oa_brand_loader_seen";

export function BrandLoader() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SKIP_KEY) === "1";
    if (reduced || seen) {
      setDone(true);
      return;
    }

    const show = requestAnimationFrame(() => setVisible(true));
    const hide = window.setTimeout(() => {
      setDone(true);
      try {
        sessionStorage.setItem(SKIP_KEY, "1");
      } catch {
        // ignore
      }
    }, 1100);

    const failsafe = window.setTimeout(() => setDone(true), 2200);

    return () => {
      cancelAnimationFrame(show);
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
      <div className="oa-logo-wrap oa-logo-wrap--loader max-w-full animate-pulse">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/only-aesthetic-logo.png"
          alt=""
          className="h-auto w-full"
          width={1024}
          height={1024}
        />
      </div>
    </div>
  );
}
