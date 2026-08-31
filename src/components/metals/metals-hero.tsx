import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MetalsHero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800">
      <div className="metals-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="max-w-3xl metals-animate-in">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Vadodara, Gujarat
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Steel at the speed of search
          </h1>
          <p className="mt-6 max-w-xl text-lg text-neutral-400">
            Alloy and carbon steel bars, cut to size. Find exact stock and live prices in seconds, not days.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/metals/search" className="metals-btn-primary">
              Search Stock
              <ArrowRight size={16} />
            </Link>
            <Link href="/metals#shop" className="metals-btn-ghost">
              Browse by grade
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { stat: "9+", label: "Steel grades stocked" },
            { stat: "5", label: "Bar shapes available" },
            { stat: "600mm", label: "Max round bar diameter" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-neutral-800 bg-neutral-950/60 px-6 py-5"
            >
              <p className="text-2xl font-bold text-white">{item.stat}</p>
              <p className="mt-1 text-sm text-neutral-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
