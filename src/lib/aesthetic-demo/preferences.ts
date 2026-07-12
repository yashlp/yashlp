import type { AestheticProduct, ProductCategory, ProductTag } from "./products";

export type SwipeAction = "like" | "pass";

export type PreferenceState = {
  tagScores: Partial<Record<ProductTag, number>>;
  categoryScores: Partial<Record<ProductCategory, number>>;
  likedIds: string[];
  passedIds: string[];
  totalSwipes: number;
};

export function createPreferenceState(): PreferenceState {
  return {
    tagScores: {},
    categoryScores: {},
    likedIds: [],
    passedIds: [],
    totalSwipes: 0,
  };
}

function bumpScore(map: Record<string, number | undefined>, key: string, delta: number) {
  map[key] = (map[key] ?? 0) + delta;
}

export function recordSwipe(
  state: PreferenceState,
  product: AestheticProduct,
  action: SwipeAction
): PreferenceState {
  const delta = action === "like" ? 1 : -0.6;
  const next: PreferenceState = {
    tagScores: { ...state.tagScores },
    categoryScores: { ...state.categoryScores },
    likedIds: [...state.likedIds],
    passedIds: [...state.passedIds],
    totalSwipes: state.totalSwipes + 1,
  };

  for (const tag of product.tags) {
    bumpScore(next.tagScores, tag, delta);
  }
  bumpScore(next.categoryScores, product.category, delta);

  if (action === "like") {
    next.likedIds.push(product.id);
  } else {
    next.passedIds.push(product.id);
  }

  return next;
}

export function scoreProduct(product: AestheticProduct, prefs: PreferenceState): number {
  if (prefs.totalSwipes === 0) return Math.random() * 0.01;

  let score = 0;
  for (const tag of product.tags) {
    score += (prefs.tagScores[tag] ?? 0) * 0.35;
  }
  score += (prefs.categoryScores[product.category] ?? 0) * 0.5;

  if (prefs.likedIds.includes(product.id)) score -= 100;
  if (prefs.passedIds.includes(product.id)) score -= 100;

  return score + Math.random() * 0.05;
}

export function rankProducts(
  products: AestheticProduct[],
  prefs: PreferenceState,
  categoryFilter: ProductCategory | "all"
): AestheticProduct[] {
  const seen = new Set([...prefs.likedIds, ...prefs.passedIds]);
  const pool =
    categoryFilter === "all"
      ? products.filter((p) => !seen.has(p.id))
      : products.filter((p) => p.category === categoryFilter && !seen.has(p.id));

  return [...pool].sort((a, b) => scoreProduct(b, prefs) - scoreProduct(a, prefs));
}

export function getTopVibes(prefs: PreferenceState, limit = 3): string[] {
  const entries = Object.entries(prefs.tagScores) as [ProductTag, number][];
  return entries
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

export function getMatchPercent(prefs: PreferenceState): number {
  if (prefs.totalSwipes === 0) return 0;
  const likes = prefs.likedIds.length;
  return Math.min(98, Math.round(42 + likes * 8 + prefs.totalSwipes * 2));
}
