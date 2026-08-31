"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useMetals } from "./metals-provider";
import { ALL_GRADES, SHAPES } from "@/lib/metals/catalog-data";

export function GetMetalSheet() {
  const { sheetOpen, enquiry, setEnquiry, closeGetMetal, submitEnquiry } = useMetals();

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  if (!sheetOpen) return null;

  const valid =
    enquiry.grade.trim() &&
    enquiry.shape &&
    enquiry.sizeMm.trim() &&
    enquiry.lengthMm.trim() &&
    enquiry.quantityKg.trim();

  return (
    <>
      <button
        type="button"
        className="nox-overlay"
        aria-label="Close"
        onClick={closeGetMetal}
      />
      <aside className="nox-sheet" role="dialog" aria-labelledby="get-metal-title">
        <div className="nox-sheet-header">
          <div>
            <p className="nox-sheet-eyebrow">Instant enquiry</p>
            <h2 id="get-metal-title" className="nox-sheet-title">
              Get Metal
            </h2>
          </div>
          <button type="button" onClick={closeGetMetal} className="nox-icon-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <p className="nox-sheet-desc">
          Tell us what you need. Alloy, dimensions, quantity. We&apos;ll confirm everything in live
          chat before payment.
        </p>

        <form
          className="nox-sheet-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) submitEnquiry();
          }}
        >
          <label className="nox-field">
            <span>Grade</span>
            <select
              value={enquiry.grade}
              onChange={(e) => setEnquiry({ grade: e.target.value })}
              required
            >
              <option value="">Select grade</option>
              {ALL_GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="nox-field">
            <span>Shape</span>
            <select
              value={enquiry.shape}
              onChange={(e) => setEnquiry({ shape: e.target.value })}
              required
            >
              {SHAPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="nox-field-row">
            <label className="nox-field">
              <span>Size (mm)</span>
              <input
                type="number"
                min="1"
                step="0.1"
                placeholder="e.g. 50"
                value={enquiry.sizeMm}
                onChange={(e) => setEnquiry({ sizeMm: e.target.value })}
                required
              />
            </label>
            <label className="nox-field">
              <span>Length (mm)</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 1000"
                value={enquiry.lengthMm}
                onChange={(e) => setEnquiry({ lengthMm: e.target.value })}
                required
              />
            </label>
          </div>

          <label className="nox-field">
            <span>Quantity (kg)</span>
            <input
              type="number"
              min="0.1"
              step="0.1"
              placeholder="e.g. 25"
              value={enquiry.quantityKg}
              onChange={(e) => setEnquiry({ quantityKg: e.target.value })}
              required
            />
          </label>

          <button type="submit" className="nox-enquiry-btn" disabled={!valid}>
            Enquiry Now
            <span className="nox-enquiry-arrow">→</span>
          </button>
        </form>
      </aside>
    </>
  );
}
