import { NextResponse } from "next/server";
import { CACHE_PUBLIC_SHORT, jsonWithCache } from "@/lib/api-cache";
import { getCityInsights, getCountryRankings } from "@/lib/health-score";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "city";

  if (type === "rankings") {
    const rankings = await getCountryRankings(20);
    return jsonWithCache({ rankings }, CACHE_PUBLIC_SHORT);
  }

  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "lat and lng are required for city insights" },
      { status: 400 }
    );
  }

  const cityInsights = await getCityInsights(lat, lng, 30);
  return jsonWithCache({ cityInsights }, CACHE_PUBLIC_SHORT);
}
