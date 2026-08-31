"use client";

import { useEffect, useMemo, useState } from "react";
import { CHEM_ELEMENTS } from "@/lib/metals/chem-catalog";
import { useLiveChemCatalog } from "@/lib/metals/use-live-chem-catalog";

export function NoxChemistry() {
  const { grades, chemFor } = useLiveChemCatalog();
  const [mode, setMode] = useState<"single" | "compare">("single");
  const [singleGrade, setSingleGrade] = useState("");
  const [compareGrades, setCompareGrades] = useState<string[]>([]);

  useEffect(() => {
    if (!grades.length) return;
    setSingleGrade((prev) => (prev && grades.includes(prev) ? prev : grades[0]));
    setCompareGrades((prev) => {
      const kept = prev.filter((g) => grades.includes(g));
      if (kept.length) return kept;
      return grades.slice(0, Math.min(3, grades.length));
    });
  }, [grades]);

  const compareRows = useMemo(
    () => compareGrades.filter((g) => grades.includes(g)),
    [compareGrades, grades]
  );

  function toggleCompare(grade: string) {
    setCompareGrades((prev) => {
      if (prev.includes(grade)) return prev.filter((g) => g !== grade);
      if (prev.length >= 3) return [...prev.slice(1), grade];
      return [...prev, grade];
    });
  }

  const single = singleGrade ? chemFor(singleGrade) : null;

  return (
    <section id="chemistry" className="nox-section">
      <div className="nox-container">
        <div className="nox-section-head">
          <div>
            <p className="nox-eyebrow">Technical data</p>
            <h2 className="nox-h2">Chemical composition</h2>
            <p className="nox-body" style={{ marginTop: "0.75rem", maxWidth: "36rem" }}>
              View grade chemistry or compare up to three grades side by side (C, Mn, Si, Cr, Ni, Mo
              percentage). New grades added in Stock Manager appear here automatically.
            </p>
          </div>
          <div className="nox-tabs" role="tablist" aria-label="Chemistry view">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "single"}
              className={mode === "single" ? "nox-tab on" : "nox-tab"}
              onClick={() => setMode("single")}
            >
              Single grade
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "compare"}
              className={mode === "compare" ? "nox-tab on" : "nox-tab"}
              onClick={() => setMode("compare")}
            >
              Compare grades
            </button>
          </div>
        </div>

        {mode === "single" ? (
          <div className="nox-chem-panel">
            <label className="nox-field" style={{ maxWidth: "280px" }}>
              <span>Select grade</span>
              <select value={singleGrade} onChange={(e) => setSingleGrade(e.target.value)}>
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            {single ? (
              <table className="nox-chem-table">
                <thead>
                  <tr>
                    <th>Element</th>
                    <th>Composition (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {CHEM_ELEMENTS.map((el) => (
                    <tr key={el}>
                      <td>{el}</td>
                      <td>{single[el] ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="nox-body">No grades in catalog yet.</p>
            )}
          </div>
        ) : (
          <div className="nox-chem-panel">
            <p className="nox-chem-hint">Select up to 3 grades to compare:</p>
            <div className="nox-chem-checks">
              {grades.map((g) => (
                <label key={g} className="nox-chem-check">
                  <input
                    type="checkbox"
                    checked={compareGrades.includes(g)}
                    onChange={() => toggleCompare(g)}
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
            {compareRows.length > 0 ? (
              <div className="nox-chem-scroll">
                <table className="nox-chem-table">
                  <thead>
                    <tr>
                      <th>Element</th>
                      {compareRows.map((g) => (
                        <th key={g}>{g}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CHEM_ELEMENTS.map((el) => (
                      <tr key={el}>
                        <td>{el}</td>
                        {compareRows.map((g) => (
                          <td key={`${g}-${el}`}>{chemFor(g)[el] ?? "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="nox-body">Select at least one grade above.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
