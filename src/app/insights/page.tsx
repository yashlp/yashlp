"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Crosshair,
  Globe,
  MapPin,
  Trophy,
} from "lucide-react";
import { GLOBAL_SAMPLE_PLACES } from "@/lib/constants";
import { cn, scoreBg, scoreColor } from "@/lib/utils";

type Trend = { date: string; reported: number; resolved: number; positive: number };
type CategoryStat = { name: string; emoji: string; count: number };
type CityInsights = {
  city: string;
  state?: string;
  countryCode?: string;
  pinCount: number;
  health: {
    overallScore: number;
    confidence: number;
    incidentCount: number;
    issueCount: number;
    totalInArea: number;
  };
  trends: Trend[];
  topIssues: CategoryStat[];
  topPositive: CategoryStat[];
};
type Ranking = {
  name: string;
  countryCode?: string;
  overallScore: number;
  pinCount?: number;
};

const DEFAULT_CITY = GLOBAL_SAMPLE_PLACES[2];

export default function InsightsPage() {
  const [cityInsights, setCityInsights] = useState<CityInsights | null>(null);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [locating, setLocating] = useState(true);
  const [locationHint, setLocationHint] = useState<string | null>(null);

  const loadInsights = useCallback(async (lat: number, lng: number) => {
    const [cityRes, rankRes] = await Promise.all([
      fetch(`/api/insights?type=city&lat=${lat}&lng=${lng}`).then((r) => r.json()),
      fetch("/api/insights?type=rankings").then((r) => r.json()),
    ]);
    setCityInsights(cityRes.cityInsights ?? null);
    setRankings(rankRes.rankings ?? []);
  }, []);

  const applyLocation = useCallback(
    (lat: number, lng: number) => {
      setLocationHint(null);
      void loadInsights(lat, lng);
    },
    [loadInsights]
  );

  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationHint("Location is not supported in this browser.");
      setLocating(false);
      applyLocation(DEFAULT_CITY.lat, DEFAULT_CITY.lng);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyLocation(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocationHint("Using Mumbai as default — allow location for your city.");
        applyLocation(DEFAULT_CITY.lat, DEFAULT_CITY.lng);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, [applyLocation]);

  useEffect(() => {
    locateUser();
  }, [locateUser]);

  const trends = cityInsights?.trends ?? [];
  const maxReported = Math.max(...trends.map((t) => t.reported), 1);
  const cityLabel = cityInsights
    ? [cityInsights.city, cityInsights.state].filter(Boolean).join(", ")
    : locating
      ? "Detecting your city…"
      : "Your city";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">City Insights</h1>
          <p className="mt-1 flex items-center gap-1.5 text-muted">
            <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
            <span>{cityLabel}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={locateUser}
          disabled={locating}
          className="flex min-h-10 items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 shadow-sm hover:bg-orange-50 disabled:opacity-60"
        >
          <Crosshair className={cn("h-4 w-4 text-blue-600", locating && "animate-pulse")} />
          {locating ? "Locating…" : "My city"}
        </button>
      </div>
      {locationHint && (
        <p className="mt-2 text-xs text-amber-700">{locationHint}</p>
      )}

      {cityInsights && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
            <Activity className="h-3.5 w-3.5 text-orange-500" />
            {cityInsights.city} Health Score
          </div>
          <div className="mt-2 flex flex-wrap items-end gap-4">
            <span className={cn("text-4xl font-bold", scoreColor(cityInsights.health.overallScore))}>
              {cityInsights.health.overallScore}
            </span>
            <span className="mb-1 text-sm text-stone-400">/ 100</span>
            <div className="flex-1 min-w-[8rem]">
              <div className="h-2 overflow-hidden rounded-full bg-orange-100">
                <div
                  className={cn("h-full rounded-full", scoreBg(cityInsights.health.overallScore))}
                  style={{ width: `${cityInsights.health.overallScore}%` }}
                />
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            {cityInsights.health.issueCount}{" "}
            {cityInsights.health.issueCount === 1 ? "issue" : "issues"} · {cityInsights.pinCount} map
            pins in {cityInsights.city}
          </p>
        </div>
      )}

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <BarChart3 className="h-5 w-5 text-orange-600" />
          30-Day Trends in {cityInsights?.city ?? "your city"}
        </h2>
        <div className="mt-4 rounded-2xl border border-border bg-white p-6">
          {locating ? (
            <p className="text-sm text-muted">Loading city trends…</p>
          ) : trends.length === 0 || trends.every((t) => t.reported === 0) ? (
            <p className="text-sm text-muted">
              No reports in {cityInsights?.city ?? "this city"} in the last 30 days yet.
            </p>
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

      {cityInsights && (cityInsights.topIssues.length > 0 || cityInsights.topPositive.length > 0) && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {cityInsights.topIssues.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="text-sm font-semibold text-stone-700">Top issues in {cityInsights.city}</h3>
              <ul className="mt-3 space-y-2">
                {cityInsights.topIssues.map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <span>
                      {item.emoji} {item.name}
                    </span>
                    <span className="font-medium text-stone-500">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cityInsights.topPositive.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="text-sm font-semibold text-stone-700">Top positives in {cityInsights.city}</h3>
              <ul className="mt-3 space-y-2">
                {cityInsights.topPositive.map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <span>
                      {item.emoji} {item.name}
                    </span>
                    <span className="font-medium text-stone-500">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Trophy className="h-5 w-5 text-amber-500" />
          Country Rankings
        </h2>
        <p className="mt-1 text-sm text-muted">
          Global country scores — higher health score = higher rank.
        </p>
        <div className="mt-4 space-y-2">
          {rankings.length === 0 ? (
            <p className="rounded-xl border border-border bg-white p-4 text-sm text-muted">
              No country data yet.
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
                >
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Globe className="h-4 w-4 shrink-0 text-stone-400" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.name}</p>
                    <p className="text-xs text-muted">
                      {(r.pinCount ?? 0)} map pin{(r.pinCount ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <p className={cn("text-2xl font-bold", scoreColor(r.overallScore))}>
                  {r.overallScore}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
