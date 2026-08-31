import Link from "next/link";
import { GUIDES } from "@/lib/metals/catalog";

export const metadata = { title: "Guides" };

export default function GuidesIndexPage() {
  return (
    <div className="jk-page">
      <p className="jk-kicker">Guides</p>
      <h1>Shop-floor notes.</h1>
      <div className="jk-guides" style={{ marginTop: 28 }}>
        {GUIDES.map((g) => (
          <Link className="jk-guide" href={`/metals/guides/${g.slug}`} key={g.slug}>
            <h3>{g.title}</h3>
            <p>{g.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
