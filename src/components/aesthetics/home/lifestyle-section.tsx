const PILLARS = [
  {
    title: "Browse & Delight",
    body: "Explore editorial collections from independent makers. Every object tells a story worth keeping.",
    color: "var(--aes-pink)",
  },
  {
    title: "Curate & Collect",
    body: "Browse editorial collections from independent makers. Every object tells a story worth keeping.",
    color: "var(--aes-lavender)",
  },
  {
    title: "Unwind & Reset",
    body: "Wellness essentials and calm objects for slow mornings, cozy nights, and quiet rooms.",
    color: "var(--aes-mint)",
  },
  {
    title: "Celebrate & Spark",
    body: "Sculptural pieces and bold design for dinner parties, creative spaces, and joyful living.",
    color: "var(--aes-orange)",
  },
];

export function LifestyleSection() {
  return (
    <section className="bg-[var(--aes-cream)] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="aes-section-title text-[var(--aes-ink)]">Life is a lot. Joy should be too.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--aes-ink-muted)]">
            Aesthetics is crafted to turn hectic days into moments of beauty — curated objects that
            bring harmony to your space and spirit.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-3xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="mb-4 h-1 w-12 rounded-full"
                style={{ background: pillar.color }}
              />
              <h3 className="text-lg font-bold text-[var(--aes-ink)]">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--aes-ink-muted)]">{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
