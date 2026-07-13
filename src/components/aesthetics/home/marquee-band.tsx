const WORDS = [
  "Wellness",
  "Tranquility",
  "Restore",
  "Mindful",
  "Curated",
  "Serene",
  "Handcrafted",
  "Sanctuary",
  "Balance",
  "Harmony",
];

export function MarqueeBand() {
  const items = [...WORDS, ...WORDS];

  return (
    <div className="overflow-hidden border-y border-[var(--aes-border-light)] bg-[var(--aes-forest)] py-5">
      <div className="aes-marquee-track gap-16 px-6">
        {items.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="aes-serif shrink-0 text-lg italic text-[var(--aes-sand)]/80 sm:text-xl"
          >
            {word}
            <span className="mx-10 text-[var(--aes-gold-soft)]">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
