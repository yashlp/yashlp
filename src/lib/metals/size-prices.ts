/** Per-size Rs/kg prices stored by the stock tool (`jk3_` keys in localStorage). */

export const PRICE_PREFIX = "jk3_";

export type PriceEntry = {
  grade: string;
  shape: string;
  subtype: string;
  size: string;
  price: number;
};

type KeyValueStore = {
  length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
};

export function priceSizeKey(sizeLabel: string): string {
  return sizeLabel.replace(/×/g, "x").replace(/\s+/g, "");
}

export function parsePriceKey(key: string): Omit<PriceEntry, "price"> | null {
  if (!key.startsWith(PRICE_PREFIX)) return null;
  const parts = key.slice(PRICE_PREFIX.length).split("|");
  if (parts.length < 4) return null;
  const size = parts[parts.length - 1];
  if (!parts[0] || !parts[1] || !size) return null;
  return {
    grade: parts[0],
    shape: parts[1],
    subtype: parts.slice(2, -1).join("|"),
    size,
  };
}

export function readPriceEntries(store: KeyValueStore): PriceEntry[] {
  const out: PriceEntry[] = [];
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i);
    if (!key) continue;
    const parsed = parsePriceKey(key);
    if (!parsed) continue;
    const raw = store.getItem(key);
    const price = raw == null ? NaN : parseFloat(raw);
    if (isNaN(price)) continue;
    out.push({ ...parsed, price });
  }
  return out;
}

export function pricesMatching(
  entries: PriceEntry[],
  grade: string,
  shape: string,
  sizeLabel: string
): PriceEntry[] {
  const size = priceSizeKey(sizeLabel);
  return entries.filter(
    (e) => e.grade === grade && e.shape === shape && priceSizeKey(e.size) === size
  );
}

export function formatInrPerKg(price: number): string {
  return `Rs ${price.toFixed(2)}/kg`;
}

export function formatPriceList(matches: Pick<PriceEntry, "subtype" | "price">[]): string {
  if (!matches.length) return "";
  if (matches.length === 1) return formatInrPerKg(matches[0].price);
  return matches.map((m) => `${m.subtype} ${formatInrPerKg(m.price)}`).join(" · ");
}

export function listedPriceLine(
  entries: PriceEntry[],
  grade: string,
  shape: string,
  sizeLabel: string
): string | null {
  const matches = pricesMatching(entries, grade, shape, sizeLabel);
  if (!matches.length) return null;
  const unit = sizeLabel.includes("×") || sizeLabel.includes("x") ? "" : " mm";
  return `Listed price for ${sizeLabel}${unit}: ${formatPriceList(matches)}.`;
}

export function sizeSearchValue(label: string): number {
  const normalized = priceSizeKey(label);
  const head = normalized.split("x")[0];
  return parseFloat(head);
}

export function matchSizes(sizes: string[], query: string): { exact: string | null; nearest: string[] } {
  const q = query.trim();
  if (!q) return { exact: null, nearest: [] };
  const wanted = priceSizeKey(q);
  const exact = sizes.find((s) => priceSizeKey(s) === wanted) ?? null;
  const target = parseFloat(wanted.split("x")[0]);
  if (isNaN(target)) return { exact, nearest: [] };
  const numeric = sizes
    .map((s) => ({ s, v: sizeSearchValue(s) }))
    .filter((x) => !isNaN(x.v))
    .sort((a, b) => a.v - b.v);
  const below = numeric.filter((x) => x.v < target - 0.0001).slice(-3);
  const above = numeric.filter((x) => x.v > target + 0.0001).slice(0, 3);
  const nearest = [...below, ...above].map((x) => x.s).filter((s) => s !== exact);
  return { exact, nearest };
}
