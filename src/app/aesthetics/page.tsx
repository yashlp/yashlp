import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { HeroSection } from "@/components/aesthetics/home/hero-section";
import { MarqueeBand } from "@/components/aesthetics/home/marquee-band";
import { ProductRow } from "@/components/aesthetics/home/product-row";
import { AboutBanner } from "@/components/aesthetics/home/about-banner";
import { LifestyleSection } from "@/components/aesthetics/home/lifestyle-section";
import { FunctionFunSection } from "@/components/aesthetics/home/function-fun-section";
import { TestimonialsSection } from "@/components/aesthetics/home/testimonials-section";
import { BundleSection } from "@/components/aesthetics/home/bundle-section";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { productService } from "@/lib/commerce/services/product.service";

export default async function AestheticsHomePage() {
  let featured: Awaited<ReturnType<typeof productService.listPublished>> = [];
  let newArrivals: typeof featured = [];

  try {
    const data = await catalogService.getHomepageData();
    featured = data.featured;
    newArrivals = data.newArrivals;
  } catch {
    // Database not seeded
  }

  return (
    <>
      <ConsumerNav />
      <main className="relative">
        <HeroSection products={featured} />
        <MarqueeBand />
        <ProductRow
          title="Objects as beautiful"
          titleLine2="as they are meaningful"
          titleStyle="upper"
          products={featured.slice(0, 5)}
          bg="blush"
          quickAdd
        />
        <ProductRow
          title="curated to match your mood"
          titleStyle="lower"
          products={newArrivals.slice(0, 5)}
          bg="lavender"
          quickAdd
        />
        <AboutBanner />
        <LifestyleSection />
        <FunctionFunSection />
        <TestimonialsSection />
        <BundleSection />
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
