export type Guide = {
  slug: string;
  title: string;
  dek: string;
  kicker: string;
  updated: string;
  body: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "en8-vs-en24",
    title: "EN-8 vs EN-24",
    dek: "Which alloy should you specify?",
    kicker: "Comparison",
    updated: "August 2026",
    body: [
      "EN-8 is the default medium-carbon bar for general engineering. EN-24 is the nickel-chromium-molybdenum upgrade for high tensile in thick section. If the drawing says “EN-8 or equivalent” and the shaft is under ~80 mm with no impact requirement, stay on EN-8. If the part is quenched and tempered above 850 MPa, or the section is too heavy for 4140 to harden through, specify EN-24.",
      "Cost and lead time follow the chemistry. EN-8 is on the floor in rolled, bright, imported, and forging. EN-24 is stocked 16–200 mm rod and 210–450 mm forging, at a higher rupee-per-kilo. Do not substitute EN-19 (4140) for EN-24 without the designer — nickel is the toughness, not a marketing extra.",
      "A practical rule used on our floor: fixtures, hubs, and general shafts → EN-8. Oilfield, die holders, and heavy Q&T shafts → EN-19 first, EN-24 if the heat-treat shop says the section will not quench through.",
    ],
  },
  {
    slug: "read-mill-cert",
    title: "How to Read a Mill Cert",
    dek: "Every field on an Indian MTC explained.",
    kicker: "Guide",
    updated: "August 2026",
    body: [
      "A mill test certificate (MTC) is the heat’s passport. Heat number on the bar must match the cert. Chemistry is reported as ladle or product analysis — for EN-8, C 0.36–0.44 and Mn 0.60–1.00 are the lines that matter. Mechanical results are for the tested coupon, not a guarantee of every millimetre of a 450 mm forging.",
      "Origin and mill name (VSP, LSR, Laxcon, Super Forge, imported) sit near the header. Keep the cert with the job card. If a second operation or a customer audit asks “what heat is this?”, the stencil plus the PDF is the answer. We ship both.",
      "Reject a cert that is missing heat number, specification, or a signature/stamp. Photocopies without a lot link are not traceability.",
    ],
  },
  {
    slug: "cut-to-size",
    title: "Cut-to-Size vs Mill Length",
    dek: "When to buy a full bar, when to cut.",
    kicker: "Guide",
    updated: "August 2026",
    body: [
      "Mill length (usually 3–6 m) is cheaper per kilo and right when your shop will nest many parts. Cut-to-size is cheaper per part when you would scrap the drop, pay freight on dead weight, or wait on a saw you do not have.",
      "Our hydraulic bandsaws cover 16–550 mm. Standard length tolerance is commercially square; faced ends on request. Kerf is accounted in the quote so you are not short on a 500 mm blank.",
      "If you repeat a blank size, we will hold a cut program against the grade so the next PO is a pick-and-cut, not a conversation.",
    ],
  },
  {
    slug: "heat-treatment",
    title: "Heat Treatment Cheatsheet",
    dek: "Normalize, Q&T, carburize, and what we stock against.",
    kicker: "Guide",
    updated: "August 2026",
    body: [
      "EN-8 / EN-9: normalize for machining; quench and temper if the shaft needs 40 HRC. EN-19 / EN-24: quench and temper to T–Z ranges; nitriding after Q&T for wear. 20MnCr5 / EN-353: carburize, quench, temper — do not through-harden as if they were EN-8. EN-31 / D3: spheroidize anneal to machine, then harden and grind; do not weld.",
      "Order the condition your heat-treat shop actually wants. Buying Q&T bar saves a cycle but machines slower. Buying annealed bar is the default for D3 and EN-31.",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
