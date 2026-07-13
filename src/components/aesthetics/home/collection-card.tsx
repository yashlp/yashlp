import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Collection } from "@/lib/aesthetics/types";

const ACCENT_BARS = [
  "bg-gradient-to-r from-blue-600 to-violet-500",
  "bg-gradient-to-r from-rose-500 to-orange-400",
  "bg-gradient-to-r from-emerald-500 to-teal-400",
  "bg-gradient-to-r from-violet-600 to-fuchsia-500",
  "bg-gradient-to-r from-amber-500 to-rose-400",
];

export function CollectionCard({ collection, index = 0 }: { collection: Collection; index?: number }) {
  const bar = ACCENT_BARS[index % ACCENT_BARS.length];

  return (
    <Link href={`/aesthetics/collections/${collection.slug}`} className="group block">
      <article className="aes-card-editorial aes-grain relative overflow-hidden">
        <div className={`h-1.5 w-full ${bar}`} />
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.image}
            alt={collection.title}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--aes-ink)]/80 via-[var(--aes-ink)]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="aes-mono text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
              Collection
            </p>
            <h3 className="aes-serif mt-2 text-3xl italic leading-tight">{collection.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-white/75">{collection.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
              Explore <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
