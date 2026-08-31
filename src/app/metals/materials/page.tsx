import Link from "next/link";
import { GRADES, SHAPES } from "@/lib/metals/catalog";

export const metadata = { title: "Materials" };

export default function MaterialsPage() {
  return (
    <div className="jk-page">
      <p className="jk-kicker">Materials</p>
      <h1>What we stock and cut.</h1>
      <p className="jk-lead">
        Carbon, alloy, tool, stainless, and non-ferrous bar from Makarpura GIDC. Cut to length on hydraulic bandsaw.
        Mill certs travel with the heat.
      </p>
      <div className="jk-pills">
        <span className="jk-pill">Ready stock to Ø 550 mm</span>
        <span className="jk-pill">Mill certs on request</span>
        <span className="jk-pill">GST invoiced</span>
        <span className="jk-pill">Ships Gujarat-wide</span>
      </div>

      <div className="jk-mat-list">
        {GRADES.map((g) => (
          <Link className="jk-mat-row" href={`/metals/materials/${g.slug}`} key={g.slug}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 22 }}>{g.name}</h2>
              <p style={{ color: "#8a8a8a", marginTop: 4, fontSize: 13 }}>{g.headline}</p>
            </div>
            <p style={{ color: "#bdbdbd", fontSize: 14, lineHeight: 1.5 }}>{g.blurb}</p>
            <span className="jk-shop">View specs →</span>
          </Link>
        ))}
      </div>

      <h2 className="jk-h2" style={{ marginTop: 56 }}>
        Shapes
      </h2>
      <div className="jk-grid-4" style={{ marginTop: 20 }}>
        {SHAPES.map((s) => (
          <Link className="jk-card" href={s.href} key={s.id} style={{ minHeight: 180 }}>
            <h3>{s.name}</h3>
            <p className="sub">{s.range}</p>
            <p className="blurb">{s.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
