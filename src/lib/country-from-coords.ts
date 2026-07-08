import { GLOBAL_SAMPLE_PLACES } from "./constants";

/** Rough bounding boxes for country inference from coordinates (demo + global coverage). */
const COUNTRY_BOUNDS: Array<{
  code: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}> = [
  { code: "IN", minLat: 6, maxLat: 37, minLng: 68, maxLng: 97 },
  { code: "GB", minLat: 49, maxLat: 61, minLng: -8.5, maxLng: 2 },
  { code: "NG", minLat: 4, maxLat: 14, minLng: 2.5, maxLng: 15 },
  { code: "BR", minLat: -34, maxLat: 6, minLng: -74, maxLng: -34 },
  { code: "JP", minLat: 24, maxLat: 46, minLng: 122, maxLng: 146 },
  { code: "AU", minLat: -44, maxLat: -10, minLng: 113, maxLng: 154 },
  { code: "US", minLat: 24, maxLat: 50, minLng: -125, maxLng: -66 },
  { code: "CA", minLat: 41, maxLat: 70, minLng: -141, maxLng: -52 },
];

const ADDRESS_COUNTRY_HINTS: Array<{ pattern: RegExp; code: string }> = [
  { pattern: /\bindia\b/i, code: "IN" },
  { pattern: /\buk\b|united kingdom|england|scotland|wales/i, code: "GB" },
  { pattern: /\bnigeria\b/i, code: "NG" },
  { pattern: /\bbrazil\b|brasil|são paulo/i, code: "BR" },
  { pattern: /\bjapan\b|tokyo/i, code: "JP" },
  { pattern: /\baustralia\b|sydney/i, code: "AU" },
  { pattern: /\bunited states\b|\busa\b/i, code: "US" },
  { pattern: /\bcanada\b/i, code: "CA" },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Resolve ISO-style country code from coordinates and optional address label. */
export function inferCountryCode(
  latitude: number,
  longitude: number,
  address?: string | null
): string | null {
  const trimmed = address?.trim();
  if (trimmed) {
    for (const hint of ADDRESS_COUNTRY_HINTS) {
      if (hint.pattern.test(trimmed)) return hint.code;
    }
  }

  for (const box of COUNTRY_BOUNDS) {
    if (
      latitude >= box.minLat &&
      latitude <= box.maxLat &&
      longitude >= box.minLng &&
      longitude <= box.maxLng
    ) {
      return box.code;
    }
  }

  let nearest: { code: string; dist: number } | null = null;
  for (const place of GLOBAL_SAMPLE_PLACES) {
    if (!place.countryCode) continue;
    const dist = haversineKm(latitude, longitude, place.lat, place.lng);
    if (dist <= 400 && (!nearest || dist < nearest.dist)) {
      nearest = { code: place.countryCode, dist };
    }
  }

  return nearest?.code ?? null;
}
