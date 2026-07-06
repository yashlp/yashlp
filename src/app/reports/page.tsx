"use client";

import Link from "next/link";
import { ArrowRight, Check, Eye, Lock } from "lucide-react";
import { FREE_FEATURES, PAID_REPORTS } from "@/lib/categories";
import { getReportPrice, REPORT_PRICING } from "@/lib/report-demo-data";

export default function ReportsPage() {
  const smallReports = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "small");
  const bigReports = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "big");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:p-8">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          CivicLens <span className="text-orange-600">Intelligence Reports</span>
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Affordable area intelligence for everyone. See the <strong>full report</strong> before you buy —
          no blurred sections.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="rounded-xl bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-orange-100">
            🇮🇳 <strong>₹{REPORT_PRICING.small.inr}</strong> standard · <strong>₹{REPORT_PRICING.big.inr}</strong>{" "}
            detailed
          </div>
          <div className="rounded-xl bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-orange-100">
            🌍 <strong>${REPORT_PRICING.small.usd}</strong> standard · <strong>${REPORT_PRICING.big.usd}</strong>{" "}
            detailed
          </div>
        </div>
        <Link
          href="/reports/demo/area-intelligence"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:bg-orange-700"
        >
          <Eye className="h-4 w-4" />
          See full ₹{REPORT_PRICING.small.inr} report demo
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
            <div
              key={f}
              className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50/50 px-4 py-3 text-sm text-stone-700"
            >
              <Check className="h-4 w-4 shrink-0 text-green-600" />
              {f}
            </div>
          ))}
        </div>
      </section>

      <ReportTierSection
        title={`Standard Reports — ₹${REPORT_PRICING.small.inr} / $${REPORT_PRICING.small.usd}`}
        subtitle="Area snapshot with health score, top issues, trends, and AI summary."
        reports={smallReports}
      />

      <ReportTierSection
        title={`Detailed Reports — ₹${REPORT_PRICING.big.inr} / $${REPORT_PRICING.big.usd}`}
        subtitle="Everything in standard, plus comparisons, heatmap zones, plain-language Q&A, and deeper analysis."
        reports={bigReports}
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
}: {
  title: string;
  subtitle: string;
  reports: (typeof PAID_REPORTS)[number][];
}) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
        <Lock className="h-5 w-5 text-orange-600" />
        {title}
      </h2>
      <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {reports.map((report) => {
          const price = getReportPrice(report.id);
          return (
            <div
              key={report.id}
              className="flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{report.emoji}</span>
                <div>
                  <h3 className="font-bold text-stone-900">{report.name}</h3>
                  <p className="text-xs text-orange-600">{report.audience}</p>
                  <p className="mt-1 text-sm font-semibold text-stone-800">
                    ₹{price.inr} · ${price.usd}
                  </p>
                </div>
              </div>
              <ul className="mt-4 flex-1 space-y-1.5">
                {report.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/reports/demo/${report.id}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
              >
                <Eye className="h-4 w-4" />
                See full report
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
