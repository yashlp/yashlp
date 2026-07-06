"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, Crosshair, Shield, TrendingUp } from "lucide-react";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, USER_LOCATION_ZOOM } from "@/lib/constants";
import { useDebouncedValue } from "@/lib/use-debounce";
import { cn, scoreBg, scoreColor } from "@/lib/utils";

const MapView = dynamic(() => import("@/components/map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-orange-50 text-stone-400">
      Loading world map...
    </div>
  ),
});

const SearchBar = dynamic(
  () => import("@/components/search-bar").then((m) => m.SearchBar),
  { ssr: false, loading: () => <div className="h-11 animate-pulse rounded-2xl bg-orange-100/80" /> }
);

const IncidentPanel = dynamic(
  () => import("@/components/incident-panel").then((m) => m.IncidentPanel),
  { ssr: false }
);

type Incident = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  visibilityStage?: string;
  displayLabel?: string | null;
  underLegalReview?: boolean;
  confidenceScore: number;
  confirmationCount?: number;
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
  const [viewCenter, setViewCenter] = useState(DEFAULT_MAP_CENTER);
  const [healthCenter, setHealthCenter] = useState(DEFAULT_MAP_CENTER);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_MAP_ZOOM);
  const [filter, setFilter] = useState<"all" | "issues" | "positive" | "resolved">("all");

  const debouncedHealthCenter = useDebouncedValue(healthCenter, 500);

  const loadIncidents = useCallback(async () => {
    const res = await fetch("/api/incidents");
    const data = await res.json();
    setIncidents(data.incidents ?? []);
  }, []);

  const loadHealth = useCallback(async (lat: number, lng: number) => {
    const res = await fetch(`/api/health?lat=${lat}&lng=${lng}`);
    const data = await res.json();
    setHealth(data);
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  useEffect(() => {
    loadHealth(debouncedHealthCenter.lat, debouncedHealthCenter.lng);
  }, [debouncedHealthCenter.lat, debouncedHealthCenter.lng, loadHealth]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setViewCenter(loc);
          setHealthCenter(loc);
          setZoom(USER_LOCATION_ZOOM);
        },
        () => {},
        { enableHighAccuracy: false, timeout: 8000 }
      );
    }
  }, []);

  const goToMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setUserLocation(loc);
      setViewCenter(loc);
      setHealthCenter(loc);
      setZoom(USER_LOCATION_ZOOM);
    });
  };

  const filtered = incidents.filter((i) => {
    if (filter === "issues") return !i.isPositive && i.status !== "resolved";
    if (filter === "positive") return i.isPositive || i.status === "positive_active";
    if (filter === "resolved") return i.status === "resolved";
    return true;
  });

  const selected = incidents.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="relative h-[calc(100dvh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
      <div className="absolute inset-0 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <MapView
          incidents={filtered}
          center={viewCenter}
          zoom={zoom}
          selectedId={selectedId}
          userLocation={userLocation}
          onSelect={setSelectedId}
          onMove={(lat, lng) => setHealthCenter({ lat, lng })}
          onZoom={setZoom}
        />
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 z-[1000] flex flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="pointer-events-auto mx-auto w-full max-w-xl">
          <SearchBar
            onSelect={(lat, lng) => {
              setViewCenter({ lat, lng });
              setHealthCenter({ lat, lng });
              setZoom(USER_LOCATION_ZOOM);
              setSelectedId(null);
            }}
          />
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
          {(["all", "issues", "positive", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "min-h-9 rounded-full px-3 py-2 text-xs font-semibold capitalize shadow-sm transition sm:px-3.5",
                filter === f
                  ? "bg-orange-600 text-white shadow-orange-200"
                  : "glass-card text-stone-700 hover:bg-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {health && (
        <div className="pointer-events-auto absolute bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] left-3 z-[1000] md:bottom-4 md:left-4">
          <div className="glass-card w-[min(100vw-1.5rem,16rem)] rounded-2xl p-3 sm:w-64 sm:p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
              <Activity className="h-3.5 w-3.5 text-orange-500" />
              Community Health Score
            </div>
            <div className="flex items-end gap-2">
              <span className={cn("text-3xl font-bold sm:text-4xl", scoreColor(health.overallScore))}>
                {health.overallScore}
              </span>
              <span className="mb-1 text-sm text-stone-400">/ 100</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-orange-100">
              <div
                className={cn("h-full rounded-full transition-all", scoreBg(health.overallScore))}
                style={{ width: `${health.overallScore}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-stone-400">
              {health.incidentCount} verified · {Math.round(health.confidence * 100)}% confidence
            </p>
            <Link
              href="/insights"
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              View trends & rankings
            </Link>
          </div>
        </div>
      )}

      <div className="pointer-events-auto absolute bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] right-3 z-[1000] flex flex-col gap-2 md:bottom-4 md:right-4">
        <button
          onClick={goToMyLocation}
          className="glass-card flex min-h-11 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-600 shadow hover:bg-orange-50"
          title="Go to my location"
        >
          <Crosshair className="h-4 w-4 text-blue-600" />
          <span className="hidden sm:inline">My location</span>
        </button>
        <div className="glass-card hidden items-center gap-2 rounded-xl px-3 py-2 text-xs text-stone-400 md:flex">
          <Shield className="h-3.5 w-3.5 text-orange-500" />
          {filtered.length} pins worldwide
        </div>
      </div>

      {selected && (
        <IncidentPanel
          incidentId={selected.id}
          onClose={() => setSelectedId(null)}
          onUpdate={loadIncidents}
        />
      )}
    </div>
  );
}
