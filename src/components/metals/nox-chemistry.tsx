"use client";

import { useMemo, useState } from "react";
import { CHEM_COMP } from "@/lib/metals/builtin-catalog";
import { getAllGrades } from "@/lib/metals/catalog-queries";

const ELEMENTS = ["C", "Mn", "Si", "Cr", "Ni", "Mo"] as const;

function chemForGrade(grade: string): Record<string, string> | null {
  if (CHEM_COMP[grade]) return CHEM_COMP[grade];
  const base = grade.split(" / ")[0];
  if (CHEM_COMP[base]) return CHEM_COMP[base];
  if (grade.startsWith("SS")) {
    return CHEM_COMP[grade] ?? { C: "—", Mn: "—", Si: "—", Cr: "—", Ni: "—", Mo: "—" };
  }
  return null;
}

const GRADES_WITH_CHEM = getAllGrades().filter((g) => chemForGrade(g));

export function NoxChemistry() {
  const [mode, setMode] = useState<"single" | "compare">("single");
  const [singleGrade, setSingleGrade] = useState(GRADES_WITH_CHEM[0] ?? "EN-24");
  const [compareGrades, setCompareGrades] = useState<string[]>(["EN-24", "EN-19 (4140)", "MS"]);

  const compareRows = useMemo(
    () => compareGrades.filter((g) => chemForGrade(g)),
    [compareGrades]
  );

  function toggleCompare(grade: string) {
    setCompareGrades((prev) => {
      if (prev.includes(grade)) return prev.filter((g) => g !== grade);
      if (prev.length >= 3) return [...prev.slice(1), grade];
      return [...prev, grade];
    });
  }

  const single = chemForGrade(singleGrade);

  return (
    <section id="chemistry" className="nox-section">
      <div className="nox-container">
        <div className="nox-section-head">
          <div>
            <p className="nox-eyebrow">Technical data</p>
            <h2 className="nox-h2">Chemical composition</h2>
            <p className="nox-body" style={{ marginTop: "0.75rem", maxWidth: "36rem" }}>
              View grade chemistry or compare up to three grades side by side (C, Mn, Si, Cr, Ni, Mo
              percentage).
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
                {GRADES_WITH_CHEM.map((g) => (
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
                  {ELEMENTS.map((el) => (
                    <tr key={el}>
                      <td>{el}</td>
                      <td>{single[el] ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="nox-body">Composition data not available for this grade.</p>
            )}
          </div>
        ) : (
          <div className="nox-chem-panel">
            <p className="nox-chem-hint">Select up to 3 grades to compare:</p>
            <div className="nox-chem-checks">
              {GRADES_WITH_CHEM.map((g) => (
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
                    {ELEMENTS.map((el) => (
                      <tr key={el}>
                        <td>{el}</td>
                        {compareRows.map((g) => (
                          <td key={`${g}-${el}`}>{chemForGrade(g)?.[el] ?? "—"}</td>
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
