import {
  type Grade,
  type ShapeId,
  type StockLine,
  GRADES,
  STOCK,
  gradeByCatalogKey,
  hasExactSize,
  nearestSizes,
  getGrade,
} from "./catalog";

const STEEL_SHAPES: ShapeId[] = ["round", "square", "flat", "hex"];

export type QuoteDims = {
  diameterMm?: number;
  sideMm?: number;
  thicknessMm?: number;
  widthMm?: number;
  lengthMm: number;
  qty: number;
};

export type QuoteLineInput = {
  gradeSlug: string;
  shape: ShapeId;
  dims: QuoteDims;
};

export type StockMatch = {
  line: StockLine;
  exact: boolean;
  nearest?: { below: number[]; above: number[] };
  flatExact?: boolean;
};

export function hexAreaMm2(acrossFlatsMm: number): number {
  // Regular hexagon area from across-flats (AF): (√3 / 2) * AF²
  return (Math.sqrt(3) / 2) * acrossFlatsMm * acrossFlatsMm;
}

export function crossSectionMm2(shape: ShapeId, dims: QuoteDims): number {
  if (shape === "round") {
    const d = dims.diameterMm ?? 0;
    return Math.PI * (d / 2) * (d / 2);
  }
  if (shape === "square") {
    const s = dims.sideMm ?? 0;
    return s * s;
  }
  if (shape === "hex") {
    return hexAreaMm2(dims.sideMm ?? dims.diameterMm ?? 0);
  }
  if (shape === "flat") {
    return (dims.thicknessMm ?? 0) * (dims.widthMm ?? 0);
  }
  const d = dims.diameterMm ?? dims.sideMm ?? 0;
  return Math.PI * (d / 2) * (d / 2);
}

/** Weight in kilograms for one piece. density is g/cm³. */
export function pieceWeightKg(shape: ShapeId, dims: QuoteDims, density: number): number {
  const volumeMm3 = crossSectionMm2(shape, dims) * dims.lengthMm;
  return (volumeMm3 * density) / 1_000_000;
}

export function matchStock(grade: Grade, shape: ShapeId, dims: QuoteDims): StockMatch[] {
  const keys = new Set(grade.catalogKeys.map((k) => k.toUpperCase()));
  const lines = STOCK.filter((s) => keys.has(s.grade.toUpperCase()) && s.shape === shape);
  if (!lines.length) {
    const fallback = STOCK.filter((s) => keys.has(s.grade.toUpperCase()));
    return fallback.map((line) => ({ line, exact: Boolean(line.noteOnly) }));
  }

  return lines.map((line) => {
    if (line.noteOnly) return { line, exact: true };
    if (shape === "flat" && line.flats) {
      const thk = dims.thicknessMm ?? 0;
      const wid = dims.widthMm ?? 0;
      const thkKey = Object.keys(line.flats).find((k) => Math.abs(Number(k) - thk) < 0.0001);
      const widths = thkKey ? line.flats[thkKey] : undefined;
      const exact = Boolean(widths?.some((w) => Math.abs(w - wid) < 0.0001));
      const allThk = Object.keys(line.flats).map(Number);
      const nearest = nearestSizes(allThk, thk, 3);
      return { line, exact, flatExact: exact, nearest };
    }
    const size = dims.diameterMm ?? dims.sideMm ?? 0;
    const exact = hasExactSize(line, size);
    const nearest = nearestSizes(line.sizesMm ?? [], size, 3);
    return { line, exact, nearest };
  });
}

export type QuoteResult = {
  grade: Grade;
  shape: ShapeId;
  dims: QuoteDims;
  weightEachKg: number;
  weightTotalKg: number;
  unitPrice: number;
  total: number;
  inStock: boolean;
  matches: StockMatch[];
  leadTime: string;
};

export function quoteLine(input: QuoteLineInput): QuoteResult | null {
  const grade = getGrade(input.gradeSlug) ?? gradeByCatalogKey(input.gradeSlug);
  if (!grade) return null;
  const qty = Math.max(1, Math.floor(input.dims.qty || 1));
  const lengthMm = Math.max(1, input.dims.lengthMm || 1000);
  const dims = { ...input.dims, qty, lengthMm };
  const weightEachKg = pieceWeightKg(input.shape, dims, grade.density);
  const weightTotalKg = weightEachKg * qty;
  const matches = matchStock(grade, input.shape, dims);
  const inStock =
    matches.some((m) => m.exact) ||
    (input.shape === "non-ferrous" && matches.length > 0) ||
    (!STEEL_SHAPES.includes(input.shape) && matches.some((m) => m.line.noteOnly));
  const unitPrice = Math.round(weightEachKg * grade.pricePerKg);
  const total = unitPrice * qty;
  const leadTime = inStock ? "Same-day cut · dispatch 1–2 working days" : "Confirm mill / forging — typically 3–7 days";
  return {
    grade,
    shape: input.shape,
    dims,
    weightEachKg,
    weightTotalKg,
    unitPrice,
    total,
    inStock,
    matches,
    leadTime,
  };
}

export function formatInr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatKg(n: number): string {
  if (n >= 100) return `${n.toFixed(1)} kg`;
  if (n >= 10) return `${n.toFixed(2)} kg`;
  return `${n.toFixed(3)} kg`;
}

export const QUOTE_GRADES = GRADES.map((g) => ({ slug: g.slug, name: g.name }));

export const QUOTE_SHAPES: { id: ShapeId; label: string }[] = [
  { id: "round", label: "Round Bar" },
  { id: "square", label: "Square Bar" },
  { id: "flat", label: "Flat Bar" },
  { id: "hex", label: "Hex Bar" },
  { id: "non-ferrous", label: "Non-Ferrous" },
];
