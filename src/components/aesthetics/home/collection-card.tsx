import Link from "next/link";
import type { Collection } from "@/lib/aesthetics/types";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/aesthetics/collections/${collection.slug}`} className="group block">
      <article className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={collection.image}
          alt={collection.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.65)] via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="aes-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
            Collection
          </p>
          <h3 className="aes-display mt-1 text-2xl font-semibold italic">{collection.title}</h3>
          <p className="mt-2 text-sm text-white/75">{collection.description}</p>
        </div>
      </article>
    </Link>
  );
}
