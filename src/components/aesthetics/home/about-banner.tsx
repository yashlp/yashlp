import Link from "next/link";

const VALUES = [
  { title: "Details matter", body: "Every object is chosen for craft, material honesty, and the small details that elevate a room." },
  { title: "Small-batch makers", body: "We partner with independent studios — not mass-market factories — so each piece feels personal." },
  { title: "Maker-vetted", body: "Our team reviews makers for quality, ethics, and consistency before anything reaches the shop." },
  { title: "Mood-first edits", body: "Collections are built around how a space should feel — calm, cozy, focused, or romantic." },
  { title: "Ships with care", body: "Pan-India delivery with protective packaging. Free shipping on orders above ₹999." },
];

export function AboutBanner() {
  return (
    <section className="aes-bg-peach px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xl font-black leading-snug text-[var(--aes-ink)] sm:text-2xl md:text-3xl">
          Beautiful objects from independent makers, chosen for the way you live.
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-[var(--aes-ink-muted)] sm:text-base">
          A curated Indian store for design-led home, wellness, and lifestyle objects — shipped with care.
        </p>
        <Link href="/aesthetics/shop" className="aes-btn aes-btn-secondary mt-8 inline-flex px-8 py-3.5">
          Shop now
        </Link>
      </div>
    </section>
  );
}

export function AboutValuesSection() {
  return (
    <section className="aes-bg-sand px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="aes-joy-title-lower text-center text-[var(--aes-ink)]">what we stand for</h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {VALUES.map((v) => (
            <li key={v.title} className="aes-panel p-6">
              <h3 className="font-bold text-[var(--aes-ink)]">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--aes-ink-muted)]">{v.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
