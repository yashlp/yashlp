"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatInr } from "@/lib/aesthetics/format-inr";
import type { Product } from "@/lib/aesthetics/types";
import { cn } from "@/lib/utils";

type Props = {
  products: Product[];
};

const AUTO_PX_PER_FRAME = 0.9;
const RESUME_AFTER_MS = 1800;
const DRAG_CLICK_THRESHOLD = 8;

/** Live products under Shop now: LTR auto-scroll + finger swipe / mouse drag. */
export function ShopNowProducts({ products }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    moved: boolean;
  } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const loop =
    products.length === 0
      ? []
      : products.length === 1
        ? [...products, ...products, ...products, ...products]
        : [...products, ...products, ...products];

  const clearResume = useCallback(() => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  const pauseAuto = useCallback(() => {
    pausedRef.current = true;
    clearResume();
  }, [clearResume]);

  const scheduleResume = useCallback(() => {
    clearResume();
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
      resumeTimer.current = null;
    }, RESUME_AFTER_MS);
  }, [clearResume]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || !loop.length) return;

    const tick = () => {
      const el = scrollerRef.current;
      if (el && !pausedRef.current) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          if (el.scrollLeft >= max - 1) el.scrollLeft = 0;
          else el.scrollLeft += AUTO_PX_PER_FRAME;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      clearResume();
    };
  }, [clearResume, loop.length, reducedMotion]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Touch: native overflow scroll handles fingers — only pause auto-scroll.
    if (e.pointerType === "touch") {
      pauseAuto();
      return;
    }
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const el = scrollerRef.current;
    if (!el) return;
    pauseAuto();
    suppressClickRef.current = false;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !el) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > DRAG_CLICK_THRESHOLD) {
      drag.moved = true;
      suppressClickRef.current = true;
    }
    el.scrollLeft = drag.startScroll - dx;
  }

  function endMouseDrag(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const el = scrollerRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    dragRef.current = null;
    scheduleResume();
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") {
      scheduleResume();
      return;
    }
    endMouseDrag(e);
  }

  function onLinkClick(e: React.MouseEvent) {
    if (suppressClickRef.current) {
      e.preventDefault();
      suppressClickRef.current = false;
    }
  }

  if (!products.length) return null;

  return (
    <div
      className="aes-animate-fade-up relative mx-auto mt-12 w-full max-w-6xl sm:mt-14"
      style={{ animationDelay: "0.32s" }}
      aria-label="Shop products"
    >
      <p className="mb-5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--aes-ink-muted)] sm:mb-6 sm:text-[11px]">
        In the shop
      </p>
      <p className="mb-4 text-center text-[11px] text-[var(--aes-ink-soft)] sm:hidden">
        Swipe to browse · tap to open
      </p>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[var(--aes-cream,#faf6f1)] to-transparent sm:w-14" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[var(--aes-cream,#faf6f1)] to-transparent sm:w-14" />

        <div
          ref={scrollerRef}
          className={cn(
            "oa-products-scroller flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 sm:gap-4 sm:px-6",
            "touch-pan-x cursor-grab active:cursor-grabbing snap-x snap-mandatory",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseEnter={pauseAuto}
          onMouseLeave={scheduleResume}
        >
          {loop.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              href={`/aesthetics/product/${product.slug}`}
              onClick={onLinkClick}
              draggable={false}
              className="group relative w-[148px] shrink-0 snap-start overflow-hidden rounded-2xl bg-[var(--aes-cream-deep,#f3eee8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--aes-royal)] sm:w-[180px]"
            >
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0] || "/oa/placeholder-product.jpg"}
                  alt={product.name}
                  width={360}
                  height={450}
                  loading={i < 4 ? "eager" : "lazy"}
                  draggable={false}
                  className="pointer-events-none h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-3 py-3 text-center">
                <p className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--aes-ink)] transition group-hover:text-[var(--aes-pink)] sm:text-sm">
                  {product.name}
                </p>
                <p className="mt-1 text-xs font-medium text-[var(--aes-ink-muted)]">{formatInr(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
