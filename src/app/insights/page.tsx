"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { cn, scoreBg, scoreColor } from "@/lib/utils";

type Trend = { date: string; reported: number; resolved: number; positive: number };
type Ranking = {
  name: string;
  overallScore: number;
  confidence: number;
  incidentCount: number;
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
          Best and worst areas by Community Health Score — grouped by city or neighborhood.
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
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-rose-400" /> Reported</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-indigo-400" /> Resolved</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-400" /> Positive</span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Trophy className="h-5 w-5 text-amber-500" />
          Area Rankings
        </h2>
        <div className="mt-4 space-y-2">
          {rankings.length === 0 ? (
            <p className="rounded-xl border border-border bg-white p-4 text-sm text-muted">
              No verified area data yet. Reports need community validation before they appear in
              rankings.
            </p>
          ) : (
            rankings.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-white p-4"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700"
                title={`Rank ${i + 1}`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{r.name}</p>
                <p className="text-xs text-muted">
                  {r.incidentCount} verified reports · {Math.round(r.confidence * 100)}% confidence
                </p>
              </div>
              <div className="text-right">
                <p className={cn("text-2xl font-bold", scoreColor(r.overallScore))}>
                  {r.overallScore}
                </p>
                <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", scoreBg(r.overallScore))} style={{ width: `${r.overallScore}%` }} />
                </div>
              </div>
              {i === 0 ? (
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-muted opacity-40" />
              )}
            </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
