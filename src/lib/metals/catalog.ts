export type ShapeId = "round" | "square" | "flat" | "hex" | "non-ferrous";

export type ElementTile = {
  z: number;
  symbol: string;
  pct: string;
};

export type StockLine = {
  grade: string;
  shape: ShapeId;
  subtype: string;
  mill?: string;
  sizesMm?: number[];
  /** thickness mm → widths mm */
  flats?: Record<string, number[]>;
  noteOnly?: boolean;
};

export type MaterialForm = {
  name: string;
  availability: "stock" | "request";
  detail: string;
};

export type Grade = {
  slug: string;
  name: string;
  catalogKeys: string[];
  tagline: string;
  overlay: string;
  family: "carbon" | "alloy" | "tool" | "case" | "stainless" | "nonferrous";
  availableNow: boolean;
  composition: ElementTile[];
  chemistry: Record<string, string>;
  density: number;
  pricePerKg: number;
  overview: string;
  body: string[];
  tempers: string[];
  origins: string[];
  forms: MaterialForm[];
  mechanical: { condition: string; tensile: string; yield: string; elongation: string; hardness: string }[];
  physical: { label: string; value: string }[];
  specs: string[];
  machining: string[];
  applications: string[];
  why: string[];
  related: string[];
};

export const SHAPES: {
  id: ShapeId;
  name: string;
  tagline: string;
  overlay: string;
  href: string;
}[] = [
  {
    id: "round",
    name: "Round Bar",
    tagline: "Rolled, bright, forging, and imported rod",
    overlay: "Saw-cut to length with square ends. Ready stock 4 mm through 550 mm depending on grade.",
    href: "/metals/materials?shape=round",
  },
  {
    id: "square",
    name: "Square Bar",
    tagline: "EN-8, WPS (D3), and MS bright",
    overlay: "Hot-rolled and bright-drawn square. Side 8 mm through 155 mm.",
    href: "/metals/materials?shape=square",
  },
  {
    id: "flat",
    name: "Flat Bar",
    tagline: "Rolled, heavy, and forging flats",
    overlay: "Thickness × width combinations in EN-8, WPS (D3), and MS. Cut to length on the bandsaw.",
    href: "/metals/materials?shape=flat",
  },
  {
    id: "hex",
    name: "Hex Bar",
    tagline: "MS bright across-flats",
    overlay: "Bright-drawn hex 12 mm through 75 mm AF. Ready for turning and fastener work.",
    href: "/metals/materials?shape=hex",
  },
  {
    id: "non-ferrous",
    name: "Non-Ferrous",
    tagline: "Brass, copper, aluminium, stainless",
    overlay: "Rod, hex, square, flat, and sheet. SS 304 through 17-4PH plus HE30 aluminium.",
    href: "/metals/materials?shape=non-ferrous",
  },
];

