export type ChemElement = { symbol: string; label: string; value: string };

export type GradeProduct = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  shapes: string[];
  chemistry: ChemElement[];
  badges?: string[];
};

export type ShapeProduct = {
  id: string;
  name: string;
  description: string;
  grades: string[];
};

export const GRADE_PRODUCTS: GradeProduct[] = [
  {
    id: "en-24",
    name: "EN-24",
    tagline: "High strength, nickel-chromium",
    description:
      "Nickel-chromium-molybdenum alloy steel for gears, shafts, and heavy-duty machine components. Rolled and forging rods from 16 mm to 450 mm.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: [
      { symbol: "C", label: "Carbon", value: "0.36–0.44%" },
      { symbol: "Cr", label: "Chromium", value: "1.00–1.40%" },
      { symbol: "Ni", label: "Nickel", value: "1.30–1.70%" },
      { symbol: "Mo", label: "Molybdenum", value: "0.20–0.30%" },
    ],
  },
  {
    id: "en-19",
    name: "EN-19 (4140)",
    tagline: "Chromium-molybdenum alloy",
    description:
      "Versatile alloy steel that machines, welds, and heat-treats well. Ideal for bolts, crankshafts, and precision machine parts.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: [
      { symbol: "C", label: "Carbon", value: "0.38–0.43%" },
      { symbol: "Cr", label: "Chromium", value: "0.80–1.10%" },
      { symbol: "Mo", label: "Molybdenum", value: "0.15–0.25%" },
      { symbol: "Mn", label: "Manganese", value: "0.75–1.00%" },
    ],
  },
  {
    id: "en-8",
    name: "EN-8 / EN-8D",
    tagline: "All-purpose carbon steel",
    description:
      "Workhorse carbon steel for shafts, pins, and general engineering. Available rolled, bright, forged, and centerless ground.",
    shapes: ["Round Bar", "Square Bar", "Flat Bar"],
    badges: ["ROLLED", "BRIGHT ROD", "FORGING"],
    chemistry: [
      { symbol: "C", label: "Carbon", value: "0.36–0.44%" },
      { symbol: "Mn", label: "Manganese", value: "0.60–1.00%" },
      { symbol: "Si", label: "Silicon", value: "0.15–0.35%" },
    ],
  },
  {
    id: "en-31",
    name: "EN-31",
    tagline: "Bearing-grade alloy steel",
    description:
      "High-carbon chromium steel for bearings, rollers, and cutting tools. Rolled and forging rods in full size range.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: [
      { symbol: "C", label: "Carbon", value: "0.90–1.05%" },
      { symbol: "Cr", label: "Chromium", value: "1.30–1.60%" },
      { symbol: "Mn", label: "Manganese", value: "0.30–0.50%" },
    ],
  },
  {
    id: "wps",
    name: "WPS (D3)",
    tagline: "Cold work tool steel",
    description:
      "High-carbon tool steel for dies, punches, and cutting applications. Round, square, and flat bar in rolled and forging grades.",
    shapes: ["Round Bar", "Square Bar", "Flat Bar"],
    badges: ["ROD", "SQUARE BAR", "FLAT BAR"],
    chemistry: [
      { symbol: "C", label: "Carbon", value: "0.65–0.75%" },
      { symbol: "Cr", label: "Chromium", value: "0.90–1.10%" },
      { symbol: "Si", label: "Silicon", value: "0.25–0.45%" },
    ],
  },
  {
    id: "ms",
    name: "MS",
    tagline: "Mild steel, every size",
    description:
      "Bright, black, and centerless ground rods plus square and flat bar. The backbone of fabrication and general engineering.",
    shapes: ["Round Bar", "Square Bar", "Flat Bar", "Hex Bar"],
    badges: ["BRIGHT", "BLACK", "CENTERLESS"],
    chemistry: [
      { symbol: "C", label: "Carbon", value: "0.16–0.23%" },
      { symbol: "Mn", label: "Manganese", value: "0.35–0.80%" },
      { symbol: "Si", label: "Silicon", value: "0.10–0.35%" },
    ],
  },
  {
    id: "20mncr5",
    name: "20MnCr5",
    tagline: "Case-hardening steel",
    description:
      "Carburizing grade for gears, camshafts, and wear-resistant components. Full rod and forging size range stocked.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: [
      { symbol: "C", label: "Carbon", value: "0.17–0.23%" },
      { symbol: "Mn", label: "Manganese", value: "1.10–1.40%" },
      { symbol: "Cr", label: "Chromium", value: "0.90–1.20%" },
    ],
  },
  {
    id: "en-353",
    name: "EN-353",
    tagline: "Heavy-duty case hardening",
    description:
      "High-carbon case-hardening steel for heavy gears and transmission parts. Rolled and forging rods available.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: [
      { symbol: "C", label: "Carbon", value: "0.48–0.55%" },
      { symbol: "Cr", label: "Chromium", value: "1.00–1.30%" },
      { symbol: "Mn", label: "Manganese", value: "0.50–0.80%" },
    ],
  },
  {
    id: "en-9",
    name: "EN-9",
    tagline: "Medium carbon steel",
    description:
      "Medium carbon grade for axles, shafts, and springs. Rod and forging sizes from 18 mm to 450 mm.",
    shapes: ["Round Bar"],
    badges: ["ROD", "FORGING ROD"],
    chemistry: [
      { symbol: "C", label: "Carbon", value: "0.40–0.50%" },
      { symbol: "Mn", label: "Manganese", value: "0.70–1.10%" },
      { symbol: "Si", label: "Silicon", value: "0.15–0.35%" },
    ],
  },
];

