import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { HeroSection } from "@/components/aesthetics/home/hero-section";
import { PhilosophySection } from "@/components/aesthetics/home/philosophy-section";
import { MarqueeBand } from "@/components/aesthetics/home/marquee-band";
import { CollectionRow } from "@/components/aesthetics/home/collection-row";
import { ProductRow } from "@/components/aesthetics/home/product-row";
import { TranquilitySection } from "@/components/aesthetics/home/tranquility-section";
import { PromoSection } from "@/components/aesthetics/home/promo-section";
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
        <PhilosophySection />
        <MarqueeBand />
        <CollectionRow collections={collections.filter((c) => c.featured)} />
        <ProductRow
          title="Aesthetics menu"
          subtitle="Choose from our wide range of curated objects — from sculptural ceramics to wellness essentials and artisan lighting."
          products={featured}
          href="/aesthetics/shop"
          accent="sage"
        />
        <TranquilitySection />
        <ProductRow
          title="New arrivals"
          subtitle="Fresh from independent studios"
          products={newArrivals}
          href="/aesthetics/shop?sort=new"
          accent="coral"
        />
        <PromoSection />
        <BrandStrip brands={brands} />
        <ProductRow
          title="Continue discovering"
          subtitle="Immerse yourself in full-screen mode"
          products={curated}
          href="/aesthetics/discover"
          accent="lavender"
        />
        {!featured.length && (
          <section className="px-6 py-24 text-center sm:px-8">
            <p className="aes-serif text-2xl italic text-[var(--aes-ink-muted)]">
              Your sanctuary is waiting — add products from the admin panel.
            </p>
            <Link
              href="/platform-admin/login"
              className="aes-btn aes-btn-primary mt-8 inline-flex px-8 py-4"
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
