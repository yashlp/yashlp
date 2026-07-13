/**
 * India-focused product search with synonym expansion for natural-language queries.
 * e.g. "good smell" → lavender room mist, midnight taper set
 */
const SYNONYM_GROUPS: string[][] = [
  ["scent", "smell", "fragrance", "aroma", "perfume", "mist", "lavender"],
  ["candle", "taper", "lighting", "midnight", "beeswax"],
  ["journal", "notebook", "stationery", "paper", "writing"],
  ["ceramic", "vessel", "vase", "pottery", "cloud"],
  ["jewelry", "jewellery", "earring", "pearl", "wearable"],
  ["blanket", "throw", "linen", "cozy", "warm"],
  ["sleep", "wellness", "mask", "silk", "eye"],
  ["desk", "tray", "brass", "office", "work"],
  ["lamp", "light", "floor", "arc", "steel"],
  ["gift", "present", "under"],
];

function expandToken(token: string): string[] {
  const lower = token.toLowerCase().trim();
  if (!lower) return [];
  const expanded = new Set<string>([lower]);
  for (const group of SYNONYM_GROUPS) {
    if (group.some((w) => lower.includes(w) || w.includes(lower))) {
      group.forEach((w) => expanded.add(w));
    }
  }
  return [...expanded];
}

export function expandSearchQuery(query: string): string[] {
  const phrases = query.toLowerCase().trim();
  const tokens = phrases.split(/\s+/).filter(Boolean);
  const expanded = new Set<string>();

  // whole phrase
  expandToken(phrases).forEach((t) => expanded.add(t));
  tokens.forEach((t) => expandToken(t).forEach((e) => expanded.add(e)));

  return [...expanded];
}

export type SearchableProduct = {
  name: string;
  description: string;
  shortDescription?: string | null;
  tags: string[];
  category: string;
  mood?: string | null;
  materials?: string[];
  colors?: string[];
};

export function scoreProductSearch(product: SearchableProduct, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const haystack = [
    product.name,
    product.description,
    product.shortDescription ?? "",
    product.category,
    product.mood ?? "",
    ...product.tags,
    ...(product.materials ?? []),
    ...(product.colors ?? []),
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  if (haystack.includes(q)) score += 100;
  if (product.name.toLowerCase().includes(q)) score += 80;

  const expanded = expandSearchQuery(q);
  for (const term of expanded) {
    if (term.length < 3) continue;
    if (product.name.toLowerCase().includes(term)) score += 25;
    if (haystack.includes(term)) score += 12;
    for (const tag of product.tags) {
      if (tag.toLowerCase().includes(term)) score += 18;
    }
  }

  const tokens = q.split(/\s+/).filter((t) => t.length > 2);
  const matchedTokens = tokens.filter((t) => haystack.includes(t) || expanded.some((e) => haystack.includes(e)));
  score += matchedTokens.length * 15;

  return score;
}

export function searchProducts<T extends SearchableProduct>(products: T[], query: string, limit = 50): T[] {
  const q = query.trim();
  if (!q) return products.slice(0, limit);

  return products
    .map((p) => ({ p, score: scoreProductSearch(p, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ p }) => p)
    .slice(0, limit);
}
