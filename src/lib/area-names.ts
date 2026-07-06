import { GLOBAL_SAMPLE_PLACES } from "./constants";
import { haversineDistance } from "./utils";

/** Pick the best human-readable label for a map grid / ranking cell */
export function resolveAreaName(
  lat: number,
  lng: number,
  addresses: (string | null | undefined)[]
): string {
  const counts = new Map<string, number>();
  for (const addr of addresses) {
    const trimmed = addr?.trim();
    if (!trimmed) continue;
    counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1);
  }

  if (counts.size > 0) {
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }

  let nearest: (typeof GLOBAL_SAMPLE_PLACES)[number] | null = null;
  let minDist = Infinity;
  for (const place of GLOBAL_SAMPLE_PLACES) {
    const d = haversineDistance(lat, lng, place.lat, place.lng);
    if (d < minDist) {
      minDist = d;
      nearest = place;
    }
  }

  if (nearest && minDist <= 120_000) {
    return nearest.name;
  }

  return formatRegionLabel(lat, lng);
}

function formatRegionLabel(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `Region ${Math.abs(lat).toFixed(1)}°${latDir}, ${Math.abs(lng).toFixed(1)}°${lngDir}`;
}

export function areaGroupKey(
  lat: number,
  lng: number,
  address?: string | null
): string {
  const trimmed = address?.trim();
  if (trimmed) return `place:${trimmed.toLowerCase()}`;
  return `grid:${lat.toFixed(2)},${lng.toFixed(2)}`;
}
