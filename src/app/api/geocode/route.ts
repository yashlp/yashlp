import { NextResponse } from "next/server";

import { rateLimitResponse } from "@/lib/api-security";
import { looksLikePincode } from "@/lib/countries";
import type { GeocodePlace } from "@/lib/geocode";

type NominatimAddress = {
  country_code?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  suburb?: string;
  county?: string;
  country?: string;
};

type NominatimItem = {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
};

function mapNominatimItem(item: NominatimItem): GeocodePlace {
  const addr = item.address;
  return {
    name: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    countryCode: addr?.country_code?.toUpperCase(),
    city: addr?.city ?? addr?.town ?? addr?.village ?? addr?.suburb,
    state: addr?.state ?? addr?.county,
    postcode: addr?.postcode,
    suburb: addr?.suburb,
  };
}

async function reverseGeocode(lat: number, lng: number): Promise<GeocodePlace | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "18");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "CivicLens/1.0 (community intelligence platform)",
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as NominatimItem & { error?: string };
  if (!data?.lat || !data?.lon || data.error) return null;
  return mapNominatimItem(data);
}

/** Free worldwide geocoding via OpenStreetMap Nominatim (no API key required) */
export async function GET(req: Request) {
  const limited = rateLimitResponse(req, "geocode", 60, 60 * 1000);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const q = searchParams.get("q")?.trim();
  const country = searchParams.get("country")?.trim().toUpperCase();

  // Reverse geocode: ?lat=&lng=
  if (latParam != null && lngParam != null) {
    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }
    try {
      const place = await reverseGeocode(lat, lng);
      if (!place) {
        return NextResponse.json({
          place: {
            name: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            lat,
            lng,
          } satisfies GeocodePlace,
        });
      }
      return NextResponse.json({ place });
    } catch {
      return NextResponse.json({
        place: {
          name: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          lat,
          lng,
        } satisfies GeocodePlace,
      });
    }
  }

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] as GeocodePlace[] });
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "8");
    url.searchParams.set("addressdetails", "1");

    if (country && country !== "INT") {
      url.searchParams.set("countrycodes", country.toLowerCase());
    }

    if (country && country !== "INT" && looksLikePincode(q, country)) {
      url.searchParams.set("postalcode", q.replace(/\s+/g, ""));
      url.searchParams.set("country", country);
    } else {
      url.searchParams.set("q", q);
    }

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "CivicLens/1.0 (community intelligence platform)",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = (await res.json()) as NominatimItem[];
    const results = data.map(mapNominatimItem);

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
