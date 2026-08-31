import Link from "next/link";
import { notFound } from "next/navigation";
import { GRADES, getGrade, sizeRangeLabel, stockForGrade } from "@/lib/metals/catalog";
import { ElementTiles } from "@/components/metals/bar-art";
import { trimNum } from "@/lib/metals/catalog";

export function generateStaticParams() {
  return GRADES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const grade = getGrade(slug);
  if (!grade) return { title: "Material" };
  return {
    title: `${grade.name} bar, cut to size | Vadodara`,
    description: grade.overview,
  };
}

export default async function GradePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const grade = getGrade(slug);
  if (!grade) notFound();
  const stock = stockForGrade(grade);
  const related = grade.related.map((s) => getGrade(s)).filter(Boolean);

  return (
    <div className="jk-wrap py-14">
      <p className="text-sm text-neutral-500">
        <Link href="/metals">Jagetiya Metals</Link>
        <span className="mx-2">/</span>
        <Link href="/metals/materials">Materials</Link>
        <span className="mx-2">/</span>
        {grade.name}
      </p>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="jk-mono text-xs uppercase tracking-[0.16em] text-neutral-500">
            {grade.availableNow ? "Available now" : "By request"}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{grade.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-400">{grade.tagline}</p>
        </div>
        <ElementTiles items={grade.composition} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2 text-xs text-neutral-400">
        {grade.origins.map((o) => (
          <span key={o} className="border border-white/10 px-2 py-1">
            {o}
          </span>
        ))}
        <span className="border border-white/10 px-2 py-1">Mill certs included</span>
        <span className="border border-white/10 px-2 py-1">Full traceability</span>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="jk-kicker">At a glance</p>
          <h2 className="mt-2 text-2xl font-semibold">What is {grade.name}?</h2>
          <p className="mt-4 leading-relaxed text-neutral-300">{grade.overview}</p>
          {grade.body.map((p) => (
            <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-neutral-400">
              {p}
            </p>
          ))}

          <h2 className="mt-14 text-xl font-semibold">Available forms</h2>
          <ul className="mt-4 divide-y divide-white/10 border border-white/10">
            {grade.forms.map((f) => (
              <li key={f.name} className="flex flex-wrap items-start justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{f.name}</p>
                  <p className="text-sm text-neutral-400">{f.detail}</p>
                </div>
                <span className="jk-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  {f.availability === "stock" ? "Stock" : "By request"}
                </span>
              </li>
            ))}
          </ul>

          <h2 className="mt-14 text-xl font-semibold">Mechanical properties</h2>
          <div className="mt-4 overflow-x-auto border border-white/10">
            <table className="jk-table">
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Tensile</th>
                  <th>Yield</th>
                  <th>Elongation</th>
                  <th>Hardness</th>
                </tr>
              </thead>
              <tbody>
                {grade.mechanical.map((m) => (
                  <tr key={m.condition}>
                    <td>{m.condition}</td>
                    <td>{m.tensile}</td>
                    <td>{m.yield}</td>
                    <td>{m.elongation}</td>
                    <td>{m.hardness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Values are typical / specification minimums unless noted. Always verify against the mill cert for the heat
            you receive.
          </p>

          <h2 className="mt-14 text-xl font-semibold">Warehouse sizes</h2>
          <div className="mt-4 space-y-4">
            {stock.map((line) => (
              <div key={`${line.grade}-${line.subtype}`} className="border border-white/10 p-4">
                <p className="text-sm font-medium">
                  {line.grade} · {line.subtype}
                  {line.mill ? <span className="text-neutral-500"> · {line.mill}</span> : null}
                </p>
                {line.noteOnly && <p className="mt-2 text-sm text-neutral-400">Sizes confirmed on quote.</p>}
                {line.sizesMm && (
                  <p className="jk-mono mt-2 text-xs leading-6 text-neutral-400">
                    {line.sizesMm.map(trimNum).join(" · ")} mm
                  </p>
                )}
                {line.flats && (
                  <ul className="mt-2 space-y-1 text-xs text-neutral-400">
                    {Object.entries(line.flats).map(([thk, widths]) => (
                      <li key={thk}>
                        <span className="text-white">{thk} mm thk</span> × {widths.map(trimNum).join(", ")} mm wide
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="border border-white/10 p-5">
            <h2 className="text-lg font-semibold">Chemistry %</h2>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {Object.entries(grade.chemistry).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2 border-b border-white/5 py-1">
                  <dt className="text-neutral-500">{k}</dt>
                  <dd className="jk-mono">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="border border-white/10 p-5">
            <h2 className="text-lg font-semibold">Physical</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-400">
              {grade.physical.map((p) => (
                <li key={p.label}>
                  <span className="text-neutral-500">{p.label}: </span>
                  {p.value}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-white/10 p-5">
            <h2 className="text-lg font-semibold">Why Jagetiya for {grade.name.split(" ")[0]}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-neutral-400">
              {grade.why.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-neutral-500">Sizes {sizeRangeLabel(grade)}</p>
            <Link href={`/metals/quote?grade=${grade.slug}`} className="jk-btn jk-btn-primary mt-5 w-full">
              Quote in under 60 seconds
            </Link>
          </div>
          <div className="border border-white/10 p-5">
            <h2 className="text-lg font-semibold">Applications</h2>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-neutral-400">
              {grade.applications.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="border border-white/10 p-5">
            <h2 className="text-lg font-semibold">Specifications</h2>
            <ul className="mt-3 space-y-1 text-sm text-neutral-400">
              {grade.specs.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <h2 className="mt-16 text-xl font-semibold">Machining notes</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-400">
        {grade.machining.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>

      {related.length > 0 && (
        <>
          <h2 className="mt-16 text-xl font-semibold">Related materials</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {related.map((r) =>
              r ? (
                <Link key={r.slug} href={`/metals/materials/${r.slug}`} className="border border-white/10 p-4 hover:border-white/20">
                  <p className="font-medium">{r.name}</p>
                  <p className="mt-1 text-sm text-neutral-500">{r.tagline}</p>
                </Link>
              ) : null
            )}
          </div>
        </>
      )}
    </div>
  );
}
