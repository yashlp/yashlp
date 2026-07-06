import { CACHE_PUBLIC_SHORT, jsonWithCache } from "@/lib/api-cache";
import { getRankings, getTrends } from "@/lib/health-score";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "trends";

  if (type === "rankings") {
    const rankings = await getRankings(10);
    return jsonWithCache({ rankings }, CACHE_PUBLIC_SHORT);
  }

  const trends = await getTrends(30);
  return jsonWithCache({ trends }, CACHE_PUBLIC_SHORT);
}
