import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { HeroSection } from "@/components/aesthetics/home/hero-section";
import { MarqueeBand } from "@/components/aesthetics/home/marquee-band";
import { ProductRow } from "@/components/aesthetics/home/product-row";
import { CollectionRow } from "@/components/aesthetics/home/collection-row";
import { AboutBanner } from "@/components/aesthetics/home/about-banner";
import { LifestyleSection } from "@/components/aesthetics/home/lifestyle-section";
import { FunctionFunSection } from "@/components/aesthetics/home/function-fun-section";
import { TestimonialsSection } from "@/components/aesthetics/home/testimonials-section";
import { BundleSection } from "@/components/aesthetics/home/bundle-section";
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

  return (
    <>
      <ConsumerNav />
      <main className="relative">
        <HeroSection />
        <MarqueeBand />
        <ProductRow
          title="Objects as beautiful as they are meaningful"
          products={featured.slice(0, 5)}
          href="/aesthetics/shop"
          bg="white"
          quickAdd
        />
        <CollectionRow collections={collections.filter((c) => c.featured)} />
        <ProductRow
          title="Blends built to match moods"
          subtitle="Gummies-style curation — collections for every vibe"
          products={newArrivals.slice(0, 5)}
          href="/aesthetics/shop?sort=new"
          bg="pink"
          quickAdd
        />
        <AboutBanner />
        <LifestyleSection />
        <FunctionFunSection />
        <TestimonialsSection />
        <BundleSection />
        <BrandStrip brands={brands} />
        {!featured.length && (
          <section className="px-4 py-20 text-center sm:px-6">
            <p className="text-lg font-medium text-[var(--aes-ink-muted)]">
              New products are on the way — check back soon.
            </p>
            <Link href="/aesthetics/shop" className="aes-btn aes-btn-primary mt-6 inline-flex px-8 py-4">
              Browse shop
            </Link>
          </section>
        )}
      </main>
      <ConsumerFooter />
    </>
  );
}
