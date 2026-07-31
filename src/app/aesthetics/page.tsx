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

/** Fetch catalog at most once a minute; product create/update already revalidates. */
export const revalidate = 60;

export default async function AestheticsHomePage() {
  let featured: Awaited<ReturnType<typeof productService.listPublished>> = [];
  let latest: typeof featured = [];
  let reviews: Awaited<ReturnType<typeof reviewService.listStorefront>> = [];

  try {
    const data = await catalogService.getHomepageData();
    featured = data.featured;
    latest = data.latest;
  } catch {
    // Database not ready
  }

  try {
    reviews = await reviewService.listStorefront(24);
  } catch {
    reviews = [];
  }

  return (
    <>
      <ConsumerNav />
      <main className="relative">
        {/* All published products, each once — updates as soon as you upload */}
        <HeroSection products={latest} />
        {/* Featured rail only when products are explicitly marked featured (avoids Shop now duplicates) */}
        <ProductRow
          title="Pieces as stunning"
          titleLine2="as they are intentional"
          titleStyle="upper"
          products={featured}
          bg="blush"
          quickAdd
        />
        <AboutBanner />
        <LifestyleSection />
        <FunctionFunSection />
        <TestimonialsSection reviews={reviews} />
        <ContactSection />
        {!latest.length && (
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