export const STOCK: StockLine[] = [
  { grade: "EN-8D", shape: "round", subtype: "Rolled", mill: "VSP Make", sizesMm: [16, 18, 20, 22, 25, 28, 32, 35, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90] },
  { grade: "EN-8D", shape: "round", subtype: "Rod", mill: "R.L Steel / LSR Make", sizesMm: [85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 200, 210] },
  { grade: "EN-8D", shape: "round", subtype: "Bright Rod", sizesMm: [8, 10, 12, 14, 16, 20, 25, 28, 30, 32, 36, 40, 50, 55, 60, 63] },
  { grade: "EN-8D / C-45", shape: "round", subtype: "Rolled Imported", mill: "China / Korea", sizesMm: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350] },
  { grade: "EN-8", shape: "round", subtype: "Forging Rod", sizesMm: [310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
  { grade: "EN-8", shape: "round", subtype: "Centerless Grinding", sizesMm: [12, 15, 16, 20, 25, 30, 35, 38, 40] },
  { grade: "EN-9", shape: "round", subtype: "Rod", sizesMm: [18, 20, 22, 25, 28, 30, 32, 36, 38, 40, 42, 45, 48, 50, 52, 56, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
  { grade: "EN-9", shape: "round", subtype: "Forging Rod", sizesMm: [310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
  { grade: "EN-19 (4140)", shape: "round", subtype: "Rod", mill: "R.L Steel / Laxcon / LSR", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
  { grade: "EN-19 (4140)", shape: "round", subtype: "Imported / Forging Rod", mill: "China / Forging", sizesMm: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
  { grade: "EN-24", shape: "round", subtype: "Rod", mill: "R.L Steel / Laxcon / LSR", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
  { grade: "EN-24", shape: "round", subtype: "Forging Rod", sizesMm: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
  { grade: "20MnCr5", shape: "round", subtype: "Rod", mill: "R.L Steel / Laxcon / LSR", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
  { grade: "20MnCr5", shape: "round", subtype: "Forging Rod", sizesMm: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
  { grade: "EN-353", shape: "round", subtype: "Rod (Rolled)", mill: "Super Forge Steel / LSR", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160] },
  { grade: "EN-353", shape: "round", subtype: "Forging Rod", sizesMm: [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350] },
  { grade: "EN-31", shape: "round", subtype: "Rod (Rolled)", mill: "LSR Steel Make", sizesMm: [16, 18, 20, 22, 25, 28, 32, 36, 40, 42, 45, 50, 53, 56, 60, 63, 65, 70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 190, 200] },
  { grade: "EN-31", shape: "round", subtype: "Forging / Imported Rod", sizesMm: [160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450] },
  { grade: "WPS (D3)", shape: "round", subtype: "Rod", mill: "Super Forge Steel Make", sizesMm: [8, 10, 13, 16, 20, 22, 26, 28, 32, 36, 40, 45, 50, 56, 60, 63, 70, 75] },
  { grade: "WPS (D3)", shape: "round", subtype: "Turn Rod Imported", mill: "China Make", sizesMm: [80, 85, 90, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 180, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350] },
  { grade: "MS", shape: "round", subtype: "Bright Rod", mill: "Rolling & VSP Make", sizesMm: [4, 5, 6, 12, 14.2, 15, 16, 18, 19, 20, 22, 22.2, 24, 25, 25.4, 27, 28.5, 30, 32, 35, 36, 38, 40, 42, 45, 50, 55, 57, 60, 63, 70, 75] },
  { grade: "MS", shape: "round", subtype: "Black Rod", mill: "Rolling & VSP / Imported", sizesMm: [16, 20, 22, 25, 28, 32, 36, 40, 45, 50, 53, 56, 60, 63, 65, 71, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150, 160, 170, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300] },
  { grade: "MS", shape: "round", subtype: "Centerless Grinding", sizesMm: [12, 15, 16, 20, 25, 30, 35, 38, 40] },
  { grade: "EN-8", shape: "square", subtype: "Square Bar", sizesMm: [16, 20, 25, 28, 32, 40, 45, 50, 55, 65, 75, 90, 100, 125, 130, 155] },
  { grade: "WPS (D3)", shape: "square", subtype: "Square Bar", mill: "Super Forge Steel Make", sizesMm: [16, 20, 22, 26, 28, 32, 36, 40, 45, 50, 56, 60, 65, 80, 105, 125, 130, 155] },
  { grade: "MS Bright", shape: "square", subtype: "Square Bar", sizesMm: [8, 10, 12, 12.7, 14.2, 16, 19, 20, 22, 25.4, 28, 30, 32, 38, 40, 45, 50, 63] },
  { grade: "MS Bright", shape: "hex", subtype: "Hex Bar", sizesMm: [12, 12.7, 14.2, 16, 17, 19, 22.2, 24, 25.4, 27, 28.5, 30, 32, 36, 41, 46, 50, 55, 60, 65, 70, 75] },
  {
    grade: "EN-8",
    shape: "flat",
    subtype: "Rolled",
    flats: {
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
  {
    grade: "WPS (D3)",
    shape: "flat",
    subtype: "Rolled - Super Forge",
    flats: {
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
    grade: "WPS (D3)",
    shape: "flat",
    subtype: "Forging",
    flats: {
      40: [50, 65, 80, 105, 130, 155, 200, 250, 310, 355, 410],
      50: [65, 80, 105, 130, 155, 200, 250, 310, 355, 410],
      65: [80, 105, 130, 155, 200, 250, 305, 355, 410],
      80: [105, 130, 155, 200, 250, 305, 355, 410],
      105: [130, 155, 200, 250, 305, 355, 410],
    },
  },
  {
    grade: "MS Bright",
    shape: "flat",
    subtype: "Rolled",
    flats: {
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
    grade: "MS Black",
    shape: "flat",
    subtype: "Heavy Flat",
    flats: {
      32: [40, 50, 65, 75, 100, 125, 150, 200],
      40: [50, 65, 75, 100, 125, 150, 200],
      50: [65, 75, 100, 125, 150, 200],
    },
  },
  { grade: "Brass", shape: "non-ferrous", subtype: "Rod, Hex, Square, Flat, Sheet", noteOnly: true },
  { grade: "Copper", shape: "non-ferrous", subtype: "EC Grade", noteOnly: true },
  { grade: "Aluminium", shape: "non-ferrous", subtype: "HE30 / 6082 Grade", noteOnly: true },
  { grade: "SS 304", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 304L", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 316", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 316L", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 321", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 410", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 420", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 430F", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 431", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 440C", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
  { grade: "SS 17-4-PH", shape: "non-ferrous", subtype: "Stainless Steel Rod", noteOnly: true },
];

const steelPhysical = (density = "7.85 g/cm³"): { label: string; value: string }[] => [
  { label: "Density", value: density },
  { label: "Melting range", value: "1425–1540 °C" },
  { label: "Modulus of elasticity", value: "190–210 GPa" },
  { label: "Thermal conductivity", value: "42–52 W/m·K" },
  { label: "Machinability", value: "Good with carbide tooling" },
  { label: "Weldability", value: "Grade dependent — see notes" },
];

export const GRADES: Grade[] = [
  {
    slug: "en-8",
    name: "EN-8 / EN-8D",
    catalogKeys: ["EN-8", "EN-8D", "EN-8D / C-45"],
    tagline: "All-purpose, easy to machine",
    overlay: "All-purpose medium-carbon: machines, welds, and heat-treats well. Shafts, axles, bolts.",
    family: "carbon",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "97.5%" },
      { z: 6, symbol: "C", pct: "0.40%" },
      { z: 25, symbol: "Mn", pct: "0.80%" },
      { z: 14, symbol: "Si", pct: "0.25%" },
    ],
    chemistry: { C: "0.36–0.44", Mn: "0.60–1.00", Si: "0.15–0.35", Cr: "0.00–0.20", Ni: "0.00–0.20", Mo: "0.00" },
    density: 7.85,
    pricePerKg: 72,
    overview:
      "EN-8 (080M40 / C45 family) is the default medium-carbon bar for general engineering in India. Jagetiya Metals stocks rolled, bright, imported, forging, and centerless-ground rod from 8 mm through 450 mm, plus square and flat.",
    body: [
      "EN-8 sits between mild steel and the alloy grades. Carbon around 0.40% gives useful strength after normalizing or through-hardening without the quench-cracking risk of EN-31 or D3. It turns cleanly, takes a thread, and welds with preheat on heavier sections.",
      "EN-8D is the tighter-chemistry / higher-integrity variant used when customers specify C45 or 080M40 with mill traceability. We keep VSP rolled, R.L Steel / LSR rod, bright-drawn, and China/Korea imported heavy rounds so a buyer can match origin to the job.",
      "Forging rod from 310–450 mm covers die blocks, large shafts, and rough-turned blanks that will be cut on our 16–550 mm hydraulic bandsaw.",
    ],
    tempers: ["As rolled", "Normalized", "Bright drawn", "Forged", "Centerless ground"],
    origins: ["VSP", "R.L Steel / LSR", "China / Korea", "Forging"],
    forms: [
      { name: "Round Bar", availability: "stock", detail: "8 mm through 450 mm. Rolled, bright, imported, forging, CLG." },
      { name: "Square Bar", availability: "stock", detail: "16 mm through 155 mm side." },
      { name: "Flat Bar", availability: "stock", detail: "6–50 mm thick × 25–250 mm wide, cut to length." },
      { name: "Custom Cut", availability: "stock", detail: "Hydraulic bandsaw 16–550 mm. Square ends on request." },
    ],
    mechanical: [
      { condition: "Normalized", tensile: "550–700 MPa", yield: "280 MPa min", elongation: "16% min", hardness: "152–207 HB" },
      { condition: "Bright drawn", tensile: "660–850 MPa", yield: "510 MPa typ.", elongation: "8–12%", hardness: "201–255 HB" },
    ],
    physical: steelPhysical(),
    specs: ["BS 970 080M40", "EN 10083 C45 / C45E", "IS 1570 45C8", "DIN 1.1191"],
    machining: [
      "Turns and mills well in the normalized condition; use sharp carbide and generous coolant on bright bar.",
      "Preheat 150–200 °C before welding sections above 20 mm; post-heat optional.",
      "Through-harden and temper for pins and shafts that need 40–45 HRC.",
    ],
    applications: [
      "Axles, spindles, and general shafts",
      "Bolts, studs, and connecting rods",
      "Gears in moderate duty",
      "Hydraulic fittings and bosses",
      "Machine tool parts and fixtures",
    ],
    why: [
      "Broadest size ladder in the warehouse — 8 mm bright through 450 mm forging",
      "Rolled, bright, imported, and forging origins on the same grade",
      "Mill certificates and heat numbers with every lot",
      "Cut to length the same day on in-stock diameters",
    ],
    related: ["en-9", "en-19", "ms"],
  },
  {
    slug: "en-9",
    name: "EN-9",
    catalogKeys: ["EN-9"],
    tagline: "Higher carbon, wear ready",
    overlay: "0.45% carbon for wear parts, cams, and shafts that need more hardness than EN-8.",
    family: "carbon",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "97.3%" },
      { z: 6, symbol: "C", pct: "0.45%" },
      { z: 25, symbol: "Mn", pct: "0.90%" },
      { z: 14, symbol: "Si", pct: "0.25%" },
    ],
    chemistry: { C: "0.40–0.50", Mn: "0.70–1.10", Si: "0.15–0.35", Cr: "0.00–0.20", Ni: "0.00–0.20", Mo: "0.00" },
    density: 7.85,
    pricePerKg: 78,
    overview:
      "EN-9 (070M55 family) is the step up from EN-8 when the part needs more wear resistance after heat treatment. Round bar is stocked 18–200 mm rolled and 310–450 mm forging.",
    body: [
      "Carbon in the mid-0.40s to 0.50% range lets EN-9 take a deeper hard case or a higher through-hardness than EN-8. It is the usual call for cams, sprockets, and shafts that polish in service.",
      "Weldability is narrower than EN-8 — preheat and controlled hydrogen consumables on anything beyond light attachments.",
    ],
    tempers: ["As rolled", "Normalized", "Forged"],
    origins: ["Domestic rolled", "Forging"],
    forms: [
      { name: "Round Bar", availability: "stock", detail: "18–200 mm rod; 310–450 mm forging rod." },
      { name: "Custom Cut", availability: "stock", detail: "Bandsaw to length from warehouse bar." },
    ],
    mechanical: [
      { condition: "Normalized", tensile: "700–850 MPa", yield: "355 MPa min", elongation: "13% min", hardness: "201–255 HB" },
    ],
    physical: steelPhysical(),
    specs: ["BS 970 070M55", "EN 10083 C50 / C55", "IS 1570 55C8"],
    machining: ["Machine in the annealed or normalized state; grind after hardening.", "Limited weldability — preheat required."],
    applications: ["Cams and camshafts", "Sprockets and wear collars", "Keys and spindles", "General wear parts"],
    why: ["Full diameter ladder 18–200 mm plus heavy forging", "Same-day cut from Vadodara stock", "Mill certs on request"],
    related: ["en-8", "en-31", "en-19"],
  },
  {
    slug: "en-19",
    name: "EN-19 (4140)",
    catalogKeys: ["EN-19 (4140)"],
    tagline: "Cr-Mo strength, oil & gas ready",
    overlay: "4140 / 42CrMo4: the workhorse alloy for high-tensile shafts, tooling, and oilfield parts.",
    family: "alloy",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "97.0%" },
      { z: 24, symbol: "Cr", pct: "0.95%" },
      { z: 25, symbol: "Mn", pct: "0.87%" },
      { z: 42, symbol: "Mo", pct: "0.20%" },
    ],
    chemistry: { C: "0.38–0.43", Mn: "0.75–1.00", Si: "0.15–0.35", Cr: "0.80–1.10", Ni: "0.00–0.20", Mo: "0.15–0.25" },
    density: 7.85,
    pricePerKg: 95,
    overview:
      "EN-19 is the Indian / BS designation for SAE 4140 and 42CrMo4. Chromium-molybdenum alloy steel with through-hardening capability in sections that EN-8 cannot match. Stocked 16–200 mm rod (R.L Steel, Laxcon, LSR) and 210–450 mm imported / forging.",
    body: [
      "4140 is specified when tensile in the 850–1100 MPa range is required after quench and temper, with toughness that plain carbon cannot hold in thicker sections. Molybdenum resists temper brittleness; chromium adds hardenability.",
      "It is the default bar for high-tensile bolts, crankshafts, connection rods, tool holders, and oilfield subs. We keep both domestic rolled and imported/forging so buyers can stay on one heat or step up in diameter without changing grade.",
    ],
    tempers: ["As rolled", "Annealed", "Q&T (T/U/V)", "Forged"],
    origins: ["R.L Steel", "Laxcon", "LSR", "China / Forging"],
    forms: [
      { name: "Round Bar", availability: "stock", detail: "16–200 mm domestic rod; 210–450 mm imported / forging." },
      { name: "Custom Cut", availability: "stock", detail: "Bandsaw to length. Facing on request." },
    ],
    mechanical: [
      { condition: "Q&T T (~850 MPa)", tensile: "850–1000 MPa", yield: "680 MPa min", elongation: "13% min", hardness: "248–302 HB" },
      { condition: "Q&T U (~925 MPa)", tensile: "925–1075 MPa", yield: "755 MPa min", elongation: "12% min", hardness: "269–331 HB" },
    ],
    physical: steelPhysical(),
    specs: ["BS 970 709M40", "SAE 4140", "DIN 42CrMo4 / 1.7225", "EN 10083-3 42CrMo4"],
    machining: [
      "Best machined annealed or at ~28 HRC; carbide with through-coolant on Q&T bar.",
      "Preheat 200–300 °C to weld; PWHT recommended on critical joints.",
      "Nitridable for wear surfaces after Q&T.",
    ],
    applications: [
      "High-tensile shafts and axles",
      "Oil & gas subs, collars, and tool joints",
      "Crankshafts and connecting rods",
      "Tool holders and spindles",
      "Bolts, studs, and landing-gear fittings",
    ],
    why: [
      "Domestic + imported/forging coverage 16–450 mm",
      "R.L Steel / Laxcon / LSR mill options",
      "Cut-to-size from live Vadodara inventory",
      "Chemistry and MTC with every shipment",
    ],
    related: ["en-24", "en-8", "20mncr5"],
  },
  {
    slug: "en-24",
    name: "EN-24",
    catalogKeys: ["EN-24"],
    tagline: "Ni-Cr-Mo, our strongest bar",
    overlay: "817M40 / 34CrNiMo6: steel-grade strength in heavy sections. Aerospace, tooling, and shafts.",
    family: "alloy",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "95.5%" },
      { z: 28, symbol: "Ni", pct: "1.50%" },
      { z: 24, symbol: "Cr", pct: "1.20%" },
      { z: 42, symbol: "Mo", pct: "0.25%" },
    ],
    chemistry: { C: "0.36–0.44", Mn: "0.60–1.00", Si: "0.15–0.35", Cr: "1.00–1.40", Ni: "1.30–1.70", Mo: "0.20–0.30" },
    density: 7.85,
    pricePerKg: 125,
    overview:
      "EN-24 is the nickel-chromium-molybdenum grade for parts that must stay tough at high tensile in thick section. Stocked 16–200 mm rod and 210–450 mm forging from R.L Steel, Laxcon, and LSR.",
    body: [
      "Nickel gives EN-24 a toughness floor that 4140 loses as section thickness grows. It is the usual upgrade when a shaft, die holder, or landing-gear fitting is too heavy for EN-19 to quench through.",
      "Available in T through Z tensile ranges after quench and temper. We cut forging blanks up to 450 mm on the hydraulic bandsaw.",
    ],
    tempers: ["As rolled", "Annealed", "Q&T T–Z", "Forged"],
    origins: ["R.L Steel", "Laxcon", "LSR", "Forging"],
    forms: [
      { name: "Round Bar", availability: "stock", detail: "16–200 mm rod; 210–450 mm forging rod." },
      { name: "Custom Cut", availability: "stock", detail: "Heavy-section bandsaw capability to 550 mm." },
    ],
    mechanical: [
      { condition: "Q&T T", tensile: "850–1000 MPa", yield: "680 MPa min", elongation: "13% min", hardness: "248–302 HB" },
      { condition: "Q&T Z", tensile: "1550 MPa typ.", yield: "1235 MPa typ.", elongation: "7% typ.", hardness: "444 HB typ." },
    ],
    physical: steelPhysical(),
    specs: ["BS 970 817M40", "DIN 34CrNiMo6 / 1.6582", "AISI 4340 (near)", "EN 10083-3 36CrNiMo4"],
    machining: ["Machine annealed or at T condition. Grinding after high-tensile heat treat.", "Weld only with matching consumables and strict PWHT."],
    applications: ["Heavy shafts and power-transmission parts", "Die holders and bolsters", "Aircraft and defence fittings", "High-tensile fasteners"],
    why: ["Forging coverage through 450 mm", "Same mills as our EN-19 so mixed BOMs stay consistent", "MTC and heat traceability"],
    related: ["en-19", "en-353", "en-31"],
  },
  {
    slug: "20mncr5",
    name: "20MnCr5",
    catalogKeys: ["20MnCr5"],
    tagline: "Case hardening gears",
    overlay: "The standard case-hardening grade for gears, pinions, and shafts that need a hard skin and a tough core.",
    family: "case",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "97.3%" },
      { z: 25, symbol: "Mn", pct: "1.25%" },
      { z: 24, symbol: "Cr", pct: "1.05%" },
      { z: 6, symbol: "C", pct: "0.20%" },
    ],
    chemistry: { C: "0.17–0.23", Mn: "1.10–1.40", Si: "0.15–0.35", Cr: "0.90–1.20", Ni: "0.00–0.20", Mo: "0.00" },
    density: 7.85,
    pricePerKg: 98,
    overview:
      "20MnCr5 is the DIN case-hardening steel used across Indian gear shops. Low core carbon, manganese and chromium for hardenability. Stocked 16–200 mm rod and 210–450 mm forging.",
    body: [
      "Carburize, quench, and temper to put 58–62 HRC on the tooth while the core stays in the 30–45 HRC band. It is the default for automotive and industrial gears when EN-353 / 8620 is not specified.",
    ],
    tempers: ["As rolled", "Annealed", "Blank carburizing", "Forged"],
    origins: ["R.L Steel", "Laxcon", "LSR", "Forging"],
    forms: [
      { name: "Round Bar", availability: "stock", detail: "16–200 mm rod; 210–450 mm forging." },
      { name: "Custom Cut", availability: "stock", detail: "Cut blanks for gear turning." },
    ],
    mechanical: [
      { condition: "Core after case hardening", tensile: "1000–1300 MPa", yield: "800 MPa typ.", elongation: "8% typ.", hardness: "30–45 HRC core / 58–62 HRC case" },
    ],
    physical: steelPhysical(),
    specs: ["DIN 20MnCr5 / 1.7147", "EN 10084 20MnCr5", "IS 20MnCr5"],
    machining: ["Turn and hob in the annealed condition before carburizing.", "Leave grind stock on journals and bores."],
    applications: ["Spur and helical gears", "Pinions and shafts", "CV joints and cam lobes", "Wear bushes after case hardening"],
    why: ["Full 16–450 mm coverage", "Matched mill sources with EN-19 / EN-24", "Ready for gear-blank cutting"],
    related: ["en-353", "en-19", "en-8"],
  },
  {
    slug: "en-353",
    name: "EN-353",
    catalogKeys: ["EN-353"],
    tagline: "Case hardening with nickel",
    overlay: "Nickel-bearing case steel for heavy gears and pinions that outgrow 20MnCr5.",
    family: "case",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "97.0%" },
      { z: 24, symbol: "Cr", pct: "1.15%" },
      { z: 6, symbol: "C", pct: "0.52%" },
      { z: 25, symbol: "Mn", pct: "0.65%" },
    ],
    chemistry: { C: "0.48–0.55", Mn: "0.50–0.80", Si: "0.15–0.35", Cr: "1.00–1.30", Ni: "0.00–0.20", Mo: "0.00" },
    density: 7.85,
    pricePerKg: 110,
    overview:
      "EN-353 is stocked as Super Forge / LSR rolled 16–160 mm and forging 150–350 mm for heavy case-hardened gears, crown wheels, and pinions.",
    body: [
      "Specified when the gear designer wants more core strength and case depth than 20MnCr5 in larger sections. Cut on the bandsaw as turning blanks.",
    ],
    tempers: ["As rolled", "Forged", "Annealed"],
    origins: ["Super Forge Steel", "LSR", "Forging"],
    forms: [
      { name: "Round Bar", availability: "stock", detail: "16–160 mm rolled; 150–350 mm forging." },
      { name: "Custom Cut", availability: "stock", detail: "Gear-blank lengths from stock bar." },
    ],
    mechanical: [
      { condition: "Case hardened", tensile: "Core 1100 MPa typ.", yield: "—", elongation: "—", hardness: "58–63 HRC case" },
    ],
    physical: steelPhysical(),
    specs: ["BS 970 815M17 family (near)", "IS EN-353", "SAE 8620 (related)"],
    machining: ["Soft-state turning and hobbing before carburize.", "Distortion control on thin webs — fixturing matters."],
    applications: ["Crown wheels and pinions", "Heavy industrial gears", "Transmission shafts"],
    why: ["Super Forge / LSR rolled plus forging", "Sizes aimed at gear blanks", "Cut-to-length from Vadodara"],
    related: ["20mncr5", "en-24", "en-19"],
  },
  {
    slug: "en-31",
    name: "EN-31",
    catalogKeys: ["EN-31"],
    tagline: "Bearing steel, high carbon Cr",
    overlay: "1% carbon, 1.5% chromium. The standard for bearings, gauges, and wear tools.",
    family: "tool",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "96.8%" },
      { z: 6, symbol: "C", pct: "0.98%" },
      { z: 24, symbol: "Cr", pct: "1.45%" },
      { z: 25, symbol: "Mn", pct: "0.40%" },
    ],
    chemistry: { C: "0.90–1.05", Mn: "0.30–0.50", Si: "0.20–0.35", Cr: "1.30–1.60", Ni: "0.00–0.20", Mo: "0.00" },
    density: 7.81,
    pricePerKg: 105,
    overview:
      "EN-31 (SAE 52100 / 100Cr6) is high-carbon chromium bearing steel. LSR rolled 16–200 mm and forging / imported 160–450 mm.",
    body: [
      "Hardens to 60–66 HRC with excellent rolling-contact fatigue. Used for bearings, balls, rollers, gauges, mandrels, and cold-work tools that do not need the wear chemistry of D3.",
      "Weldability is poor. Machine in the spheroidized annealed condition, then harden and grind.",
    ],
    tempers: ["Spheroidized annealed", "Rolled", "Forged"],
    origins: ["LSR Steel", "Imported / Forging"],
    forms: [
      { name: "Round Bar", availability: "stock", detail: "16–200 mm rolled; 160–450 mm forging / imported." },
      { name: "Custom Cut", availability: "stock", detail: "Blank lengths for turning and grinding." },
    ],
    mechanical: [
      { condition: "Annealed", tensile: "750 MPa typ.", yield: "—", elongation: "—", hardness: "201 HB max" },
      { condition: "Hardened & tempered", tensile: "—", yield: "—", elongation: "—", hardness: "60–66 HRC" },
    ],
    physical: steelPhysical("7.81 g/cm³"),
    specs: ["BS 970 535A99", "SAE 52100", "DIN 100Cr6 / 1.3505", "IS 4398"],
    machining: ["Anneal before heavy machining.", "Do not weld. Grind after heat treatment.", "Oil quench from 820–860 °C; temper immediately."],
    applications: ["Ball and roller bearings", "Gauges, mandrels, and collets", "Pump parts and wear rings", "Cold-work punches (light)"],
    why: ["LSR rolled plus heavy imported / forging", "Bearing-quality chemistry", "Cut blanks ready for the grinder"],
    related: ["wps-d3", "en-9", "en-8"],
  },
  {
    slug: "wps-d3",
    name: "WPS (D3)",
    catalogKeys: ["WPS (D3)"],
    tagline: "High-carbon, high-chromium tool steel",
    overlay: "D3 / 1.2080 die steel. Wear first. Punches, dies, shear blades, and gauges.",
    family: "tool",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "97.0%" },
      { z: 6, symbol: "C", pct: "0.70%" },
      { z: 24, symbol: "Cr", pct: "1.00%" },
      { z: 25, symbol: "Mn", pct: "0.50%" },
    ],
    chemistry: { C: "0.65–0.75", Mn: "0.40–0.60", Si: "0.25–0.45", Cr: "0.90–1.10", Ni: "0.00", Mo: "0.00" },
    density: 7.70,
    pricePerKg: 145,
    overview:
      "WPS (D3) is our high-carbon / high-chromium cold-work die steel. Super Forge rod 8–75 mm, China turned rod 80–350 mm, plus square and a deep flat program including forging flats.",
    body: [
      "D3 holds an edge and resists abrasion in blanking, cold forming, and shearing. Chromium carbides are the wear mechanism. Toughness is lower than D2 / H13 — design for compression and abrasion, not shock.",
      "The flat program is one of the widest in the warehouse: rolled 6–32 mm thick and forging 40–105 mm thick out to 410 mm wide.",
    ],
    tempers: ["Annealed", "Rolled", "Turned", "Forged"],
    origins: ["Super Forge Steel", "China turned"],
    forms: [
      { name: "Round Bar", availability: "stock", detail: "8–75 mm Super Forge; 80–350 mm turned imported." },
      { name: "Square Bar", availability: "stock", detail: "16–155 mm Super Forge." },
      { name: "Flat Bar", availability: "stock", detail: "Rolled and forging flats 6–105 mm thick × 25–410 mm wide." },
      { name: "Custom Cut", availability: "stock", detail: "Die blocks and blade blanks, square ends." },
    ],
    mechanical: [
      { condition: "Annealed", tensile: "—", yield: "—", elongation: "—", hardness: "255 HB max" },
      { condition: "Hardened", tensile: "—", yield: "—", elongation: "—", hardness: "58–62 HRC" },
    ],
    physical: steelPhysical("7.70 g/cm³"),
    specs: ["AISI D3", "DIN 1.2080 / X210Cr12 (related)", "IS T105Cr5 / WPS"],
    machining: [
      "Machine fully annealed. Carbide only after hardening.",
      "Preheat in steps before austenitizing; oil or air quench per mill sheet.",
      "Never weld wear faces; repair only with matching electrodes and full heat-treat cycle.",
    ],
    applications: ["Blanking and piercing dies", "Shear blades and slitter knives", "Gauges and forming tools", "Brick-mould liners and wear plates"],
    why: ["Round, square, and the widest D3 flat list in stock", "Super Forge + imported turned", "Die-block cutting on the 550 mm saw"],
    related: ["en-31", "en-8", "en-19"],
  },
  {
    slug: "ms",
    name: "Mild Steel",
    catalogKeys: ["MS", "MS Bright", "MS Black"],
    tagline: "Weldable, formable, in every shop",
    overlay: "IS 2062 / 1018 family. Bright, black, hex, square, and heavy flat — the everyday bar.",
    family: "carbon",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "98.9%" },
      { z: 6, symbol: "C", pct: "0.20%" },
      { z: 25, symbol: "Mn", pct: "0.55%" },
      { z: 14, symbol: "Si", pct: "0.20%" },
    ],
    chemistry: { C: "0.16–0.23", Mn: "0.35–0.80", Si: "0.10–0.35", Cr: "0.00", Ni: "0.00", Mo: "0.00" },
    density: 7.85,
    pricePerKg: 58,
    overview:
      "Mild steel is the highest-velocity SKU in the warehouse. Bright rod from 4 mm, black rod through 300 mm, hex 12–75 mm AF, square, rolled flat, and heavy black flat. VSP and rolling-mill origins.",
    body: [
      "Low carbon keeps it weldable, formable, and cheap to machine. It is the right call for fixtures, frames, spacers, and any part that does not need a heat-treat hardness.",
      "Bright bar is drawn for dimensional accuracy and finish; black bar is the structural / fabrication default; hex is fastener and socket stock.",
    ],
    tempers: ["Bright drawn", "Black / as rolled", "Centerless ground"],
    origins: ["VSP", "Rolling mills", "Imported black"],
    forms: [
      { name: "Bright Round", availability: "stock", detail: "4 mm through 75 mm including 14.2, 22.2, 25.4 inch-metric sizes." },
      { name: "Black Round", availability: "stock", detail: "16–300 mm VSP / rolling / imported." },
      { name: "Hex Bar", availability: "stock", detail: "MS bright 12–75 mm AF." },
      { name: "Square / Flat", availability: "stock", detail: "Bright square 8–63 mm; flats 5–50 mm thick." },
    ],
    mechanical: [
      { condition: "IS 2062 E250 (typ.)", tensile: "410 MPa min", yield: "250 MPa min", elongation: "23% min", hardness: "— " },
      { condition: "Bright drawn", tensile: "430–580 MPa", yield: "330 MPa typ.", elongation: "12–18%", hardness: "— " },
    ],
    physical: steelPhysical(),
    specs: ["IS 2062 E250 / E350", "SAE 1018", "EN S235 / S355 (related)", "ASTM A36 (related)"],
    machining: ["Free-machining relative to alloy steels. HSS or carbide.", "Excellent weldability; no preheat on light sections."],
    applications: ["Fabrication and frames", "Fixtures and jigs", "Fasteners and pins", "General OEM components"],
    why: ["Deepest size list of any grade we stock", "Bright, black, hex, square, flat in one place", "Same-day cut and dispatch from Makarpura"],
    related: ["en-8", "en-9", "ss-304"],
  },
  {
    slug: "ss-304",
    name: "Stainless 304 / 316",
    catalogKeys: ["SS 304", "SS 304L", "SS 316", "SS 316L", "SS 321", "SS 410", "SS 420", "SS 430F", "SS 431", "SS 440C", "SS 17-4-PH"],
    tagline: "Corrosion-resistant rod",
    overlay: "304, 304L, 316, 316L, 321, 410, 420, 430F, 431, 440C, and 17-4PH in rod and related forms.",
    family: "stainless",
    availableNow: true,
    composition: [
      { z: 26, symbol: "Fe", pct: "70.0%" },
      { z: 24, symbol: "Cr", pct: "18.5%" },
      { z: 28, symbol: "Ni", pct: "8.5%" },
      { z: 6, symbol: "C", pct: "0.08%" },
    ],
    chemistry: { C: "0.08 max", Mn: "2.00 max", Si: "1.00 max", Cr: "18.00–20.00", Ni: "8.00–10.50", Mo: "0.00 (316: 2.00–3.00)" },
    density: 8.0,
    pricePerKg: 220,
    overview:
      "Austenitic, martensitic, and precipitation-hardening stainless rod for corrosion-critical and hygienic work. 304/304L for general, 316/316L for chlorides, 17-4PH for strength, 410/420/440C for hardenable cutlery and shafts.",
    body: [
      "Stainless is quoted to length and diameter from live stock and mill lead times. Tell us grade, form, and size — we confirm the same day.",
    ],
    tempers: ["Annealed", "Cold drawn", "H900 (17-4PH)"],
    origins: ["Domestic", "Imported"],
    forms: [
      { name: "Round Bar", availability: "stock", detail: "304/316 family plus 410, 420, 431, 440C, 17-4PH." },
      { name: "Other forms", availability: "request", detail: "Pipe, sheet, wire, and flat by enquiry." },
    ],
    mechanical: [
      { condition: "304 annealed", tensile: "515 MPa min", yield: "205 MPa min", elongation: "40% min", hardness: "201 HB max" },
      { condition: "316 annealed", tensile: "515 MPa min", yield: "205 MPa min", elongation: "40% min", hardness: "217 HB max" },
    ],
    physical: steelPhysical("8.00 g/cm³"),
    specs: ["ASTM A276 / A479", "EN 10088-3", "IS 6603"],
    machining: ["304 work-hardens — positive rake, constant feed.", "316 is gummier; through-coolant recommended.", "17-4PH machines best in H1150, used in H900."],
    applications: ["Food and pharma fittings", "Pump shafts", "Marine hardware", "Valve trim", "Medical and architectural"],
    why: ["Eleven stainless grades on the board", "Rod plus related forms by request", "Cut-to-length with MTC"],
    related: ["ms", "brass", "aluminium"],
  },
  {
    slug: "brass",
    name: "Brass",
    catalogKeys: ["Brass"],
    tagline: "Free-machining copper-zinc",
    overlay: "Rod, hex, square, flat, and sheet. Plumbing, turnery, and decorative hardware.",
    family: "nonferrous",
    availableNow: true,
    composition: [
      { z: 29, symbol: "Cu", pct: "60%" },
      { z: 30, symbol: "Zn", pct: "39%" },
      { z: 82, symbol: "Pb", pct: "1%" },
    ],
    chemistry: { Cu: "57–63", Zn: "bal.", Pb: "0.5–3.5 (free-cut)", Fe: "0.30 max" },
    density: 8.5,
    pricePerKg: 580,
    overview: "Free-cutting and forging brasses in rod, hex, square, flat, and sheet. Quoted by size and form from Vadodara stock.",
    body: ["Excellent machinability and corrosion resistance in water service. Tell us diameter / AF / thickness and length."],
    tempers: ["Half hard", "Free cutting"],
    origins: ["Domestic"],
    forms: [{ name: "Rod / Hex / Square / Flat / Sheet", availability: "stock", detail: "By enquiry — sizes confirmed against warehouse." }],
    mechanical: [{ condition: "CZ121 / IS 319 typ.", tensile: "380 MPa typ.", yield: "—", elongation: "20% typ.", hardness: "—" }],
    physical: [
      { label: "Density", value: "8.4–8.7 g/cm³" },
      { label: "Conductivity", value: "Good electrical / thermal" },
      { label: "Machinability", value: "Excellent (leaded)" },
    ],
    specs: ["IS 319", "IS 4170", "BS CZ121"],
    machining: ["High speed, light cuts, excellent chip breaking on leaded grades."],
    applications: ["Plumbing fittings", "Turned inserts", "Decorative hardware", "Electrical terminals"],
    why: ["Multi-form brass in one enquiry", "Cut to length", "Paired with copper and aluminium on the same floor"],
    related: ["copper", "aluminium", "ss-304"],
  },
  {
    slug: "copper",
    name: "Copper",
    catalogKeys: ["Copper"],
    tagline: "EC grade conductivity",
    overlay: "Electrolytic copper for electrical, thermal, and busbar work.",
    family: "nonferrous",
    availableNow: true,
    composition: [{ z: 29, symbol: "Cu", pct: "99.9%" }],
    chemistry: { Cu: "99.90 min", O: "EC / ETP" },
    density: 8.96,
    pricePerKg: 850,
    overview: "EC-grade copper rod and related forms. Quoted against live stock.",
    body: ["Use when conductivity is the spec. We confirm size and temper on enquiry."],
    tempers: ["Annealed", "Half hard"],
    origins: ["Domestic"],
    forms: [{ name: "Rod and related", availability: "stock", detail: "EC grade — confirm size on quote." }],
    mechanical: [{ condition: "Annealed EC", tensile: "210 MPa typ.", yield: "—", elongation: "35% typ.", hardness: "—" }],
    physical: [
      { label: "Density", value: "8.96 g/cm³" },
      { label: "Electrical conductivity", value: "100% IACS typ." },
      { label: "Thermal conductivity", value: "390 W/m·K" },
    ],
    specs: ["IS 191", "ASTM B187"],
    machining: ["Soft — sharp tools, high rake, support thin walls."],
    applications: ["Busbars", "Electrical connectors", "Heat exchangers", "Earthing"],
    why: ["EC grade on the floor", "Cut to length with brass and aluminium"],
    related: ["brass", "aluminium", "ss-304"],
  },
  {
    slug: "aluminium",
    name: "Aluminium HE30 / 6082",
    catalogKeys: ["Aluminium"],
    tagline: "Structural aluminium bar",
    overlay: "HE30 / 6082 (and 7075 by related enquiry). Lightweight structural bar and plate work.",
    family: "nonferrous",
    availableNow: true,
    composition: [
      { z: 13, symbol: "Al", pct: "97.0%" },
      { z: 12, symbol: "Mg", pct: "0.90%" },
      { z: 14, symbol: "Si", pct: "1.00%" },
      { z: 25, symbol: "Mn", pct: "0.70%" },
    ],
    chemistry: { Si: "0.7–1.3", Mg: "0.6–1.2", Mn: "0.4–1.0", Fe: "0.50 max", Al: "bal." },
    density: 2.70,
    pricePerKg: 280,
    overview:
      "6082 / HE30 is the structural aluminium we keep for jigs, frames, and machined parts that cannot carry steel weight. 7075 available by related enquiry.",
    body: ["A third the density of steel with weldable 6xxx properties. Quote diameter or flat size and length."],
    tempers: ["T6", "T651"],
    origins: ["Domestic"],
    forms: [{ name: "Bar / related", availability: "stock", detail: "HE30 / 6082. 7075 on request." }],
    mechanical: [{ condition: "6082-T6", tensile: "310 MPa min", yield: "260 MPa min", elongation: "10% min", hardness: "95 HB typ." }],
    physical: [
      { label: "Density", value: "2.70 g/cm³" },
      { label: "Melting range", value: "555–650 °C" },
      { label: "Modulus", value: "70 GPa" },
    ],
    specs: ["IS 733 HE30", "EN 573 6082", "ASTM B221 6082"],
    machining: ["Sharp tools, high speed, chip breakers. Excellent relative to stainless."],
    applications: ["Jigs and fixtures", "Structural frames", "Marine and transport", "Machined housings"],
    why: ["HE30 / 6082 on the non-ferrous board", "Pairs with our steel bar program for mixed BOMs"],
    related: ["ms", "ss-304", "brass"],
  },
];

