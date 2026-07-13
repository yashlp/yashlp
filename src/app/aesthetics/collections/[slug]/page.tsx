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
    <ConsumerPage tint="lavender">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="relative mb-12 aspect-[21/9] overflow-hidden rounded-3xl bg-[var(--aes-bg-lavender-deep)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={collection.image} alt={collection.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--aes-bg-dark)]/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-12">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">Collection</p>
            <h1 className="aes-joy-title-lower mt-2 text-white">{collection.title}</h1>
            <p className="mt-3 max-w-lg text-white/85">{collection.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/aesthetics/collections"
            className="text-xs font-bold uppercase tracking-wider text-[var(--aes-pink)] hover:underline"
          >
            ← All collections
          </Link>
        </div>
      </main>
    </ConsumerPage>
  );
}
