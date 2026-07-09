"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Lock } from "lucide-react";
import { IntelligenceReportView } from "@/components/intelligence-report-view";
import { ComparisonReportView } from "@/components/comparison-report-view";
import { ReportPrice } from "@/components/report-price";
import { GLOBAL_SAMPLE_PLACES } from "@/lib/constants";
import { parsePlaceFromSearchParams } from "@/lib/geocode";
import {
  buildComparisonDemoReport,
  buildDemoReport,
  getReportProduct,
  mergeLiveHealth,
  resolveReportProductId,
  type IntelligenceReportData,
  type ReportProductId,
} from "@/lib/report-demo-data";
import type { AdvancedPreset } from "@/lib/report-structure";
import { ADVANCED_PRESETS } from "@/lib/report-structure";

const MUMBAI = GLOBAL_SAMPLE_PLACES[2];
const VALID_PRESETS = new Set(ADVANCED_PRESETS.map((p) => p.id));
const SAMPLE_REPORT_ID: ReportProductId = "area-insight";

export function ReportExperience({ mode }: { mode: "sample" | "paid" }) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawId = params.id as string;
  const resolvedId = resolveReportProductId(rawId);
  const product = resolvedId ? getReportProduct(resolvedId) : undefined;
  const [report, setReport] = useState<IntelligenceReportData | null>(null);
  const [accessChecked, setAccessChecked] = useState(mode === "sample");

  const selectedPlace = useMemo(() => parsePlaceFromSearchParams(searchParams), [searchParams]);
  const areaCoords = selectedPlace
    ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
    : { lat: MUMBAI.lat, lng: MUMBAI.lng };
  const areaLabel = selectedPlace?.name ?? "Bandra West, Mumbai, India";

  const presetParam = searchParams.get("preset");
  const preset: AdvancedPreset | undefined =
    presetParam && VALID_PRESETS.has(presetParam as AdvancedPreset) ? (presetParam as AdvancedPreset) : undefined;

  const locationParams = useMemo(() => {
    if (!selectedPlace) return "";
    const p = new URLSearchParams({
      lat: String(selectedPlace.lat),
      lng: String(selectedPlace.lng),
      place: selectedPlace.name,
    });
    if (selectedPlace.countryCode) p.set("country", selectedPlace.countryCode);
    return p.toString();
  }, [selectedPlace]);

  const locationSuffix = locationParams ? `&${locationParams}` : "";
  const checkoutQuery = searchParams.toString() ? `?${searchParams.toString()}` : "";

  useEffect(() => {
    if (mode === "sample" && resolvedId && resolvedId !== SAMPLE_REPORT_ID) {
      router.replace(`/reports/sample/${SAMPLE_REPORT_ID}${checkoutQuery}`);
    }
  }, [mode, resolvedId, router, checkoutQuery]);

  useEffect(() => {
    if (mode !== "paid" || !resolvedId) return;

    const sessionId = searchParams.get("session_id");

    const verifyAccess = async () => {
      if (sessionId) {
        await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: "stripe", sessionId }),
        });
      }

      const res = await fetch(
        `/api/payments/access?productId=${encodeURIComponent(resolvedId)}&lat=${areaCoords.lat}&lng=${areaCoords.lng}`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (!data.authenticated) {
        router.replace(`/login?next=${encodeURIComponent(`/reports/checkout/${resolvedId}${checkoutQuery}`)}`);
        return;
      }

      if (!data.paid) {
        router.replace(`/reports/checkout/${resolvedId}${checkoutQuery}`);
        return;
      }

      setAccessChecked(true);
    };

    verifyAccess();
  }, [mode, resolvedId, areaCoords.lat, areaCoords.lng, router, checkoutQuery, searchParams]);

  useEffect(() => {
    if (!resolvedId || resolvedId === "area-comparison") return;
    if (mode === "paid" && !accessChecked) return;

    const demo = buildDemoReport(resolvedId, {
      preset: preset ?? (resolvedId === "advanced-report" ? "family" : undefined),
    });
    setReport(selectedPlace ? { ...demo, areaName: areaLabel } : demo);

    fetch(`/api/health?lat=${areaCoords.lat}&lng=${areaCoords.lng}`)
      .then((r) => r.json())
      .then((health) => {
        setReport((prev) => (prev ? mergeLiveHealth(prev, health) : prev));
      })
      .catch(() => {});
  }, [resolvedId, preset, areaCoords.lat, areaCoords.lng, areaLabel, selectedPlace, mode, accessChecked]);

  if (!product && rawId !== "area-comparison") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-stone-600">Report type not found.</p>
        <Link href="/reports" className="mt-4 inline-block text-orange-600 hover:underline">
          Back to reports
        </Link>
      </div>
    );
  }

  if (mode === "paid" && !accessChecked) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
      </div>
    );
  }

  if (resolvedId === "area-comparison") {
    const comparison = buildComparisonDemoReport();
    return (
      <div className="px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
        <div className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <Link href="/reports" className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-orange-600">
            <ArrowLeft className="h-4 w-4" />
            All reports
          </Link>
          {mode === "paid" ? (
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
              <FileText className="h-3.5 w-3.5" />
              Your report · <ReportPrice productId="area-comparison" areaCoords={areaCoords} className="font-bold" />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900">
              Sample comparison preview
            </div>
          )}
        </div>
        <ComparisonReportView report={comparison} variant={mode} />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <div className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <Link href="/reports" className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-orange-600">
          <ArrowLeft className="h-4 w-4" />
          All reports
        </Link>
        <div className="flex flex-col items-end gap-1">
          {mode === "paid" ? (
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
              <FileText className="h-3.5 w-3.5" />
              Your report ·{" "}
              <ReportPrice productId={resolvedId as ReportProductId} areaCoords={areaCoords} className="font-bold" />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900">
              Sample preview — Mumbai demo data
            </div>
          )}
          {selectedPlace && mode === "paid" && (
            <p className="text-xs text-stone-500">Location: {areaLabel}</p>
          )}
        </div>
      </div>

      {mode === "sample" && (
        <div className="mx-auto mb-6 max-w-3xl rounded-2xl border border-orange-200 bg-orange-50/80 p-4 text-sm text-stone-700">
          This is a <strong>sample report</strong> so you can see layout and depth. To get a report for your area, go back and{" "}
          <Link href={`/reports/checkout/${SAMPLE_REPORT_ID}${checkoutQuery}`} className="font-semibold text-orange-700 underline">
            purchase Area Insight
          </Link>
          .
        </div>
      )}

      {resolvedId === "advanced-report" && mode === "paid" && (
        <div className="mx-auto mb-6 flex max-w-3xl flex-wrap gap-2">
          {ADVANCED_PRESETS.map((p) => (
            <Link
              key={p.id}
              href={`/reports/view/advanced-report?preset=${p.id}${locationSuffix}`}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                (preset ?? "family") === p.id
                  ? "border-violet-400 bg-violet-50 text-violet-900"
                  : "border-stone-200 bg-white text-stone-600 hover:border-violet-200"
              }`}
            >
              {p.emoji} {p.label}
            </Link>
          ))}
        </div>
      )}

      {report ? (
        <IntelligenceReportView report={report} variant={mode} />
      ) : (
        <div className="mx-auto flex h-64 max-w-3xl items-center justify-center rounded-3xl border border-orange-100 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
        </div>
      )}

      {mode === "sample" && (
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <Link
            href={`/reports/checkout/${SAMPLE_REPORT_ID}${checkoutQuery}`}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
          >
            <Lock className="h-4 w-4" />
            Buy this report for your location
          </Link>
        </div>
      )}
    </div>
  );
}
