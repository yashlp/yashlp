"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, Shield, TrendingUp } from "lucide-react";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";
import { cn, scoreBg, scoreColor } from "@/lib/utils";
import { IncidentPanel } from "@/components/incident-panel";
import { SearchBar } from "@/components/search-bar";

const MapView = dynamic(() => import("@/components/map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-100 text-muted">
      Loading map...
    </div>
  ),
});

type Incident = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  confidenceScore: number;
  isPositive: boolean;
  category: { emoji: string; name: string; slug: string };
};

type HealthData = {
  overallScore: number;
  confidence: number;
  incidentCount: number;
};

export default function HomePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [center, setCenter] = useState(DEFAULT_MAP_CENTER);
  const [filter, setFilter] = useState<"all" | "issues" | "positive" | "resolved">("all");

  const loadData = async (lat: number, lng: number) => {
    const [incRes, healthRes] = await Promise.all([
      fetch("/api/incidents"),
      fetch(`/api/health?lat=${lat}&lng=${lng}`),
    ]);
    const incData = await incRes.json();
    const healthData = await healthRes.json();
    setIncidents(incData.incidents ?? []);
    setHealth(healthData);
  };

  useEffect(() => {
    loadData(center.lat, center.lng);
  }, [center.lat, center.lng]);

  const filtered = incidents.filter((i) => {
    if (filter === "issues") return !i.isPositive && i.status !== "resolved";
    if (filter === "positive") return i.isPositive;
    if (filter === "resolved") return i.status === "resolved";
    return true;
  });

  const selected = incidents.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="relative h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
      <div className="absolute inset-0 pb-14 md:pb-0">
        <MapView
          incidents={filtered}
          center={center}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onMove={(lat, lng) => setCenter({ lat, lng })}
        />
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 z-[1000] flex flex-col gap-3 p-4">
        <div className="pointer-events-auto mx-auto w-full max-w-xl">
          <SearchBar
            onSelect={(lat, lng) => {
              setCenter({ lat, lng });
              setSelectedId(null);
            }}
          />
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {(["all", "issues", "positive", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize shadow-sm transition",
                filter === f
                  ? "bg-teal-600 text-white"
                  : "glass-card text-foreground hover:bg-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {health && (
        <div className="pointer-events-auto absolute bottom-20 left-4 z-[1000] md:bottom-4">
          <div className="glass-card w-64 rounded-2xl p-4 shadow-lg">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
              <Activity className="h-3.5 w-3.5" />
              Community Health Score
            </div>
            <div className="flex items-end gap-2">
              <span className={cn("text-4xl font-bold", scoreColor(health.overallScore))}>
                {health.overallScore}
              </span>
              <span className="mb-1 text-sm text-muted">/ 100</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full transition-all", scoreBg(health.overallScore))}
                style={{ width: `${health.overallScore}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              {health.incidentCount} verified incidents · {Math.round(health.confidence * 100)}% confidence
            </p>
            <Link
              href="/insights"
              className="mt-3 flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              View trends & rankings
            </Link>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-20 right-4 z-[1000] hidden md:bottom-4 md:block">
        <div className="glass-card flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted shadow">
          <Shield className="h-3.5 w-3.5 text-teal-600" />
          {filtered.length} pins on map
        </div>
      </div>

      {selected && (
        <IncidentPanel
          incidentId={selected.id}
          onClose={() => setSelectedId(null)}
          onUpdate={() => loadData(center.lat, center.lng)}
        />
      )}
    </div>
  );
}
