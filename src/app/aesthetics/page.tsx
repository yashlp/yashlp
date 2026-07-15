import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { HeroSection } from "@/components/aesthetics/home/hero-section";
import { ProductRow } from "@/components/aesthetics/home/product-row";
import { CollectionRow } from "@/components/aesthetics/home/collection-row";
import { ShopByRoomSection } from "@/components/aesthetics/home/shop-by-room";
import { MakerStoriesSection } from "@/components/aesthetics/home/maker-stories";
import { CustomerPhotosSection } from "@/components/aesthetics/home/customer-photos";
import { NewsletterSection } from "@/components/aesthetics/home/newsletter-section";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { productService } from "@/lib/commerce/services/product.service";

export default async function AestheticsHomePage() {
  let featured: Awaited<ReturnType<typeof productService.listPublished>> = [];
  let trending: typeof featured = [];
  let editorsPicks: typeof featured = [];
  let completeSetups: Awaited<ReturnType<typeof catalogService.getHomepageData>>["completeSetups"] = [];
  let customerPhotos: Awaited<ReturnType<typeof catalogService.getHomepageData>>["customerPhotos"] = [];

  try {
    const data = await catalogService.getHomepageData();
    featured = data.featured;
    trending = data.trending.length ? data.trending : data.featured;
    editorsPicks = data.editorsPicks.length ? data.editorsPicks : data.featured;
    completeSetups = data.completeSetups;
    customerPhotos = data.customerPhotos;
  } catch {
    // Database not seeded
  }

  return (
    <>
      <ConsumerNav />
      <main className="relative">
        <HeroSection products={featured} />

        <ProductRow
          title="Featured Collection"
          titleStyle="upper"
          products={featured.slice(0, 5)}
          bg="blush"
          quickAdd
        />

        <ProductRow
          title="Trending"
          titleStyle="upper"
          products={trending.slice(0, 5)}
          bg="lavender"
          quickAdd
        />

        <ShopByRoomSection />

        {completeSetups.length > 0 && (
          <CollectionRow collections={completeSetups} />
        )}

        <ProductRow
          title="Editor's Picks"
          titleStyle="upper"
          products={editorsPicks.slice(0, 5)}
          bg="sand"
          quickAdd
        />

        <MakerStoriesSection />
        <CustomerPhotosSection photos={customerPhotos} />
        <NewsletterSection />

        {!featured.length && (
          <section className="aes-bg-sand px-4 py-20 text-center sm:px-6">
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
