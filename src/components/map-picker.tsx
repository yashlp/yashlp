"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents, ZoomControl } from "react-leaflet";
import { USER_LOCATION_ZOOM } from "@/lib/constants";
import "leaflet/dist/leaflet.css";

const userLocationIcon = L.divIcon({
  html: `<div style="width:20px;height:20px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(37,99,235,0.35);"></div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const pinPickerIcon = L.divIcon({
  html: `<div style="width:36px;height:36px;background:#ea580c;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(234,88,12,0.45);"></div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

function PinPickerEvents({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => onPick(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

/** Mini map for picking report location — tap map or drag pin */
export function LocationPicker({
  userLocation,
  pinLocation,
  onPinChange,
}: {
  userLocation: { lat: number; lng: number } | null;
  pinLocation: { lat: number; lng: number };
  onPinChange: (lat: number, lng: number) => void;
}) {
  const center = userLocation ?? pinLocation;

  return (
    <div className="overflow-hidden rounded-2xl border border-orange-200 shadow-inner">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={USER_LOCATION_ZOOM}
        className="h-56 w-full sm:h-64"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="topleft" />
        <MapCenter lat={pinLocation.lat} lng={pinLocation.lng} />
        <PinPickerEvents onPick={onPinChange} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon} />
        )}

        <Marker
          position={[pinLocation.lat, pinLocation.lng]}
          icon={pinPickerIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const pos = e.target.getLatLng();
              onPinChange(pos.lat, pos.lng);
            },
          }}
        />
      </MapContainer>
      <p className="bg-orange-50 px-3 py-2 text-center text-xs text-stone-500">
        <span className="inline-block h-2 w-2 rounded-full bg-blue-600 align-middle" /> You
        {" · "}
        <span className="inline-block h-2 w-2 rounded-full bg-orange-600 align-middle" /> Report
        pin — tap map or drag orange pin
      </p>
    </div>
  );
}
