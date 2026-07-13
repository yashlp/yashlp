import type { Product, ProductCategory, ProductMood, ProductTag } from "./types";

export type InteractionType =
  | "like"
  | "pass"
  | "wishlist"
  | "cart"
  | "view"
  | "purchase";

export type PreferenceState = {
  tagScores: Partial<Record<ProductTag, number>>;
  categoryScores: Partial<Record<ProductCategory, number>>;
  moodScores: Partial<Record<ProductMood, number>>;
  brandScores: Record<string, number>;
  colorScores: Record<string, number>;
  materialScores: Record<string, number>;
  likedIds: string[];
  passedIds: string[];
  wishlistIds: string[];
  viewDurations: Record<string, number>;
  totalInteractions: number;
};

export function createPreferenceState(): PreferenceState {
  return {
    tagScores: {},
    categoryScores: {},
    moodScores: {},
    brandScores: {},
    colorScores: {},
    materialScores: {},
    likedIds: [],
    passedIds: [],
    wishlistIds: [],
    viewDurations: {},
    totalInteractions: 0,
  };
}

function bump(map: Record<string, number | undefined>, key: string, delta: number) {
  map[key] = (map[key] ?? 0) + delta;
}

const SIGNAL_WEIGHT: Record<InteractionType, number> = {
  like: 1.2,
  cart: 1.5,
  wishlist: 1.0,
  purchase: 2.0,
  view: 0.3,
  pass: -0.7,
};

export function recordInteraction(
  state: PreferenceState,
  product: Product,
  type: InteractionType,
  viewSeconds = 0
): PreferenceState {
  const delta = SIGNAL_WEIGHT[type];
  const next: PreferenceState = {
    tagScores: { ...state.tagScores },
    categoryScores: { ...state.categoryScores },
    moodScores: { ...state.moodScores },
    brandScores: { ...state.brandScores },
    colorScores: { ...state.colorScores },
    materialScores: { ...state.materialScores },
    likedIds: [...state.likedIds],
    passedIds: [...state.passedIds],
    wishlistIds: [...state.wishlistIds],
    viewDurations: { ...state.viewDurations },
    totalInteractions: state.totalInteractions + 1,
  };

  if (type !== "view" && type !== "pass") {
    for (const tag of product.tags) bump(next.tagScores, tag, delta);
    bump(next.categoryScores, product.category, delta);
    bump(next.moodScores, product.mood, delta);
    bump(next.brandScores, product.brandId, delta);
    for (const c of product.colors) bump(next.colorScores, c, delta * 0.5);
    for (const m of product.materials) bump(next.materialScores, m, delta * 0.4);
  }

  if (type === "like" || type === "cart" || type === "purchase") {
    if (!next.likedIds.includes(product.id)) next.likedIds.push(product.id);
  }
  if (type === "pass") next.passedIds.push(product.id);
  if (type === "wishlist") {
    if (!next.wishlistIds.includes(product.id)) next.wishlistIds.push(product.id);
  }
  if (viewSeconds > 0) {
    next.viewDurations[product.id] = (next.viewDurations[product.id] ?? 0) + viewSeconds;
    const viewBoost = Math.min(viewSeconds / 10, 0.5);
    for (const tag of product.tags) bump(next.tagScores, tag, viewBoost * 0.2);
  }

  return next;
}

export function scoreProduct(product: Product, prefs: PreferenceState): number {
  if (prefs.totalInteractions === 0) return Math.random() * 0.01;

  let score = 0;
  for (const tag of product.tags) score += (prefs.tagScores[tag] ?? 0) * 0.3;
  score += (prefs.categoryScores[product.category] ?? 0) * 0.4;
  score += (prefs.moodScores[product.mood] ?? 0) * 0.25;
  score += (prefs.brandScores[product.brandId] ?? 0) * 0.2;
  for (const c of product.colors) score += (prefs.colorScores[c] ?? 0) * 0.1;
  for (const m of product.materials) score += (prefs.materialScores[m] ?? 0) * 0.08;
  score += Math.min((prefs.viewDurations[product.id] ?? 0) / 5, 1) * 0.15;

  if (prefs.likedIds.includes(product.id)) score -= 100;
  if (prefs.passedIds.includes(product.id)) score -= 100;

  return score + Math.random() * 0.03;
}

export function rankProducts(
  products: Product[],
  prefs: PreferenceState,
  category?: Product["category"] | "all"
): Product[] {
  const seen = new Set([...prefs.likedIds, ...prefs.passedIds]);
  const pool =
    !category || category === "all"
      ? products.filter((p) => !seen.has(p.id))
      : products.filter((p) => p.category === category && !seen.has(p.id));

  return [...pool].sort((a, b) => scoreProduct(b, prefs) - scoreProduct(a, prefs));
}

export function getAestheticProfile(prefs: PreferenceState): {
  topTags: string[];
  topMoods: string[];
  matchPercent: number;
} {
  const topTags = Object.entries(prefs.tagScores)
    .filter(([, v]) => (v ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 3)
    .map(([k]) => k);

  const topMoods = Object.entries(prefs.moodScores)
    .filter(([, v]) => (v ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 2)
    .map(([k]) => k);

  const matchPercent =
    prefs.totalInteractions === 0
      ? 0
      : Math.min(98, Math.round(40 + prefs.likedIds.length * 7 + prefs.totalInteractions * 1.5));

  return { topTags, topMoods, matchPercent };
}
