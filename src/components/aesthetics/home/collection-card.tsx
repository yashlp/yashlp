import Link from "next/link";
import type { Collection } from "@/lib/aesthetics/types";

export function CollectionCard({ collection, index = 0 }: { collection: Collection; index?: number }) {
  const featured = index === 0;

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
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,30,28,0.72)] via-[rgba(30,30,28,0.2)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            {featured && (
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#E8D4A8]">
                Featured collection
              </p>
            )}
            <h3 className="aes-gallery-title text-2xl text-white sm:text-3xl">{collection.title}</h3>
            <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/80">{collection.description}</p>
            <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A96E]">
              Explore →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
