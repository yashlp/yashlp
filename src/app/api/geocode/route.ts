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

/** Free worldwide geocoding via OpenStreetMap Nominatim (no API key required) */
export async function GET(req: Request) {
  const limited = rateLimitResponse(req, "geocode", 60, 60 * 1000);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const country = searchParams.get("country")?.trim().toUpperCase();

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
