import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { HeroSection } from "@/components/aesthetics/home/hero-section";
import { CollectionRow } from "@/components/aesthetics/home/collection-row";
import { ProductRow } from "@/components/aesthetics/home/product-row";
import { BrandStrip } from "@/components/aesthetics/home/brand-strip";
import { COLLECTIONS } from "@/lib/aesthetics/collections";
import { BRANDS } from "@/lib/aesthetics/brands";
import {
  getFeaturedProducts,
  getNewArrivals,
  PRODUCTS,
} from "@/lib/aesthetics/products";

export default function AestheticsHomePage() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  const curated = PRODUCTS.slice(0, 4);
  const trendingCollections = COLLECTIONS.filter((c) => c.featured);

  return (
    <>
      <ConsumerNav />
      <main>
        <HeroSection />
        <CollectionRow collections={trendingCollections} />
        <ProductRow
          title="Curated For You"
          subtitle="Handpicked pieces that define modern living"
          products={featured}
          href="/aesthetics/shop"
        />
        <ProductRow
          title="New Arrivals"
          subtitle="Fresh from independent studios"
          products={newArrivals.length ? newArrivals : curated}
          href="/aesthetics/shop?sort=new"
        />
        <BrandStrip brands={BRANDS} />
        <ProductRow
          title="Continue Discovering"
          subtitle="Or try immersive Discover mode"
          products={curated}
          href="/aesthetics/discover"
        />
      </main>
      <ConsumerFooter />
    </>
  );
}
