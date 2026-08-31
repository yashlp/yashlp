"use client";

import Link from "next/link";
import { useState } from "react";
import { FEATURED_GRADE_SLUGS, GRADES, SHAPES, getGrade } from "@/lib/metals/catalog";
import { BarArt, ElementTiles } from "./bar-art";

const TONE: Record<string, string> = {
  carbon: "steel",
  alloy: "alloy",
  tool: "tool",
  case: "case",
  stainless: "stainless",
  nonferrous: "nonferrous",
};

export function ShopCatalog() {
  const [tab, setTab] = useState<"alloy" | "shape">("alloy");
  const grades = FEATURED_GRADE_SLUGS.map((s) => getGrade(s)!).filter(Boolean);

  return (
    <section className="border-t border-white/[0.04] py-20" id="materials">
      <div className="jk-wrap">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <p className="jk-kicker">Cut to size</p>
            <h2 id="materials-heading" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Shop steel by grade or shape
            </h2>
          </div>
          <div className="jk-tabs" role="tablist" aria-label="Shop by">
            <button type="button" role="tab" className="jk-tab" data-active={tab === "alloy"} onClick={() => setTab("alloy")}>
              By grade
            </button>
            <button type="button" role="tab" className="jk-tab" data-active={tab === "shape"} onClick={() => setTab("shape")}>
              By shape
            </button>
          </div>
        </div>

        {tab === "alloy" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {grades.map((g) => (
              <article key={g.slug} className="catalog-card group" data-tone={TONE[g.family] ?? "steel"}>
                <Link href={`/metals/materials/${g.slug}`} className="flex h-full flex-col">
                  <BarArt shape="alloy" className="jk-bar-art" />
                  <div className="flex h-16 shrink-0 flex-col items-center justify-center px-4 text-center">
                    <h3 className="text-lg font-semibold tracking-tight">{g.name}</h3>
                    <p className="jk-mono mt-1 text-xs uppercase tracking-[0.12em] text-black/50">{g.tagline}</p>
                  </div>
                </Link>
                <span className="catalog-toggle" aria-hidden="true">
                  <span className="catalog-plus">+</span>
                  <span className="catalog-times">×</span>
                </span>
                <div className="catalog-overlay">
                  <span className="w-fit bg-black px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-[0.1em] text-white">
                    {g.name}
                  </span>
                  <p className="line-clamp-2 text-[13px] leading-snug text-neutral-800">{g.overlay}</p>
                  <ElementTiles items={g.composition} />
                  <div className="mt-auto flex gap-2 pt-2">
                    <Link href={`/metals/materials/${g.slug}`} className="text-xs font-medium underline underline-offset-2">
                      View specs
                    </Link>
                    <Link href={`/metals/quote?grade=${g.slug}`} className="text-xs font-medium underline underline-offset-2">
                      Quote
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHAPES.map((s) => (
              <article key={s.id} className="catalog-card group" data-tone="shape">
                <Link href={s.href} className="flex h-full flex-col">
                  <BarArt shape={s.id} className="jk-bar-art" />
                  <div className="flex h-16 shrink-0 flex-col items-center justify-center px-4 text-center">
                    <h3 className="text-lg font-semibold tracking-tight">{s.name}</h3>
                    <p className="jk-mono mt-1 text-xs uppercase tracking-[0.12em] text-white/50">{s.tagline}</p>
                  </div>
                </Link>
                <span className="catalog-toggle" aria-hidden="true">
                  <span className="catalog-plus">+</span>
                  <span className="catalog-times">×</span>
                </span>
                <div className="catalog-overlay">
                  <span className="w-fit bg-black px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-[0.1em] text-white">
                    {s.name}
                  </span>
                  <p className="text-[13px] leading-snug text-neutral-800">{s.overlay}</p>
                  <div className="mt-auto flex flex-wrap gap-1" aria-label="Available grades">
                    {GRADES.filter((g) =>
                      s.id === "non-ferrous" ? g.family === "stainless" || g.family === "nonferrous" : true
                    )
                      .slice(0, 6)
                      .map((g) => (
                        <Link
                          key={g.slug}
                          href={`/metals/quote?grade=${g.slug}&shape=${s.id}`}
                          className="min-w-[52px] border border-neutral-300 bg-white px-2 py-1 text-neutral-900 hover:bg-black hover:text-white"
                        >
                          <span className="block text-[13px] font-bold leading-none">{g.name.split(" ")[0]}</span>
                        </Link>
                      ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
