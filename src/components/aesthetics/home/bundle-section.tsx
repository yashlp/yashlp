import Link from "next/link";

const TIERS = [
  { spend: "$50", perk: "save $5", color: "bg-pink-100" },
  { spend: "$75", perk: "free shipping", color: "bg-violet-100" },
  { spend: "$100", perk: "$10 + free shipping", color: "bg-yellow-100" },
];

export function BundleSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="aes-section-title text-[var(--aes-ink)]">Discover &amp; save</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--aes-ink-muted)]">
          Why pick one? Explore collections, try Discover mode, or build your cart — a little
          something for every feeling.
        </p>

        <p className="mt-8 text-sm font-bold uppercase tracking-widest text-[var(--aes-pink)]">
          Shop more. Save more. Joy more.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.spend}
              className={`rounded-3xl ${tier.color} p-8 transition hover:-translate-y-1 hover:shadow-lg`}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--aes-ink-muted)]">
                spend {tier.spend}
              </p>
              <p className="aes-display mt-2 text-3xl text-[var(--aes-ink)]">{tier.perk}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/aesthetics/shop" className="aes-btn aes-btn-primary px-8 py-3">
            Shop now
          </Link>
          <Link href="/aesthetics/discover" className="aes-btn aes-btn-secondary px-8 py-3">
            Try discover mode
          </Link>
        </div>
      </div>
    </section>
  );
}