export const SHAPE_PRODUCTS: ShapeProduct[] = [
  {
    id: "round-bar",
    name: "Round Bar",
    description:
      "Rolled, forged, bright, and centerless ground rods. Saw-cut to length, ready for the lathe. Every stocked grade.",
    grades: ["EN-8D", "EN-9", "EN-19", "EN-24", "EN-31", "EN-353", "20MnCr5", "WPS", "MS"],
  },
  {
    id: "square-bar",
    name: "Square Bar",
    description:
      "Extruded and rolled square stock. Skips the first squaring operation on the mill.",
    grades: ["EN-8", "WPS (D3)", "MS Bright"],
  },
  {
    id: "flat-bar",
    name: "Flat Bar",
    description:
      "Thickness × width combinations across EN-8, WPS, and MS grades. Rolled and forging flats in full range.",
    grades: ["EN-8", "WPS (D3)", "MS Bright", "MS Black"],
  },
  {
    id: "hex-bar",
    name: "Hex Bar",
    description:
      "Bright hex stock for fasteners and precision components. Full metric size range.",
    grades: ["MS Bright"],
  },
  {
    id: "non-ferrous",
    name: "Non-Ferrous",
    description:
      "Brass, copper, aluminium, and stainless steel rods. Contact for specific sizes and grades.",
    grades: ["Brass", "Copper", "Aluminium", "SS 304", "SS 316", "SS 410", "SS 440C"],
  },
];

export const FEATURED_GUIDES = [
  {
    title: "EN-24 vs EN-19",
    subtitle: "Which alloy steel should you specify?",
    href: "/metals/search#p4",
  },
  {
    title: "WPS (D3) Tool Steel",
    subtitle: "When to choose cold work tool steel.",
    href: "/metals/search",
  },
  {
    title: "How to Read a Mill Cert",
    subtitle: "Every field explained for Indian steel.",
    href: "/metals/search",
  },
  {
    title: "Chemical Composition",
    subtitle: "Compare up to 3 grades side by side.",
    href: "/metals/search#p4",
  },
];

export const CONTACT = {
  phone: "+91-9824012344",
  email: "Kamlesh@jkmetal.in",
  address: "502/1-A G.I.D.C., Makarpura, Vadodara, Gujarat",
  gst: "24AGIPS3207M1Z7",
};
