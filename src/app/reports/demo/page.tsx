"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { PAID_REPORTS } from "@/lib/categories";
import { getReportPrice, type ReportProductId } from "@/lib/report-demo-data";
import { GLOBAL_SAMPLE_PLACES } from "@/lib/constants";
import { PricingRegionBanner, ReportPrice } from "@/components/report-price";
import { usePricingRegion } from "@/hooks/use-pricing-region";
import { getLocalizedTierPrice } from "@/lib/report-pricing";

const MUMBAI = GLOBAL_SAMPLE_PLACES[2];

export default function ReportDemosIndexPage() {
  const areaCoords = { lat: MUMBAI.lat, lng: MUMBAI.lng };
  const { market } = usePricingRegion(areaCoords);
  const small = getLocalizedTierPrice("small", market);
  const big = getLocalizedTierPrice("big", market);
  const smallReports = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "small");
  const bigReports = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "big");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <h1 className="text-2xl font-bold text-stone-900">Full report previews</h1>
      <p className="mt-1 text-stone-600">
        Every demo shows the <strong>complete report</strong> you receive after payment — nothing hidden or
        blurred.
      </p>

      <PricingRegionBanner areaCoords={areaCoords} className="mt-6" />

      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900">Standard — {small.formatted}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {smallReports.map((report) => (
            <DemoCard
              key={report.id}
              id={report.id}
              name={report.name}
              emoji={report.emoji}
              audience={report.audience}
              areaCoords={areaCoords}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900">Detailed — {big.formatted}</h2>
        <p className="mt-1 text-sm text-stone-500">
          More comparisons, heatmap zones, plain-language Q&A, and longer issue lists.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {bigReports.map((report) => (
            <DemoCard
              key={report.id}
              id={report.id}
              name={report.name}
              emoji={report.emoji}
              audience={report.audience}
              areaCoords={areaCoords}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function DemoCard({
  id,
  name,
  emoji,
  audience,
  areaCoords,
}: {
  id: string;
  name: string;
  emoji: string;
  audience: string;
  areaCoords: { lat: number; lng: number };
}) {
  return (
    <Link
      href={`/reports/demo/${id}`}
      className="group flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h3 className="font-bold text-stone-900 group-hover:text-orange-700">{name}</h3>
          <p className="text-xs text-orange-600">{audience}</p>
          <p className="mt-1 text-sm font-semibold text-stone-700">
            <ReportPrice productId={id as ReportProductId} areaCoords={areaCoords} />
          </p>
        </div>
      </div>
      <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600">
        <Eye className="h-4 w-4" />
        See full report
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
