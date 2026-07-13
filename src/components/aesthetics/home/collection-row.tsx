import Link from "next/link";
import { CollectionCard } from "./collection-card";
import type { Collection } from "@/lib/aesthetics/types";

export function CollectionRow({ collections }: { collections: Collection[] }) {
  if (!collections.length) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="aes-section-title text-[var(--aes-ink)]">
            Curated to match your mood
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--aes-ink-muted)]">
            Collections built for how you live — calm mornings, creative nights, and everything between.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <CollectionCard key={c.id} collection={c} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/aesthetics/collections" className="aes-btn aes-btn-primary inline-flex px-8 py-3">
            All collections
          </Link>
        </div>
      </div>
    </section>
  );
}
