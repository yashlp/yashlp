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
        <div className="relative mb-14 aspect-[21/9] overflow-hidden rounded-[1.75rem] border border-[var(--aes-border)] bg-[var(--aes-bg-sand)] shadow-[var(--aes-shadow)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={collection.image} alt={collection.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(30,30,28,0.7)] via-[rgba(30,30,28,0.35)] to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E8D4A8]">Collection</p>
            <h1 className="aes-gallery-title mt-2 text-white">{collection.title}</h1>
            <p className="mt-3 max-w-lg text-sm text-white/85 sm:text-base">{collection.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            href="/aesthetics/collections"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--aes-pink)] hover:underline"
          >
            ← All collections
          </Link>
        </div>
      </main>
    </ConsumerPage>
  );
}
