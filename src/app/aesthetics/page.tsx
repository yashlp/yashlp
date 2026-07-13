import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { HeroSection } from "@/components/aesthetics/home/hero-section";
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
    // Database not seeded yet — show empty state via hero only
  }

  const curated = featured.slice(0, 4);

  return (
    <>
      <ConsumerNav />
      <main>
        <HeroSection />
        {collections.filter((c) => c.featured).length > 0 && (
          <CollectionRow collections={collections.filter((c) => c.featured)} />
        )}
        {featured.length > 0 && (
          <ProductRow
            title="Curated For You"
            subtitle="Handpicked pieces that define modern living"
            products={featured}
            href="/aesthetics/shop"
          />
        )}
        {newArrivals.length > 0 && (
          <ProductRow
            title="New Arrivals"
            subtitle="Fresh from independent studios"
            products={newArrivals}
            href="/aesthetics/shop?sort=new"
          />
        )}
        {brands.length > 0 && <BrandStrip brands={brands} />}
        {curated.length > 0 && (
          <ProductRow
            title="Continue Discovering"
            subtitle="Or try immersive Discover mode"
            products={curated}
            href="/aesthetics/discover"
          />
        )}
      </main>
      <ConsumerFooter />
    </>
  );
}
