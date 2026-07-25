"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, Crosshair, Minus, Plus, Shield, TrendingUp } from "lucide-react";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, USER_LOCATION_ZOOM } from "@/lib/constants";
import {
  filterMapIncidents,
  getAreaFilterShortcuts,
  MAP_CATEGORY_FILTERS,
  NEAR_ME_RADIUS_M,
  WOMENS_SAFETY_FILTER_SLUG,
  type MapFilterMode,
} from "@/lib/map-filters";
import { useDebouncedValue } from "@/lib/use-debounce";
import { cn, haversineDistance, scoreBg, scoreColor } from "@/lib/utils";

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
  issueCount: number;
  totalInArea: number;
};

const AREA_RADIUS_M = 800;
const STATE_RADIUS_M = 15000;
const COUNTRY_RADIUS_M = 120000;

function getHealthScopeForZoom(zoom: number) {
  if (zoom >= 11) {
    return { label: "City Health Score", radiusM: AREA_RADIUS_M, insightsCta: "View city insights" };
  }
  if (zoom >= 6) {
    return { label: "State Health Score", radiusM: STATE_RADIUS_M, insightsCta: "View state-level trends" };
  }
  return { label: "Country Health Score", radiusM: COUNTRY_RADIUS_M, insightsCta: "View country rankings" };
}