export const FEATURED_GRADE_SLUGS = ["en-8", "en-19", "en-24", "20mncr5", "en-31", "wps-d3", "ms", "ss-304"] as const;

export function getGrade(slug: string): Grade | undefined {
  return GRADES.find((g) => g.slug === slug);
}

export function gradeByCatalogKey(key: string): Grade | undefined {
  const k = key.toUpperCase();
  return GRADES.find((g) => g.catalogKeys.some((x) => x.toUpperCase() === k) || g.name.toUpperCase() === k);
}

export function stockForGrade(grade: Grade): StockLine[] {
  const keys = new Set(grade.catalogKeys.map((k) => k.toUpperCase()));
  return STOCK.filter((s) => keys.has(s.grade.toUpperCase()));
}

export function sizeRangeLabel(grade: Grade): string {
  const lines = stockForGrade(grade);
  const sizes: number[] = [];
  for (const line of lines) {
    if (line.sizesMm) sizes.push(...line.sizesMm);
    if (line.flats) {
      for (const [thk, widths] of Object.entries(line.flats)) {
        sizes.push(Number(thk), ...widths);
      }
    }
  }
  if (!sizes.length) return "By enquiry";
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  return `${trimNum(min)}–${trimNum(max)} mm`;
}

export function trimNum(n: number): string {
  return String(Number(n.toFixed(1))).replace(/\.0$/, "");
}

export function hasExactSize(line: StockLine, size: number): boolean {
  if (!line.sizesMm) return false;
  return line.sizesMm.some((s) => Math.abs(s - size) < 0.0001);
}

export function nearestSizes(values: number[], target: number, n = 3): { below: number[]; above: number[] } {
  const sorted = [...new Set(values.map(Number))].sort((a, b) => a - b);
  const below = sorted.filter((s) => s < target - 0.0001).slice(-n);
  const above = sorted.filter((s) => s > target + 0.0001).slice(0, n);
  return { below, above };
}

export function allSizesForShape(shape: ShapeId, gradeName?: string): number[] {
  const lines = STOCK.filter((s) => s.shape === shape && (!gradeName || s.grade === gradeName));
  const sizes: number[] = [];
  for (const line of lines) {
    if (line.sizesMm) sizes.push(...line.sizesMm);
  }
  return [...new Set(sizes)].sort((a, b) => a - b);
}
