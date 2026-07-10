"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, BarChart3, CheckCircle2, Loader2 } from "lucide-react";
import type { ReportTier } from "@/lib/report-demo-data";

type ReadinessResponse = {
  ready: boolean;
  tier: ReportTier;
  message: string;
  gaps: string[];
  stats: {
    totalPins: number;
    verifiedPins: number;
    categoryCount: number;
    confidence: number;
    radiusM: number;
  };
  requirements: {
    label: string;
    minTotalPins: number;
    minVerifiedPins: number;
    minCategories: number;
    minConfidence: number;
  };
};

export function ReportDataReadinessBanner({
  productId,
  tier,
  lat,
  lng,
  className = "",
}: {
  productId?: string;
  tier?: ReportTier;
  lat: number | null;
  lng: number | null;
  className?: string;
}) {
  const [data, setData] = useState<ReadinessResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat == null || lng == null) {
      setData(null);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
    });
    if (productId) params.set("productId", productId);
    else if (tier) params.set("tier", tier);

    fetch(`/api/reports/data-readiness?${params}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [productId, tier, lat, lng]);

  if (lat == null || lng == null) return null;

  if (loading) {
    return (
      <div
        className={`flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking community data for this area…
      </div>
    );
  }

  if (!data || data.ready === undefined) return null;

  if (data.ready) {
    return (
      <div
        className={`rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900 ${className}`}
      >
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Enough data for this {data.requirements.label.toLowerCase()}</p>
            <p className="mt-1 text-xs text-emerald-800">
              {data.stats.totalPins} community pins · {data.stats.verifiedPins} verified ·{" "}
              {data.stats.categoryCount} categories within ~{data.stats.radiusM}m
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className}`}
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Not enough data to buy this report yet</p>
          <p className="mt-1 text-amber-900">{data.message}</p>
          <ul className="mt-2 space-y-1 text-xs text-amber-900/90">
            {data.gaps.map((gap) => (
              <li key={gap} className="flex items-center gap-1.5">
                <BarChart3 className="h-3 w-3 shrink-0" />
                {gap}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-amber-800">
            Help build data: report issues or confirm pins on the{" "}
            <Link href="/" className="font-semibold underline">
              map
            </Link>{" "}
            near this location, then check back.
          </p>
        </div>
      </div>
    </div>
  );
}
