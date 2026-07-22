import { haversineDistance } from "./utils";
import { WOMENS_SAFETY_CATEGORY_SLUGS } from "./categories";

export const NEAR_ME_RADIUS_M = 3000;
export const WOMENS_SAFETY_FILTER_SLUG = "__womens_safety__";

export type MapFilterMode = "all" | "issues" | "positive" | "resolved";

export type MapCategoryFilter = {
  slug: string;
  label: string;
  emoji: string;
};

/** Quick map filters — spotlight pin types users search for near them */
export const MAP_CATEGORY_FILTERS: MapCategoryFilter[] = [
  { slug: "reel-making-spot", label: "Reel spots", emoji: "🎬" },
  { slug: "photogenic-place", label: "Photogenic", emoji: "📸" },
  { slug: "great-community-area", label: "Great areas", emoji: "🏘️" },
  { slug: "trusted-street-food-spot", label: "Food spots", emoji: "🍛" },
  { slug: "clean-park", label: "Parks", emoji: "🌳" },
  { slug: WOMENS_SAFETY_FILTER_SLUG, label: "Women's safety", emoji: "🛡️" },
  { slug: "potholes-bad-roads", label: "Road issues", emoji: "🕳️" },
];

type MappableIncident = {
  latitude: number;
  longitude: number;
  status: string;
  isPositive: boolean;
  category: { slug: string };
};

export function filterMapIncidents<T extends MappableIncident>(
  incidents: T[],
  options: {
    filter: MapFilterMode;
    categorySlug?: string | null;
    nearMeOnly: boolean;
    userLocation?: { lat: number; lng: number } | null;
    nearRadiusM?: number;
  }
): T[] {
  let result = incidents;

  if (options.filter === "issues") {
    result = result.filter((i) => !i.isPositive && i.status !== "resolved");
  } else if (options.filter === "positive") {
    result = result.filter((i) => i.isPositive || i.status === "positive_active");
  } else if (options.filter === "resolved") {
    result = result.filter((i) => i.status === "resolved");
  }

  if (options.categorySlug) {
    if (options.categorySlug === WOMENS_SAFETY_FILTER_SLUG) {
      result = result.filter((i) =>
        (WOMENS_SAFETY_CATEGORY_SLUGS as readonly string[]).includes(i.category.slug)
      );
    } else {
      result = result.filter((i) => i.category.slug === options.categorySlug);
    }
  }

  if (options.nearMeOnly) {
    // Until GPS arrives, show nothing — avoid flashing every pin worldwide.
    if (!options.userLocation) return [];
    const radius = options.nearRadiusM ?? NEAR_ME_RADIUS_M;
    result = result.filter(
      (i) =>
        haversineDistance(
          options.userLocation!.lat,
          options.userLocation!.lng,
          i.latitude,
          i.longitude
        ) <= radius
    );
  }

  return result;
}

/** Build map filter shortcuts from densest categories in the visible area */
export function getAreaFilterShortcuts<
  T extends { latitude: number; longitude: number; category: { slug: string; name: string; emoji: string } },
>(
  incidents: T[],
  center: { lat: number; lng: number },
  radiusM = 2500,
  limit = 6
): Array<MapCategoryFilter & { count: number }> {
  const counts = new Map<string, { label: string; emoji: string; count: number }>();

  for (const inc of incidents) {
    if (
      haversineDistance(center.lat, center.lng, inc.latitude, inc.longitude) > radiusM
    ) {
      continue;
    }
    const slug = inc.category.slug;
    const cur = counts.get(slug) ?? {
      label: shortFilterLabel(inc.category.name, inc.category.slug),
      emoji: inc.category.emoji,
      count: 0,
    };
    cur.count += 1;
    counts.set(slug, cur);
  }

  // Prefer dense local categories; fill with curated defaults if sparse
  const local = [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([slug, v]) => ({ slug, label: v.label, emoji: v.emoji, count: v.count }));

  if (local.length >= 3) return local;

  const used = new Set(local.map((l) => l.slug));
  const fillers = MAP_CATEGORY_FILTERS.filter((f) => !used.has(f.slug)).map((f) => ({
    ...f,
    count: counts.get(f.slug)?.count ?? 0,
  }));

  return [...local, ...fillers].slice(0, limit);
}

function shortFilterLabel(name: string, slug: string): string {
  const curated = MAP_CATEGORY_FILTERS.find((f) => f.slug === slug);
  if (curated) return curated.label;
  if (name.length <= 16) return name;
  return name.slice(0, 14).trimEnd() + "…";
}
