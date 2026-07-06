"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Download,
  MapPin,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { IntelligenceReportData } from "@/lib/report-demo-data";
import { REPORT_DEMO_PRICES } from "@/lib/report-demo-data";
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

export function IntelligenceReportView({
  report,
  isDemo = true,
}: {
  report: IntelligenceReportData;
  isDemo?: boolean;
}) {
  const price = REPORT_DEMO_PRICES[report.productId];
  const maxReported = Math.max(...report.trends.map((t) => t.reported), 1);
  const dateLabel = new Date(report.generatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const verdictStyles = {
    positive: "border-emerald-200 bg-emerald-50 text-emerald-900",
    neutral: "border-orange-200 bg-orange-50 text-stone-800",
    caution: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Document shell */}
      <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl shadow-orange-100/40">
        {/* Cover header */}
        <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 px-6 py-8 text-white sm:px-10 sm:py-10">
          {isDemo && (
            <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur">
              Sample Demo
            </span>
          )}
          <div className="flex items-start gap-4">
            <span className="text-4xl sm:text-5xl">{report.emoji}</span>
            <div>
              <p className="text-sm font-medium text-orange-100">CivicLens Intelligence</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{report.productName}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-orange-50">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {report.areaName}
                </span>
                <span>·</span>
                <span>{report.radiusM}m radius</span>
                <span>·</span>
                <span>{dateLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-10">
          {/* Hero score */}
          <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Community Health Score
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className={cn("text-5xl font-bold sm:text-6xl", scoreColor(report.overallScore))}>
                  {report.overallScore}
                </span>
                <span className="mb-2 text-lg text-stone-400">/ 100</span>
              </div>
              <div className="mt-3 h-3 w-full max-w-xs overflow-hidden rounded-full bg-orange-100">
                <div
                  className={cn("h-full rounded-full transition-all", scoreBg(report.overallScore))}
                  style={{ width: `${report.overallScore}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 text-center">
                <p className="text-2xl font-bold text-stone-900">{report.incidentCount}</p>
                <p className="text-xs text-stone-500">Verified signals</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 text-center">
                <p className="text-2xl font-bold text-stone-900">{Math.round(report.confidence * 100)}%</p>
                <p className="text-xs text-stone-500">Confidence</p>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-white p-3 text-sm">
                {report.trendDirection === "improving" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : report.trendDirection === "declining" ? (
                  <TrendingDown className="h-4 w-4 text-rose-600" />
                ) : (
                  <BarChart3 className="h-4 w-4 text-stone-400" />
                )}
                <span className="capitalize text-stone-600">{report.trendDirection} over 30 days</span>
                <span className="text-stone-300">·</span>
                <span className="capitalize text-stone-500">{report.engagementLevel} engagement</span>
              </div>
            </div>
          </section>

          {/* Category breakdown */}
          <section>
            <h2 className="text-lg font-bold text-stone-900">Category Performance</h2>
            <div className="mt-4 space-y-3">
              {report.categoryScores.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="w-6 text-center text-lg">{cat.emoji}</span>
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-stone-700">{cat.name}</span>
                      <span className={cn("font-bold", scoreColor(cat.score))}>{cat.score}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className={cn("h-full rounded-full", scoreBg(cat.score))}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </div>
                  {cat.trend === "up" && <TrendingUp className="h-4 w-4 shrink-0 text-emerald-500" />}
                  {cat.trend === "down" && <TrendingDown className="h-4 w-4 shrink-0 text-rose-500" />}
                </div>
              ))}
            </div>
          </section>

          {/* Issues & improvements */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <h2 className="text-lg font-bold text-stone-900">Top Issues</h2>
              <ul className="mt-3 space-y-2">
                {report.topIssues.map((issue) => (
                  <li
                    key={issue.title}
                    className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50/30 p-3"
                  >
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
              <h2 className="text-lg font-bold text-stone-900">Top Improvements</h2>
              <ul className="mt-3 space-y-2">
                {report.topImprovements.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/30 p-3"
                  >
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

          {/* Trend chart */}
          <section>
            <h2 className="text-lg font-bold text-stone-900">30-Day Activity</h2>
            <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/30 p-4">
              <div className="flex min-h-[120px] items-end gap-2">
                {report.trends.map((t) => (
                  <div key={t.label} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-24 w-full items-end justify-center gap-0.5">
                      <div
                        className="w-full max-w-[14px] rounded-t bg-rose-400"
                        style={{ height: `${(t.reported / maxReported) * 100}%` }}
                      />
                      <div
                        className="w-full max-w-[14px] rounded-t bg-indigo-400"
                        style={{ height: `${(t.resolved / maxReported) * 100}%` }}
                      />
                      <div
                        className="w-full max-w-[14px] rounded-t bg-emerald-400"
                        style={{ height: `${(t.positive / maxReported) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-400">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-rose-400" /> Reported
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-indigo-400" /> Resolved
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-emerald-400" /> Positive
                </span>
              </div>
            </div>
          </section>

          {/* Product-specific extras */}
          {report.extraSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold text-stone-900">{section.title}</h2>
              <div className="mt-3 overflow-hidden rounded-2xl border border-orange-100">
                {section.items.map((item, i) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center justify-between gap-4 px-4 py-3",
                      i > 0 && "border-t border-orange-50"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-stone-800">{item.label}</p>
                      {item.hint && <p className="text-xs text-stone-400">{item.hint}</p>}
                    </div>
                    <p className="text-right text-sm font-semibold text-orange-700">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* AI verdict */}
          <section className={cn("rounded-2xl border p-5", verdictStyles[report.aiVerdictTone])}>
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5" />
              CivicLens AI Summary
            </div>
            <p className="mt-3 text-sm leading-relaxed">{report.aiVerdict}</p>
          </section>

          {/* Disclaimer */}
          <section className="flex gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-stone-400" />
            <p className="text-xs leading-relaxed text-stone-500">{report.disclaimer}</p>
          </section>

          {/* CTA footer */}
          {isDemo && (
            <div className="flex flex-col items-center gap-3 border-t border-orange-100 pt-6 sm:flex-row sm:justify-between">
              <div>
                <p className="text-sm text-stone-500">Full report for any location worldwide</p>
                <p className="text-lg font-bold text-stone-900">
                  from ₹{price.inr}{" "}
                  <span className="text-sm font-normal text-stone-400">(${price.usd} USD)</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-medium text-orange-700 opacity-60"
                >
                  <Download className="h-4 w-4" />
                  PDF export soon
                </button>
                <Link
                  href="/login"
                  className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  Get early access
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
