import { CACHE_PUBLIC_SHORT, jsonWithCache } from "@/lib/api-cache";
import { getPopularCategoriesInArea } from "@/lib/health-score";
import { POPULAR_CATEGORY_SLUGS, POPULAR_POSITIVE_CATEGORY_SLUGS } from "@/lib/constants";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") === "positive" ? "positive" : "issue") as
    | "issue"
    | "positive";
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const radius = parseInt(searchParams.get("radius") ?? "800", 10);

  let slugs: string[] = [];
  let counts: Record<string, number> = {};

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const area = await getPopularCategoriesInArea(lat, lng, type, radius);
    slugs = area.slugs;
    counts = area.counts;
  }

  const fallback =
    type === "positive" ? POPULAR_POSITIVE_CATEGORY_SLUGS : POPULAR_CATEGORY_SLUGS;

  if (slugs.length === 0) {
    slugs = [...fallback];
  }

  const categories = await prisma.category.findMany({
    where: { slug: { in: slugs }, type },
    select: {
      id: true,
      slug: true,
      name: true,
      emoji: true,
      type: true,
      group: true,
      photoRequired: true,
      photoRule: true,
      description: true,
      sortOrder: true,
    },
  });

  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const ordered = slugs
    .map((slug) => bySlug.get(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return jsonWithCache({ categories: ordered, counts }, CACHE_PUBLIC_SHORT);
}
