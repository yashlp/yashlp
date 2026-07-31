"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  name: string;
};

const SWIPE_THRESHOLD = 48;

export function ProductGallery({ images, name }: Props) {
  const safe = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    axis: "undecided" | "x" | "y";
  } | null>(null);
  const suppressClickRef = useRef(false);
  const current = safe[active] || safe[0];
  const multi = safe.length > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!safe.length) return;
      const next = ((index % safe.length) + safe.length) % safe.length;
      setActive(next);
      setDragX(0);
    },
    [safe.length]
  );

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (!multi) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, multi]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!multi || e.button > 0) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      axis: "undecided",
    };
    suppressClickRef.current = false;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.axis === "undecided") {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      drag.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      if (drag.axis === "y") {
        // Let the page scroll vertically
        dragRef.current = null;
        setDragging(false);
        setDragX(0);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        return;
      }
    }

    if (drag.axis !== "x") return;
    e.preventDefault();
    setDragX(dx);
    if (Math.abs(dx) > 10) suppressClickRef.current = true;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const dx = drag.axis === "x" ? e.clientX - drag.startX : 0;
    dragRef.current = null;
    setDragging(false);

    if (dx <= -SWIPE_THRESHOLD) goNext();
    else if (dx >= SWIPE_THRESHOLD) goPrev();
    else setDragX(0);
  }

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[1.5rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] text-sm text-[var(--gallery-muted,#6f6a63)]">
        No photos yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="relative touch-pan-y overflow-hidden rounded-[1.5rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] shadow-[var(--gallery-shadow,0_2px_16px_rgba(30,30,28,0.05))] select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} photos`}
      >
        <div
          className={cn(
            "flex w-full",
            dragging ? "transition-none" : "transition-transform duration-300 ease-out"
          )}
          style={{
            transform: `translate3d(calc(${-active * 100}% + ${dragX}px), 0, 0)`,
          }}
        >
          {safe.map((img, i) => (
            <div key={`${img}-${i}`} className="w-full shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={i === active ? name : ""}
                draggable={false}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="mx-auto max-h-[min(72vh,640px)] w-full object-contain object-center pointer-events-none"
              />
            </div>
          ))}
        </div>

        {multi && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous photo"
              className="aes-touch absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(255,255,255,0.88)] text-[var(--gallery-ink,#1e1e1c)] shadow-sm backdrop-blur-sm transition hover:bg-white sm:left-3"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next photo"
              className="aes-touch absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(255,255,255,0.88)] text-[var(--gallery-ink,#1e1e1c)] shadow-sm backdrop-blur-sm transition hover:bg-white sm:right-3"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[rgba(30,30,28,0.55)] px-2.5 py-1 text-[10px] font-medium tracking-wide text-white">
              {active + 1} / {safe.length}
            </p>
          </>
        )}
      </div>

      {multi && (
        <div className="grid grid-cols-4 gap-2.5">
          {safe.map((img, i) => (
            <button
              key={`${img}-thumb-${i}`}
              type="button"
              onClick={() => {
                if (suppressClickRef.current) {
                  suppressClickRef.current = false;
                  return;
                }
                goTo(i);
              }}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "aspect-square overflow-hidden rounded-xl border bg-[var(--gallery-card,#fcfbf8)] transition",
                i === active
                  ? "border-[var(--gallery-ink,#1e1e1c)] ring-1 ring-[var(--gallery-ink,#1e1e1c)]"
                  : "border-[var(--gallery-border,#ddd7cf)] hover:border-[var(--gallery-muted,#6f6a63)]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
