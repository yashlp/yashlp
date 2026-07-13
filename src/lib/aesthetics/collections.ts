import type { Collection } from "./types";

export const COLLECTIONS: Collection[] = [
  {
    id: "c1",
    title: "Slow Mornings",
    slug: "slow-mornings",
    description: "Objects that make waking up feel intentional",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&q=80",
    productIds: ["p9", "p6", "p5"],
    featured: true,
  },
  {
    id: "c2",
    title: "Gallery at Home",
    slug: "gallery-at-home",
    description: "Sculptural pieces that belong in a museum",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80",
    productIds: ["p1", "p7", "p10"],
    featured: true,
  },
  {
    id: "c3",
    title: "Independent Light",
    slug: "independent-light",
    description: "Candles and lamps from small studios",
    image: "https://images.unsplash.com/photo-1602874801006-4f8a22944a3a?w=1200&q=80",
    productIds: ["p2", "p7", "p8"],
    featured: true,
  },
  {
    id: "c4",
    title: "Paper & Ink",
    slug: "paper-and-ink",
    description: "Stationery for the analog soul",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20842fd0?w=1200&q=80",
    productIds: ["p3", "p11"],
  },
  {
    id: "c5",
    title: "Wear the Mood",
    slug: "wear-the-mood",
    description: "Accessories with quiet confidence",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80",
    productIds: ["p4", "p12"],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
