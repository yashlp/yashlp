import Link from "next/link";
import { CollectionCard } from "./collection-card";
import type { Collection } from "@/lib/aesthetics/types";

export function CollectionRow({ collections }: { collections: Collection[] }) {
  if (!collections.length) return null;

  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="aes-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--aes-coral)]">
              Editor&apos;s picks
            </p>
            <h2 className="aes-display mt-2 text-4xl font-extrabold tracking-tight text-[var(--aes-ink)]">
              Trending collections
            </h2>
          </div>
          <Link
            href="/aesthetics/collections"
            className="aes-serif text-lg italic text-[var(--aes-ink-muted)] hover:text-[var(--aes-cobalt-bright)]"
          >
            View all collections →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <CollectionCard key={c.id} collection={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
