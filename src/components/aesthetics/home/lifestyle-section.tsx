const PILLARS = [
  {
    title: "Unwind & Reset",
    body: "Take a breath and let the day melt off. Made for slow mornings, cozy nights in, and quiet moments when you finally get to come back to yourself.",
  },
  {
    title: "Gather & Connect",
    body: "Good company, easy laughter, and spaces that linger. Perfect for dinner parties, creative studios, and everyday moments that feel special together.",
  },
  {
    title: "Celebrate & Spark",
    body: "Bring a little extra glow to the occasion. From housewarmings to spontaneous plans, these are the objects made to feel lively, light, and unforgettable.",
  },
  {
    title: "Play & Indulge",
    body: "Say yes to the fun part. Think weekend markets, studio visits, and carefree afternoons where the mood is sunny, social, and full of joy.",
  },
];

export function LifestyleSection() {
  return (
    <section className="aes-bg-warm px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="aes-section-title text-[var(--aes-ink)]">
            Life is a Lot.
            <br />
            Joy Should be Too.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[var(--aes-ink-muted)] sm:text-base">
            Aesthetics is crafted to turn those hectic moments and busy days into joyful harmony
            and total balance.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <article key={pillar.title} className="text-center sm:text-left">
              <h3 className="text-base font-bold text-[var(--aes-ink)] sm:text-lg">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--aes-ink-muted)]">{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
