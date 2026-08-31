export function NestSection() {
  return (
    <section className="border-t border-white/[0.04] py-24">
      <div className="jk-wrap grid items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="mb-6 text-4xl uppercase tracking-[0.3em] text-neutral-600">JK NEST</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Every cut is a decision. Ours are made against live stock.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-neutral-400">
            Jagetiya Nest reads your size against the full warehouse — round, square, hex, and flat — and
            picks the bar that yields. Hundreds of diameters. Dozens of grades. Considered against what is
            already on the floor in Makarpura. When a drop is still a sellable size, it stays inventory,
            not scrap.
          </p>
          <ul className="mt-10 space-y-5 text-sm text-neutral-300">
            <li>
              <span className="font-semibold text-white">Live schedule</span>
              <p className="mt-1 text-neutral-400">Bandsaw jobs stacked so your blank ships with the next dispatch, not the next week.</p>
            </li>
            <li>
              <span className="font-semibold text-white">Guillotine cuts</span>
              <p className="mt-1 text-neutral-400">
                Hydraulic bandsaw 16–550 mm. Square ends. Kerf accounted in the quote so the blank is the length you asked for.
              </p>
            </li>
            <li>
              <span className="font-semibold text-white">Predictive inventory</span>
              <p className="mt-1 text-neutral-400">
                EN-8, EN-19, EN-24, 20MnCr5, EN-31, and D3 are held through forging diameters because Gujarat&apos;s shops re-order them.
              </p>
            </li>
          </ul>
        </div>
        <div className="nest-grid relative min-h-[340px] border border-white/10 bg-black p-6">
          <svg viewBox="0 0 420 280" className="h-full w-full" role="img" aria-label="Nesting layout of bar cuts">
            <rect x="24" y="36" width="372" height="72" rx="4" fill="#1f1f1f" stroke="#3f3f3f" />
            <rect x="32" y="44" width="110" height="56" fill="#3b82f6" fillOpacity="0.85" />
            <rect x="148" y="44" width="86" height="56" fill="#60a5fa" fillOpacity="0.75" />
            <rect x="240" y="44" width="64" height="56" fill="#93c5fd" fillOpacity="0.7" />
            <rect x="310" y="44" width="78" height="56" fill="#1d4ed8" fillOpacity="0.5" />
            <text x="40" y="76" fill="#fff" fontSize="11" fontFamily="ui-monospace, monospace">
              EN-19 Ø80
            </text>
            <text x="156" y="76" fill="#fff" fontSize="11" fontFamily="ui-monospace, monospace">
              Ø50
            </text>
            <rect x="24" y="128" width="372" height="56" rx="4" fill="#1f1f1f" stroke="#3f3f3f" />
            <rect x="32" y="136" width="160" height="40" fill="#f5f5f5" fillOpacity="0.12" />
            <rect x="198" y="136" width="120" height="40" fill="#3b82f6" fillOpacity="0.55" />
            <text x="40" y="161" fill="#a3a3a3" fontSize="11" fontFamily="ui-monospace, monospace">
              DROP
            </text>
            <text x="24" y="220" fill="#a3a3a3" fontSize="11" fontFamily="ui-monospace, monospace">
              91.4% YIELD
            </text>
            <text x="160" y="220" fill="#a3a3a3" fontSize="11" fontFamily="ui-monospace, monospace">
              4,812 LAYOUTS
            </text>
            <text x="310" y="220" fill="#a3a3a3" fontSize="11" fontFamily="ui-monospace, monospace">
              EST. 1.4 HRS
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
