"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { PAID_REPORTS } from "@/lib/categories";
import { getReportPrice, type ReportProductId } from "@/lib/report-demo-data";
import { GLOBAL_SAMPLE_PLACES } from "@/lib/constants";
import { PlaceSearch } from "@/components/place-search";
import { PricingRegionBanner, ReportPrice } from "@/components/report-price";
import { usePricingRegion } from "@/hooks/use-pricing-region";
import { getLocalizedTierPrice } from "@/lib/report-pricing";
import type { GeocodePlace } from "@/lib/geocode";
import { placeQueryString } from "@/lib/geocode";

const MUMBAI = GLOBAL_SAMPLE_PLACES[2];

export default function ReportDemosIndexPage() {
  const [selectedPlace, setSelectedPlace] = useState<GeocodePlace | null>(null);
  const areaCoords = selectedPlace
    ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
    : { lat: MUMBAI.lat, lng: MUMBAI.lng };
  const { market } = usePricingRegion(areaCoords);
  const small = getLocalizedTierPrice("small", market);
  const big = getLocalizedTierPrice("big", market);
  const smallReports = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "small");
  const bigReports = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "big");
  const demoQuery = selectedPlace ? `?${placeQueryString(selectedPlace)}` : "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <h1 className="text-2xl font-bold text-stone-900">Full report previews</h1>
      <p className="mt-1 text-stone-600">
        Every demo is the <strong>complete report</strong> after payment — AI interpretation included, nothing blurred.
      </p>

      <div className="mt-6 rounded-2xl border border-orange-100 bg-white p-4">
        <PlaceSearch
          selectedPlace={selectedPlace}
          onSelect={setSelectedPlace}
          onClear={() => setSelectedPlace(null)}
          label="Report location"
          hint="Country first, then city, area, state, or pincode"
        />
      </div>

      <PricingRegionBanner areaCoords={areaCoords} className="mt-6" />

      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900">Standard — {small.formatted}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {smallReports.map((report) => (
            <DemoCard key={report.id} id={report.id} report={report} areaCoords={areaCoords} demoQuery={demoQuery} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900">Detailed — {big.formatted}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {bigReports.map((report) => (
            <DemoCard key={report.id} id={report.id} report={report} areaCoords={areaCoords} demoQuery={demoQuery} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DemoCard({
  id,
  report,
  areaCoords,
  demoQuery,
}: {
  id: string;
  report: (typeof PAID_REPORTS)[number];
  areaCoords: { lat: number; lng: number };
  demoQuery: string;
}) {
  return (
    <Link
      href={`/reports/demo/${id}${demoQuery}`}
      className="group flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{report.emoji}</span>
        <div>
          <h3 className="font-bold text-stone-900 group-hover:text-orange-700">{report.name}</h3>
          <p className="text-xs italic text-stone-500">&ldquo;{report.customerQuestion}&rdquo;</p>
          <p className="mt-1 text-sm font-semibold text-stone-700">
            <ReportPrice productId={id as ReportProductId} areaCoords={areaCoords} />
          </p>
        </div>
      </div>
      <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600">
        <Eye className="h-4 w-4" />
        See full demo
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
