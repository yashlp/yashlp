const REVIEWS = [
  {
    name: "Tina A.",
    text: "Discover mode completely changed how I shop. The AI actually gets my taste — every swipe feels personal.",
  },
  {
    name: "Sara M.",
    text: "These ceramics are amazing. Beautiful quality and the curation feels like a gallery, not a warehouse.",
  },
  {
    name: "Nina K.",
    text: "Subtle, relaxing, and gorgeous. Perfect pieces for a calm home without sacrificing style.",
  },
  {
    name: "Jennifer P.",
    text: "Better than expected. I found three makers I now follow — the brand stories make it special.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-gradient-to-b from-[var(--aes-cream)] to-pink-50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="aes-section-title text-center text-[var(--aes-ink)]">
          Don&apos;t take our word for it
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review) => (
            <blockquote
              key={review.name}
              className="rounded-3xl bg-white p-6 shadow-md"
            >
              <p className="text-sm font-bold text-[var(--aes-ink)]">Perfect find</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--aes-ink-muted)]">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer className="mt-4 text-xs font-bold uppercase tracking-wider text-[var(--aes-pink)]">
                {review.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
