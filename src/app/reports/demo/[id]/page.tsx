"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { IntelligenceReportView } from "@/components/intelligence-report-view";
import { GLOBAL_SAMPLE_PLACES } from "@/lib/constants";
import {
  buildDemoReport,
  getReportProduct,
  mergeLiveHealth,
  type IntelligenceReportData,
  type ReportProductId,
} from "@/lib/report-demo-data";

const MUMBAI = GLOBAL_SAMPLE_PLACES[2];

export default function ReportDemoPage() {
  const params = useParams();
  const id = params.id as string;
  const product = getReportProduct(id);
  const [report, setReport] = useState<IntelligenceReportData | null>(null);
  const [liveMerged, setLiveMerged] = useState(false);

  useEffect(() => {
    if (!product) return;

    const demo = buildDemoReport(id as ReportProductId);
    setReport(demo);
    setLiveMerged(false);

    if (id === "area-intelligence" || id === "real-estate" || id === "business-location") {
      fetch(`/api/health?lat=${MUMBAI.lat}&lng=${MUMBAI.lng}`)
        .then((r) => r.json())
        .then((health) => {
          setReport((prev) => (prev ? mergeLiveHealth(prev, health) : prev));
          if (health.incidentCount > 0) setLiveMerged(true);
        })
        .catch(() => {});
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-stone-600">Report type not found.</p>
        <Link href="/reports" className="mt-4 inline-block text-orange-600 hover:underline">
          Back to reports
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <div className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <Link
          href="/reports"
          className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          All reports
        </Link>
        <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700">
          <Eye className="h-3.5 w-3.5" />
          Interactive demo — sample data
          {liveMerged && " + live health score"}
        </div>
      </div>

      {report ? (
        <IntelligenceReportView report={report} isDemo />
      ) : (
        <div className="mx-auto flex h-64 max-w-3xl items-center justify-center rounded-3xl border border-orange-100 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
        </div>
      )}

      <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-stone-400">
        This is a preview of the paid report layout. Purchased reports will use your selected location
        and the latest verified community data at generation time.
      </p>
    </div>
  );
}
