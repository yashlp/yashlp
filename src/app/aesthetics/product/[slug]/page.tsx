import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Truck } from "lucide-react";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
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
    <>
      <ConsumerNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/aesthetics/shop"
          className="aes-mono mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--aes-dusty)] hover:text-[var(--aes-royal)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-[var(--aes-ivory-deep)]">
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

          <div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <Badge key={t} variant="muted">{t}</Badge>
              ))}
            </div>
            <p className="aes-mono mt-4 text-[10px] uppercase tracking-[0.2em] text-[var(--aes-dusty)]">
              {brand?.name}
            </p>
            <h1 className="aes-display mt-2 text-4xl font-semibold italic text-[var(--aes-charcoal)]">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-[var(--aes-charcoal-muted)]">
                <Star className="h-4 w-4 fill-[var(--aes-royal)] text-[var(--aes-royal)]" />
                {product.rating} ({product.reviewCount} reviews)
              </div>
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-[var(--aes-charcoal)]">${product.price}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-[var(--aes-charcoal-muted)] line-through">
                  ${product.compareAtPrice}
                </span>
              )}
            </div>
            <p className="mt-6 leading-relaxed text-[var(--aes-charcoal-muted)]">{product.description}</p>

            <ProductActions product={product} />

            <div className="mt-10 space-y-4 border-t border-[var(--aes-border)] pt-8">
              <div className="flex items-start gap-3 text-sm text-[var(--aes-charcoal-muted)]">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--aes-dusty)]" />
                <div>
                  <p className="font-medium text-[var(--aes-charcoal)]">Free delivery over $75</p>
                  <p>Estimated 3–5 business days</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Materials</p>
                  <p className="mt-1 text-[var(--aes-charcoal)]">{product.materials.join(", ")}</p>
                </div>
                <div>
                  <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Mood</p>
                  <p className="mt-1 capitalize text-[var(--aes-charcoal)]">{product.mood}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-[var(--aes-border)] pt-16">
            <h2 className="aes-display mb-8 text-3xl font-semibold italic">Similar style</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <ConsumerFooter />
    </>
  );
}
