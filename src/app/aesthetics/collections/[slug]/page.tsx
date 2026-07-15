import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { catalogService } from "@/lib/commerce/services/catalog.service";

type Props = { params: Promise<{ slug: string }> };

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = await catalogService.getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = collection.products || [];

  return (
    <ConsumerPage room="warm">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="relative mb-10 min-h-[14rem] overflow-hidden rounded-[1.75rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-bg-secondary,#ece8e1)] shadow-[var(--gallery-shadow,0_2px_16px_rgba(30,30,28,0.05))] aspect-[4/3] sm:mb-14 sm:aspect-[21/9] sm:min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={collection.image} alt={collection.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,12,12,0.85)] via-[rgba(12,12,12,0.4)] to-transparent sm:bg-gradient-to-r sm:from-[rgba(12,12,12,0.78)] sm:via-[rgba(12,12,12,0.4)] sm:to-transparent" />
          <div className="aes-collection-overlay absolute inset-0 flex flex-col justify-end p-5 sm:p-12">
            <p className="aes-collection-overlay-kicker text-[10px] font-bold uppercase tracking-[0.22em]">
              Collection
            </p>
            <h1 className="aes-gallery-title mt-2 text-balance">{collection.title}</h1>
            <p className="aes-collection-overlay-copy mt-3 max-w-lg text-sm sm:text-base">
              {collection.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            href="/aesthetics/collections"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--gallery-blue,#2c5aa0)] hover:underline"
          >
            ← All collections
          </Link>
        </div>
      </main>
    </ConsumerPage>
  );
}
