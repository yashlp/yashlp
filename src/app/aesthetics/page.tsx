import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { HeroSection } from "@/components/aesthetics/home/hero-section";
import { ProductRow } from "@/components/aesthetics/home/product-row";
import { AboutBanner } from "@/components/aesthetics/home/about-banner";
import { LifestyleSection } from "@/components/aesthetics/home/lifestyle-section";
import { FunctionFunSection } from "@/components/aesthetics/home/function-fun-section";
import { TestimonialsSection } from "@/components/aesthetics/home/testimonials-section";
import { ContactSection } from "@/components/aesthetics/home/contact-section";
import { catalogService } from "@/lib/commerce/services/catalog.service";
import { productService } from "@/lib/commerce/services/product.service";
import { reviewService } from "@/lib/commerce/services/review.service";

export default async function AestheticsHomePage() {
  let featured: Awaited<ReturnType<typeof productService.listPublished>> = [];
  let newArrivals: typeof featured = [];
  let latest: typeof featured = [];
  let reviews: Awaited<ReturnType<typeof reviewService.listStorefront>> = [];

  try {
    const data = await catalogService.getHomepageData();
    featured = data.featured;
    newArrivals = data.newArrivals;
    latest = data.latest;
  } catch {
    // Database not ready
  }

  try {
    reviews = await reviewService.listStorefront(24);
  } catch {
    reviews = [];
  }

  const shopNowProducts = latest.length ? latest : featured.length ? featured : newArrivals;

  return (
    <>
      <ConsumerNav />
      <main className="relative">
        <HeroSection products={shopNowProducts.slice(0, 12)} />
        <ProductRow
          title="Pieces as stunning"
          titleLine2="as they are intentional"
          titleStyle="upper"
          products={featured.slice(0, 5)}
          bg="blush"
          quickAdd
        />
        <ProductRow
          title="New arrivals"
          titleStyle="upper"
          products={newArrivals.slice(0, 5)}
          bg="lavender"
          quickAdd
        />
        <AboutBanner />
        <LifestyleSection />
        <FunctionFunSection />
        <TestimonialsSection reviews={reviews} />
        <ContactSection />
        {!shopNowProducts.length && (
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
