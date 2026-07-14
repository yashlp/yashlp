import Link from "next/link";

const STORIES = [
  {
    title: "Clay, calm, and slow glaze",
    body: "How one studio finishes vessels in small batches for Only Aesthetics.",
    href: "/aesthetics/about",
  },
  {
    title: "Light that softens a room",
    body: "A maker note on arcs, brass, and the glow that never shouts.",
    href: "/aesthetics/about",
  },
];

export function MakerStoriesSection() {
  return (
    <section className="bg-[var(--aes-bg-base)] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="aes-gallery-eyebrow">Behind the edit</p>
        <h2 className="aes-gallery-title mt-3 text-2xl sm:text-3xl">Maker Stories</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {STORIES.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="rounded-[1.5rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] p-8 transition hover:border-[var(--gallery-blue,#2c5aa0)]"
            >
              <h3 className="text-xl font-semibold text-[var(--gallery-ink,#1e1e1c)]">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--gallery-muted,#6f6a63)]">{s.body}</p>
              <span className="mt-6 inline-block text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-blue,#2c5aa0)]">
                Read more
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
