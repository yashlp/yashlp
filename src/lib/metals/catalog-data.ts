import { CHEM_COMP, SHAPES_LIST } from "./builtin-catalog";
import { buildBuiltinChemComp, resolveChemForGrade } from "./chem-catalog";
import {
  getAllGrades,
  getGradesForShape,
  getShapesForGrade,
  getSubtypesForGradeAndShape,
} from "./catalog-queries";

export type ChemElement = { num: number; symbol: string; value: string };

export type GradeCard = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  shapes: string[];
  badges: string[];
  chemistry: ChemElement[];
};

export type ShapeCard = {
  id: string;
  name: string;
  description: string;
  grades: string[];
};

export const SHAPES = SHAPES_LIST;

export type ShapeName = (typeof SHAPES_LIST)[number];

/** Derived from builtin catalog — updates when builtin-catalog.ts changes */
export const ALL_GRADES = getAllGrades();

const ELEMENT_NUMS: Record<string, number> = {
  C: 6,
  Mn: 25,
  Si: 14,
  Cr: 24,
  Ni: 28,
  Mo: 42,
  Cu: 29,
  Zn: 30,
};

const GRADE_TAGLINES: Record<string, string> = {
  "EN-24": "High strength nickel-chromium",
  "EN-19 (4140)": "Chromium-molybdenum alloy",
  "EN-8D": "All-purpose carbon steel",
  "EN-8": "All-purpose carbon steel",
  "EN-8D / C-45": "Imported carbon steel",
  "EN-31": "Bearing-grade alloy",
  "WPS (D3)": "Cold work tool steel",
  MS: "Mild steel",
  "MS Bright": "Bright mild steel",
  "MS Black": "Black mild steel",
  "20MnCr5": "Case-hardening steel",
  "EN-353": "Heavy-duty case hardening",
  "EN-9": "Medium carbon steel",
};

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function chemFor(grade: string): ChemElement[] {
  const merged = buildBuiltinChemComp(CHEM_COMP, ALL_GRADES);
  const raw = resolveChemForGrade(grade, merged);
  return Object.entries(raw)
    .slice(0, 4)
    .map(([symbol, value]) => ({
      num: ELEMENT_NUMS[symbol] ?? 0,
      symbol,
      value: value === "—" ? "—" : `${value}%`,
    }));
}

function gradeDescription(grade: string, shapes: string[]): string {
  const shapeList = shapes.join(", ");
  const tag = GRADE_TAGLINES[grade];
  if (tag) return `${tag}. Stocked as ${shapeList}.`;
  return `Available as ${shapeList}. Contact us for sizes and lead time.`;
}

function buildGradeCards(): GradeCard[] {
  return ALL_GRADES.map((name) => {
    const shapes = getShapesForGrade(name);
    const badges = new Set<string>();
    for (const shape of shapes) {
      for (const b of getSubtypesForGradeAndShape(name, shape)) badges.add(b);
    }
    return {
      id: slug(name),
      name,
      tagline: GRADE_TAGLINES[name] ?? "Stocked grade",
      description: gradeDescription(name, shapes),
      shapes,
      badges: Array.from(badges).slice(0, 4),
      chemistry: chemFor(name),
    };
  });
}

function buildShapeCards(): ShapeCard[] {
  const descriptions: Record<string, string> = {
    "Round Bar":
      "Rolled, forged, bright, and centerless ground rods. Saw-cut to length with square ends. Ready for the lathe.",
    "Square Bar":
      "Extruded and rolled square stock. Skips the first squaring operation on the mill.",
    "Flat Bar":
      "Thickness × width combinations across EN-8, WPS, and MS grades. Rolled and forging flats in full range.",
    "Hex Bar": "Bright hex stock for fasteners and precision components.",
    "Non-Ferrous":
      "Brass, copper, aluminium, and stainless steel rods. Contact for specific sizes.",
  };
  return SHAPES_LIST.map((name) => ({
    id: slug(name),
    name,
    description: descriptions[name] ?? "",
    grades: getGradesForShape(name),
  }));
}

/** Auto-built from builtin catalog */
export const GRADE_CARDS = buildGradeCards();
export const SHAPE_CARDS = buildShapeCards();

export const CONTACT = {
  phone: "+91 9558812335",
  email: "Kamlesh@jkmetal.in",
  address: "502/1-A G.I.D.C., Makarpura, Vadodara, Gujarat",
  gst: "24AGIPS3207M1Z7",
};

export function estimatePriceInr(input: {
  grade: string;
  sizeMm: number;
  lengthMm: number;
  quantityPieces: number;
}): number {
  const basePerKg: Record<string, number> = {
    "EN-24": 95,
    "EN-19 (4140)": 88,
    "EN-31": 102,
    "WPS (D3)": 110,
    MS: 62,
    "20MnCr5": 92,
    "EN-353": 85,
    "EN-9": 72,
    "EN-8": 68,
    "EN-8D": 68,
  };
  let rate = 75;
  for (const [key, val] of Object.entries(basePerKg)) {
    if (input.grade.includes(key) || key.includes(input.grade)) {
      rate = val;
      break;
    }
  }
  const sizeFactor = 1 + Math.min(input.sizeMm, 200) / 400;
  return Math.round(rate * input.quantityPieces * sizeFactor);
}

/** Parse size label for pricing (round mm or flat thickness) */
export function parseSizeMm(sizeLabel: string): number {
  if (sizeLabel.includes("×")) return parseFloat(sizeLabel.split("×")[0]) || 0;
  return parseFloat(sizeLabel) || 0;
}
