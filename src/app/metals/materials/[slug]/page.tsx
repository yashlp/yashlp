import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteTool } from "@/components/metals/quote-tool";
import {
  formatSizeList,
  getGrade,
  GRADES,
  SHAPES,
  uniqueSizes,
  type ShapeId,
} from "@/lib/metals/catalog";

export function generateStaticParams() {
  return [
    ...GRADES.map((g) => ({ slug: g.slug })),
    ...SHAPES.map((s) => ({ slug: s.id === "round" ? "round-bar" : s.id === "square" ? "square-bar" : s.id === "flat" ? "flat-bar" : "hex-bar" })),
  ];
}

const SHAPE_SLUG: Record<string, ShapeId> = {
  "round-bar": "round",
  "square-bar": "square",
  "flat-bar": "flat",
  "hex-bar": "hex",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const grade = getGrade(slug);
  const shape = SHAPES.find((s) => SHAPE_SLUG[slug] === s.id);
  return { title: grade?.name ?? shape?.name ?? "Material" };
}

export default async function MaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const grade = getGrade(slug);
  const shapeId = SHAPE_SLUG[slug];
  const shape = SHAPES.find((s) => s.id === shapeId);

  if (grade) {
    return (
      <div className="jk-page">
        <p className="jk-kicker">
          <Link href="/metals/materials">Materials</Link> / {grade.name}
        </p>
        <h1>{grade.name}</h1>
        <p className="jk-lead">{grade.blurb}</p>
        <div className="jk-pills">
          {grade.chips.map((c) => (
            <span className="jk-chip" key={c}>
              {c}
            </span>
          ))}
        </div>

        <div className="jk-chem" style={{ maxWidth: 420, marginTop: 28 }}>
          {grade.chemistry.map((el) => (
            <div className="jk-el" key={el.sym}>
              <div className="z">{el.z}</div>
              <div className="sym">{el.sym}</div>
              <div className="pct">{el.pct}</div>
            </div>
          ))}
        </div>

        <h2 className="jk-h2" style={{ marginTop: 48 }}>
          Forms in stock
        </h2>
        <div className="jk-mat-list">
          {grade.forms.map((f) => (
            <div className="jk-mat-row" key={`${f.shape}-${f.subtype}`}>
              <div>
                <h3 style={{ color: "#fff" }}>{SHAPES.find((s) => s.id === f.shape)?.name ?? f.shape}</h3>
                <p style={{ color: "#8a8a8a", marginTop: 4 }}>{f.subtype}</p>
              </div>
              <p style={{ color: "#cfcfcf", fontFamily: "var(--jk-mono)", fontSize: 13, lineHeight: 1.6 }}>
                {f.note ??
                  (f.flat
                    ? `Thicknesses ${Object.keys(f.flat).join(", ")} mm`
                    : `Sizes ${formatSizeList(f.sizesMm ?? [])} mm`)}
                {f.mill ? ` · ${f.mill}` : ""}
              </p>
              <Link className="jk-shop" href={`/metals/quote?grade=${grade.slug}&shape=${f.shape}`}>
                Quote →
              </Link>
            </div>
          ))}
        </div>

        <h2 className="jk-h2" style={{ marginTop: 56 }}>
          Quote this grade
        </h2>
        <QuoteTool presetGrade={grade.slug} presetShape={grade.forms[0]?.shape} />
      </div>
    );
  }

  if (shape) {
    const grades = GRADES.filter((g) => g.forms.some((f) => f.shape === shape.id));
    return (
      <div className="jk-page">
        <p className="jk-kicker">
          <Link href="/metals/materials">Materials</Link> / {shape.name}
        </p>
        <h1>{shape.name}</h1>
        <p className="jk-lead">{shape.blurb}</p>
        <p className="jk-lead">{shape.range} on the floor.</p>
        <div className="jk-mat-list">
          {grades.map((g) => (
            <Link className="jk-mat-row" href={`/metals/materials/${g.slug}`} key={g.slug}>
              <div>
                <h3 style={{ color: "#fff" }}>{g.name}</h3>
                <p style={{ color: "#8a8a8a", marginTop: 4 }}>{g.headline}</p>
              </div>
              <p style={{ color: "#cfcfcf", fontFamily: "var(--jk-mono)", fontSize: 13 }}>
                {formatSizeList(uniqueSizes(g, shape.id))} mm
              </p>
              <span className="jk-shop">View specs →</span>
            </Link>
          ))}
        </div>
        <h2 className="jk-h2" style={{ marginTop: 56 }}>
          Quote this shape
        </h2>
        <QuoteTool presetShape={shape.id} />
      </div>
    );
  }

  notFound();
}
