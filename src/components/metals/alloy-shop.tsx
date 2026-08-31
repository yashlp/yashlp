"use client";

import Link from "next/link";
import { useState } from "react";
import { featuredGrades, SHAPES, type Grade } from "@/lib/metals/catalog";

function Chem({ grade }: { grade: Grade }) {
  return (
    <div className="jk-chem">
      {grade.chemistry.map((el) => (
        <div className="jk-el" key={el.sym}>
          <div className="z">{el.z}</div>
          <div className="sym">{el.sym}</div>
          <div className="pct">{el.pct}</div>
        </div>
      ))}
    </div>
  );
}

export function AlloyShop() {
  const [mode, setMode] = useState<"alloy" | "shape">("alloy");
  const grades = featuredGrades();

  return (
    <section className="jk-section" id="shop">
      <div className="jk-section-inner">
        <h2 className="jk-h2">Shop steel by alloy or shape</h2>
        <div className="jk-tabs">
          <button type="button" className={`jk-tab${mode === "alloy" ? " on" : ""}`} onClick={() => setMode("alloy")}>
            By alloy
          </button>
          <button type="button" className={`jk-tab${mode === "shape" ? " on" : ""}`} onClick={() => setMode("shape")}>
            By shape
          </button>
        </div>

        {mode === "alloy" ? (
          <div className="jk-grid-4">
            {grades.map((g) => (
              <article className="jk-card" key={g.slug}>
                <div className="jk-card-mark">{g.name.split(" ")[0]}</div>
                <h3>{g.name}</h3>
                <p className="sub">{g.headline}</p>
                <p className="blurb">{g.blurb}</p>
                <Chem grade={g} />
                <div className="jk-card-foot">
                  <div className="jk-chips">
                    {g.chips.slice(0, 2).map((c) => (
                      <span className="jk-chip" key={c}>
                        {c}
                      </span>
                    ))}
                  </div>
                  <Link className="jk-shop" href={`/metals/materials/${g.slug}`}>
                    Shop now →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="jk-grid-4">
            {SHAPES.map((s) => (
              <article className="jk-card" key={s.id}>
                <div className="jk-card-mark">{s.name.split(" ")[0]}</div>
                <h3>{s.name}</h3>
                <p className="sub">{s.range}</p>
                <p className="blurb">{s.blurb}</p>
                <div className="jk-card-foot">
                  <div className="jk-chips">
                    <span className="jk-chip">EN-8</span>
                    <span className="jk-chip">EN-19</span>
                    <span className="jk-chip">WPS</span>
                    <span className="jk-chip">MS</span>
                  </div>
                  <Link className="jk-shop" href={s.href}>
                    Shop now →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