export default function CivicHomePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [viewCenter, setViewCenter] = useState(DEFAULT_MAP_CENTER);
  const [healthCenter, setHealthCenter] = useState(DEFAULT_MAP_CENTER);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_MAP_ZOOM);
  const [filter, setFilter] = useState<MapFilterMode>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [nearMeOnly, setNearMeOnly] = useState(false);
  const [locationHint, setLocationHint] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const debouncedHealthCenter = useDebouncedValue(healthCenter, 500);
  const healthScope = useMemo(() => getHealthScopeForZoom(zoom), [zoom]);

  const loadIncidents = useCallback(async () => {
    const res = await fetch("/api/incidents");
    const data = await res.json();
    setIncidents(data.incidents ?? []);
  }, []);

  const loadHealth = useCallback(async (lat: number, lng: number) => {
    const res = await fetch(`/api/health?lat=${lat}&lng=${lng}&radius=${healthScope.radiusM}`);
    const data = await res.json();
    setHealth(data);
  }, [healthScope.radiusM]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  useEffect(() => {
    loadHealth(debouncedHealthCenter.lat, debouncedHealthCenter.lng);
  }, [debouncedHealthCenter.lat, debouncedHealthCenter.lng, loadHealth]);

  const applyUserLocation = useCallback((loc: { lat: number; lng: number }) => {
    setUserLocation(loc);
    setViewCenter(loc);
    setHealthCenter(loc);
    setZoom(USER_LOCATION_ZOOM);
    setLocationHint(null);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => applyUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [applyUserLocation]);

  const goToMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationHint("Location is not supported in this browser.");
      return;
    }
    setLocating(true);
    setLocationHint(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationHint("Allow location access in your browser settings, then try again.");
        } else {
          setLocationHint("Could not get your location. Check GPS or try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const filtered = useMemo(
    () =>
      filterMapIncidents(incidents, {
        filter,
        categorySlug: categoryFilter,
        nearMeOnly,
        userLocation,
        nearRadiusM: NEAR_ME_RADIUS_M,
      }),
    [incidents, filter, categoryFilter, nearMeOnly, userLocation]
  );

  const areaShortcuts = useMemo(
    () => getAreaFilterShortcuts(incidents, healthCenter, healthScope.radiusM, 6),
    [incidents, healthCenter, healthScope.radiusM]
  );

  const activeCategoryLabel = categoryFilter
    ? categoryFilter === WOMENS_SAFETY_FILTER_SLUG
      ? "Women's safety"
      : areaShortcuts.find((c) => c.slug === categoryFilter)?.label ??
        MAP_CATEGORY_FILTERS.find((c) => c.slug === categoryFilter)?.label
    : null;

  const toggleNearMe = () => {
    if (!userLocation) {
      goToMyLocation();
      setNearMeOnly(true);
      return;
    }
    setNearMeOnly((v) => !v);
  };

  useEffect(() => {
    if (nearMeOnly && userLocation) {
      setViewCenter(userLocation);
      setHealthCenter(userLocation);
      setZoom(USER_LOCATION_ZOOM);
    }
  }, [categoryFilter, nearMeOnly, userLocation]);

  const pinsInArea = useMemo(() => {
    return filtered.filter(
      (i) =>
        haversineDistance(healthCenter.lat, healthCenter.lng, i.latitude, i.longitude) <=
        healthScope.radiusM
    ).length;
  }, [filtered, healthCenter, healthScope.radiusM]);

  const selected = incidents.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="relative h-full min-h-0">
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

        <div className="pointer-events-auto space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {(["all", "issues", "positive", "resolved"] as const).map((f) => (
              <button
                key={f}
                type="button"
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
            <button
              type="button"
              onClick={toggleNearMe}
              className={cn(
                "min-h-9 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition sm:px-3.5",
                nearMeOnly
                  ? "bg-emerald-600 text-white shadow-emerald-200"
                  : "glass-card text-stone-700 hover:bg-white"
              )}
            >
              {nearMeOnly ? `Near me (${NEAR_ME_RADIUS_M / 1000}km)` : "Near me"}
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none sm:gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter(null)}
              className={cn(
                "shrink-0 min-h-9 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition",
                !categoryFilter
                  ? "bg-stone-800 text-white"
                  : "glass-card text-stone-700 hover:bg-white"
              )}
            >
              All pins
            </button>
            {areaShortcuts.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  setCategoryFilter((prev) => (prev === cat.slug ? null : cat.slug));
                  if (!userLocation && nearMeOnly) goToMyLocation();
                }}
                className={cn(
                  "shrink-0 min-h-9 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition",
                  categoryFilter === cat.slug
                    ? "bg-stone-800 text-white"
                    : "glass-card text-stone-700 hover:bg-white"
                )}
                title={cat.count > 0 ? `${cat.count} pins in this view` : cat.label}
              >
                {cat.emoji} {cat.label}
                {cat.count > 0 ? (
                  <span className="ml-1 opacity-70">{cat.count}</span>
                ) : null}
              </button>
            ))}
          </div>
          {areaShortcuts.some((c) => c.count > 0) && (
            <p className="text-[10px] text-stone-400 sm:text-xs">
              Shortcuts ranked by most common pins in this map area
            </p>
          )}
          {(categoryFilter || nearMeOnly) && (
            <p className="text-xs text-stone-500">
              Showing {filtered.length} pin{filtered.length === 1 ? "" : "s"}
              {activeCategoryLabel ? ` · ${activeCategoryLabel}` : ""}
              {nearMeOnly ? ` · within ${NEAR_ME_RADIUS_M / 1000}km` : ""}
              {!userLocation && nearMeOnly ? " · enable location" : ""}
            </p>
          )}
        </div>
      </div>

      {health && (
        <div className="pointer-events-auto absolute bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] left-3 z-[1000] md:bottom-4 md:left-4">
          <div className="glass-card w-[min(100vw-1.5rem,16rem)] rounded-2xl p-3 sm:w-64 sm:p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
              <Activity className="h-3.5 w-3.5 text-orange-500" />
              {healthScope.label}
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
              {health.issueCount} {health.issueCount === 1 ? "issue" : "issues"} in this{" "}
              {healthScope.label.toLowerCase().replace(" health score", "")}
              {health.incidentCount > 0 && (
                <> · {health.incidentCount} verified</>
              )}
            </p>
            <Link
              href="/insights"
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              {healthScope.insightsCta}
            </Link>
          </div>
        </div>
      )}

      <div className="pointer-events-auto absolute bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] right-3 z-[1000] flex flex-col items-end gap-2 md:bottom-4 md:right-4">
        <div className="glass-card flex flex-col overflow-hidden rounded-xl shadow">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 1, 19))}
            className="flex h-11 w-11 items-center justify-center border-b border-orange-100 text-stone-700 hover:bg-orange-50"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 1, 2))}
            className="flex h-11 w-11 items-center justify-center text-stone-700 hover:bg-orange-50"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={goToMyLocation}
          disabled={locating}
          className="glass-card flex min-h-11 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-600 shadow hover:bg-orange-50 disabled:opacity-60"
          title="Go to my location"
        >
          <Crosshair className={cn("h-4 w-4 text-blue-600", locating && "animate-pulse")} />
          <span className="hidden sm:inline">{locating ? "Locating…" : "My location"}</span>
        </button>
        {locationHint && (
          <p className="max-w-[11rem] rounded-lg bg-white/95 px-2 py-1.5 text-[10px] leading-snug text-rose-700 shadow ring-1 ring-rose-100 sm:max-w-xs sm:text-xs">
            {locationHint}
          </p>
        )}
        <div className="glass-card hidden items-center gap-2 rounded-xl px-3 py-2 text-xs text-stone-400 md:flex">
          <Shield className="h-3.5 w-3.5 text-orange-500" />
          {pinsInArea} pins in this area
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
