import { CACHE_PUBLIC_SHORT, jsonWithCache } from "@/lib/api-cache";
import { getAreaHealthScore } from "@/lib/health-score";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? String(DEFAULT_MAP_CENTER.lat));
  const lng = parseFloat(searchParams.get("lng") ?? String(DEFAULT_MAP_CENTER.lng));
  const radius = parseInt(searchParams.get("radius") ?? "800", 10);

  const health = await getAreaHealthScore(lat, lng, radius);
  return jsonWithCache(health, CACHE_PUBLIC_SHORT);
}
