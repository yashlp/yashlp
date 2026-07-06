import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  GitCompare,
  MapPin,
  MessageCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import { PAID_REPORTS } from "@/lib/categories";
import { GLOBAL_SAMPLE_PLACES } from "@/lib/constants";

const MUMBAI = GLOBAL_SAMPLE_PLACES[2];

const CORE_LINKS = [
  {
    href: "/",
    title: "World map",
    desc: "Pins, filters, health score — zoom to Mumbai for demo data",
    icon: MapPin,
    accent: "bg-orange-100 text-orange-700",
  },
  {
    href: "/report?type=positive&category=great-community-area",
    title: "Great Community Area pin",
    desc: "Report → Something good → 🏘️ 90-day area recognition (new)",
    icon: Sparkles,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    href: "/reports",
    title: "Report catalog",
    desc: "Location-based pricing — ₹29/₹59 or $2.9/$5.9",
    icon: FileText,
    accent: "bg-blue-100 text-blue-700",
  },
  {
    href: "/reports/demo",
    title: "Full report demos",
    desc: "Every paid report preview — AI verdict included",
    icon: FileText,
    accent: "bg-violet-100 text-violet-700",
  },
  {
    href: "/ask",
    title: "Ask AI",
    desc: "Natural-language questions about any place",
    icon: MessageCircle,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    href: "/insights",
    title: "Insights",
    desc: "Trends and community activity charts",
    icon: BarChart3,
    accent: "bg-rose-100 text-rose-700",
  },
  {
    href: "/compare",
    title: "Compare areas",
    desc: "Side-by-side neighbourhood comparison",
    icon: GitCompare,
    accent: "bg-cyan-100 text-cyan-700",
  },
  {
    href: "/login",
    title: "Sign in (demo)",
    desc: "Phone 919988776655 · OTP 123456",
    icon: Plus,
    accent: "bg-stone-100 text-stone-700",
  },
] as const;

export default function TryHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-10">
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Try everything</p>
        <h1 className="mt-1 text-2xl font-bold text-stone-900 sm:text-3xl">CivicLens demo hub</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600 sm:text-base">
          One page for the latest build — map, new Great Community Area pin, consumer reports, and AI
          demos. Demo data is seeded around{" "}
          <strong>
            {MUMBAI.name} ({MUMBAI.lat.toFixed(2)}, {MUMBAI.lng.toFixed(2)})
          </strong>
          .
        </p>
        <p className="mt-3 rounded-xl bg-white/80 px-4 py-3 text-sm text-stone-700 ring-1 ring-orange-100">
          <strong>Host:</strong> run <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">npm run dev</code>{" "}
          then open{" "}
          <Link href="/try" className="font-semibold text-orange-700 underline">
            /try
          </Link>{" "}
          on port <strong>3000</strong> (e.g.{" "}
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">http://localhost:3000/try</code>
          ).
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-stone-900">Core features</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CORE_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex gap-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:border-orange-300 hover:shadow-md"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.accent}`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-stone-900 group-hover:text-orange-700">{item.title}</p>
                <p className="mt-0.5 text-sm text-stone-500">{item.desc}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-stone-900">Report demos (direct links)</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PAID_REPORTS.map((report) => (
            <Link
              key={report.id}
              href={`/reports/demo/${report.id}`}
              className="flex items-center gap-3 rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm transition hover:border-orange-300 hover:bg-orange-50/50"
            >
              <span className="text-xl">{report.emoji}</span>
              <span className="font-medium text-stone-800">{report.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
        <h2 className="font-bold text-emerald-900">What&apos;s new in this build</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-emerald-900/90">
          <li>🏘️ Great Community Area — 90-day TTL, green map pin, no self-confirm</li>
          <li>Consumer report relaunch — Area Insight, Comparison, Property, Business, Advanced</li>
          <li>Location-based pricing — India vs international</li>
          <li>Report demo blank-page fix</li>
        </ul>
      </section>
    </div>
  );
}
