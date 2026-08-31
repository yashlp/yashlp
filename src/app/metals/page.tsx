import { MetalsNav } from "@/components/metals/metals-nav";
import { MetalsHero } from "@/components/metals/metals-hero";
import { ProductShowcase } from "@/components/metals/product-showcase";
import { SmartStockSection } from "@/components/metals/smart-stock-section";
import { MissionSection } from "@/components/metals/mission-section";
import { GuidesSection } from "@/components/metals/guides-section";
import { QuoteCta } from "@/components/metals/quote-cta";
import { MetalsFooter } from "@/components/metals/metals-footer";
import Link from "next/link";

export default function MetalsHomePage() {
  return (
    <>
      <div className="metals-news-ticker">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-2.5 lg:px-10">
          <p className="text-xs text-[#c8960c]">
            <span className="font-semibold">Stock Search</span>
            {" — "}
            Find exact sizes and live Rs/kg prices across our full catalog
          </p>
          <Link
            href="/metals/search"
            className="hidden shrink-0 text-xs font-medium text-[#c8960c] hover:text-[#e0b030] sm:inline"
          >
            Open search →
          </Link>
        </div>
      </div>

      <MetalsNav />
      <main>
        <MetalsHero />
        <ProductShowcase />
        <SmartStockSection />
        <MissionSection />
        <GuidesSection />
        <QuoteCta />
      </main>
      <MetalsFooter />
    </>
  );
}
