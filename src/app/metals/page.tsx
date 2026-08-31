import Link from "next/link";
import { ShopCatalog } from "@/components/metals/shop-catalog";
import { NestSection } from "@/components/metals/nest-section";
import { GUIDES } from "@/lib/metals/guides";
import { company } from "@/lib/metals/company";

export default function MetalsHomePage() {
  return (
    <>
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12),transparent_55%)]" />
        <div className="jk-wrap relative">
          <h1 className="jk-hero-title">{company.tagline}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-neutral-400 sm:text-xl">
            Alloy steel, cut to spec. Quotes in seconds, not days.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="#materials" className="jk-btn jk-btn-primary">
              Cut to size
            </Link>
            <Link href="/metals/quote" className="jk-btn jk-btn-ghost">
              Instant Quote
            </Link>
          </div>
        </div>
      </section>

      <ShopCatalog />
      <NestSection />

      <section className="relative border-t border-white/[0.04] py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><path d=%22M0 40L40 0%22 stroke=%22%23ffffff%22 stroke-opacity=%220.03%22/></svg>')] opacity-80" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="jk-wrap relative z-10 mx-auto max-w-[1100px]">
          <p className="jk-serif text-left text-3xl leading-[1.3] text-white italic sm:text-center sm:text-4xl lg:text-5xl">
            Every machine in Gujarat starts with a bar of steel somebody waited too long for.
          </p>
          <div className="mx-auto mt-16 max-w-3xl space-y-6">
            <p className="text-left text-lg leading-relaxed text-neutral-300 sm:text-center">
              The three-man shop in Makarpura. The gear OEM juggling ten sizes. The production manager who lost a
              contract over a late forging. We built Jagetiya for them.
            </p>
            <p className="text-left text-lg leading-relaxed text-neutral-300 sm:text-center">
              No middlemen. No three-week lead times. No phone-tag for a diameter we already hold. Just metal, cut to
              spec, from Vadodara.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-16">
        <div className="jk-wrap">
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-neutral-500">Featured Guides</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/metals/guides/${g.slug}`}
                className="border border-white/[0.06] p-5 transition-colors hover:border-white/[0.15]"
              >
                <div className="mb-1 text-sm font-medium text-white">{g.title}</div>
                <div className="text-xs text-neutral-500">{g.dek}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-24">
        <div className="jk-wrap max-w-3xl">
          <p className="mb-6 text-4xl uppercase tracking-[0.3em] text-neutral-600">Instant Quote</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your supplier takes three days. We take sixty seconds.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-neutral-400">
            Tell us what you need. Grade, shape, dimensions, quantity. We check live inventory, run the cut against the
            bar, and send a landed price. Faster lead times aren&apos;t a promise — they&apos;re the warehouse.
          </p>
          <div className="mt-10">
            <Link href="/metals/quote" className="jk-btn jk-btn-primary">
              Open the quote sheet
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
