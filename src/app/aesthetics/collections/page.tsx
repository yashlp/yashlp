import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { CollectionCard } from "@/components/aesthetics/home/collection-card";
import { ProductSearchBar } from "@/components/aesthetics/shop/product-search-bar";
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
    <ConsumerPage tint="sand">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="aes-joy-title-lower text-[var(--aes-ink)]">collections</h1>
        <p className="mt-3 max-w-lg text-sm text-[var(--aes-ink-muted)]">
          Curated edits for every mood — calm mornings, creative nights, and everything between.
        </p>
        <div className="mt-8 flex justify-center">
          <ProductSearchBar placeholder="Search collections & products…" />
        </div>
        {collections.length === 0 ? (
          <p className="mt-12 text-[var(--aes-ink-muted)]">No collections published yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c, i) => (
              <CollectionCard key={c.id} collection={c} index={i} />
            ))}
          </div>
        )}
      </main>
    </ConsumerPage>
  );
}
