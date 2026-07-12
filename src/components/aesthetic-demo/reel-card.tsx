"use client";

import { useCallback, useRef, useState } from "react";
import { Heart, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AestheticProduct } from "@/lib/aesthetic-demo/products";

const SWIPE_THRESHOLD = 80;

type ReelCardProps = {
  product: AestheticProduct;
  onSwipe: (action: "like" | "pass") => void;
  isActive: boolean;
};

export function ReelCard({ product, onSwipe, isActive }: ReelCardProps) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<"like" | "pass" | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const locked = useRef<"x" | "y" | null>(null);

  const reset = useCallback(() => {
    setDragX(0);
    setDragging(false);
    locked.current = null;
  }, []);

  const commitSwipe = useCallback(
    (action: "like" | "pass") => {
      setExiting(action);
      setTimeout(() => {
        onSwipe(action);
        setExiting(null);
        reset();
      }, 280);
    },
    [onSwipe, reset]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isActive || exiting) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    locked.current = null;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || exiting) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    if (!locked.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      locked.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }

    if (locked.current === "x") {
      e.preventDefault();
      setDragX(dx);
    }
  };

  const onPointerUp = () => {
    if (!dragging || exiting) return;
    setDragging(false);

    if (locked.current === "x") {
      if (dragX > SWIPE_THRESHOLD) commitSwipe("like");
      else if (dragX < -SWIPE_THRESHOLD) commitSwipe("pass");
      else reset();
    } else {
      reset();
    }
  };

  const rotate = dragX * 0.04;
  const likeOpacity = Math.min(1, Math.max(0, dragX / SWIPE_THRESHOLD));
  const passOpacity = Math.min(1, Math.max(0, -dragX / SWIPE_THRESHOLD));

  const exitTransform =
    exiting === "like"
      ? "translateX(120%) rotate(12deg)"
      : exiting === "pass"
        ? "translateX(-120%) rotate(-12deg)"
        : `translateX(${dragX}px) rotate(${rotate}deg)`;

  return (
    <div className="aesthetic-snap-item relative h-dvh w-full shrink-0 snap-start">
      <div
        className={cn(
          "absolute inset-3 overflow-hidden rounded-[2rem] aesthetic-card-shadow aesthetic-grain transition-transform duration-300 ease-out sm:inset-4",
          !dragging && !exiting && "transition-transform duration-300"
        )}
        style={{
          transform: exitTransform,
          opacity: exiting ? 0 : 1,
          transition: exiting ? "transform 0.28s ease-in, opacity 0.28s ease-in" : undefined,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Product image */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(10,22,40,0.15) 0%, transparent 30%, transparent 45%, rgba(10,22,40,0.75) 100%)`,
            }}
          />
        </div>

        {/* Swipe hints */}
        <div
          className="aesthetic-swipe-hint-right absolute left-6 top-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#4a7cbb] bg-[#fffef7]/90 px-4 py-3 backdrop-blur-md"
          style={{ opacity: likeOpacity }}
        >
          <ShoppingBag className="h-6 w-6 text-[#1b3a6b]" />
          <p className="aesthetic-mono mt-1 text-[10px] uppercase tracking-wider text-[#1b3a6b]">
            add
          </p>
        </div>
        <div
          className="aesthetic-swipe-hint-left absolute right-6 top-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#c4a882] bg-[#fffef7]/90 px-4 py-3 backdrop-blur-md"
          style={{ opacity: passOpacity }}
        >
          <X className="h-6 w-6 text-[#8a7355]" />
          <p className="aesthetic-mono mt-1 text-[10px] uppercase tracking-wider text-[#8a7355]">
            pass
          </p>
        </div>

        {/* Product info */}
        <div className="absolute inset-x-0 bottom-0 p-6 pb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="aesthetic-mono rounded-full border border-[#fffef7]/25 bg-[#fffef7]/15 px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-[#fffef7]/90 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="aesthetic-mono text-[10px] uppercase tracking-[0.2em] text-[#7eb8da]">
            {product.brand}
          </p>
          <h2 className="mt-1 text-3xl font-semibold leading-tight text-[#fffef7]">
            {product.name}
          </h2>
          <p className="mt-2 max-w-[85%] text-base italic leading-snug text-[#fffef7]/75">
            {product.description}
          </p>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="aesthetic-mono text-[9px] uppercase tracking-wider text-[#fffef7]/50">
                {product.vibe}
              </p>
              <p className="text-2xl font-semibold text-[#fffef7]">${product.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  commitSwipe("pass");
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#fffef7]/30 bg-[#fffef7]/10 backdrop-blur-md transition active:scale-95"
                aria-label="Pass"
              >
                <X className="h-5 w-5 text-[#fffef7]/80" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  commitSwipe("like");
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a7cbb] shadow-lg shadow-[#1b3a6b]/40 transition active:scale-95"
                aria-label="Add to cart"
              >
                <Heart className="h-5 w-5 fill-[#fffef7] text-[#fffef7]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      {isActive && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2">
          <p className="aesthetic-mono text-[9px] uppercase tracking-[0.3em] text-[#1b3a6b]/35">
            scroll ↕ · swipe ↔
          </p>
        </div>
      )}
    </div>
  );
}
