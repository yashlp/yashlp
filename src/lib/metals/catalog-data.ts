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

export const SHAPES = [
  "Round Bar",
  "Square Bar",
  "Flat Bar",
  "Hex Bar",
  "Non-Ferrous",
] as const;

export type ShapeName = (typeof SHAPES)[number];

/** All unique grades from the Jagetiya catalog */
export const ALL_GRADES = [
  "EN-8D",
  "EN-8",
  "EN-8D / C-45",
  "EN-9",
  "EN-19 (4140)",
  "EN-24",
  "20MnCr5",
  "EN-353",
  "EN-31",
  "WPS (D3)",
  "MS",
  "MS Bright",
  "MS Black",
  "Brass",
  "Copper",
  "Aluminium",
  "SS 304",
  "SS 304L",
  "SS 316",
  "SS 316L",
  "SS 321",
  "SS 410",
  "SS 420",
  "SS 430F",
  "SS 431",
  "SS 440C",
  "SS 17-4-PH",
] as const;

export const CHEMISTRY: Record<string, ChemElement[]> = {
  "EN-8D": [
    { num: 6, symbol: "C", value: "0.36–0.44%" },
    { num: 25, symbol: "Mn", value: "0.60–1.00%" },
    { num: 14, symbol: "Si", value: "0.15–0.35%" },
  ],
  "EN-8": [
    { num: 6, symbol: "C", value: "0.36–0.44%" },
    { num: 25, symbol: "Mn", value: "0.60–1.00%" },
    { num: 14, symbol: "Si", value: "0.15–0.35%" },
  ],
  "EN-9": [
    { num: 6, symbol: "C", value: "0.40–0.50%" },
    { num: 25, symbol: "Mn", value: "0.70–1.10%" },
    { num: 14, symbol: "Si", value: "0.15–0.35%" },
  ],
  "EN-19 (4140)": [
    { num: 6, symbol: "C", value: "0.38–0.43%" },
    { num: 24, symbol: "Cr", value: "0.80–1.10%" },
    { num: 42, symbol: "Mo", value: "0.15–0.25%" },
  ],
  "EN-24": [
    { num: 6, symbol: "C", value: "0.36–0.44%" },
    { num: 24, symbol: "Cr", value: "1.00–1.40%" },
    { num: 28, symbol: "Ni", value: "1.30–1.70%" },
    { num: 42, symbol: "Mo", value: "0.20–0.30%" },
  ],
  "20MnCr5": [
    { num: 6, symbol: "C", value: "0.17–0.23%" },
    { num: 25, symbol: "Mn", value: "1.10–1.40%" },
    { num: 24, symbol: "Cr", value: "0.90–1.20%" },
  ],
  "EN-353": [
    { num: 6, symbol: "C", value: "0.48–0.55%" },
    { num: 24, symbol: "Cr", value: "1.00–1.30%" },
    { num: 25, symbol: "Mn", value: "0.50–0.80%" },
  ],
  "EN-31": [
    { num: 6, symbol: "C", value: "0.90–1.05%" },
    { num: 24, symbol: "Cr", value: "1.30–1.60%" },
    { num: 25, symbol: "Mn", value: "0.30–0.50%" },
  ],
  "WPS (D3)": [
    { num: 6, symbol: "C", value: "0.65–0.75%" },
    { num: 24, symbol: "Cr", value: "0.90–1.10%" },
    { num: 14, symbol: "Si", value: "0.25–0.45%" },
  ],
  MS: [
    { num: 6, symbol: "C", value: "0.16–0.23%" },
    { num: 25, symbol: "Mn", value: "0.35–0.80%" },
    { num: 14, symbol: "Si", value: "0.10–0.35%" },
  ],
};

function chemFor(grade: string): ChemElement[] {
  if (CHEMISTRY[grade]) return CHEMISTRY[grade];
  const base = grade.replace(/\s.*/, "");
  if (CHEMISTRY[base]) return CHEMISTRY[base];
  if (grade.startsWith("SS")) {
    return [
      { num: 24, symbol: "Cr", value: "16–20%" },
      { num: 28, symbol: "Ni", value: "8–14%" },
    ];
  }
  return [
    { num: 29, symbol: "Cu", value: "—" },
    { num: 30, symbol: "Zn", value: "—" },
  ];
}

