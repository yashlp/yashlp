"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { DEFAULT_MAP_ZOOM } from "@/lib/constants";
import "leaflet/dist/leaflet.css";

type Incident = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  confidenceScore: number;
  isPositive: boolean;
  category: { emoji: string; name: string };
};

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
      prev.current.lat !== center.lat ||
      prev.current.lng !== center.lng ||
      prev.current.zoom !== zoom
    ) {
      map.flyTo([center.lat, center.lng], zoom, { duration: 0.8 });
      prev.current = { ...center, zoom };
    }
  }, [center, zoom, map]);

  return null;
}

function MapEvents({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onMove(c.lat, c.lng);
    },
  });
  return null;
}

function createIcon(incident: Incident, selected: boolean) {
  const color = incident.isPositive
    ? incident.status === "positive_active" || incident.status === "active"
      ? "#2563eb"
      : "#93c5fd"
    : incident.status === "resolved"
      ? "#16a34a"
      : incident.status === "disputed"
        ? "#eab308"
        : incident.status === "pending"
          ? "#f59e0b"
          : "#dc2626";

  const size = selected ? 44 : 36;
  const html = `
    <div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:3px solid ${selected ? "#ea580c" : "white"};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:${selected ? 20 : 16}px;
      box-shadow:0 2px 10px rgba(234,88,12,0.35);
      transform:translate(-50%,-50%);
    ">${incident.category.emoji}</div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function MapView({
  incidents,
  center,
  zoom = DEFAULT_MAP_ZOOM,
  selectedId,
  onSelect,
  onMove,
}: {
  incidents: Incident[];
  center: { lat: number; lng: number };
  zoom?: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={true}
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapMover center={center} zoom={zoom} />
      <MapEvents onMove={onMove} />

      {incidents.map((inc) => (
        <Marker
          key={inc.id}
          position={[inc.latitude, inc.longitude]}
          icon={createIcon(inc, inc.id === selectedId)}
          eventHandlers={{ click: () => onSelect(inc.id) }}
        >
          <Popup>
            <div className="text-sm">
              <strong>
                {inc.category.emoji} {inc.category.name}
              </strong>
              <p className="mt-1 capitalize text-stone-500">
                {inc.status} · {Math.round(inc.confidenceScore * 100)}% confidence
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
