import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Collection } from "@/lib/aesthetics/types";

export function CollectionCard({ collection, index = 0 }: { collection: Collection; index?: number }) {
  return (
    <Link href={`/aesthetics/collections/${collection.slug}`} className="group block">
      <article className="aes-grain relative overflow-hidden">
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.image}
            alt={collection.title}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--aes-forest-deep)]/85 via-[var(--aes-forest-deep)]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-[var(--aes-sand)]">
            <p className="aes-label text-[var(--aes-gold-soft)]">Collection</p>
            <h3 className="aes-display mt-2 text-3xl leading-tight">{collection.title}</h3>
            <p className="mt-3 line-clamp-2 text-sm text-[var(--aes-sand)]/70">{collection.description}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--aes-sand)]/80 opacity-0 transition-opacity group-hover:opacity-100">
              Explore <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
