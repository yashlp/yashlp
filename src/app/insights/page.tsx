"use client";

import { useEffect, useState } from "react";
import { BarChart3, Globe, Trophy } from "lucide-react";
import { cn, scoreBg, scoreColor } from "@/lib/utils";

type Trend = { date: string; reported: number; resolved: number; positive: number };
type Ranking = {
  name: string;
  countryCode?: string;
  overallScore: number;
  confidence: number;
  incidentCount: number;
  pinCount?: number;
};

export default function InsightsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/insights?type=trends").then((r) => r.json()),
      fetch("/api/insights?type=rankings").then((r) => r.json()),
    ]).then(([t, r]) => {
      setTrends(t.trends ?? []);
      setRankings(r.rankings ?? []);
    });
  }, []);

  const maxReported = Math.max(...trends.map((t) => t.reported), 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <h1 className="text-2xl font-bold">Community Insights</h1>
      <p className="mt-1 text-muted">
        Country rankings by Community Health Score — updated from verified map markings worldwide.
      </p>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <BarChart3 className="h-5 w-5 text-orange-600" />
          30-Day Trends
        </h2>
        <div className="mt-4 rounded-2xl border border-border bg-white p-6">
          {trends.length === 0 ? (
            <p className="text-sm text-muted">No trend data yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex min-w-[480px] items-end gap-1" style={{ height: 160 }}>
                {trends.map((t) => (
                  <div key={t.date} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 120 }}>
                      <div
                        className="w-full max-w-[12px] rounded-t bg-rose-400"
                        style={{ height: `${(t.reported / maxReported) * 100}%` }}
                        title={`${t.reported} reported`}
                      />
                      <div
                        className="w-full max-w-[12px] rounded-t bg-indigo-400"
                        style={{ height: `${(t.resolved / maxReported) * 100}%` }}
                        title={`${t.resolved} resolved`}
                      />
                      <div
                        className="w-full max-w-[12px] rounded-t bg-emerald-400"
                        style={{ height: `${(t.positive / maxReported) * 100}%` }}
                        title={`${t.positive} positive`}
                      />
                    </div>
                    <span className="text-[10px] text-muted sm:text-xs">{t.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-4 text-xs text-muted">
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

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Trophy className="h-5 w-5 text-amber-500" />
          Country Rankings
        </h2>
        <p className="mt-1 text-sm text-muted">
          Higher health score = higher rank. Scores reflect all community pins on the map in each country.
        </p>
        <div className="mt-4 space-y-2">
          {rankings.length === 0 ? (
            <p className="rounded-xl border border-border bg-white p-4 text-sm text-muted">
              No country data yet. Map reports need community validation before countries appear in
              rankings.
            </p>
          ) : (
            rankings.map((r, i) => (
              <div
                key={r.countryCode ?? r.name}
                className="flex items-center gap-4 rounded-xl border border-border bg-white p-4"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    i === 0
                      ? "bg-amber-100 text-amber-700"
                      : i === 1
                        ? "bg-stone-200 text-stone-700"
                        : i === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-orange-50 text-orange-600"
                  )}
                  title={`Rank ${i + 1}`}
                >
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Globe className="h-4 w-4 shrink-0 text-stone-400" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.name}</p>
                    <p className="text-xs text-muted">
                      {(r.pinCount ?? r.incidentCount)} map pin
                      {(r.pinCount ?? r.incidentCount) === 1 ? "" : "s"}
                      {r.countryCode ? ` · ${r.countryCode}` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-2xl font-bold", scoreColor(r.overallScore))}>
                    {r.overallScore}
                  </p>
                  <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full", scoreBg(r.overallScore))}
                      style={{ width: `${r.overallScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
