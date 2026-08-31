/** Jagetiya Metals catalog — grades, shapes, and live-stock sizes from the Vadodara floor. */

export const COMPANY = {
  name: "Jagetiya Metals",
  short: "JM",
  tagline: "Metal at the speed of stock",
  phonePrimary: "+91 98240 12344",
  phonePrimaryTel: "+919824012344",
  phoneSecondary: "+91 95588 12335",
  phoneSecondaryTel: "+919558812335",
  email: "kamlesh@jkmetal.in",
  emailAlt: "info@jagetiyametals.com",
  addressLine: "502/A-1, Makarpura GIDC",
  city: "Vadodara, Gujarat 390010",
  gst: "24AGIPS3207M1Z7",
  founded: 1990,
  whatsapp: "919824012344",
} as const;

export type ChemEl = {
  z: number;
  sym: string;
  pct: string;
};

export type GradeForm = {
  shape: ShapeId;
  subtype: string;
  mill?: string;
  sizesMm?: number[];
  /** thickness mm → widths mm */
  flat?: Record<number, number[]>;
  note?: string;
};

export type Grade = {
  slug: string;
  name: string;
  family: "carbon" | "alloy" | "tool" | "stainless" | "nonferrous";
  headline: string;
  blurb: string;
  chemistry: ChemEl[];
  density: number;
  pricePerKg: number;
  chips: string[];
  forms: GradeForm[];
};

export type ShapeId = "round" | "square" | "flat" | "hex" | "nonferrous";

export const SHAPES: {
  id: ShapeId;
  name: string;
  range: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: "round",
    name: "Round Bar",
    range: "Ø 4–550 mm",
    blurb: "Rolled, bright, forged, and centerless-ground rod. Saw-cut to length with square ends. Ready for the lathe.",
    href: "/metals/materials/round-bar",
  },
  {
    id: "square",
    name: "Square Bar",
    range: "8–155 mm",
    blurb: "Square bar in EN-8, WPS (D3), and MS bright. Skips the first squaring operation.",
    href: "/metals/materials/square-bar",
  },
  {
    id: "flat",
    name: "Flat Bar",
    range: "5–105 × 16–410 mm",
    blurb: "Rolled, bright, heavy, and forging flats. Cut to width and length from ready stock.",
    href: "/metals/materials/flat-bar",
  },
  {
    id: "hex",
    name: "Hex Bar",
    range: "AF 12–75 mm",
    blurb: "MS bright hex. Across-flats sizes for fasteners, fittings, and turned parts.",
    href: "/metals/materials/hex-bar",
  },
];

