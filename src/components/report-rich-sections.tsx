"use client";

import { Calendar, CheckCircle2, Home, TrendingUp, XCircle } from "lucide-react";
import type { RichReportContent } from "@/lib/report-rich-content";
import { cn, scoreBg, scoreColor } from "@/lib/utils";

function CheckIcon({ status }: { status: "pass" | "warn" | "fail" }) {
  if (status === "pass") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (status === "fail") return <XCircle className="h-4 w-4 text-rose-600" />;
  return <span className="text-amber-600">⚠</span>;
}

const verdictTone = {
  positive: "border-emerald-300 bg-emerald-50 text-emerald-900",
  neutral: "border-orange-300 bg-orange-50 text-orange-900",
  caution: "border-amber-300 bg-amber-50 text-amber-900",
};

export function ReportRichSections({ rich }: { rich: RichReportContent }) {
  const maxHistory = Math.max(...rich.scoreHistory.map((h) => h.score), 1);
  const maxWeekday = Math.max(...rich.weekdayPattern.map((d) => d.issues), 1);

  return (
    <div className="space-y-8 border-y border-orange-100 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Detailed analysis</p>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
          {rich.sectionCount} sections included
        </span>
      </div>

      {/* Executive summary */}
      <section className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5">
        <h2 className="text-lg font-bold text-stone-900">Executive summary</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">{rich.executiveSummary}</p>
        <div className={cn("mt-4 inline-flex flex-col rounded-xl border px-4 py-3", verdictTone[rich.verdictBadge.tone])}>
          <span className="text-lg font-bold">{rich.verdictBadge.label}</span>
          <span className="text-sm opacity-80">{rich.verdictBadge.sub}</span>
        </div>
      </section>

      {/* 12-month score history */}
      <section>
        <h2 className="text-lg font-bold text-stone-900">12-month health score history</h2>
        <p className="mt-1 text-sm text-stone-500">How this area has changed over the past year.</p>
        <div className="mt-4 rounded-2xl border border-orange-100 bg-white p-4">
          <div className="flex h-32 items-end gap-1">
            {rich.scoreHistory.map((h) => (
              <div key={h.month} className="flex flex-1 flex-col items-center gap-1">
                <span className={cn("text-[10px] font-bold", scoreColor(h.score))}>{h.score}</span>
                <div
                  className={cn("w-full max-w-[20px] rounded-t", scoreBg(h.score))}
                  style={{ height: `${(h.score / maxHistory) * 100}%`, minHeight: 4 }}
                />
                <span className="text-[9px] text-stone-400">{h.month}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Livability index */}
      <section>
        <h2 className="text-lg font-bold text-stone-900">Livability index (8 factors)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {rich.livabilityIndex.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl border border-stone-100 p-3">
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-stone-700">{item.label}</span>
                  <span className={cn("font-bold", scoreColor(item.score))}>{item.score}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div className={cn("h-full rounded-full", scoreBg(item.score))} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best & worst streets */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-800">
            <TrendingUp className="h-5 w-5" /> Best streets to live
          </h2>
          <ul className="mt-3 space-y-2">
            {rich.bestStreets.map((s, i) => (
              <li key={s.street} className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-stone-800">
                    {i + 1}. {s.street}
                  </span>
                  <span className={cn("font-bold", scoreColor(s.score))}>{s.score}</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">{s.why}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-rose-800">
            <Home className="h-5 w-5" /> Streets to double-check
          </h2>
          <ul className="mt-3 space-y-2">
            {rich.worstStreets.map((s, i) => (
              <li key={s.street} className="rounded-xl border border-rose-100 bg-rose-50/40 p-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-stone-800">
                    {i + 1}. {s.street}
                  </span>
                  <span className={cn("font-bold", scoreColor(s.score))}>{s.score}</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">{s.why}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Amenities */}
      <section>
        <h2 className="text-lg font-bold text-stone-900">Nearby amenities scorecard</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {rich.amenities.map((a) => (
            <div key={a.name} className="rounded-xl border border-orange-100 p-3">
              <div className="flex items-start gap-2">
                <span className="text-xl">{a.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-stone-800">{a.name}</p>
                    <span className={cn("font-bold", scoreColor(a.score))}>{a.score}</span>
                  </div>
                  <p className="text-xs text-orange-600">{a.distance}</p>
                  <p className="mt-1 text-xs text-stone-500">{a.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal risks */}
      <section>
        <h2 className="text-lg font-bold text-stone-900">Seasonal risk calendar</h2>
        <div className="mt-3 space-y-2">
          {rich.seasonalRisks.map((s) => (
            <div
              key={s.season}
              className={cn(
                "rounded-xl border px-4 py-3",
                s.level === "high" && "border-rose-200 bg-rose-50/50",
                s.level === "medium" && "border-amber-200 bg-amber-50/50",
                s.level === "low" && "border-emerald-200 bg-emerald-50/50"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-stone-800">{s.season}</p>
                <span className="text-xs font-bold uppercase text-stone-500">{s.level} risk</span>
              </div>
              <p className="mt-1 text-sm text-stone-600">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
          <Calendar className="h-5 w-5 text-orange-600" />
          Recent events (90 days)
        </h2>
        <div className="mt-3 space-y-0 border-l-2 border-orange-200 pl-4">
          {rich.recentTimeline.map((e) => (
            <div key={e.date + e.title} className="relative pb-4">
              <span
                className={cn(
                  "absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white",
                  e.type === "issue" && "bg-rose-500",
                  e.type === "positive" && "bg-emerald-500",
                  e.type === "resolved" && "bg-indigo-500"
                )}
              />
              <p className="text-xs text-stone-400">{e.date}</p>
              <p className="text-sm font-medium text-stone-800">{e.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community themes */}
      <section>
        <h2 className="text-lg font-bold text-stone-900">What residents are talking about</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {rich.communityThemes.map((t) => (
            <div key={t.theme} className="rounded-xl border border-stone-100 bg-stone-50/50 p-4">
              <div className="flex justify-between">
                <p className="font-semibold text-stone-800">{t.theme}</p>
                <span className="text-xs text-stone-400">{t.mentions} mentions</span>
              </div>
              <p className="mt-2 text-sm italic text-stone-600">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* Weekday pattern */}
      <section>
        <h2 className="text-lg font-bold text-stone-900">When issues peak (by weekday)</h2>
        <div className="mt-4 flex h-24 items-end gap-2">
          {rich.weekdayPattern.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-orange-400"
                style={{ height: `${(d.issues / maxWeekday) * 100}%`, minHeight: 4 }}
              />
              <span className="text-xs text-stone-500">{d.day}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-stone-500">Fri–Sun see the most new reports — plan visits accordingly.</p>
      </section>

      {/* Decision checklist */}
      <section>
        <h2 className="text-lg font-bold text-stone-900">Before you sign — decision checklist</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-orange-100">
          {rich.decisionChecklist.map((row, i) => (
            <div
              key={row.item}
              className={cn("flex items-start gap-3 px-4 py-3", i > 0 && "border-t border-orange-50")}
            >
              <CheckIcon status={row.status} />
              <div>
                <p className="text-sm font-medium text-stone-800">{row.item}</p>
                <p className="text-sm text-stone-600">{row.result}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rental & investment */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="text-lg font-bold text-stone-900">Rental signals</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-orange-100">
            {rich.rentalSignals.map((row, i) => (
              <div
                key={row.label}
                className={cn("flex justify-between gap-2 px-4 py-2.5 text-sm", i > 0 && "border-t border-orange-50")}
              >
                <span className="text-stone-600">{row.label}</span>
                <span className="font-semibold text-stone-800">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-stone-900">Investment signals</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-orange-100">
            {rich.investmentSignals.map((row, i) => (
              <div
                key={row.label}
                className={cn("flex justify-between gap-2 px-4 py-2.5 text-sm", i > 0 && "border-t border-orange-50")}
              >
                <span className="text-stone-600">{row.label}</span>
                <span className="font-semibold text-stone-800">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Methodology */}
      <section className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <h2 className="text-sm font-bold text-stone-700">How this report was built</h2>
        <div className="mt-2 grid gap-1 sm:grid-cols-2">
          {rich.methodology.map((m) => (
            <p key={m.label} className="text-xs text-stone-500">
              <span className="font-medium text-stone-700">{m.label}:</span> {m.value}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
