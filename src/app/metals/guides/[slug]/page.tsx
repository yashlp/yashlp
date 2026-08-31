import { notFound } from "next/navigation";
import { GUIDES } from "@/lib/metals/catalog";

const BODIES: Record<string, { title: string; html: string[] }> = {
  "en8-vs-en19-vs-en24": {
    title: "EN-8 vs EN-19 vs EN-24",
    html: [
      "EN-8 (C45 / 080M40) is the default medium-carbon bar. It machines cleanly, takes a moderate heat treatment, and covers shafts, pins, and general engineering. Specify it when the drawing does not ask for alloy.",
      "EN-19 (4140 / 42CrMo4) adds chromium and molybdenum. Tensile and hardenability jump. Use it for axles, crankshafts, and any shaft that sees cyclic load in a section EN-8 will not through-harden.",
      "EN-24 (817M40) adds nickel on top of Cr-Mo. Toughness in thick section is the point. Aerospace fittings, heavy gearbox shafts, and defence parts that cannot go brittle after quench.",
      "Rule of thumb on our floor: EN-8 if it is a commodity shaft, EN-19 if it is loaded, EN-24 if it is loaded and thick. We stock all three as rolled rod and as forging above Ø 200 mm.",
    ],
  },
  "how-to-read-a-mill-cert": {
    title: "How to Read a Mill Cert",
    html: [
      "A mill test certificate is the heat’s passport. Heat number ties the bar in your rack to a chemistry ladle and a mechanical test piece.",
      "Chemistry: C, Mn, Si, Cr, Ni, Mo must sit inside the grade band. We keep EN and AISI names on the same lot so a 4140 drawing and an EN-19 indent land on one heat.",
      "Mechanicals: yield, UTS, elongation, and hardness. Forged lots often show as-forged values — ask if you need quenched and tempered properties.",
      "Every Jagetiya dispatch can carry the mill cert. If a customer needs a third-party retest, say so before the saw — we hold the remnant against that heat.",
    ],
  },
  "cut-to-size-bandsaw": {
    title: "Cut-to-Size Bandsaw Guide",
    html: [
      "Capacity is 16 mm to 550 mm on hydraulic bandsaw. That covers bright rod through heavy forging.",
      "Standard tolerance is minus zero, plus two millimetres unless the drawing calls a tighter face. We can face after the saw if the lathe allowance is already gone.",
      "Kerf is real. A 6 metre bar does not yield six clean 1000 mm billets. Tell us finished length and we will nest remnants against the next order on that grade.",
      "Lead time is a function of whether the diameter is on the rack. Exact size: same-day cut. Nearest size: you choose turn-down or wait for the mill lot.",
    ],
  },
  "carbon-vs-alloy-steel": {
    title: "Carbon vs Alloy Steel",
    html: [
      "Mild steel and EN-8 are carbon steels. Cheap, weldable, plenty of size. They fail when the section is thick and the hardness has to go through the core.",
      "Alloy steels — EN-19, EN-24, 20MnCr5, EN-353 — buy hardenability. Chromium, molybdenum, and nickel let the quench reach the centre of a 150 mm shaft.",
      "Tool and die (EN-31, WPS D3) are a third family: wear first, toughness second. Do not substitute EN-8 for D3 on a punch.",
      "If the drawing is silent, we quote EN-8. If it mentions 4140, 42CrMo4, or 817M40, we pull EN-19 or EN-24. Stainless and non-ferrous are a different rack — ask explicitly.",
    ],
  },
};

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: BODIES[slug]?.title ?? "Guide" };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = BODIES[slug];
  if (!body) notFound();
  return (
    <div className="jk-page">
      <p className="jk-kicker">Guide</p>
      <h1>{body.title}</h1>
      <div className="jk-prose">
        {body.html.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </div>
  );
}
