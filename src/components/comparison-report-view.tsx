"use client";

import { useCallback, useRef, useState } from "react";
import { CheckCircle2, Download, Loader2, MapPin, Printer, Sparkles, Trophy } from "lucide-react";
import type { ComparisonReportData } from "@/lib/report-demo-data";
import { REPORT_PRICING } from "@/lib/report-demo-data";
import { formatPriceForMarket } from "@/components/report-price";
import { usePricingRegion } from "@/hooks/use-pricing-region";
import { downloadElementAsPdf, printReportAsPdf, reportPdfFilename } from "@/lib/download-report-pdf";
import { cn, scoreColor } from "@/lib/utils";

export function ComparisonReportView({
  report,
  variant = "paid",
}: {
  report: ComparisonReportData;
  variant?: "paid" | "sample";
}) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const areaCoords = { lat: report.areaA.lat, lng: report.areaA.lng };
  const { market } = usePricingRegion(areaCoords);
  const localizedPrice = formatPriceForMarket("area-comparison", market);
  const tierLabel = REPORT_PRICING.small.label;
  const pdfFilename = reportPdfFilename("area-comparison", `${report.areaA.name}-vs-${report.areaB.name}`);

  const handleDownloadPdf = useCallback(async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    try {
      await downloadElementAsPdf(reportRef.current, pdfFilename);
    } catch {
      printReportAsPdf(reportRef.current);
    } finally {
      setDownloading(false);
    }
  }, [downloading, pdfFilename]);

  const dateLabel = new Date(report.generatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex justify-end gap-2 no-print">
        <button
          type="button"
          onClick={() => reportRef.current && printReportAsPdf(reportRef.current)}
          className="flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-semibold text-orange-700"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download PDF
        </button>
      </div>

      <div ref={reportRef} data-pdf-root className="overflow-visible rounded-3xl border border-orange-100 bg-white shadow-xl">
        {variant === "sample" ? (
          <div className="flex flex-wrap justify-between gap-2 border-b border-amber-100 bg-amber-50 px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <Sparkles className="h-4 w-4" />
              Sample comparison — illustrative preview only
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-between gap-2 border-b border-emerald-100 bg-emerald-50 px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              Payment successful — comparison unlocked
            </div>
            <div className="text-xs text-emerald-700">
              {localizedPrice.formatted} · {tierLabel}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-orange-600 to-amber-500 px-6 py-8 text-white sm:px-10" data-pdf-cover="true">
          <p className="text-sm text-orange-100">CivicLens Intelligence</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{report.productName}</h1>
          <p className="mt-2 text-orange-50">&ldquo;{report.customerQuestion}&rdquo;</p>
          <p className="mt-4 text-xs text-orange-100">Order {report.orderRef} · {dateLabel}</p>
        </div>

        <div className="space-y-8 p-6 sm:p-10">
          <div className="grid grid-cols-2 gap-4">
            <AreaCard name={report.areaA.name} score={report.areaA.score} highlight={report.winner === "a"} />
            <AreaCard name={report.areaB.name} score={report.areaB.score} highlight={report.winner === "b"} />
          </div>

          <section>
            <h2 className="text-lg font-bold text-stone-900">Side-by-side comparison</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-orange-100">
              <div className="grid grid-cols-[1fr_auto_auto] gap-2 bg-orange-50 px-4 py-2 text-xs font-semibold text-stone-500">
                <span>Dimension</span>
                <span className="w-14 text-center">{report.areaA.name.split(" ")[0]}</span>
                <span className="w-14 text-center">{report.areaB.name.split(" ")[0]}</span>
              </div>
              {report.dimensions.map((d, i) => (
                <div
                  key={d.name}
                  className={cn(
                    "grid grid-cols-[1fr_auto_auto] items-center gap-2 px-4 py-3",
                    i > 0 && "border-t border-orange-50"
                  )}
                >
                  <span className="text-sm font-medium text-stone-700">
                    {d.emoji} {d.name}
                  </span>
                  <span className={cn("w-14 text-center text-lg font-bold", scoreColor(d.scoreA))}>{d.scoreA}</span>
                  <span className={cn("w-14 text-center text-lg font-bold", scoreColor(d.scoreB))}>{d.scoreB}</span>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-t-2 border-orange-200 bg-orange-50/80 px-4 py-3 font-bold">
                <span>Overall score</span>
                <span className={cn("w-14 text-center text-xl", scoreColor(report.areaA.score))}>{report.areaA.score}</span>
                <span className={cn("w-14 text-center text-xl", scoreColor(report.areaB.score))}>{report.areaB.score}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <Trophy className="h-5 w-5" />
              AI winner: {report.winnerName}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-stone-700">
              {report.aiReasons.map((r) => (
                <li key={r}>✓ {r}</li>
              ))}
            </ul>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <WeaknessBox title={`${report.areaA.name} weaknesses`} items={report.aiWeaknessesA} />
            <WeaknessBox title={`${report.areaB.name} weaknesses`} items={report.aiWeaknessesB} />
          </div>

          <section>
            <h2 className="text-lg font-bold text-stone-900">Best for…</h2>
            <div className="mt-3 space-y-2">
              {report.bestFor.map((b) => (
                <div key={b.audience} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-4 py-3 text-sm">
                  <span className="font-medium text-stone-700">{b.audience}</span>
                  <span className="font-semibold text-orange-700">
                    {b.pick === "a" ? report.areaA.name : report.areaB.name}
                  </span>
                  <span className="w-full text-xs text-stone-500">{b.reason}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center gap-2 font-semibold text-stone-900">
              <Sparkles className="h-5 w-5 text-orange-600" />
              CivicLens AI summary
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">{report.aiSummary}</p>
          </section>

          <p className="text-xs text-stone-400">{report.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}

function AreaCard({ name, score, highlight }: { name: string; score: number; highlight: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 text-center",
        highlight ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200" : "border-stone-200 bg-stone-50"
      )}
    >
      <MapPin className="mx-auto h-5 w-5 text-orange-500" />
      <p className="mt-2 font-bold text-stone-900">{name}</p>
      <p className={cn("mt-1 text-3xl font-bold", scoreColor(score))}>{score}</p>
      {highlight && <p className="mt-1 text-xs font-semibold text-emerald-700">Winner</p>}
    </div>
  );
}

function WeaknessBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
      <p className="text-sm font-semibold text-amber-900">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-stone-600">
        {items.map((i) => (
          <li key={i}>· {i}</li>
        ))}
      </ul>
    </div>
  );
}
