import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { PAID_REPORTS } from "@/lib/categories";
import { getReportPrice, REPORT_PRICING } from "@/lib/report-demo-data";

export default function ReportDemosIndexPage() {
  const small = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "small");
  const big = PAID_REPORTS.filter((r) => getReportPrice(r.id).tier === "big");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <h1 className="text-2xl font-bold text-stone-900">Full report previews</h1>
      <p className="mt-1 text-stone-600">
        Every demo shows the <strong>complete report</strong> you receive after payment — nothing hidden or
        blurred.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm">
          <span className="font-bold text-orange-800">India:</span> ₹{REPORT_PRICING.small.inr} standard · ₹
          {REPORT_PRICING.big.inr} detailed
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm">
          <span className="font-bold text-orange-800">International:</span> ${REPORT_PRICING.small.usd} · $
          {REPORT_PRICING.big.usd}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900">
          Standard — ₹{REPORT_PRICING.small.inr} / ${REPORT_PRICING.small.usd}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {small.map((report) => (
            <DemoCard key={report.id} id={report.id} name={report.name} emoji={report.emoji} audience={report.audience} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900">
          Detailed — ₹{REPORT_PRICING.big.inr} / ${REPORT_PRICING.big.usd}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          More comparisons, heatmap zones, plain-language Q&A, and longer issue lists.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {big.map((report) => (
            <DemoCard key={report.id} id={report.id} name={report.name} emoji={report.emoji} audience={report.audience} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DemoCard({
  id,
  name,
  emoji,
  audience,
}: {
  id: string;
  name: string;
  emoji: string;
  audience: string;
}) {
  const price = getReportPrice(id as Parameters<typeof getReportPrice>[0]);
  return (
    <Link
      href={`/reports/demo/${id}`}
      className="group flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h3 className="font-bold text-stone-900 group-hover:text-orange-700">{name}</h3>
          <p className="text-xs text-orange-600">{audience}</p>
          <p className="mt-1 text-sm font-semibold text-stone-700">
            ₹{price.inr} · ${price.usd}
          </p>
        </div>
      </div>
      <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600">
        <Eye className="h-4 w-4" />
        See full report
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
