const BENEFITS = [
  "Small-batch makers",
  "Maker-vetted",
  "Mood-first edits",
  "Ships with care",
  "Details matter",
];

export function MarqueeBand() {
  const items = [...BENEFITS, ...BENEFITS, ...BENEFITS];

  return (
    <div className="overflow-hidden border-y border-[var(--aes-border)] bg-[var(--aes-yellow)] py-4">
      <div className="aes-marquee-track gap-12 px-4">
        {items.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex shrink-0 items-center gap-12 text-xs font-medium uppercase tracking-[0.22em] text-[var(--aes-royal)]"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
