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
  const featured = index === 0;
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <Link
      href={`/aesthetics/collections/${collection.slug}`}
      className={`group block ${featured ? "sm:col-span-2 lg:col-span-2" : ""}`}
    >
      <article className="aes-gallery-collection-card">
        <div className={`relative overflow-hidden ${featured ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[4/5]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.image}
            alt={collection.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${accent} opacity-35 mix-blend-multiply`} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white sm:p-8">
            {featured && (
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--aes-yellow)]">
                Featured collection
              </p>
            )}
            <h3 className="aes-display text-2xl sm:text-3xl">{collection.title}</h3>
            <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/80">{collection.description}</p>
            <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--aes-yellow)]">
              Explore →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
