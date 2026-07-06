"use client";

import Link from "next/link";
import { ArrowRight, Check, Eye, Lock } from "lucide-react";
import { FREE_FEATURES, PAID_REPORTS } from "@/lib/categories";
import { REPORT_DEMO_PRICES } from "@/lib/report-demo-data";

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:p-8">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          CivicLens <span className="text-orange-600">Intelligence Reports</span>
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Deep analytics and professional reports powered by community-verified data worldwide.
        </p>
        <Link
          href="/reports/demo/area-intelligence"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:bg-orange-700"
        >
          <Eye className="h-4 w-4" />
          View sample report demo
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

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
            <Lock className="h-5 w-5 text-orange-600" />
            Premium Intelligence
          </h2>
          <Link href="/reports/demo" className="text-sm font-medium text-orange-600 hover:underline">
            Browse all demos →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {PAID_REPORTS.map((report) => {
            const price = REPORT_DEMO_PRICES[report.id];
            return (
              <div
                key={report.id}
                className="flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:shadow-orange-50"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{report.emoji}</span>
                  <div>
                    <h3 className="font-bold text-stone-900">{report.name}</h3>
                    <p className="text-xs text-orange-600">{report.audience}</p>
                    <p className="mt-1 text-xs text-stone-400">
                      from ₹{price.inr} · ${price.usd}
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
                  {report.features.length > 5 && (
                    <li className="text-xs text-stone-400">+{report.features.length - 5} more</li>
                  )}
                </ul>
                <Link
                  href={`/reports/demo/${report.id}`}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  <Eye className="h-4 w-4" />
                  View demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-stone-500">
        Interested in early access?{" "}
        <Link href="/login" className="font-medium text-orange-600 hover:underline">
          Sign in
        </Link>{" "}
        and contact us at enterprise@civiclens.app
      </p>
    </div>
  );
}
