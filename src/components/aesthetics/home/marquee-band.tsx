const BENEFITS = [
  "Small-batch makers",
  "Mood-first edits",
  "Maker-vetted",
  "Ships with care",
  "Curated not cluttered",
];

export function MarqueeBand() {
  const items = [...BENEFITS, ...BENEFITS, ...BENEFITS];

  return (
    <div className="overflow-hidden bg-[var(--aes-yellow)] py-4">
      <div className="aes-marquee-track gap-12 px-4">
        {items.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex shrink-0 items-center gap-12 text-xs font-black uppercase tracking-[0.22em] text-[var(--aes-ink)]"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
