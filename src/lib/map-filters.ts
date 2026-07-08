import { haversineDistance } from "./utils";

export const NEAR_ME_RADIUS_M = 3000;

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
    result = result.filter((i) => i.category.slug === options.categorySlug);
  }

  if (options.nearMeOnly && options.userLocation) {
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
