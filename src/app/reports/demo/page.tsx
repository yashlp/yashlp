import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { PAID_REPORTS } from "@/lib/categories";
import { REPORT_DEMO_PRICES } from "@/lib/report-demo-data";

export default function ReportDemosIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <h1 className="text-2xl font-bold text-stone-900">Report demos</h1>
      <p className="mt-1 text-stone-600">
        Preview what each premium intelligence report looks like before purchase.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PAID_REPORTS.map((report) => {
          const price = REPORT_DEMO_PRICES[report.id];
          return (
            <Link
              key={report.id}
              href={`/reports/demo/${report.id}`}
              className="group flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{report.emoji}</span>
                <div>
                  <h2 className="font-bold text-stone-900 group-hover:text-orange-700">{report.name}</h2>
                  <p className="text-xs text-orange-600">{report.audience}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-500">
                from ₹{price.inr} · ${price.usd} USD
              </p>
              <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600">
                <Eye className="h-4 w-4" />
                View demo
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
