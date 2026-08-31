import Link from "next/link";
import { Search, Database, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Instant Search",
    description:
      "Search by shape, size, and grade. Exact matches show live Rs/kg prices. Nearest sizes surfaced automatically.",
  },
  {
    icon: Database,
    title: "Full Catalog",
    description:
      "Round, square, hex, and flat bars across EN, MS, WPS, and non-ferrous grades. Thousands of size combinations in stock.",
  },
  {
    icon: BarChart3,
    title: "Chemical Compare",
    description:
      "View and compare chemical composition for up to 3 grades side by side. C, Mn, Si, Cr, Ni, Mo at a glance.",
  },
];

export function SmartStockSection() {
  return (
    <section id="smart-stock" className="border-b border-neutral-800 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c8960c]">
              Smart Stock
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Every size is a decision. Find yours in seconds.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-neutral-400">
              Our stock search reads your size and grade against the full catalog to find exact matches
              and nearest alternatives instantly. Dozens of grades. Hundreds of sizes. Considered against
              what&apos;s on the floor right now in Vadodara.
            </p>
            <p className="mt-4 text-base leading-relaxed text-neutral-400">
              When your exact size isn&apos;t available, the system surfaces the closest options above
              and below — so you can quote faster and keep production moving.
            </p>
            <Link href="/metals/search" className="metals-btn-primary mt-8">
              Open Stock Search
            </Link>
          </div>

          <div className="space-y-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-6"
              >
                <feature.icon className="text-[#c8960c]" size={22} />
                <h3 className="mt-3 text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{feature.description}</p>
              </div>
            ))}

            <div className="rounded-xl border border-[#c8960c]/30 bg-[#c8960c]/5 p-5 font-mono text-xs text-neutral-400">
              <div className="flex flex-wrap gap-4">
                <span className="text-[#c8960c]">EXACT MATCH</span>
                <span>EN-24 · 50 mm</span>
                <span className="text-green-400">Rs 89.50/kg</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-4">
                <span className="text-neutral-500">NEAREST</span>
                <span>48 mm (below) · 53 mm (above)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
