import { getPublicSiteConfig } from "@/lib/site-settings";
import { jsonWithCache } from "@/lib/api-cache";

export async function GET() {
  const config = await getPublicSiteConfig();
  return jsonWithCache(config, "public, s-maxage=30, stale-while-revalidate=60");
}
