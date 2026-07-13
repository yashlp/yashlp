import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { CollectionCard } from "@/components/aesthetics/home/collection-card";
import { catalogService } from "@/lib/commerce/services/catalog.service";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  let collections: Awaited<ReturnType<typeof catalogService.getCollections>> = [];
  try {
    collections = await catalogService.getCollections();
  } catch {
    // empty
  }

  return (
    <>
      <ConsumerNav />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="aes-mono text-[10px] uppercase tracking-[0.3em] text-[var(--aes-dusty)]">Explore</p>
        <h1 className="aes-display mt-2 text-4xl font-semibold italic text-[var(--aes-charcoal)]">Collections</h1>
        {collections.length === 0 ? (
          <p className="mt-12 text-[var(--aes-charcoal-muted)]">No collections published yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        )}
      </main>
      <ConsumerFooter />
    </>
  );
}