export const GRADES: Grade[] = [
  {
    slug: "en-8",
    name: "EN-8 / EN-8D",
    family: "carbon",
    headline: "All-purpose medium carbon",
    blurb:
      "The shop-floor workhorse. Machines, welds, and heat-treats well. Shafts, axles, bolts, and general engineering.",
    chemistry: [
      { z: 6, sym: "C", pct: "0.40%" },
      { z: 25, sym: "Mn", pct: "0.80%" },
      { z: 14, sym: "Si", pct: "0.25%" },
      { z: 26, sym: "Fe", pct: "bal." },
    ],
    density: 7.85,
    pricePerKg: 72,
    chips: ["Rolled", "Bright", "Forging to Ø 450"],
    forms: [
      { shape: "round", subtype: "Rolled", mill: "VSP Make", sizesMm: [16, 18, 20, 22, 25, 28, 32, 35, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90] },
      { shape: "round", subtype: "Rod", mill: "R.L Steel / LSR Make", sizesMm: [85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 200, 210] },
      { shape: "round", subtype: "Bright Rod", sizesMm: [8, 10, 12, 14, 16, 20, 25, 28, 30, 32, 36, 40, 50, 55, 60, 63] },
      { shape: "round", subtype: "Rolled Imported", mill: "China / Korea", sizesMm: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350] },
      { shape: "round", subtype: "Forging Rod", sizesMm: [310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
      { shape: "round", subtype: "Centerless Grinding", sizesMm: [12, 15, 16, 20, 25, 30, 35, 38, 40] },
      { shape: "square", subtype: "Square Bar", sizesMm: [16, 20, 25, 28, 32, 40, 45, 50, 55, 65, 75, 90, 100, 125, 130, 155] },
      {
        shape: "flat",
        subtype: "Rolled",
        flat: {
          6: [25, 32, 40, 50, 63, 75, 100],
          10: [25, 32, 40, 50, 63, 75, 100, 125],
          12: [25, 32, 40, 50, 63, 75, 100, 125],
          16: [25, 32, 40, 50, 63, 75, 100, 125, 155],
          20: [32, 40, 50, 63, 75, 100, 125, 155, 200],
          25: [40, 50, 63, 75, 100, 125, 155, 200, 250],
          32: [40, 50, 65, 75, 100, 125, 155, 200, 250],
          40: [50, 65, 75, 100, 125, 155, 200, 250],
          50: [65, 75, 100, 125, 155, 200, 250],
        },
      },
    ],
  },
  {
    slug: "en-9",
    name: "EN-9",
    family: "carbon",
    headline: "Higher carbon, higher wear",
    blurb:
      "A step up from EN-8 for gears, cams, and wear parts. Oil-hardening carbon steel with a strong as-rolled floor.",
    chemistry: [
      { z: 6, sym: "C", pct: "0.45%" },
      { z: 25, sym: "Mn", pct: "0.90%" },
      { z: 14, sym: "Si", pct: "0.25%" },
      { z: 26, sym: "Fe", pct: "bal." },
    ],
    density: 7.85,
    pricePerKg: 78,
    chips: ["Rod to Ø 200", "Forging to Ø 450"],
    forms: [
      { shape: "round", subtype: "Rod", sizesMm: [18, 20, 22, 25, 28, 30, 32, 36, 38, 40, 42, 45, 48, 50, 52, 56, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
      { shape: "round", subtype: "Forging Rod", sizesMm: [310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
    ],
  },
  {
    slug: "en-19",
    name: "EN-19 (4140)",
    family: "alloy",
    headline: "Chrome-moly strength",
    blurb:
      "The 4140 workhorse. High tensile, through-hardening, used for axles, crankshafts, and high-load shafts.",
    chemistry: [
      { z: 6, sym: "C", pct: "0.40%" },
      { z: 24, sym: "Cr", pct: "0.95%" },
      { z: 42, sym: "Mo", pct: "0.20%" },
      { z: 25, sym: "Mn", pct: "0.85%" },
    ],
    density: 7.85,
    pricePerKg: 95,
    chips: ["R.L Steel / Laxcon / LSR", "Imported / Forging to Ø 450"],
    forms: [
      { shape: "round", subtype: "Rod", mill: "R.L Steel / Laxcon / LSR", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
      { shape: "round", subtype: "Imported / Forging Rod", mill: "China / Forging", sizesMm: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
    ],
  },
  {
    slug: "en-24",
    name: "EN-24",
    family: "alloy",
    headline: "Nickel chrome-moly, high toughness",
    blurb:
      "Our strongest engineering steel: Ni-Cr-Mo for aerospace, defence, and heavy shafts. Through-hardens in thick section.",
    chemistry: [
      { z: 6, sym: "C", pct: "0.40%" },
      { z: 28, sym: "Ni", pct: "1.50%" },
      { z: 24, sym: "Cr", pct: "1.20%" },
      { z: 42, sym: "Mo", pct: "0.25%" },
    ],
    density: 7.85,
    pricePerKg: 145,
    chips: ["Rod to Ø 200", "Forging to Ø 450"],
    forms: [
      { shape: "round", subtype: "Rod", mill: "R.L Steel / Laxcon / LSR", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
      { shape: "round", subtype: "Forging Rod", sizesMm: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
    ],
  },
  {
    slug: "20mncr5",
    name: "20MnCr5",
    family: "alloy",
    headline: "Case-hardening gear steel",
    blurb:
      "Manganese-chrome case carburizing steel. Gears, pinions, and camshafts with a hard case and tough core.",
    chemistry: [
      { z: 6, sym: "C", pct: "0.20%" },
      { z: 25, sym: "Mn", pct: "1.25%" },
      { z: 24, sym: "Cr", pct: "1.05%" },
      { z: 14, sym: "Si", pct: "0.25%" },
    ],
    density: 7.85,
    pricePerKg: 92,
    chips: ["Rod to Ø 200", "Forging to Ø 450"],
    forms: [
      { shape: "round", subtype: "Rod", mill: "R.L Steel / Laxcon / LSR", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
      { shape: "round", subtype: "Forging Rod", sizesMm: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
    ],
  },
  {
    slug: "en-353",
    name: "EN-353",
    family: "alloy",
    headline: "Case-carburizing, heavy duty",
    blurb:
      "Nickel-bearing case steel for crown wheels, pinion shafts, and heavy transmission parts.",
    chemistry: [
      { z: 6, sym: "C", pct: "0.18%" },
      { z: 28, sym: "Ni", pct: "1.10%" },
      { z: 24, sym: "Cr", pct: "1.00%" },
      { z: 42, sym: "Mo", pct: "0.12%" },
    ],
    density: 7.85,
    pricePerKg: 98,
    chips: ["Super Forge / LSR", "Forging to Ø 350"],
    forms: [
      { shape: "round", subtype: "Rod (Rolled)", mill: "Super Forge Steel / LSR", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160] },
      { shape: "round", subtype: "Forging Rod", sizesMm: [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350] },
    ],
  },
  {
    slug: "en-31",
    name: "EN-31",
    family: "tool",
    headline: "High-carbon bearing steel",
    blurb:
      "1% carbon, 1.5% chrome. Bearings, gauges, and wear parts. Hardens to 60+ HRC.",
    chemistry: [
      { z: 6, sym: "C", pct: "0.98%" },
      { z: 24, sym: "Cr", pct: "1.45%" },
      { z: 25, sym: "Mn", pct: "0.40%" },
      { z: 14, sym: "Si", pct: "0.28%" },
    ],
    density: 7.81,
    pricePerKg: 110,
    chips: ["LSR Steel", "Forging / Imported to Ø 450"],
    forms: [
      { shape: "round", subtype: "Rod (Rolled)", mill: "LSR Steel Make", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
      { shape: "round", subtype: "Forging / Imported Rod", sizesMm: [160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
    ],
  },
  {
    slug: "wps-d3",
    name: "WPS (D3)",
    family: "tool",
    headline: "Die steel, high wear",
    blurb:
      "Cold-work die steel for punches, dies, and shear blades. Round, square, and flat — rolled and forged.",
    chemistry: [
      { z: 6, sym: "C", pct: "0.70%" },
      { z: 24, sym: "Cr", pct: "1.00%" },
      { z: 25, sym: "Mn", pct: "0.50%" },
      { z: 14, sym: "Si", pct: "0.35%" },
    ],
    density: 7.7,
    pricePerKg: 165,
    chips: ["Super Forge", "Imported turn rod", "Flats to 410 mm"],
    forms: [
      { shape: "round", subtype: "Rod", mill: "Super Forge Steel Make", sizesMm: [8, 10, 13, 16, 20, 22, 26, 28, 32, 36, 40, 45, 50, 56, 60, 63, 70, 75] },
      { shape: "round", subtype: "Turn Rod Imported", mill: "China Make", sizesMm: [80, 85, 90, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350] },
      { shape: "square", subtype: "Square Bar", mill: "Super Forge Steel Make", sizesMm: [16, 20, 22, 26, 28, 32, 36, 40, 45, 50, 56, 60, 65, 80, 105, 125, 130, 155] },
      {
        shape: "flat",
        subtype: "Rolled - Super Forge",
        flat: {
          6: [25, 32, 40, 50, 65, 80, 105],
          10: [25, 32, 40, 50, 65, 80, 105],
          13: [25, 32, 40, 50, 65, 80, 105],
          16: [32, 40, 50, 65, 80, 105, 130, 155],
          20: [40, 50, 65, 80, 105, 130, 155, 200],
          25: [40, 50, 65, 80, 105, 130, 155, 200, 250],
          32: [40, 50, 65, 80, 105, 130, 155, 180, 200, 250, 310, 355, 410],
        },
      },
      {
        shape: "flat",
        subtype: "Forging",
        flat: {
          40: [50, 65, 80, 105, 130, 155, 200, 250, 310, 355, 410],
          50: [65, 80, 105, 130, 155, 200, 250, 310, 355, 410],
          65: [80, 105, 130, 155, 200, 250, 305, 355, 410],
          80: [105, 130, 155, 200, 250, 305, 355, 410],
          105: [130, 155, 200, 250, 305, 355, 410],
        },
      },
    ],
  },
  {
    slug: "mild-steel",
    name: "Mild Steel",
    family: "carbon",
    headline: "Bright, black, hex, and heavy flat",
    blurb:
      "Low-carbon MS for fabrication, machining, and construction. Bright rod, black rod, hex, square, and heavy flats.",
    chemistry: [
      { z: 6, sym: "C", pct: "0.20%" },
      { z: 25, sym: "Mn", pct: "0.55%" },
      { z: 14, sym: "Si", pct: "0.20%" },
      { z: 26, sym: "Fe", pct: "bal." },
    ],
    density: 7.85,
    pricePerKg: 62,
    chips: ["Bright", "Black", "Hex", "CL grinding"],
    forms: [
      { shape: "round", subtype: "Bright Rod", mill: "Rolling & VSP Make", sizesMm: [4, 5, 6, 12, 14.2, 15, 16, 18, 19, 20, 22, 22.2, 24, 25, 25.4, 27, 28.5, 30, 32, 35, 36, 38, 40, 42, 45, 50, 55, 57, 60, 63, 70, 75] },
      { shape: "round", subtype: "Black Rod", mill: "Rolling & VSP / Imported", sizesMm: [16, 20, 22, 25, 28, 32, 36, 40, 45, 50, 53, 56, 60, 63, 65, 71, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300] },
      { shape: "round", subtype: "Centerless Grinding", sizesMm: [12, 15, 16, 20, 25, 30, 35, 38, 40] },
      { shape: "square", subtype: "Square Bar", sizesMm: [8, 10, 12, 12.7, 14.2, 16, 19, 20, 22, 25.4, 28, 30, 32, 38, 40, 45, 50, 63] },
      { shape: "hex", subtype: "Hex Bar", sizesMm: [12, 12.7, 14.2, 16, 17, 19, 22.2, 24, 25.4, 27, 28.5, 30, 32, 36, 41, 46, 50, 55, 60, 65, 70, 75] },
      {
        shape: "flat",
        subtype: "Bright Rolled",
        flat: {
          5: [16, 20, 25, 32, 40],
          6: [16, 20, 25, 32, 40, 50, 63, 75, 100],
          8: [16, 20, 25, 32, 40, 50, 60, 63, 75, 100],
          10: [16, 20, 25, 32, 40, 50, 60, 63, 75, 100, 125],
          12: [16, 20, 25, 32, 40, 50, 63, 75, 100, 125],
          16: [20, 25, 32, 40, 50, 63, 75, 100, 125],
          20: [25, 30, 32, 40, 50, 60, 63, 75, 100, 125],
          25: [32, 40, 50, 63, 75, 100, 125],
          32: [40, 50, 65, 75, 100],
        },
      },
      {
        shape: "flat",
        subtype: "Heavy Flat",
        flat: {
          32: [40, 50, 65, 75, 100, 125, 150, 200],
          40: [50, 65, 75, 100, 125, 150, 200],
          50: [65, 75, 100, 125, 150, 200],
        },
      },
    ],
  },
  {
    slug: "stainless",
    name: "Stainless Steel",
    family: "stainless",
    headline: "304 to 17-4PH, rod in stock",
    blurb:
      "Austenitic, martensitic, and precipitation-hardened grades. Rod for shafts, fasteners, food, and chemical plant.",
    chemistry: [
      { z: 24, sym: "Cr", pct: "18.0%" },
      { z: 28, sym: "Ni", pct: "8.5%" },
      { z: 6, sym: "C", pct: "0.08%" },
      { z: 26, sym: "Fe", pct: "bal." },
    ],
    density: 8.0,
    pricePerKg: 220,
    chips: ["304 / 304L", "316 / 316L", "410 / 420 / 431", "17-4PH"],
    forms: [
      { shape: "nonferrous", subtype: "SS 304 Rod", note: "Stainless steel rod — call for diameter" },
      { shape: "nonferrous", subtype: "SS 304L Rod", note: "Low-carbon 304 for welded assemblies" },
      { shape: "nonferrous", subtype: "SS 316 Rod", note: "Mo-bearing, chemical and marine" },
      { shape: "nonferrous", subtype: "SS 316L Rod", note: "Low-carbon 316" },
      { shape: "nonferrous", subtype: "SS 321 Rod", note: "Ti-stabilized, high-temp service" },
      { shape: "nonferrous", subtype: "SS 410 Rod", note: "12% Cr martensitic" },
      { shape: "nonferrous", subtype: "SS 420 Rod", note: "Cutlery / wear grade" },
      { shape: "nonferrous", subtype: "SS 430F Rod", note: "Free-machining ferritic" },
      { shape: "nonferrous", subtype: "SS 431 Rod", note: "High-strength martensitic" },
      { shape: "nonferrous", subtype: "SS 440C Rod", note: "High-carbon, high hardness" },
      { shape: "nonferrous", subtype: "SS 17-4-PH Rod", note: "Precipitation-hardened 17-4" },
    ],
  },
  {
    slug: "brass",
    name: "Brass",
    family: "nonferrous",
    headline: "Rod, hex, square, flat, sheet",
    blurb:
      "Copper-zinc alloy for fittings, turned parts, and decorative hardware. Excellent machinability.",
    chemistry: [
      { z: 29, sym: "Cu", pct: "60%" },
      { z: 30, sym: "Zn", pct: "40%" },
      { z: 82, sym: "Pb", pct: "trace" },
      { z: 50, sym: "Sn", pct: "—" },
    ],
    density: 8.5,
    pricePerKg: 650,
    chips: ["Rod", "Hex", "Square", "Flat", "Sheet"],
    forms: [{ shape: "nonferrous", subtype: "Rod, Hex, Square, Flat, Sheet", note: "Call for sizes in stock" }],
  },
  {
    slug: "copper",
    name: "Copper",
    family: "nonferrous",
    headline: "EC grade conductivity",
    blurb:
      "Electrolytic copper for busbars, electrical, and thermal parts. High conductivity, ready rod.",
    chemistry: [
      { z: 29, sym: "Cu", pct: "99.9%" },
      { z: 8, sym: "O", pct: "ppm" },
      { z: 50, sym: "Sn", pct: "—" },
      { z: 82, sym: "Pb", pct: "—" },
    ],
    density: 8.96,
    pricePerKg: 850,
    chips: ["EC Grade"],
    forms: [{ shape: "nonferrous", subtype: "EC Grade", note: "Call for sizes in stock" }],
  },
  {
    slug: "aluminium",
    name: "Aluminium",
    family: "nonferrous",
    headline: "HE30 / 6082 structural",
    blurb:
      "6082 (HE30) structural aluminium. High strength-to-weight for jigs, frames, and marine fittings.",
    chemistry: [
      { z: 13, sym: "Al", pct: "96.5%" },
      { z: 12, sym: "Mg", pct: "0.90%" },
      { z: 14, sym: "Si", pct: "1.00%" },
      { z: 25, sym: "Mn", pct: "0.70%" },
    ],
    density: 2.7,
    pricePerKg: 280,
    chips: ["HE30", "6082"],
    forms: [{ shape: "nonferrous", subtype: "HE30 / 6082 Grade", note: "Call for sizes in stock" }],
  },
];

export const FEATURED_GRADE_SLUGS = ["en-8", "en-19", "en-24", "wps-d3"] as const;

export const GUIDES = [
  {
    slug: "en8-vs-en19-vs-en24",
    title: "EN-8 vs EN-19 vs EN-24",
    dek: "Which engineering steel should you specify?",
  },
  {
    slug: "how-to-read-a-mill-cert",
    title: "How to Read a Mill Cert",
    dek: "Heat number, chemistry, and mechanicals — every field explained.",
  },
  {
    slug: "cut-to-size-bandsaw",
    title: "Cut-to-Size Bandsaw Guide",
    dek: "16 mm to 550 mm hydraulic cutting. Kerf, tolerance, and length.",
  },
  {
    slug: "carbon-vs-alloy-steel",
    title: "Carbon vs Alloy Steel",
    dek: "When MS and EN-8 stop being enough.",
  },
] as const;

export function getGrade(slug: string): Grade | undefined {
  return GRADES.find((g) => g.slug === slug);
}

export function featuredGrades(): Grade[] {
  return FEATURED_GRADE_SLUGS.map((s) => getGrade(s)!);
}

export function gradesForShape(shape: ShapeId): Grade[] {
  return GRADES.filter((g) => g.forms.some((f) => f.shape === shape));
}

export function uniqueSizes(grade: Grade, shape: ShapeId): number[] {
  const set = new Set<number>();
  for (const f of grade.forms) {
    if (f.shape !== shape) continue;
    (f.sizesMm ?? []).forEach((n) => set.add(n));
    if (f.flat) {
      Object.keys(f.flat).forEach((t) => set.add(Number(t)));
    }
  }
  return [...set].sort((a, b) => a - b);
}

export function formatSizeList(sizes: number[], max = 18): string {
  if (sizes.length === 0) return "Call for size";
  const shown = sizes.slice(0, max).map((n) => (Number.isInteger(n) ? String(n) : String(n)));
  const extra = sizes.length - shown.length;
  return extra > 0 ? `${shown.join(", ")} +${extra}` : shown.join(", ");
}

export type StockHit = {
  grade: Grade;
  form: GradeForm;
  exact: boolean;
  sizeLabel: string;
  below: number[];
  above: number[];
};

function nearest(arr: number[], target: number, n = 3): { below: number[]; above: number[] } {
  const s = [...new Set(arr)].sort((a, b) => a - b);
  const below = s.filter((x) => x < target - 0.0001).slice(-n);
  const above = s.filter((x) => x > target + 0.0001).slice(0, n);
  return { below, above };
}

function hasExact(arr: number[], t: number) {
  return arr.some((x) => Math.abs(x - t) < 0.0001);
}

export function searchStock(opts: {
  shape: ShapeId | "all";
  gradeQuery?: string;
  sizeMm?: number;
  thicknessMm?: number;
  widthMm?: number;
}): StockHit[] {
  const q = (opts.gradeQuery ?? "").trim().toLowerCase();
  const hits: StockHit[] = [];

  for (const grade of GRADES) {
    if (q && !grade.name.toLowerCase().includes(q) && !grade.slug.includes(q.replace(/\s+/g, "-"))) {
      const chipHit = grade.chips.some((c) => c.toLowerCase().includes(q));
      const formHit = grade.forms.some((f) => f.subtype.toLowerCase().includes(q));
      if (!chipHit && !formHit) continue;
    }

    for (const form of grade.forms) {
      if (opts.shape !== "all" && form.shape !== opts.shape) continue;

      if (form.flat) {
        const thk = opts.thicknessMm;
        const wid = opts.widthMm;
        const thicknesses = Object.keys(form.flat).map(Number).sort((a, b) => a - b);
        if (thk == null && wid == null && !opts.sizeMm) {
          hits.push({
            grade,
            form,
            exact: true,
            sizeLabel: `${thicknesses.length} thicknesses in stock`,
            below: [],
            above: [],
          });
          continue;
        }
        const t = thk ?? opts.sizeMm;
        if (t == null) continue;
        const widths = form.flat[t];
        if (widths && (wid == null || hasExact(widths, wid))) {
          hits.push({
            grade,
            form,
            exact: true,
            sizeLabel: wid != null ? `${t} × ${wid} mm` : `${t} mm thick · widths ${widths.join(", ")}`,
            below: [],
            above: [],
          });
        } else {
          const nearT = nearest(thicknesses, t, 2);
          hits.push({
            grade,
            form,
            exact: false,
            sizeLabel: `${t} mm thick not in this mill lot`,
            below: nearT.below,
            above: nearT.above,
          });
        }
        continue;
      }

      const sizes = form.sizesMm ?? [];
      if (!sizes.length) {
        hits.push({
          grade,
          form,
          exact: true,
          sizeLabel: form.note ?? "Call for size",
          below: [],
          above: [],
        });
        continue;
      }

      const size = opts.sizeMm;
      if (size == null) {
        hits.push({
          grade,
          form,
          exact: true,
          sizeLabel: `${sizes[0]}–${sizes[sizes.length - 1]} mm`,
          below: [],
          above: [],
        });
        continue;
      }

      if (hasExact(sizes, size)) {
        hits.push({
          grade,
          form,
          exact: true,
          sizeLabel: `Ø / ${size} mm in stock`,
          below: [],
          above: [],
        });
      } else {
        const n = nearest(sizes, size, 3);
        hits.push({
          grade,
          form,
          exact: false,
          sizeLabel: `${size} mm not in this mill lot`,
          below: n.below,
          above: n.above,
        });
      }
    }
  }

  return hits.sort((a, b) => Number(b.exact) - Number(a.exact));
}

export function weightKg(opts: {
  shape: ShapeId;
  density: number;
  diameterMm?: number;
  sideMm?: number;
  thicknessMm?: number;
  widthMm?: number;
  lengthMm: number;
  qty: number;
}): number {
  const L = opts.lengthMm / 10; // cm
  const d = opts.density;
  let volCm3 = 0;
  if (opts.shape === "round" && opts.diameterMm) {
    const r = opts.diameterMm / 20;
    volCm3 = Math.PI * r * r * L;
  } else if ((opts.shape === "square" || opts.shape === "hex") && opts.sideMm) {
    const s = opts.sideMm / 10;
    volCm3 = opts.shape === "hex" ? (Math.sqrt(3) / 2) * s * s * L : s * s * L;
  } else if (opts.shape === "flat" && opts.thicknessMm && opts.widthMm) {
    volCm3 = (opts.thicknessMm / 10) * (opts.widthMm / 10) * L;
  } else if (opts.diameterMm) {
    const r = opts.diameterMm / 20;
    volCm3 = Math.PI * r * r * L;
  }
  return volCm3 * d * opts.qty * 0.001;
}

export function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function kgLabel(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n < 1) return `${n.toFixed(2)} kg`;
  if (n < 100) return `${n.toFixed(1)} kg`;
  return `${Math.round(n).toLocaleString("en-IN")} kg`;
}
