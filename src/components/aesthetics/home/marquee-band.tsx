const BENEFITS = [
  "Handcrafted",
  "Independent makers",
  "Curated daily",
  "AI taste learning",
  "Free returns",
];

export function MarqueeBand() {
  const items = [...BENEFITS, ...BENEFITS];

  return (
    <div className="overflow-hidden border-y-2 border-[var(--aes-ink)] bg-[var(--aes-yellow)] py-4">
      <div className="aes-marquee-track gap-10 px-4">
        {items.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex shrink-0 items-center gap-10 text-sm font-bold uppercase tracking-wider text-[var(--aes-ink)]"
          >
            {word}
            <span className="text-[var(--aes-pink)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
