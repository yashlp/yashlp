"use client";

import Link from "next/link";
import { useState } from "react";
import { GRADE_PRODUCTS, SHAPE_PRODUCTS } from "@/lib/metals/catalog";

type Tab = "grade" | "shape";

export function ProductShowcase() {
  const [tab, setTab] = useState<Tab>("grade");

  return (
    <section id="shop" className="border-b border-neutral-800 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              Cut to size
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Shop steel by grade or shape
            </h2>
          </div>

          <div
            className="inline-flex h-auto w-fit rounded-none border border-neutral-800 bg-black p-0"
            role="tablist"
            aria-label="Shop by"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "grade"}
              onClick={() => setTab("grade")}
              className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                tab === "grade"
                  ? "metals-tab-active text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              By grade
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "shape"}
              onClick={() => setTab("shape")}
              className={`border-l border-neutral-800 px-5 py-2.5 text-sm font-medium transition-colors ${
                tab === "shape"
                  ? "metals-tab-active text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              By shape
            </button>
          </div>
        </div>

        {tab === "grade" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GRADE_PRODUCTS.map((product) => (
              <article key={product.id} className="metals-card group rounded-xl p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                      {product.tagline}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-white">{product.name}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{product.description}</p>

                {product.badges && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.badges.map((badge) => (
                      <span key={badge} className="metals-badge">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {product.chemistry.map((el) => (
                    <div key={el.symbol} className="metals-chem-pill">
                      <span className="symbol">{el.symbol}</span>
                      <span className="value">{el.value}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs text-neutral-600">
                  Shapes: {product.shapes.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHAPE_PRODUCTS.map((shape) => (
              <article key={shape.id} className="metals-card rounded-xl p-6">
                <h3 className="text-xl font-bold text-white">{shape.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{shape.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {shape.grades.map((grade) => (
                    <span key={grade} className="metals-badge">
                      {grade}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/metals/search" className="metals-btn-primary">
            Search live stock &amp; prices
          </Link>
        </div>
      </div>
    </section>
  );
}
