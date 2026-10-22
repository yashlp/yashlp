"use client";

import { useMemo, useState } from "react";
import { SHAPES } from "@/lib/metals/catalog-data";
import { matchSizes } from "@/lib/metals/size-prices";
import { useLiveStock } from "@/lib/metals/use-live-stock";

export function NoxSizePrices() {
  const { sizesFor, gradesFor, priceText } = useLiveStock();
  const [shape, setShape] = useState<string>(SHAPES[0]);
  const [grade, setGrade] = useState("EN-24");
  const [query, setQuery] = useState("");

  const grades = gradesFor(shape);
  const activeGrade = grades.includes(grade) ? grade : (grades[0] ?? "");
  const sizes = sizesFor(shape, activeGrade);
  const match = useMemo(() => matchSizes(sizes, query), [sizes, query]);

  const rows = useMemo(() => {
    const q = query.trim();
    const source = q && (match.exact || match.nearest.length)
      ? sizes.filter((s) => s === match.exact || match.nearest.includes(s))
      : sizes;
    return source.map((size) => ({
      size,
      price: priceText(shape, activeGrade, size),
      exact: size === match.exact,
      near: match.nearest.includes(size),
    }));
  }, [sizes, query, match, priceText, shape, activeGrade]);

  return (
    <section id="prices" className="nox-section">
      <div className="nox-container">
        <div className="nox-section-head">
          <div>
            <p className="nox-eyebrow">Live stock prices</p>
            <h2 className="nox-h2">Price for each size</h2>
            <p className="nox-body" style={{ marginTop: "0.75rem", maxWidth: "40rem" }}>
              Rs/kg saved in Stock Manager shows here for every size. Search a size to see that
              price and the nearest sizes.
            </p>
          </div>
        </div>

        <div className="nox-price-filters">
          <label className="nox-field">
            <span>Shape</span>
            <select
              value={shape}
              onChange={(e) => {
                setShape(e.target.value);
                setGrade("");
              }}
            >
              {SHAPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="nox-field">
            <span>Grade</span>
            <select value={activeGrade} onChange={(e) => setGrade(e.target.value)}>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="nox-field">
            <span>Search size</span>
            <input
              type="text"
              value={query}
              placeholder={shape === "Flat Bar" ? "e.g. 6x25" : "e.g. 47"}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        {rows.length === 0 ? (
          <p className="nox-body">No sizes listed for this grade.</p>
        ) : (
          <ul className="nox-price-list">
            {rows.map((row) => (
              <li
                key={row.size}
                className={
                  row.exact ? "nox-price-row exact" : row.near ? "nox-price-row near" : "nox-price-row"
                }
              >
                <span className="nox-price-size">
                  {row.size}
                  {row.size !== "Contact for size" ? " mm" : ""}
                  {row.exact ? " · exact" : row.near ? " · nearest" : ""}
                </span>
                <span className="nox-price-val">{row.price || "Price not set"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
