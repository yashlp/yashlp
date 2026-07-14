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
  | "fragrance"
  | "art"
  | "kitchen";

export type ProductMood = "calm" | "bold" | "romantic" | "earthy" | "modern";

export type Brand = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  instagram?: string;
  logo?: string;
  verified: boolean;
};

export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  productIds: string[];
  featured?: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  brand?: Brand;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  tags: ProductTag[];
  mood: ProductMood;
  materials: string[];
  colors: string[];
  room?: string;
  style?: string;
  dimensions?: string;
  specifications?: Record<string, string>;
  vibe: string;
  description: string;
  images: string[];
  video?: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  newArrival?: boolean;
  trending?: boolean;
  recommended?: boolean;
  isBestseller?: boolean;
};

export type ShopMode = "classic";
