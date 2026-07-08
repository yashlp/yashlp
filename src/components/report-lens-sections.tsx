"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { AnalysisBlock } from "@/lib/report-structure";
import type { TrendWindow, VisitorBrief } from "@/lib/report-structure";
import type { PropertyLens, BusinessLens } from "@/lib/report-structure";
import { ADVANCED_PRESETS } from "@/lib/report-structure";
import type { AdvancedPreset } from "@/lib/report-structure";
import { cn, scoreColor } from "@/lib/utils";

export function ReportAnalysisBlocks({ blocks }: { blocks: AnalysisBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <section key={block.title} className="rounded-2xl border border-orange-100 bg-white p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
            <span>{block.emoji}</span>
            {block.title}
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {block.metrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm">
                <span className="text-stone-600">{m.label}</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={scoreColor(m.score)}>{m.score}</span>
                  {m.trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
                  {m.trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-rose-500" />}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
              <p className="text-xs font-semibold uppercase text-emerald-700">Strengths</p>
              <ul className="mt-2 space-y-1 text-sm text-stone-600">
                {block.strengths.map((s) => (
                  <li key={s}>✓ {s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
              <p className="text-xs font-semibold uppercase text-rose-700">Weaknesses</p>
              <ul className="mt-2 space-y-1 text-sm text-stone-600">
                {block.weaknesses.map((w) => (
                  <li key={w}>✗ {w}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-3 text-sm text-stone-500">
            <span className="font-medium text-stone-700">Trend: </span>
            {block.trendNote}
          </p>
        </section>
      ))}
    </div>
  );
}

export function ReportTrendWindows({ windows }: { windows: TrendWindow[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-stone-900">Trend analysis</h2>
      <p className="mt-1 text-sm text-stone-500">Is the area improving or worsening?</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {windows.map((w) => (
          <div key={w.window} className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
            <p className="text-xs font-semibold uppercase text-orange-600">Last {w.window}</p>
            <p
              className={cn(
                "mt-1 text-sm font-bold capitalize",
                w.direction === "improving" && "text-emerald-700",
                w.direction === "declining" && "text-rose-700",
                w.direction === "stable" && "text-stone-600"
              )}
            >
              {w.direction}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-stone-600">{w.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function VisitorBriefSection({ brief }: { brief: VisitorBrief }) {
  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5">
      <h2 className="text-lg font-bold text-stone-900">✈️ Visitor & travel brief</h2>
      <p className="mt-1 text-sm text-stone-500">Included with Area Insight — for visitors and short stays.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <BriefItem label="Night safety" value={brief.nightSafety} />
        <BriefItem label="Public transport" value={brief.publicTransport} />
        <BriefItem label="Food hygiene" value={brief.foodHygiene} />
        <BriefItem label="Best visiting hours" value={brief.bestVisitingHours} />
        <BriefItem label="Emergency facilities" value={brief.emergencyNote} className="sm:col-span-2" />
      </div>
      <div className="mt-3">
        <p className="text-xs font-semibold text-stone-500">Streets to approach with caution</p>
        <ul className="mt-1 text-sm text-stone-600">
          {brief.streetsToAvoid.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BriefItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("rounded-xl bg-white p-3 ring-1 ring-sky-100", className)}>
      <p className="text-xs font-semibold text-sky-800">{label}</p>
      <p className="mt-1 text-sm text-stone-600">{value}</p>
    </div>
  );
}

export function PropertyLensSection({ lens }: { lens: PropertyLens }) {
  const rec = lens.buyRecommendation;
  return (
    <div className="space-y-6 border-t border-orange-100 pt-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Property due diligence</p>

      <section>
        <h2 className="text-lg font-bold text-stone-900">Radius analysis</h2>
        <div className="mt-3 space-y-3">
          {lens.radiusRings.map((ring) => (
            <div key={ring.radius} className="rounded-2xl border border-orange-100 p-4">
              <p className="font-bold text-orange-700">Within {ring.radius}</p>
              <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                <Cell label="Schools" value={ring.schools} />
                <Cell label="Hospitals" value={ring.hospitals} />
                <Cell label="Transport" value={ring.transport} />
                <Cell label="Parks" value={ring.parks} />
                <Cell label="Major civic issues" value={ring.majorIssues} />
                <Cell label="Positive developments" value={ring.positives} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">Risk analysis</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-orange-100">
          {lens.risks.map((r, i) => (
            <div key={r.label} className={cn("flex justify-between gap-4 px-4 py-3", i > 0 && "border-t border-orange-50")}>
              <span className="text-sm font-medium text-stone-700">{r.label}</span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  r.level === "high" && "text-rose-600",
                  r.level === "medium" && "text-amber-600",
                  r.level === "low" && "text-emerald-600"
                )}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">Timeline — before → today</h2>
        <div className="mt-3 space-y-2">
          {lens.timeline.map((t) => (
            <div key={t.period} className="flex gap-3 rounded-xl bg-stone-50 px-4 py-2 text-sm">
              <span className="shrink-0 font-bold text-stone-500">{t.period}</span>
              <span className="text-stone-700">{t.event}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5">
        <h2 className="text-lg font-bold text-stone-900">AI buy recommendation</h2>
        <p className="mt-2 text-xl font-bold text-orange-800">{rec.headline}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-emerald-700">Pros</p>
            <ul className="mt-1 space-y-1 text-sm text-stone-600">
              {rec.pros.map((p) => (
                <li key={p}>+ {p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-700">Cons</p>
            <ul className="mt-1 space-y-1 text-sm text-stone-600">
              {rec.cons.map((c) => (
                <li key={c}>− {c}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-sm">
          <span className="font-semibold">Risk level:</span> {rec.riskLevel}
        </p>
        <p className="mt-2 text-sm text-stone-600">
          <span className="font-semibold text-stone-800">Future outlook (estimate):</span> {rec.futureOutlook}
        </p>
        <p className="mt-2 text-xs text-stone-400">
          Trend-based estimate from community signals — not a guarantee of future conditions.
        </p>
      </section>
    </div>
  );
}

export function BusinessLensSection({ lens }: { lens: BusinessLens }) {
  const fitColor = {
    excellent: "text-emerald-700 bg-emerald-50",
    good: "text-sky-700 bg-sky-50",
    mixed: "text-amber-700 bg-amber-50",
    poor: "text-rose-700 bg-rose-50",
  };
  return (
    <div className="space-y-6 border-t border-orange-100 pt-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Business location analysis</p>

      <ScoreGrid title="Accessibility" items={lens.accessibility} />
      <ScoreGrid title="Cleanliness" items={lens.cleanliness} />
      <ScoreGrid title="Infrastructure" items={lens.infrastructure} />
      <ScoreGrid title="Customer environment" items={lens.customerEnv} />

      <section>
        <h2 className="text-lg font-bold text-stone-900">Nearby risks</h2>
        <ul className="mt-2 space-y-1 text-sm text-stone-600">
          {lens.nearbyRisks.map((r) => (
            <li key={r}>⚠ {r}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">Community engagement</h2>
        <p className="mt-2 text-sm text-stone-600">{lens.engagement}</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">AI business suitability by type</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {lens.suitability.map((s) => (
            <div key={s.type} className="flex items-center justify-between rounded-xl border border-stone-100 px-4 py-3">
              <span className="text-sm font-medium text-stone-700">{s.type}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold capitalize", fitColor[s.fit])}>
                {s.fit} · {s.score}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-2xl font-bold text-orange-700">
          Business suitability score: {lens.overallBusinessScore}/100
        </p>
      </section>
    </div>
  );
}

function ScoreGrid({ title, items }: { title: string; items: { label: string; score: number }[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-stone-900">{title}</h2>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm">
            <span>{item.label}</span>
            <span className={cn("font-bold", scoreColor(item.score))}>{item.score}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdvancedPresetBadge({ preset }: { preset: AdvancedPreset }) {
  const info = ADVANCED_PRESETS.find((p) => p.id === preset)!;
  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4">
      <p className="text-xs font-semibold uppercase text-violet-600">Advanced preset</p>
      <p className="mt-1 text-lg font-bold text-stone-900">
        {info.emoji} {info.label}
      </p>
      <p className="mt-1 text-sm text-stone-600">{info.description}</p>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-stone-400">{label}</span>
      <p className="text-sm font-medium text-stone-700">{value}</p>
    </div>
  );
}
