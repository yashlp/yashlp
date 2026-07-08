import { GLOBAL_SAMPLE_PLACES } from "./constants";
import { haversineDistance } from "./utils";

/** Metropolitan radius — covers full city (e.g. all of Mumbai from any lane). */
export const CITY_METRO_RADIUS_M = 40_000;

export type ResolvedCity = {
  cityName: string;
  state?: string;
  countryCode?: string;
  centerLat: number;
  centerLng: number;
  source: "reverse_geocode" | "sample_place" | "coordinates";
};

type NominatimReverseAddress = {
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  state?: string;
  county?: string;
  country_code?: string;
};

type NominatimReverse = {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimReverseAddress;
};

function cityFromAddress(addr?: NominatimReverseAddress): string | null {
  if (!addr) return null;
  return addr.city ?? addr.town ?? addr.village ?? addr.suburb ?? addr.county ?? null;
}

function extractCityFromLabel(label: string): string {
  const first = label.split(",")[0]?.trim();
  return first || label;
}

/** Reverse geocode coordinates to a city name (Nominatim). */
export async function reverseGeocodeCity(
  lat: number,
  lng: number
): Promise<ResolvedCity | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "10");

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "CivicLens/1.0 (community intelligence platform)",
        Accept: "application/json",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as NominatimReverse;
    const cityName = cityFromAddress(data.address);
    if (!cityName) return null;

    return {
      cityName,
      state: data.address?.state,
      countryCode: data.address?.country_code?.toUpperCase(),
      centerLat: parseFloat(data.lat),
      centerLng: parseFloat(data.lon),
      source: "reverse_geocode",
    };
  } catch {
    return null;
  }
}

/** Resolve city from coordinates — geocode first, then nearest known sample city. */
export async function resolveCityFromCoordinates(
  lat: number,
  lng: number
): Promise<ResolvedCity> {
  const geocoded = await reverseGeocodeCity(lat, lng);
  if (geocoded) return geocoded;

  let nearest: (typeof GLOBAL_SAMPLE_PLACES)[number] | null = null;
  let minDist = Infinity;
  for (const place of GLOBAL_SAMPLE_PLACES) {
    const d = haversineDistance(lat, lng, place.lat, place.lng);
    if (d < minDist) {
      minDist = d;
      nearest = place;
    }
  }

  if (nearest && minDist <= CITY_METRO_RADIUS_M) {
    return {
      cityName: extractCityFromLabel(nearest.name),
      countryCode: nearest.countryCode,
      centerLat: nearest.lat,
      centerLng: nearest.lng,
      source: "sample_place",
    };
  }

  return {
    cityName: formatCoordsCity(lat, lng),
    centerLat: lat,
    centerLng: lng,
    source: "coordinates",
  };
}

function formatCoordsCity(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `Area ${Math.abs(lat).toFixed(1)}°${latDir}, ${Math.abs(lng).toFixed(1)}°${lngDir}`;
}

/** Whether an incident belongs to the resolved city metro area. */
export function incidentInCity(
  incident: { latitude: number; longitude: number; address?: string | null },
  city: ResolvedCity
): boolean {
  const cityKey = city.cityName.toLowerCase();
  if (incident.address?.toLowerCase().includes(cityKey)) return true;

  return (
    haversineDistance(city.centerLat, city.centerLng, incident.latitude, incident.longitude) <=
    CITY_METRO_RADIUS_M
  );
}
