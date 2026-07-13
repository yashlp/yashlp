const WORDS = [
  "Ceramics",
  "Independent",
  "Curated",
  "Sculptural",
  "Handmade",
  "Discover",
  "Gallery",
  "Objects",
  "Aesthetic",
  "Collect",
];

export function MarqueeBand() {
  const items = [...WORDS, ...WORDS];

  return (
    <div className="relative overflow-hidden border-y border-[var(--aes-border)] bg-[var(--aes-ink)] py-4">
      <div className="aes-marquee-track gap-12 px-6">
        {items.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="aes-display shrink-0 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-base"
          >
            {word}
            <span className="mx-8 text-[var(--aes-coral)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
