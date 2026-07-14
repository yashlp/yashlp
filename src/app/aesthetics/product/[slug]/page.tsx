import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Truck, RefreshCcw } from "lucide-react";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { ProductReviews } from "@/components/aesthetics/shop/product-reviews";
import { TrustBadges } from "@/components/aesthetics/trust/trust-badges";
import { Badge } from "@/components/aesthetics/ui/badge";
import { productService } from "@/lib/commerce/services/product.service";
import { formatInr } from "@/lib/aesthetics/format-inr";
import { ProductActions } from "./product-actions";
import { RememberProductView } from "./remember-view";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) notFound();

  const related = await productService.getRelated(product.id, product.category, product.tags);
  const frequentlyBought =
    product.recommended != null
      ? await productService.listPublished({ recommended: true, limit: 4 })
      : related;
  const fbt = frequentlyBought.filter((p) => p.id !== product.id).slice(0, 4);

  const specs = product.specifications
    ? Object.entries(product.specifications)
    : [];

  return (
    <ConsumerPage room="ivory">
      <RememberProductView product={product} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/aesthetics/shop"
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--gallery-muted,#6f6a63)] transition hover:text-[var(--gallery-blue,#2c5aa0)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] shadow-[var(--gallery-shadow,0_2px_16px_rgba(30,30,28,0.05))]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-xl border border-[var(--gallery-border,#ddd7cf)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
            {product.video && (
              <div className="overflow-hidden rounded-[1.25rem] border border-[var(--gallery-border,#ddd7cf)] bg-black">
                <video
                  src={product.video}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-80 w-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          <div className="aes-panel p-7 sm:p-10">
            <div className="flex flex-wrap gap-2">
              {product.isBestseller && <Badge variant="coral">Bestseller</Badge>}
              {product.brand?.name && <Badge variant="muted">{product.brand.name}</Badge>}
              {product.tags.map((t) => (
                <Badge key={t} variant="muted">
                  {t}
                </Badge>
              ))}
            </div>
            <h1 className="aes-gallery-title mt-5">{product.name}</h1>
            {product.brand?.name && (
              <p className="mt-2 text-sm text-[var(--gallery-muted,#6f6a63)]">by {product.brand.name}</p>
            )}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-[var(--gallery-muted,#6f6a63)]">
                <Star className="h-4 w-4 fill-[var(--gallery-luxury,#b58e4a)] text-[var(--gallery-luxury,#b58e4a)]" />
                {product.rating} ({product.reviewCount} reviews)
              </div>
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-[var(--gallery-ink,#1e1e1c)]">
                {formatInr(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-[var(--gallery-muted,#6f6a63)] line-through">
                  {formatInr(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="mt-6 leading-relaxed text-[var(--gallery-muted,#6f6a63)]">{product.description}</p>

            <ProductActions product={product} />

            <div className="mt-10 space-y-4 border-t border-[var(--gallery-border,#ddd7cf)] pt-8">
              <div className="flex items-start gap-3 text-sm text-[var(--gallery-muted,#6f6a63)]">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gallery-blue,#2c5aa0)]" />
                <div>
                  <p className="font-semibold text-[var(--gallery-ink,#1e1e1c)]">Shipping</p>
                  <p>Free delivery over ₹999 · Ships across India · 3–7 business days</p>
                  <Link href="/aesthetics/shipping" className="mt-1 inline-block text-[var(--gallery-blue,#2c5aa0)]">
                    Shipping policy
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-[var(--gallery-muted,#6f6a63)]">
                <RefreshCcw className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gallery-blue,#2c5aa0)]" />
                <div>
                  <p className="font-semibold text-[var(--gallery-ink,#1e1e1c)]">Easy returns</p>
                  <p>Unused items within 7 days of delivery</p>
                  <Link href="/aesthetics/returns" className="mt-1 inline-block text-[var(--gallery-blue,#2c5aa0)]">
                    Return policy
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-muted,#6f6a63)]">
                    Materials
                  </p>
                  <p className="mt-1 text-[var(--gallery-ink,#1e1e1c)]">
                    {product.materials.join(", ") || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-muted,#6f6a63)]">
                    Dimensions
                  </p>
                  <p className="mt-1 text-[var(--gallery-ink,#1e1e1c)]">{product.dimensions || "See description"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-muted,#6f6a63)]">
                    Mood
                  </p>
                  <p className="mt-1 capitalize text-[var(--gallery-ink,#1e1e1c)]">{product.mood}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-muted,#6f6a63)]">
                    Room / Style
                  </p>
                  <p className="mt-1 capitalize text-[var(--gallery-ink,#1e1e1c)]">
                    {[product.room, product.style].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              </div>
              {specs.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gallery-muted,#6f6a63)]">
                    Specifications
                  </p>
                  <dl className="mt-2 space-y-1 text-sm">
                    {specs.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-[var(--gallery-border,#ddd7cf)] py-1.5">
                        <dt className="text-[var(--gallery-muted,#6f6a63)]">{k}</dt>
                        <dd className="text-[var(--gallery-ink,#1e1e1c)]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14">
          <TrustBadges />
        </div>

        <ProductReviews
          productId={product.id}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        {related.length > 0 && (
          <section className="mt-20 rounded-[2rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-bg-secondary,#ece8e1)] px-4 py-14 sm:px-8">
            <p className="aes-gallery-eyebrow">Similar products</p>
            <h2 className="aes-gallery-title mt-3 text-2xl sm:text-3xl">Complete the look</h2>
            <p className="aes-gallery-lead mt-3">
              Pieces that sit naturally alongside this one — curated for mood and material harmony.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
              ))}
            </div>
          </section>
        )}

        {fbt.length > 0 && (
          <section className="mt-14 px-1 py-6">
            <p className="aes-gallery-eyebrow">Frequently bought together</p>
            <h2 className="aes-gallery-title mt-3 text-2xl sm:text-3xl">Curated For You</h2>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {fbt.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
              ))}
            </div>
          </section>
        )}
      </main>
    </ConsumerPage>
  );
}
