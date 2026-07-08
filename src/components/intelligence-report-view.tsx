"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  MapPin,
  Printer,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { IntelligenceReportData } from "@/lib/report-demo-data";
import { REPORT_PRICING } from "@/lib/report-demo-data";
import { ReportRichSections } from "@/components/report-rich-sections";
import {
  AdvancedPresetBadge,
  BusinessLensSection,
  PropertyLensSection,
  ReportAnalysisBlocks,
  ReportTrendWindows,
  VisitorBriefSection,
} from "@/components/report-lens-sections";
import { formatPriceForMarket } from "@/components/report-price";
import { usePricingRegion } from "@/hooks/use-pricing-region";
import { downloadElementAsPdf, printReportAsPdf, reportPdfFilename } from "@/lib/download-report-pdf";
import { cn, scoreBg, scoreColor } from "@/lib/utils";

function SeverityBadge({ severity }: { severity: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-rose-100 text-rose-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", styles[severity])}>
      {severity}
    </span>
  );
}

function HeatLevel({ level }: { level: "high" | "medium" | "low" }) {
  const styles = { high: "bg-rose-500", medium: "bg-amber-400", low: "bg-emerald-500" };
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", styles[level])} />;
}

export function IntelligenceReportView({
  report,
  variant = "paid",
}: {
  report: IntelligenceReportData;
  variant?: "paid" | "sample";
}) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const maxReported = Math.max(...report.trends.map((t) => t.reported), 1);
  const dateLabel = new Date(report.generatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const tierLabel = report.tier === "big" ? REPORT_PRICING.big.label : REPORT_PRICING.small.label;
  const areaCoords = { lat: report.areaLat, lng: report.areaLng };
  const { market } = usePricingRegion(areaCoords);
  const localizedPrice = formatPriceForMarket(report.productId, market);
  const pdfFilename = reportPdfFilename(report.productId, report.areaName);

  const handleDownloadPdf = useCallback(async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    setDownloadError("");
    try {
      await downloadElementAsPdf(reportRef.current, pdfFilename);
    } catch {
      try {
        printReportAsPdf(reportRef.current);
        setDownloadError('Print dialog opened — choose "Save as PDF".');
      } catch {
        setDownloadError('Use "Print / Save as PDF" instead.');
      }
    } finally {
      setDownloading(false);
    }
  }, [downloading, pdfFilename]);

  const verdictStyles = {
    positive: "border-emerald-200 bg-emerald-50 text-emerald-900",
    neutral: "border-orange-200 bg-orange-50 text-stone-800",
    caution: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap justify-end gap-2 no-print">
        <button
          type="button"
          onClick={() => reportRef.current && printReportAsPdf(reportRef.current)}
          className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-50"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-orange-700 disabled:opacity-60"
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {downloading ? "Generating PDF…" : "Download PDF"}
        </button>
      </div>
      {downloadError && (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{downloadError}</p>
      )}

      <div
        ref={reportRef}
        data-pdf-root
        className="overflow-visible rounded-3xl border border-orange-100 bg-white shadow-xl shadow-orange-100/40"
      >
        {variant === "sample" ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 bg-amber-50 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <Sparkles className="h-4 w-4" />
            Sample report — illustrative preview only
          </div>
          <div className="text-xs text-amber-800">
            Purchase to get this report for your chosen location
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 bg-emerald-50 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            Payment successful — full report unlocked
          </div>
          <div className="text-xs text-emerald-700">
            {localizedPrice.formatted} · {tierLabel}
          </div>
        </div>
      )}

        <div
          className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 px-6 py-8 text-white sm:px-10 sm:py-10"
          data-pdf-cover="true"
        >
          <div className="absolute right-4 top-4 text-right text-xs text-orange-100">
            <p>Order {report.orderRef}</p>
            <p className="mt-0.5 opacity-80">{dateLabel}</p>
          </div>
          <div className="flex items-start gap-4 pr-24">
            <span className="text-4xl sm:text-5xl">{report.emoji}</span>
            <div>
              <p className="text-sm font-medium text-orange-100">CivicLens Intelligence</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{report.productName}</h1>
              <p className="mt-2 text-sm italic text-orange-50">&ldquo;{report.customerQuestion}&rdquo;</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-orange-50">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {report.areaName}
                </span>
                <span>·</span>
                <span>{report.radiusM}m radius</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-10">
          {report.advancedPreset && <AdvancedPresetBadge preset={report.advancedPreset} />}

          {/* Executive summary */}
          <section className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5">
            <h2 className="text-lg font-bold text-stone-900">Executive summary</h2>
            <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">CivicLens Score</p>
                <div className="mt-1 flex items-end gap-2">
                  <span className={cn("text-5xl font-bold", scoreColor(report.overallScore))}>{report.overallScore}</span>
                  <span className="mb-2 text-lg text-stone-400">/ 100</span>
                </div>
                <div className="mt-2 h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-orange-100">
                  <div className={cn("h-full rounded-full", scoreBg(report.overallScore))} style={{ width: `${report.overallScore}%` }} />
                </div>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-2 text-center text-sm">
                <div className="rounded-xl bg-white p-3 ring-1 ring-orange-100">
                  <p className="font-bold text-stone-900">{report.incidentCount}</p>
                  <p className="text-xs text-stone-500">Verified signals</p>
                </div>
                <div className="rounded-xl bg-white p-3 ring-1 ring-orange-100">
                  <p className="font-bold text-stone-900">{Math.round(report.confidence * 100)}%</p>
                  <p className="text-xs text-stone-500">Confidence</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-700">{report.executiveSummary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {report.verdictBadges.map((b) => (
                <span
                  key={b.text}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    b.type === "positive" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  )}
                >
                  {b.type === "positive" ? "✔" : "⚠"} {b.text}
                </span>
              ))}
            </div>
          </section>

          <ReportAnalysisBlocks blocks={report.analysisBlocks} />
          <ReportTrendWindows windows={report.trendWindows} />

          {report.visitorBrief && <VisitorBriefSection brief={report.visitorBrief} />}
          {report.propertyLens && <PropertyLensSection lens={report.propertyLens} />}
          {report.businessLens && <BusinessLensSection lens={report.businessLens} />}
          {report.richContent && <ReportRichSections rich={report.richContent} />}

          {/* AI nine questions */}
          <section>
            <h2 className="text-lg font-bold text-stone-900">AI analysis — your 9 questions answered</h2>
            <p className="mt-1 text-sm text-stone-500">Interpretation is the product — not raw data.</p>
            <div className="mt-4 space-y-3">
              {report.aiNineQuestions.map((item) => (
                <div key={item.question} className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                  <p className="text-sm font-semibold text-stone-800">{item.question}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Issues & heatmap */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <h2 className="text-lg font-bold text-stone-900">Top issues</h2>
              <ul className="mt-3 space-y-2">
                {report.topIssues.map((issue) => (
                  <li key={issue.title} className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50/30 p-3">
                    <span className="text-lg">{issue.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-800">{issue.title}</p>
                      <p className="text-xs text-stone-500">{issue.confirmations} confirmations</p>
                    </div>
                    <SeverityBadge severity={issue.severity} />
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-stone-900">Top improvements</h2>
              <ul className="mt-3 space-y-2">
                {report.topImprovements.map((item) => (
                  <li key={item.title} className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/30 p-3">
                    <span className="text-lg">{item.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-800">{item.title}</p>
                      <p className="text-xs text-stone-500">{item.confirmations} confirmations</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section>
            <h2 className="text-lg font-bold text-stone-900">Issue heatmap by zone</h2>
            <div className="mt-3 space-y-2">
              {report.heatmapZones.map((z) => (
                <div key={z.zone} className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50/50 px-4 py-3">
                  <HeatLevel level={z.level} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-800">{z.zone}</p>
                    <p className="text-xs text-stone-500">{z.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900">Weekly activity</h2>
            <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/30 p-4">
              <div className="flex min-h-[100px] items-end gap-2">
                {report.trends.map((t) => (
                  <div key={t.label} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-20 w-full items-end justify-center gap-0.5">
                      <div className="w-full max-w-[12px] rounded-t bg-rose-400" style={{ height: `${(t.reported / maxReported) * 100}%` }} />
                      <div className="w-full max-w-[12px] rounded-t bg-indigo-400" style={{ height: `${(t.resolved / maxReported) * 100}%` }} />
                      <div className="w-full max-w-[12px] rounded-t bg-emerald-400" style={{ height: `${(t.positive / maxReported) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-stone-400">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-stone-500">
                {report.trendDirection === "improving" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-rose-600" />
                )}
                <span className="capitalize">{report.trendDirection} · {report.engagementLevel} engagement</span>
              </div>
            </div>
          </section>

          <section className={cn("rounded-2xl border p-5", verdictStyles[report.aiVerdictTone])}>
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5" />
              AI verdict
            </div>
            <p className="mt-3 text-sm leading-relaxed">{report.aiVerdict}</p>
          </section>

          <section className="flex gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-stone-400" />
            <p className="text-xs leading-relaxed text-stone-500">{report.disclaimer}</p>
          </section>

          <div className="flex flex-col items-center gap-3 border-t border-orange-100 pt-6 sm:flex-row sm:justify-between no-print">
            <div>
              <p className="text-sm font-medium text-stone-700">You paid {localizedPrice.formatted}</p>
              <p className="text-xs text-stone-400">Download or print this report</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => reportRef.current && printReportAsPdf(reportRef.current)} className="rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-medium text-orange-700">
                Print
              </button>
              <button type="button" onClick={handleDownloadPdf} disabled={downloading} className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {downloading ? "Generating…" : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-stone-400">
        Demo uses sample Mumbai data. After purchase, your report uses your chosen location and live verified data.
      </p>
    </div>
  );
}
