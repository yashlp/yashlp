"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Lock, MapPin } from "lucide-react";
import { PlaceSearch } from "@/components/place-search";
import { PricingRegionBanner, ReportPrice } from "@/components/report-price";
import { parsePlaceFromSearchParams, placeQueryString, type GeocodePlace } from "@/lib/geocode";
import { markReportPaid } from "@/lib/report-access";
import {
  getReportProduct,
  resolveReportProductId,
  type ReportProductId,
} from "@/lib/report-demo-data";

export function ReportCheckoutClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawId = params.id as string;
  const resolvedId = resolveReportProductId(rawId);
  const product = resolvedId ? getReportProduct(resolvedId) : undefined;

  const initialPlace = useMemo(() => parsePlaceFromSearchParams(searchParams), [searchParams]);
  const [selectedPlace, setSelectedPlace] = useState<GeocodePlace | null>(initialPlace);
  const [searchCountry, setSearchCountry] = useState<string | null>(initialPlace?.countryCode ?? null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const pricingCountry = selectedPlace?.countryCode ?? searchCountry;
  const areaCoordsForPricing = selectedPlace
    ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
    : null;

  const preset = searchParams.get("preset");

  if (!product || !resolvedId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-stone-600">Report not found.</p>
        <Link href="/reports" className="mt-4 inline-block text-orange-600 hover:underline">
          Back to reports
        </Link>
      </div>
    );
  }

  const query = new URLSearchParams(
    selectedPlace ? placeQueryString(selectedPlace) : ""
  );
  if (preset) query.set("preset", preset);
  const viewUrl = selectedPlace
    ? `/reports/view/${resolvedId}?${query.toString()}`
    : `/reports/view/${resolvedId}`;

  const handlePay = async () => {
    if (!selectedPlace) {
      setError("Please select the location for your report first.");
      return;
    }
    setPaying(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    markReportPaid(resolvedId, selectedPlace.lat, selectedPlace.lng);
    router.push(viewUrl);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <Link href="/reports" className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-orange-600">
        <ArrowLeft className="h-4 w-4" />
        All reports
      </Link>

      <div className="mt-6 rounded-3xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/40">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{product.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">{product.name}</h1>
            <p className="mt-1 text-sm italic text-stone-500">&ldquo;{product.customerQuestion}&rdquo;</p>
            <p className="mt-2 text-lg font-bold text-orange-700">
              <ReportPrice
                productId={resolvedId as ReportProductId}
                areaCoords={areaCoordsForPricing}
                countryCode={pricingCountry}
              />
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {product.features.slice(0, 6).map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
          <PlaceSearch
            selectedPlace={selectedPlace}
            onSelect={(p) => {
              setSelectedPlace(p);
              setError("");
            }}
            onClear={() => setSelectedPlace(null)}
            onCountryChange={setSearchCountry}
            label="Report location"
            hint="Country first, then city, neighbourhood, state, or pincode"
          />
          {!selectedPlace && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-600">
              <MapPin className="h-3.5 w-3.5" />
              Select a location before payment
            </p>
          )}
        </div>

        <PricingRegionBanner
          areaCoords={areaCoordsForPricing}
          countryCode={pricingCountry}
          className="mt-4"
        />

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <button
          type="button"
          onClick={handlePay}
          disabled={paying}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-700 disabled:opacity-60"
        >
          <CreditCard className="h-5 w-5" />
          {paying ? "Processing…" : (
            <>
              Pay{" "}
              <ReportPrice
                productId={resolvedId as ReportProductId}
                areaCoords={areaCoordsForPricing}
                countryCode={pricingCountry}
                className="font-bold text-white"
              />{" "}
              & get report
            </>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-stone-500">
          Demo checkout — no real charge yet. Stripe/Razorpay can be connected for production.
        </p>

        <Link
          href={`/reports/sample/area-insight`}
          className="mt-4 block text-center text-sm font-medium text-orange-600 hover:underline"
        >
          Not sure? See a sample report first
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-600">
        <Lock className="h-4 w-4 shrink-0 text-stone-400" />
        After payment you get the full PDF-style report for your selected area — not a demo preview.
      </div>
    </div>
  );
}
