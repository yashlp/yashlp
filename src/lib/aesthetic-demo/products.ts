export type ProductTag =
  | "minimal"
  | "cozy"
  | "vintage"
  | "botanical"
  | "sculptural"
  | "soft"
  | "artisan"
  | "dreamy";

export type ProductCategory =
  | "home"
  | "wellness"
  | "stationery"
  | "wearables"
  | "lighting"
  | "fragrance";

export type AestheticProduct = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: ProductCategory;
  tags: ProductTag[];
  vibe: string;
  description: string;
  image: string;
  accent: string;
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  home: "Home",
  wellness: "Wellness",
  stationery: "Stationery",
  wearables: "Wearables",
  lighting: "Lighting",
  fragrance: "Fragrance",
};

export const FILTER_OPTIONS: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "For You" },
  { id: "home", label: "Home" },
  { id: "wellness", label: "Wellness" },
  { id: "stationery", label: "Paper" },
  { id: "wearables", label: "Wear" },
  { id: "lighting", label: "Light" },
  { id: "fragrance", label: "Scent" },
];

export const AESTHETIC_PRODUCTS: AestheticProduct[] = [
  {
    id: "p1",
    name: "Cloud Vessel",
    brand: "Atelier Lumen",
    price: 68,
    category: "home",
    tags: ["sculptural", "minimal", "soft"],
    vibe: "soft brutalism",
    description: "Hand-thrown ceramic with an impossible curve — like holding a slow exhale.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    accent: "#7EB8DA",
  },
  {
    id: "p2",
    name: "Midnight Taper Set",
    brand: "Nocturne Studio",
    price: 34,
    category: "lighting",
    tags: ["vintage", "dreamy", "cozy"],
    vibe: "candlelit nostalgia",
    description: "Indigo-dipped beeswax tapers that burn like a memory you can't place.",
    image: "https://images.unsplash.com/photo-1602874801006-4f8a22944a3a?w=800&q=80",
    accent: "#4A7CBB",
  },
  {
    id: "p3",
    name: "Moss Journal",
    brand: "Field Notes Co.",
    price: 28,
    category: "stationery",
    tags: ["botanical", "minimal", "artisan"],
    vibe: "forest floor energy",
    description: "Linen-bound pages with deckled edges. For thoughts that grow slowly.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20842fd0?w=800&q=80",
    accent: "#5B8A72",
  },
  {
    id: "p4",
    name: "Pearl Drop Earrings",
    brand: "Lune Atelier",
    price: 92,
    category: "wearables",
    tags: ["dreamy", "soft", "artisan"],
    vibe: "moonlit minimal",
    description: "Baroque pearls on brushed silver — irregular on purpose.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    accent: "#B8C9E8",
  },
  {
    id: "p5",
    name: "Sage & Sea Salt",
    brand: "Ether Scents",
    price: 56,
    category: "fragrance",
    tags: ["botanical", "cozy", "minimal"],
    vibe: "coastal calm",
    description: "A room that smells like a window left open after rain.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    accent: "#8FAF9A",
  },
  {
    id: "p6",
    name: "Weighted Silk Eye Mask",
    brand: "Somnus",
    price: 44,
    category: "wellness",
    tags: ["soft", "cozy", "dreamy"],
    vibe: "sleep as ritual",
    description: "Cool-touch silk with lavender seed weight. Dreams optional.",
    image: "https://images.unsplash.com/photo-1515377901643-4697fd6f54c9?w=800&q=80",
    accent: "#9BB4D4",
  },
  {
    id: "p7",
    name: "Arc Floor Lamp",
    brand: "Form & Void",
    price: 240,
    category: "lighting",
    tags: ["sculptural", "minimal", "vintage"],
    vibe: "gallery at home",
    description: "A single arc of brushed steel — light as sculpture, not utility.",
    image: "https://images.unsplash.com/photo-1507473889451-b8932f4a0b2c?w=800&q=80",
    accent: "#6B8FB8",
  },
  {
    id: "p8",
    name: "Terracotta Diffuser",
    brand: "Clay & Co.",
    price: 38,
    category: "fragrance",
    tags: ["artisan", "botanical", "vintage"],
    vibe: "sun-baked earth",
    description: "Unglazed terracotta that holds scent like warm skin.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    accent: "#C4956A",
  },
  {
    id: "p9",
    name: "Linen Throw",
    brand: "Hearth & Haze",
    price: 118,
    category: "home",
    tags: ["cozy", "soft", "minimal"],
    vibe: "slow mornings",
    description: "Undyed Belgian linen — gets softer every year you keep it.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
    accent: "#D4C4B0",
  },
  {
    id: "p10",
    name: "Crystal Water Bottle",
    brand: "Aura Hydrate",
    price: 52,
    category: "wellness",
    tags: ["dreamy", "sculptural", "botanical"],
    vibe: "wellness witch",
    description: "Rose quartz chamber. Hydration with intention (and good photos).",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    accent: "#E8B4C8",
  },
  {
    id: "p11",
    name: "Brass Bookmark",
    brand: "Object Poetry",
    price: 22,
    category: "stationery",
    tags: ["vintage", "artisan", "minimal"],
    vibe: "quiet luxury",
    description: "Hand-cut brass leaf that ages with your reading list.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    accent: "#B8956B",
  },
  {
    id: "p12",
    name: "Sheer Layered Scarf",
    brand: "Veil Studio",
    price: 76,
    category: "wearables",
    tags: ["soft", "dreamy", "minimal"],
    vibe: "ethereal layers",
    description: "Two-tone organza that catches light like fog over water.",
    image: "https://images.unsplash.com/photo-1520903920243-00d4a0a86fe1?w=800&q=80",
    accent: "#A8C4E0",
  },
];
