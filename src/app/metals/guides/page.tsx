import Link from "next/link";
import { GUIDES } from "@/lib/metals/guides";

export const metadata = { title: "Guides" };

export default function GuidesIndexPage() {
  return (
    <div className="jk-wrap py-16">
      <p className="jk-kicker">Resources</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Featured guides</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/metals/guides/${g.slug}`} className="border border-white/10 p-6 hover:border-white/20">
            <p className="jk-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">{g.kicker}</p>
            <h2 className="mt-2 text-xl font-semibold">{g.title}</h2>
            <p className="mt-2 text-sm text-neutral-400">{g.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
