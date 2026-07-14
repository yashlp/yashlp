import type { Product } from "@/lib/aesthetics/types";

const KEY = "aes_recently_viewed";
const MAX = 8;

export type RecentProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
};

export function getRecentlyViewed(): RecentProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function rememberProductView(product: Pick<Product, "id" | "name" | "slug" | "images" | "price">) {
  if (typeof window === "undefined") return;
  const entry: RecentProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.images[0] || "",
    price: product.price,
  };
  const prev = getRecentlyViewed().filter((p) => p.id !== entry.id);
  localStorage.setItem(KEY, JSON.stringify([entry, ...prev].slice(0, MAX)));
}
