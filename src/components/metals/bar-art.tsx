"use client";

import { useId } from "react";
import type { ShapeId } from "@/lib/metals/catalog";

export function BarArt({ shape, className }: { shape: ShapeId | "alloy"; className?: string }) {
  const gid = useId().replace(/:/g, "");
  if (shape === "round" || shape === "non-ferrous" || shape === "alloy") {
    return (
      <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-round`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f3efe6" />
            <stop offset="45%" stopColor="#c5bfb3" />
            <stop offset="100%" stopColor="#8f887c" />
          </linearGradient>
        </defs>
        <ellipse cx="168" cy="60" rx="22" ry="36" fill={`url(#${gid}-round)`} stroke="#6f6a60" strokeWidth="1" />
        <rect x="18" y="24" width="150" height="72" fill={`url(#${gid}-round)`} />
        <ellipse cx="18" cy="60" rx="16" ry="36" fill="#ddd7cc" stroke="#6f6a60" strokeWidth="1" />
        <path d="M18 28h150 M18 92h150" stroke="#fff" strokeOpacity="0.25" />
      </svg>
    );
  }
  if (shape === "square") {
    return (
      <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-sq`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ece7dc" />
            <stop offset="100%" stopColor="#8a8478" />
          </linearGradient>
        </defs>
        <path d="M20 40h120l30 18v44H50L20 84Z" fill={`url(#${gid}-sq)`} stroke="#6a655c" />
        <path d="M140 40l30 18-30 18-30-18Z" fill="#d8d2c6" stroke="#6a655c" />
      </svg>
    );
  }
  if (shape === "flat") {
    return (
      <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-flat`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f6f1e6" />
            <stop offset="100%" stopColor="#9a9386" />
          </linearGradient>
        </defs>
        <rect x="16" y="44" width="168" height="32" rx="2" fill={`url(#${gid}-flat)`} stroke="#6a655c" />
        <rect x="16" y="44" width="168" height="6" fill="#fff" fillOpacity="0.25" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-hex`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#efeae0" />
            <stop offset="100%" stopColor="#857e72" />
          </linearGradient>
        </defs>
        <polygon points="30,60 50,28 150,28 170,60 150,92 50,92" fill={`url(#${gid}-hex)`} stroke="#6a655c" />
      <polygon points="150,28 175,48 175,72 150,92 150,28" fill="#cfc8bc" stroke="#6a655c" />
    </svg>
  );
}

export function ElementTiles({
  items,
}: {
  items: { z: number; symbol: string; pct: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1" aria-label="Typical composition">
      {items.map((el) => (
        <div key={el.symbol} className="jk-tile">
          <p className="z">{el.z}</p>
          <p className="sym">{el.symbol}</p>
          <p className="pct">{el.pct}</p>
        </div>
      ))}
    </div>
  );
}
