"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Info,
  ShoppingBag,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { getBrand } from "@/lib/aesthetics/brands";
import type { Product } from "@/lib/aesthetics/types";

const SWIPE_THRESHOLD = 72;
const DOUBLE_TAP_MS = 300;

type DiscoverCardProps = {
  product: Product;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
};

export function DiscoverCard({ product, isActive, onNext, onPrev }: DiscoverCardProps) {
  const { addToCart, recordPass, toggleWishlist, recordView } = useCart();
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<"like" | "pass" | "up" | "down" | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const start = useRef({ x: 0, y: 0 });
  const lock = useRef<"x" | "y" | null>(null);
  const viewStart = useRef<number | null>(null);
  const brand = getBrand(product.brandId);

  useEffect(() => {
    if (isActive) {
      viewStart.current = Date.now();
      return () => {
        if (viewStart.current) {
          const secs = (Date.now() - viewStart.current) / 1000;
          if (secs > 0.5) recordView(product, secs);
        }
      };
    }
  }, [isActive, product, recordView]);

  const reset = () => {
    setDrag({ x: 0, y: 0 });
    setDragging(false);
    lock.current = null;
  };

  const commit = useCallback(
    (action: "like" | "pass" | "up" | "down") => {
      setExiting(action);
      setTimeout(() => {
        if (action === "like") addToCart(product);
        else if (action === "pass") recordPass(product);
        else if (action === "up") onNext();
        else if (action === "down") onPrev();
        setExiting(null);
        reset();
      }, 260);
    },
    [addToCart, recordPass, product, onNext, onPrev]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isActive || exiting) return;
    start.current = { x: e.clientX, y: e.clientY };
    lock.current = null;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || exiting) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (!lock.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      lock.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (lock.current) {
      e.preventDefault();
      setDrag({ x: lock.current === "x" ? dx : 0, y: lock.current === "y" ? dy : 0 });
    }
  };

  const onPointerUp = () => {
    if (!dragging || exiting) return;
    setDragging(false);
    if (lock.current === "x") {
      if (drag.x > SWIPE_THRESHOLD) commit("like");
      else if (drag.x < -SWIPE_THRESHOLD) commit("pass");
      else reset();
    } else if (lock.current === "y") {
      if (drag.y < -SWIPE_THRESHOLD) commit("up");
      else if (drag.y > SWIPE_THRESHOLD) commit("down");
      else reset();
    } else reset();
  };

  const onTap = () => {
    const now = Date.now();
    if (now - lastTap < DOUBLE_TAP_MS) {
      toggleWishlist(product);
      setWishlisted(true);
      setTimeout(() => setWishlisted(false), 600);
    }
    setLastTap(now);
  };

  const likeOpacity = Math.min(1, Math.max(0, drag.x / SWIPE_THRESHOLD));
  const passOpacity = Math.min(1, Math.max(0, -drag.x / SWIPE_THRESHOLD));

  const transform =
    exiting === "like"
      ? "translateX(110%) rotate(8deg)"
      : exiting === "pass"
        ? "translateX(-110%) rotate(-8deg)"
        : exiting === "up"
          ? "translateY(-110%)"
          : exiting === "down"
            ? "translateY(110%)"
            : `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x * 0.03}deg)`;

  return (
    <>
      <div className="aes-snap-item relative h-dvh w-full shrink-0">
        <div
          className={cn(
            "absolute inset-2 overflow-hidden rounded-[2rem] sm:inset-4",
            "border border-[var(--aes-border)] shadow-[var(--aes-shadow-hover)] aes-grain",
            !dragging && !exiting && "transition-transform duration-300"
          )}
          style={{
            transform,
            opacity: exiting ? 0.85 : 1,
            transition: exiting ? "transform 0.26s ease, opacity 0.26s ease" : undefined,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={onTap}
          onContextMenu={(e) => {
            e.preventDefault();
            setQuickView(true);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.75)] via-transparent to-[rgba(10,10,10,0.15)]" />

          {/* Hints */}
          <div className="absolute left-5 top-1/2 -translate-y-1/2 rounded-2xl border border-[var(--aes-royal)]/40 bg-white/90 px-3 py-2 opacity-0 backdrop-blur-md transition" style={{ opacity: likeOpacity }}>
            <ShoppingBag className="h-5 w-5 text-[var(--aes-royal)]" />
          </div>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 rounded-2xl border border-[var(--aes-dusty)]/40 bg-white/90 px-3 py-2" style={{ opacity: passOpacity }}>
            <X className="h-5 w-5 text-[var(--aes-charcoal-muted)]" />
          </div>

          {wishlisted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-16 w-16 fill-[var(--aes-royal)] text-[var(--aes-royal)] animate-ping" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-6 pb-10">
            <div className="mb-2 flex flex-wrap gap-2">
              {product.tags.slice(0, 3).map((t) => (
                <span key={t} className="aes-mono rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/90 backdrop-blur-sm">
                  {t}
                </span>
              ))}
            </div>
            <p className="aes-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{brand?.name}</p>
            <h2 className="aes-display mt-1 text-3xl font-semibold italic text-white">{product.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm italic text-white/75">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-semibold text-white">${product.price}</span>
              <div className="flex gap-2">
                <button type="button" onClick={(e) => { e.stopPropagation(); commit("pass"); }} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md" aria-label="Pass">
                  <X className="h-5 w-5 text-white/80" />
                </button>
                <Link href={`/aesthetics/product/${product.slug}`} onClick={(e) => e.stopPropagation()} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md" aria-label="Details">
                  <Info className="h-5 w-5 text-white/80" />
                </Link>
                <button type="button" onClick={(e) => { e.stopPropagation(); commit("like"); }} className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--aes-royal)] shadow-lg" aria-label="Add to cart">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isActive && (
          <p className="aes-mono pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.25em] text-[var(--aes-dusty)]/50">
            ↑↓ navigate · ↔ decide · double-tap ♥ · hold quick view
          </p>
        )}
      </div>

      {quickView && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setQuickView(false)}>
          <div className="w-full max-w-lg rounded-t-3xl bg-[var(--aes-white)] p-6" style={{ animation: "aes-slide-up 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
            <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Quick view</p>
            <h3 className="aes-display mt-1 text-2xl font-semibold italic">{product.name}</h3>
            <p className="mt-2 text-sm text-[var(--aes-charcoal-muted)]">{product.description}</p>
            <p className="mt-4 text-xl font-semibold">${product.price}</p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => { addToCart(product); setQuickView(false); }} className="aes-btn aes-btn-primary flex-1 py-3 text-sm">Add to cart</button>
              <Link href={`/aesthetics/product/${product.slug}`} className="aes-btn aes-btn-secondary flex-1 py-3 text-center text-sm">Full details</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
