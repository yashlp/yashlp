import {
  BUILTIN_DB,
  SHAPES_LIST,
  type CatalogEntry,
  type ShapeName,
} from "./builtin-catalog";

function uniqSortNums(a: number[]): number[] {
  const o: number[] = [];
  for (const n of a) {
    if (!o.some((x) => Math.abs(x - n) < 0.0001)) o.push(n);
  }
  return o.sort((x, y) => x - y);
}

function sizeSortKey(label: string): number {
  if (label.includes("×")) {
    const [t] = label.split("×");
    return parseFloat(t) || 0;
  }
  return parseFloat(label) || 0;
}

export function formatRoundSize(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n);
}

/** All unique grade names in catalog order */
export function getAllGrades(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const shape of SHAPES_LIST) {
    for (const e of BUILTIN_DB[shape]) {
      if (!seen.has(e.g)) {
        seen.add(e.g);
        out.push(e.g);
      }
    }
  }
  return out;
}

export function getGradesForShape(shape: string): string[] {
  const entries = BUILTIN_DB[shape as ShapeName];
  if (!entries) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of entries) {
    if (!seen.has(e.g)) {
      seen.add(e.g);
      out.push(e.g);
    }
  }
  return out;
}

export function getShapesForGrade(grade: string): ShapeName[] {
  const out: ShapeName[] = [];
  for (const shape of SHAPES_LIST) {
    if (BUILTIN_DB[shape].some((e) => e.g === grade)) {
      out.push(shape);
    }
  }
  return out;
}

function sizesFromEntry(e: CatalogEntry): string[] {
  if (e.note) return ["Contact for size"];
  const out: string[] = [];
  if (e.sz) {
    for (const n of uniqSortNums(e.sz)) out.push(formatRoundSize(n));
  }
  if (e.flat) {
    const thicknesses = Object.keys(e.flat)
      .map(Number)
      .sort((a, b) => a - b);
    for (const t of thicknesses) {
      const widths = e.flat[t] ?? e.flat[String(t)] ?? [];
      for (const w of uniqSortNums(widths)) {
        out.push(`${t}×${formatRoundSize(w)}`);
      }
    }
  }
  return out;
}

/** Sold sizes for exact grade + shape (union across sub-types) */
export function getSizesForGradeAndShape(grade: string, shape: string): string[] {
  const entries = BUILTIN_DB[shape as ShapeName];
  if (!entries || !grade) return [];
  const set = new Set<string>();
  for (const e of entries) {
    if (e.g !== grade) continue;
    for (const s of sizesFromEntry(e)) set.add(s);
  }
  return Array.from(set).sort((a, b) => sizeSortKey(a) - sizeSortKey(b));
}

export function getSubtypesForGradeAndShape(grade: string, shape: string): string[] {
  const entries = BUILTIN_DB[shape as ShapeName] ?? [];
  const set = new Set<string>();
  for (const e of entries) {
    if (e.g === grade) set.add(e.s.toUpperCase());
  }
  return Array.from(set);
}

export function getEntriesForGrade(grade: string): { shape: ShapeName; entry: CatalogEntry }[] {
  const out: { shape: ShapeName; entry: CatalogEntry }[] = [];
  for (const shape of SHAPES_LIST) {
    for (const entry of BUILTIN_DB[shape]) {
      if (entry.g === grade) out.push({ shape, entry });
    }
  }
  return out;
}
