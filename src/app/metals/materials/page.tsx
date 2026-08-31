import Link from "next/link";
import { GRADES, SHAPES, sizeRangeLabel } from "@/lib/metals/catalog";
import { ElementTiles } from "@/components/metals/bar-art";

export const metadata = {
  title: "What we stock and cut",
};

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ shape?: string }>;
}) {
  const { shape } = await searchParams;
  const list =
    shape === "non-ferrous"
      ? GRADES.filter((g) => g.family === "stainless" || g.family === "nonferrous")
      : GRADES;

  return (
    <div className="jk-wrap py-16">
      <p className="jk-kicker">Materials</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">What we stock and cut.</h1>
      <p className="mt-4 max-w-2xl text-neutral-400">
        Alloy and carbon bar in the grades Gujarat actually machines. Cut to size from Makarpura GIDC. Stainless and
        non-ferrous on the same floor.
      </p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs text-neutral-400">
        <span className="border border-white/10 px-2 py-1">Mill certs included</span>
        <span className="border border-white/10 px-2 py-1">Full heat traceability</span>
        <span className="border border-white/10 px-2 py-1">Bandsaw 16–550 mm</span>
        <span className="border border-white/10 px-2 py-1">Ships across Gujarat &amp; India</span>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/metals/materials" className={`jk-btn ${!shape ? "jk-btn-primary" : "jk-btn-ghost"}`}>
          All grades
        </Link>
        {SHAPES.map((s) => (
          <Link
            key={s.id}
            href={`/metals/materials?shape=${s.id}`}
            className={`jk-btn ${shape === s.id ? "jk-btn-primary" : "jk-btn-ghost"}`}
          >
            {s.name}
          </Link>
        ))}
      </div>

      <div className="mt-12 space-y-4">
        {list.map((g) => (
          <article key={g.slug} className="border border-white/10 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="jk-mono text-xs uppercase tracking-[0.14em] text-neutral-500">
                  {g.availableNow ? "Available now" : "By request"}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{g.name}</h2>
                <p className="mt-2 max-w-2xl text-sm text-neutral-400">{g.overview}</p>
              </div>
              <ElementTiles items={g.composition} />
            </div>
            <ul className="mt-5 grid gap-3 text-sm text-neutral-300 sm:grid-cols-3">
              {g.forms.slice(0, 3).map((f) => (
                <li key={f.name}>
                  <span className="font-medium text-white">{f.name}</span>
                  <p className="text-neutral-500">{f.detail}</p>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
              <span className="text-neutral-500">Sizes {sizeRangeLabel(g)}</span>
              <Link href={`/metals/materials/${g.slug}`} className="underline underline-offset-4">
                View specs
              </Link>
              <Link href={`/metals/quote?grade=${g.slug}`} className="underline underline-offset-4">
                Quote
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
