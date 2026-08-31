import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_GUIDES } from "@/lib/metals/catalog";

export function GuidesSection() {
  return (
    <section className="border-b border-neutral-800 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          Featured Guides
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_GUIDES.map((guide) => (
            <Link
              key={guide.title}
              href={guide.href}
              className="metals-card group flex flex-col rounded-xl p-5 no-underline"
            >
              <h3 className="text-sm font-semibold text-white group-hover:text-[#c8960c]">
                {guide.title}
              </h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-neutral-500">{guide.subtitle}</p>
              <ArrowUpRight
                size={16}
                className="mt-4 text-neutral-600 transition-colors group-hover:text-[#c8960c]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
