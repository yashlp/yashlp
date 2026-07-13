import Link from "next/link";
import type { Collection } from "@/lib/aesthetics/types";

const ACCENTS = [
  "from-pink-400 to-rose-500",
  "from-violet-400 to-purple-500",
  "from-orange-400 to-amber-500",
  "from-teal-400 to-cyan-500",
  "from-yellow-400 to-orange-400",
];

export function CollectionCard({ collection, index = 0 }: { collection: Collection; index?: number }) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <Link href={`/aesthetics/collections/${collection.slug}`} className="group block">
      <article className="aes-card-editorial overflow-hidden">
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.image}
            alt={collection.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${accent} opacity-40 mix-blend-multiply`} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <h3 className="aes-display text-3xl">{collection.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-white/80">{collection.description}</p>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-[var(--aes-yellow)]">
              Explore →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
