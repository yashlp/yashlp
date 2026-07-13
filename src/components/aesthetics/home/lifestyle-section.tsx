const PILLARS = [
  {
    title: "Unwind & Reset",
    body: "Slow mornings, soft light, objects that exhale with you. Built for the moment you finally close the laptop.",
  },
  {
    title: "Gather & Connect",
    body: "Tablescapes and textures that get conversations going. Dinner parties, studio nights, the hangs that linger.",
  },
  {
    title: "Celebrate & Spark",
    body: "Pieces with personality for housewarmings, creative launches, and plans you said yes to last minute.",
  },
  {
    title: "Play & Indulge",
    body: "Weekend markets, sunny afternoons, the joy of owning something nobody else picked from a warehouse shelf.",
  },
];

export function LifestyleSection() {
  return (
    <section className="aes-bg-warm px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="aes-section-title text-[var(--aes-ink)]">
            Busy Life.
            <br />
            Beautiful Home.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[var(--aes-ink-muted)] sm:text-base">
            Your space should work as hard at relaxing as you do at everything else — we find the
            objects that make that actually happen.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <article key={pillar.title} className="aes-panel rounded-2xl p-6 text-center sm:text-left">
              <h3 className="text-base font-black text-[var(--aes-ink)] sm:text-lg">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--aes-ink-muted)]">{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
