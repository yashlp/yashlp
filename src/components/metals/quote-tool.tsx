"use client";

import { useMemo, useState } from "react";
import {
  COMPANY,
  GRADES,
  SHAPES,
  inr,
  kgLabel,
  searchStock,
  weightKg,
  type ShapeId,
} from "@/lib/metals/catalog";

const DEFAULT_LENGTH = 1000;

export function QuoteTool({
  presetGrade,
  presetShape,
}: {
  presetGrade?: string;
  presetShape?: ShapeId;
}) {
  const [shape, setShape] = useState<ShapeId>(presetShape ?? "round");
  const [gradeSlug, setGradeSlug] = useState(presetGrade ?? "en-8");
  const [dia, setDia] = useState("50");
  const [thk, setThk] = useState("20");
  const [wid, setWid] = useState("75");
  const [len, setLen] = useState(String(DEFAULT_LENGTH));
  const [qty, setQty] = useState("1");

  const grade = GRADES.find((g) => g.slug === gradeSlug) ?? GRADES[0];
  const lengthMm = Number(len) || 0;
  const qtyN = Math.max(1, Number(qty) || 1);
  const sizeMm = shape === "flat" ? Number(thk) : Number(dia);

  const kg = useMemo(
    () =>
      weightKg({
        shape,
        density: grade.density,
        diameterMm: Number(dia) || undefined,
        sideMm: Number(dia) || undefined,
        thicknessMm: Number(thk) || undefined,
        widthMm: Number(wid) || undefined,
        lengthMm,
        qty: qtyN,
      }),
    [shape, grade.density, dia, thk, wid, lengthMm, qtyN]
  );

  const total = kg * grade.pricePerKg;
  const hits = useMemo(
    () =>
      searchStock({
        shape,
        gradeQuery: grade.name,
        sizeMm: Number.isFinite(sizeMm) ? sizeMm : undefined,
        thicknessMm: Number(thk) || undefined,
        widthMm: Number(wid) || undefined,
      }).slice(0, 8),
    [shape, grade.name, sizeMm, thk, wid]
  );

  const spec = [
    grade.name,
    SHAPES.find((s) => s.id === shape)?.name,
    shape === "flat" ? `${thk}×${wid}×${len} mm` : `Ø/AF ${dia} × ${len} mm`,
    `qty ${qtyN}`,
  ].join(" · ");

  const wa = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
    `Quote request from jagetiyametals site:\n${spec}\nEst. ${kgLabel(kg)} · ${inr(total)} (indicative)`
  )}`;

  return (
    <div className="jk-quote-grid">
      <div className="jk-form">
        <div>
          <div className="jk-label">Shape</div>
          <select className="jk-field" value={shape} onChange={(e) => setShape(e.target.value as ShapeId)}>
            {SHAPES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="jk-label">Grade</div>
          <select className="jk-field" value={grade.slug} onChange={(e) => setGradeSlug(e.target.value)}>
            {GRADES.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        {shape === "flat" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            <div>
              <div className="jk-label">Thickness mm</div>
              <input className="jk-field" inputMode="decimal" value={thk} onChange={(e) => setThk(e.target.value)} />
            </div>
            <div>
              <div className="jk-label">Width mm</div>
              <input className="jk-field" inputMode="decimal" value={wid} onChange={(e) => setWid(e.target.value)} />
            </div>
            <div>
              <div className="jk-label">Length mm</div>
              <input className="jk-field" inputMode="decimal" value={len} onChange={(e) => setLen(e.target.value)} />
            </div>
            <div>
              <div className="jk-label">Qty</div>
              <input className="jk-field" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div>
              <div className="jk-label">{shape === "hex" ? "AF mm" : shape === "square" ? "Side mm" : "Diameter mm"}</div>
              <input className="jk-field" inputMode="decimal" value={dia} onChange={(e) => setDia(e.target.value)} />
            </div>
            <div>
              <div className="jk-label">Length mm</div>
              <input className="jk-field" inputMode="decimal" value={len} onChange={(e) => setLen(e.target.value)} />
            </div>
            <div>
              <div className="jk-label">Qty</div>
              <input className="jk-field" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
          </div>
        )}

        <div className="jk-table-wrap">
          <table className="jk-table">
            <thead>
              <tr>
                <th>Shape</th>
                <th>Grade</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Weight</th>
                <th>Est. total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{SHAPES.find((s) => s.id === shape)?.name}</td>
                <td>{grade.name}</td>
                <td>{shape === "flat" ? `${thk}×${wid}×${len}` : `${dia} × ${len}`}</td>
                <td>{qtyN}</td>
                <td>{kgLabel(kg)}</td>
                <td>{inr(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: "#8a8a8a", fontSize: 13, lineHeight: 1.5 }}>
          Indicative landed estimate at {inr(grade.pricePerKg)}/kg. Live mill rate, cut charge, and GST confirmed on
          WhatsApp or phone. Standard cut tolerance −0 / +2 mm on hydraulic bandsaw.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="jk-btn jk-btn-solid" href={wa}>
            Send on WhatsApp
          </a>
          <a className="jk-btn jk-btn-ghost" href={`tel:${COMPANY.phonePrimaryTel}`}>
            Call {COMPANY.phonePrimary}
          </a>
        </div>
      </div>

      <div>
        <div className="jk-kicker">Live stock match</div>
        <h3 style={{ color: "#fff", fontSize: 22, margin: "8px 0 14px" }}>What we have on the floor</h3>
        {hits.length === 0 ? (
          <p style={{ color: "#8a8a8a" }}>No matching lots. Call us — forging and import cover Ø 550 mm.</p>
        ) : (
          hits.map((h, i) => (
            <div className="jk-hit" key={`${h.grade.slug}-${h.form.subtype}-${i}`}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong style={{ color: "#fff" }}>{h.grade.name}</strong>
                <span className={h.exact ? "jk-ok" : "jk-warn"}>{h.exact ? "IN STOCK" : "NEAREST"}</span>
              </div>
              <p style={{ marginTop: 6, color: "#bdbdbd", fontSize: 13 }}>
                {h.form.subtype}
                {h.form.mill ? ` · ${h.form.mill}` : ""}
              </p>
              <p style={{ marginTop: 6, fontFamily: "var(--jk-mono)", fontSize: 12, color: "#cfcfcf" }}>{h.sizeLabel}</p>
              {(h.below.length > 0 || h.above.length > 0) && (
                <p style={{ marginTop: 6, fontSize: 12, color: "#8a8a8a" }}>
                  Below: {h.below.join(", ") || "—"} · Above: {h.above.join(", ") || "—"}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
