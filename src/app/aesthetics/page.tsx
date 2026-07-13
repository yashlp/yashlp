import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { HeroSection } from "@/components/aesthetics/home/hero-section";
import { MarqueeBand } from "@/components/aesthetics/home/marquee-band";
import { CollectionRow } from "@/components/aesthetics/home/collection-row";
import { ProductRow } from "@/components/aesthetics/home/product-row";
import { BrandStrip } from "@/components/aesthetics/home/brand-strip";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { productService } from "@/lib/commerce/services/product.service";

export default async function AestheticsHomePage() {
  let featured: Awaited<ReturnType<typeof productService.listPublished>> = [];
  let newArrivals: typeof featured = [];
  let collections: Awaited<ReturnType<typeof catalogService.getCollections>> = [];
  let brands: Awaited<ReturnType<typeof catalogService.getBrands>> = [];

  try {
    const data = await catalogService.getHomepageData();
    featured = data.featured;
    newArrivals = data.newArrivals;
    collections = data.collections;
    brands = data.brands;
  } catch {
    // Database not seeded
  }

  const curated = featured.slice(0, 4);

  return (
    <>
      <ConsumerNav />
      <main className="relative">
        <HeroSection />
        <MarqueeBand />
        <CollectionRow collections={collections.filter((c) => c.featured)} />
        <ProductRow
          title="Curated for you"
          subtitle="Pieces chosen for modern, colourful living"
          products={featured}
          href="/aesthetics/shop"
          accent="lavender"
        />
        <ProductRow
          title="New arrivals"
          subtitle="Fresh from independent studios"
          products={newArrivals}
          href="/aesthetics/shop?sort=new"
          accent="coral"
        />
        <BrandStrip brands={brands} />
        <ProductRow
          title="Continue discovering"
          subtitle="Immerse yourself in full-screen mode"
          products={curated}
          href="/aesthetics/discover"
          accent="sage"
        />
        {!featured.length && (
          <section className="px-4 py-20 text-center sm:px-6">
            <p className="aes-serif text-2xl italic text-[var(--aes-ink-muted)]">
              Your gallery is waiting — add products from the admin panel.
            </p>
            <Link
              href="/platform-admin/login"
              className="aes-btn aes-btn-primary mt-6 inline-flex px-8 py-4 text-sm"
            >
              Open admin
            </Link>
          </section>
        )}
      </main>
      <ConsumerFooter />
    </>
  );
}
