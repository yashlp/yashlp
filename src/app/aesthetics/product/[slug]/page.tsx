import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Truck } from "lucide-react";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { Badge } from "@/components/aesthetics/ui/badge";
import { productService } from "@/lib/commerce/services/product.service";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { ProductActions } from "./product-actions";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) notFound();

  const brand = product.brand ?? (await catalogService.getBrandById(product.brandId));
  const related = await productService.getRelated(product.id, product.category, product.tags);

  return (
    <ConsumerPage tint="peach">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/aesthetics/shop"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--aes-ink-muted)] hover:text-[var(--aes-pink)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="aes-panel p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <Badge key={t} variant="muted">{t}</Badge>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[var(--aes-ink-soft)]">
              {brand?.name}
            </p>
            <h1 className="aes-joy-title-lower mt-2 text-[var(--aes-ink)]">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-[var(--aes-ink-muted)]">
                <Star className="h-4 w-4 fill-[var(--aes-pink)] text-[var(--aes-pink)]" />
                {product.rating} ({product.reviewCount} reviews)
              </div>
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[var(--aes-ink)]">${product.price}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-[var(--aes-ink-muted)] line-through">
                  ${product.compareAtPrice}
                </span>
              )}
            </div>
            <p className="mt-6 leading-relaxed text-[var(--aes-ink-muted)]">{product.description}</p>

            <ProductActions product={product} />

            <div className="mt-10 space-y-4 border-t border-[var(--aes-border)] pt-8">
              <div className="flex items-start gap-3 text-sm text-[var(--aes-ink-muted)]">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--aes-pink)]" />
                <div>
                  <p className="font-bold text-[var(--aes-ink)]">Free delivery over $75</p>
                  <p>Estimated 3–5 business days</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--aes-ink-soft)]">Materials</p>
                  <p className="mt-1 text-[var(--aes-ink)]">{product.materials.join(", ")}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--aes-ink-soft)]">Mood</p>
                  <p className="mt-1 capitalize text-[var(--aes-ink)]">{product.mood}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="aes-bg-blush mt-20 -mx-4 rounded-3xl px-4 py-16 sm:-mx-6 sm:px-6">
            <h2 className="aes-joy-title-lower mb-8 text-[var(--aes-ink)]">similar style</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
              ))}
            </div>
          </section>
        )}
      </main>
    </ConsumerPage>
  );
}