export const GRADE_CARDS: GradeCard[] = [
  {
    id: "en-24",
    name: "EN-24",
    tagline: "High strength nickel-chromium",
    description:
      "Nickel-chromium-molybdenum alloy steel. Gears, shafts, heavy-duty machine parts. Rod and forging sizes 16–450 mm.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: chemFor("EN-24"),
  },
  {
    id: "en-19",
    name: "EN-19 (4140)",
    tagline: "Chromium-molybdenum alloy",
    description:
      "Machines, welds, and heat-treats well. Bolts, crankshafts, precision machine parts. Full rod range stocked.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: chemFor("EN-19 (4140)"),
  },
  {
    id: "en-8",
    name: "EN-8 / EN-8D",
    tagline: "All-purpose carbon steel",
    description:
      "Workhorse grade for shafts, pins, and general engineering. Rolled, bright, forged, and centerless ground.",
    shapes: ["Round Bar", "Square Bar", "Flat Bar"],
    badges: ["ROLLED", "BRIGHT ROD", "FORGING"],
    chemistry: chemFor("EN-8D"),
  },
  {
    id: "en-31",
    name: "EN-31",
    tagline: "Bearing-grade alloy",
    description: "High-carbon chromium steel for bearings, rollers, and cutting tools.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: chemFor("EN-31"),
  },
  {
    id: "wps",
    name: "WPS (D3)",
    tagline: "Cold work tool steel",
    description: "Dies, punches, and cutting tools. Round, square, and flat bar in rolled and forging grades.",
    shapes: ["Round Bar", "Square Bar", "Flat Bar"],
    badges: ["ROD", "SQUARE BAR", "FLAT BAR"],
    chemistry: chemFor("WPS (D3)"),
  },
  {
    id: "ms",
    name: "MS",
    tagline: "Mild steel, every size",
    description:
      "Bright, black, and centerless ground rods. Square, hex, and flat bar. Fabrication and general engineering.",
    shapes: ["Round Bar", "Square Bar", "Flat Bar", "Hex Bar"],
    badges: ["BRIGHT", "BLACK", "CENTERLESS"],
    chemistry: chemFor("MS"),
  },
  {
    id: "20mncr5",
    name: "20MnCr5",
    tagline: "Case-hardening steel",
    description: "Carburizing grade for gears, camshafts, and wear-resistant components.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: chemFor("20MnCr5"),
  },
  {
    id: "en-353",
    name: "EN-353",
    tagline: "Heavy-duty case hardening",
    description: "High-carbon case-hardening steel for heavy gears and transmission parts.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: chemFor("EN-353"),
  },
  {
    id: "en-9",
    name: "EN-9",
    tagline: "Medium carbon steel",
    description: "Axles, shafts, and springs. Rod and forging sizes 18–450 mm.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: chemFor("EN-9"),
  },
];

export const SHAPE_CARDS: ShapeCard[] = [
  {
    id: "round",
    name: "Round Bar",
    description:
      "Rolled, forged, bright, and centerless ground rods. Saw-cut to length with square ends. Ready for the lathe.",
    grades: ["EN-8D", "EN-9", "EN-19", "EN-24", "EN-31", "EN-353", "20MnCr5", "WPS", "MS"],
  },
  {
    id: "square",
    name: "Square Bar",
    description: "Extruded and rolled square stock. Skips the first squaring operation on the mill.",
    grades: ["EN-8", "WPS (D3)", "MS Bright"],
  },
  {
    id: "flat",
    name: "Flat Bar",
    description:
      "Thickness × width combinations across EN-8, WPS, and MS grades. Rolled and forging flats in full range.",
    grades: ["EN-8", "WPS (D3)", "MS Bright", "MS Black"],
  },
  {
    id: "hex",
    name: "Hex Bar",
    description: "Bright hex stock for fasteners and precision components.",
    grades: ["MS Bright"],
  },
  {
    id: "non-ferrous",
    name: "Non-Ferrous",
    description: "Brass, copper, aluminium, and stainless steel rods. Contact for specific sizes.",
    grades: ["Brass", "Copper", "Aluminium", "SS 304", "SS 316", "SS 410", "SS 440C"],
  },
];

export const CONTACT = {
  phone: "+91-9824012344",
  email: "Kamlesh@jkmetal.in",
  address: "502/1-A G.I.D.C., Makarpura, Vadodara, Gujarat",
  gst: "24AGIPS3207M1Z7",
};

export function estimatePriceInr(input: {
  grade: string;
  sizeMm: number;
  lengthMm: number;
  quantityKg: number;
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
  const amount = rate * input.quantityKg * sizeFactor;
  return Math.round(amount);
}
