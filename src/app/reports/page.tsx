"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, Lock, MapPin } from "lucide-react";
import { FREE_FEATURES, PAID_REPORTS } from "@/lib/categories";
import { getReportPrice } from "@/lib/report-demo-data";
import { PlaceSearch } from "@/components/place-search";
import { PricingRegionBanner, ReportPrice } from "@/components/report-price";
import { usePricingRegion } from "@/hooks/use-pricing-region";
import { getLocalizedTierPrice } from "@/lib/report-pricing";
import type { ReportProductId } from "@/lib/report-demo-data";
import type { GeocodePlace } from "@/lib/geocode";
import { placeQueryString } from "@/lib/geocode";
import { GLOBAL_SAMPLE_PLACES } from "@/lib/constants";

const DEFAULT_PLACE: GeocodePlace = {
  name: GLOBAL_SAMPLE_PLACES[2].name,
  lat: GLOBAL_SAMPLE_PLACES[2].lat,
  lng: GLOBAL_SAMPLE_PLACES[2].lng,
  countryCode: "IN",
};

export default function ReportsPage() {
  const [selectedPlace, setSelectedPlace] = useState<GeocodePlace | null>(null);
  const areaCoords = selectedPlace
    ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
    : { lat: DEFAULT_PLACE.lat, lng: DEFAULT_PLACE.lng };
  const { market } = usePricingRegion(areaCoords);
  const smallPrice = getLocalizedTierPrice("small", market);
  const bigPrice = getLocalizedTierPrice("big", market);
  const smallReports = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "small");
  const bigReports = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "big");
  const placeLabel = selectedPlace?.name ?? DEFAULT_PLACE.name;
  const demoQuery = selectedPlace ? `?${placeQueryString(selectedPlace)}` : "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:p-8">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          CivicLens <span className="text-orange-600">Intelligence Reports</span>
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          AI interprets community-verified data so you can answer real questions —{" "}
          <em>Is this area good? Should I buy? Which neighbourhood is better?</em>
        </p>

        <div className="mt-6 rounded-2xl border border-orange-100 bg-white p-4">
          <PlaceSearch
            selectedPlace={selectedPlace}
            onSelect={setSelectedPlace}
            onClear={() => setSelectedPlace(null)}
            label="Where do you want a report?"
            hint="Select country, then search city, neighbourhood, state, or pincode"
          />
          {!selectedPlace && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-400">
              <MapPin className="h-3.5 w-3.5" />
              Showing sample pricing for {DEFAULT_PLACE.name} until you pick a location
            </p>
          )}
          {selectedPlace && (
            <p className="mt-2 text-xs font-medium text-emerald-700">
              Reports will use data near {placeLabel}
            </p>
          )}
        </div>

        <PricingRegionBanner areaCoords={areaCoords} className="mt-4" />
        <Link
          href={`/reports/demo/area-insight${demoQuery}`}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:bg-orange-700"
        >
          <Eye className="h-4 w-4" />
          See full {smallPrice.formatted} Area Insight demo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
          <Check className="h-5 w-5 text-green-600" />
          Always Free
        </h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {FREE_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50/50 px-4 py-3 text-sm text-stone-700">
              <Check className="h-4 w-4 shrink-0 text-green-600" />
              {f}
            </div>
          ))}
        </div>
      </section>

      <ReportTierSection
        title={`Standard — ${smallPrice.formatted}`}
        subtitle={`Area Insight, Area Comparison for ${placeLabel}`}
        reports={smallReports}
        demoQuery={demoQuery}
        areaCoords={areaCoords}
      />

      <ReportTierSection
        title={`Detailed — ${bigPrice.formatted}`}
        subtitle="Property Due Diligence, Business Location, Advanced presets"
        reports={bigReports}
        demoQuery={demoQuery}
        areaCoords={areaCoords}
      />

      <p className="mt-8 text-center text-sm text-stone-500">
        Payment launching soon.{" "}
        <Link href="/login" className="font-medium text-orange-600 hover:underline">
          Sign in
        </Link>{" "}
        for early access.
      </p>
    </div>
  );
}

function ReportTierSection({
  title,
  subtitle,
  reports,
  demoQuery,
  areaCoords,
}: {
  title: string;
  subtitle: string;
  reports: (typeof PAID_REPORTS)[number][];
  demoQuery: string;
  areaCoords: { lat: number; lng: number };
}) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
        <Lock className="h-5 w-5 text-orange-600" />
        {title}
      </h2>
      <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <div key={report.id} className="flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{report.emoji}</span>
              <div>
                <h3 className="font-bold text-stone-900">{report.name}</h3>
                <p className="text-xs italic text-stone-500">&ldquo;{report.customerQuestion}&rdquo;</p>
                <p className="mt-1 text-xs text-orange-600">{report.audience}</p>
                <p className="mt-1 text-sm font-semibold text-stone-800">
                  <ReportPrice productId={report.id as ReportProductId} areaCoords={areaCoords} />
                </p>
              </div>
            </div>
            <ul className="mt-4 flex-1 space-y-1.5">
              {report.features.slice(0, 5).map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/reports/demo/${report.id}${demoQuery}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
            >
              <Eye className="h-4 w-4" />
              See full report demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
