import Link from "next/link";
import { CollectionCard } from "./collection-card";
import type { Collection } from "@/lib/aesthetics/types";

export function CollectionRow({ collections }: { collections: Collection[] }) {
  return (
    <section className="bg-[var(--aes-white)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="aes-mono text-[10px] uppercase tracking-[0.3em] text-[var(--aes-dusty)]">
            Curated
          </p>
          <h2 className="aes-display mt-2 text-3xl font-semibold italic text-[var(--aes-charcoal)] sm:text-4xl">
            Trending Collections
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/aesthetics/collections"
            className="aes-mono text-xs uppercase tracking-wider text-[var(--aes-royal)] hover:underline"
          >
            All collections →
          </Link>
        </div>
      </div>
    </section>
  );
}
