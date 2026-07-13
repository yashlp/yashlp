import Link from "next/link";
import { CollectionCard } from "./collection-card";
import type { Collection } from "@/lib/aesthetics/types";

export function CollectionRow({ collections }: { collections: Collection[] }) {
  if (!collections.length) return null;

  return (
    <section className="bg-[var(--aes-sand)] px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="aes-label">Treatments</p>
            <h2 className="aes-display mt-3 text-4xl text-[var(--aes-ink)] sm:text-5xl">
              Curated collections
            </h2>
          </div>
          <Link
            href="/aesthetics/collections"
            className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--aes-ink-muted)] transition hover:text-[var(--aes-forest)]"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <CollectionCard key={c.id} collection={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
