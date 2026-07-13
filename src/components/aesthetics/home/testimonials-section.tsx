import { Star } from "lucide-react";

const REVIEWS = [
  {
    title: "Perfect way to unwind",
    name: "Tina A.",
    text: "I was honestly skeptical at first, but Only Aesthetics completely changed how I shop. Every collection feels personal and thoughtful.",
  },
  {
    title: "My new favorite find",
    name: "Sara M.",
    text: "These ceramics are amazing. Beautiful quality and the curation feels like a gallery, not a warehouse. Will definitely be ordering again.",
  },
  {
    title: "Subtle, relaxing, and gorgeous",
    name: "Nina K.",
    text: "These objects look great and bring a calm, happy feeling to my home without being too intense. Perfect for a chill night in.",
  },
  {
    title: "Better than expected",
    name: "Jennifer P.",
    text: "I found three makers I now follow — the brand stories make it special. No compromise on quality, just a nice, gentle delight.",
  },
  {
    title: "Great alternative to mass retail",
    name: "Kim K.",
    text: "I've been trying to shop more intentionally, and this is the perfect replacement. Curated taste without the overwhelm.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="aes-bg-testimonial px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="aes-section-title text-center text-[var(--aes-ink)]">
          Real people. Real rooms. Real taste.
        </h2>

        <div className="aes-joy-scroll mt-12 -mx-4 px-4 sm:-mx-6 sm:px-6">
          {REVIEWS.map((review) => (
            <blockquote
              key={review.name}
              className="w-[280px] shrink-0 rounded-2xl aes-panel p-6 sm:w-[300px]"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[var(--aes-yellow-deep)] text-[var(--aes-yellow-deep)]"
                  />
                ))}
              </div>
              <p className="mt-3 text-sm font-bold text-[var(--aes-ink)]">{review.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--aes-ink-muted)]">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer className="mt-4 text-xs font-bold text-[var(--aes-ink)]">{review.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
