"use client";

import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { useMetals } from "./metals-provider";
import { SHAPES } from "@/lib/metals/catalog-data";
import {
  getAllGrades,
  getGradesForShape,
  getShapesForGrade,
  getSizesForGradeAndShape,
} from "@/lib/metals/catalog-queries";

export function GetMetalSheet() {
  const { sheetOpen, enquiry, setEnquiry, closeGetMetal, submitEnquiry } = useMetals();

  const gradeOptions = useMemo(() => {
    if (enquiry.shape) return getGradesForShape(enquiry.shape);
    return getAllGrades();
  }, [enquiry.shape]);

  const shapeOptions = useMemo(() => {
    if (enquiry.grade) return getShapesForGrade(enquiry.grade);
    return [...SHAPES];
  }, [enquiry.grade]);

  const sizeOptions = useMemo(
    () => getSizesForGradeAndShape(enquiry.grade, enquiry.shape),
    [enquiry.grade, enquiry.shape]
  );

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  useEffect(() => {
    if (!sheetOpen) return;
    if (enquiry.grade && !shapeOptions.includes(enquiry.shape as (typeof shapeOptions)[number])) {
      setEnquiry({ shape: shapeOptions[0] ?? enquiry.shape, sizeMm: "" });
    }
  }, [sheetOpen, enquiry.grade, enquiry.shape, shapeOptions, setEnquiry]);

  useEffect(() => {
    if (!sheetOpen || !enquiry.grade || !enquiry.shape) return;
    if (sizeOptions.length && !sizeOptions.includes(enquiry.sizeMm)) {
      setEnquiry({ sizeMm: "" });
    }
  }, [sheetOpen, enquiry.grade, enquiry.shape, enquiry.sizeMm, sizeOptions, setEnquiry]);

  if (!sheetOpen) return null;

  const valid =
    enquiry.grade.trim() &&
    enquiry.shape &&
    enquiry.sizeMm.trim() &&
    enquiry.lengthMm.trim() &&
    enquiry.quantityKg.trim();

  const sizeLabel =
    enquiry.shape === "Flat Bar" ? "Size (thickness × width mm)" : "Size (mm)";

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
          Select from stocked grades and sizes. We&apos;ll confirm everything in live chat before
          payment.
        </p>

        <form
          className="nox-sheet-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) submitEnquiry();
          }}
        >
          <label className="nox-field">
            <span>Shape</span>
            <select
              value={enquiry.shape}
              onChange={(e) =>
                setEnquiry({ shape: e.target.value, grade: "", sizeMm: "" })
              }
              required
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
            <select
              value={enquiry.grade}
              onChange={(e) => setEnquiry({ grade: e.target.value, sizeMm: "" })}
              required
            >
              <option value="">Select grade</option>
              {gradeOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="nox-field">
            <span>{sizeLabel}</span>
            <select
              value={enquiry.sizeMm}
              onChange={(e) => setEnquiry({ sizeMm: e.target.value })}
              required
              disabled={!enquiry.grade || sizeOptions.length === 0}
            >
              <option value="">
                {!enquiry.grade
                  ? "Select grade first"
                  : sizeOptions.length === 0
                    ? "No sizes listed"
                    : "Select size"}
              </option>
              {sizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                  {s !== "Contact for size" ? " mm" : ""}
                </option>
              ))}
            </select>
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
