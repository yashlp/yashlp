import Link from "next/link";

const TIERS = [
  { spend: "$50", perk: "save $5" },
  { spend: "$75", perk: "free shipping" },
  { spend: "$100", perk: "$10 + free shipping" },
];

export function BundleSection() {
  return (
    <section className="aes-bg-bundle px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="aes-section-title text-[var(--aes-ink)]">Bundle &amp; SAVE</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--aes-ink-muted)]">
          Why pick one? Explore collections or build your cart — a little something for every
          feeling.
        </p>

        <p className="mt-8 text-sm font-bold lowercase text-[var(--aes-ink)]">
          order more. save more. joy more.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.spend}
              className="rounded-2xl aes-panel px-6 py-10"
            >
              <p className="text-xs font-bold lowercase text-[var(--aes-ink-muted)]">
                spend {tier.spend}
              </p>
              <p className="mt-2 text-2xl font-black text-[var(--aes-ink)]">{tier.perk}</p>
            </div>
          ))}
        </div>

        <Link href="/aesthetics/shop" className="aes-btn aes-btn-primary mt-10 inline-flex px-10 py-4">
          Shop now
        </Link>
      </div>
    </section>
  );
}
