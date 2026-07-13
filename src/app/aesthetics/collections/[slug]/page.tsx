import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { catalogService } from "@/lib/commerce/services/catalog.service";

type Props = { params: Promise<{ slug: string }> };

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = await catalogService.getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = collection.products || [];

  return (
    <>
      <ConsumerNav />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="relative mb-12 aspect-[21/9] overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={collection.image} alt={collection.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-12">
            <p className="aes-mono text-[10px] uppercase tracking-[0.3em] text-white/70">Collection</p>
            <h1 className="aes-display mt-2 text-4xl font-semibold italic sm:text-5xl">{collection.title}</h1>
            <p className="mt-3 max-w-lg text-white/80">{collection.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/aesthetics/collections" className="aes-mono text-xs uppercase tracking-wider text-[var(--aes-royal)]">
            ← All collections
          </Link>
        </div>
      </main>
      <ConsumerFooter />
    </>
  );
}
