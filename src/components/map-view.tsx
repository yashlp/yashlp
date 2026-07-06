"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { DEFAULT_MAP_ZOOM, STREET_LEVEL_ZOOM } from "@/lib/constants";
import { haversineDistance } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

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
  category: { emoji: string; name: string; slug?: string };
};

const userLocationIcon = L.divIcon({
  html: `<div style="
    width:20px;height:20px;
    background:#2563eb;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 0 0 6px rgba(37,99,235,0.35), 0 2px 8px rgba(0,0,0,0.25);
  "></div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const iconCache = new Map<string, L.DivIcon>();

function MapMover({
  center,
  zoom,
}: {
  center: { lat: number; lng: number };
  zoom: number;
}) {
  const map = useMap();
  const prev = useRef({ ...center, zoom });

  useEffect(() => {
    if (
      prev.current.lat === center.lat &&
      prev.current.lng === center.lng &&
      prev.current.zoom === zoom
    ) {
      return;
    }

    const mapCenter = map.getCenter();
    const distM = haversineDistance(mapCenter.lat, mapCenter.lng, center.lat, center.lng);
    const zoomChanged = prev.current.zoom !== zoom;

    if (zoomChanged || distM > 2000) {
      map.flyTo([center.lat, center.lng], zoom, { duration: 0.5 });
    } else if (distM > 30) {
      map.setView([center.lat, center.lng], zoom, { animate: false });
    }

    prev.current = { ...center, zoom };
  }, [center, zoom, map]);

  return null;
}

function MapEvents({
  onMove,
  onZoom,
}: {
  onMove: (lat: number, lng: number) => void;
  onZoom?: (zoom: number) => void;
}) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onMove(c.lat, c.lng);
    },
    zoomend: (e) => {
      onZoom?.(e.target.getZoom());
    },
  });
  return null;
}

function createIcon(incident: Incident, selected: boolean) {
  const key = `${incident.id}:${incident.status}:${incident.visibilityStage}:${selected}`;
  const cached = iconCache.get(key);
  if (cached) return cached;

  const stage = incident.visibilityStage ?? "verified";
  const isSeed = stage === "seed";
  const isPrivate = stage === "private";

  let color: string;
  const isAreaRecognition = incident.category.slug === "great-community-area";

  if (isAreaRecognition) {
    color =
      incident.status === "positive_active" || incident.status === "active"
        ? "#16a34a"
        : "#86efac";
  } else if (incident.isPositive) {
    color =
      incident.status === "positive_active" || incident.status === "active"
        ? "#2563eb"
        : "#93c5fd";
  } else if (incident.status === "resolved") {
    color = "#16a34a";
  } else if (incident.status === "under_review" || incident.underLegalReview) {
    color = "#a855f7";
  } else if (incident.status === "resolution_pending") {
    color = "#eab308";
  } else if (incident.status === "disputed") {
    color = "#ca8a04";
  } else if (isPrivate || incident.status === "pending") {
    color = "#f59e0b";
  } else if (isSeed) {
    color = "#f97316";
  } else {
    color = "#dc2626";
  }

  const baseSize = isSeed ? 28 : isPrivate ? 24 : 36;
  const size = selected ? baseSize + 8 : baseSize;
  const opacity = isSeed ? 0.65 : isPrivate ? 0.45 : 1;
  const borderStyle = isSeed ? "dashed" : "solid";

  const html = `
    <div style="
      width:${size}px;height:${size}px;
      background:${color};
      opacity:${opacity};
      border:3px ${borderStyle} ${selected ? "#ea580c" : "white"};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:${selected ? 18 : isSeed ? 13 : 16}px;
      box-shadow:0 2px 10px rgba(${isAreaRecognition ? "22,163,74" : "234,88,12"},0.35);
      transform:translate(-50%,-50%);
      position:relative;
    ">
      ${incident.category.emoji}
      ${incident.status === "resolved" ? `<span style="position:absolute;bottom:-2px;right:-2px;font-size:10px;background:white;border-radius:50%;padding:1px;">✓</span>` : ""}
    </div>`;

  const icon = L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
  iconCache.set(key, icon);
  return icon;
}

function visibilityLabel(incident: Incident): string {
  if (incident.status === "under_review" || incident.underLegalReview) return "Under Review";
  if (incident.status === "resolution_pending") return "Resolution Pending";
  if (incident.status === "resolved") return "Resolved";
  if (incident.visibilityStage === "seed") return "Community Report (Unverified)";
  if (incident.visibilityStage === "verified") return "Verified";
  return "Pending";
}

export function MapView({
  incidents,
  center,
  zoom = DEFAULT_MAP_ZOOM,
  selectedId,
  userLocation,
  onSelect,
  onMove,
  onZoom,
}: {
  incidents: Incident[];
  center: { lat: number; lng: number };
  zoom?: number;
  selectedId: string | null;
  userLocation?: { lat: number; lng: number } | null;
  onSelect: (id: string) => void;
  onMove: (lat: number, lng: number) => void;
  onZoom?: (zoom: number) => void;
}) {
  const visibleIncidents = useMemo(
    () =>
      zoom < STREET_LEVEL_ZOOM
        ? incidents.filter((i) => i.visibilityStage !== "seed")
        : incidents,
    [incidents, zoom]
  );

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={true}
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapMover center={center} zoom={zoom} />
      <MapEvents onMove={onMove} onZoom={onZoom} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {visibleIncidents.map((inc) => (
        <Marker
          key={inc.id}
          position={[inc.latitude, inc.longitude]}
          icon={createIcon(inc, inc.id === selectedId)}
          eventHandlers={{ click: () => onSelect(inc.id) }}
        >
          <Popup>
            <div className="text-sm">
              <strong>
                {inc.category.emoji} {inc.displayLabel ?? inc.category.name}
              </strong>
              <p className="mt-1 text-stone-500">
                {visibilityLabel(inc)} · {Math.round(inc.confidenceScore * 100)}% confidence
              </p>
              {(inc.confirmationCount ?? 0) > 0 && (
                <p className="text-xs text-stone-400">{inc.confirmationCount} community reports</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

/** @deprecated Import from `@/components/map-picker` instead */
export { LocationPicker } from "@/components/map-picker";
