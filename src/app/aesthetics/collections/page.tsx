import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { CollectionCard } from "@/components/aesthetics/home/collection-card";
import { COLLECTIONS } from "@/lib/aesthetics/collections";

export const metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <>
      <ConsumerNav />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="aes-mono text-[10px] uppercase tracking-[0.3em] text-[var(--aes-dusty)]">Explore</p>
        <h1 className="aes-display mt-2 text-4xl font-semibold italic text-[var(--aes-charcoal)]">Collections</h1>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      </main>
      <ConsumerFooter />
    </>
  );
}
