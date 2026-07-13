import type { Brand } from "./types";

export const BRANDS: Brand[] = [
  {
    id: "b1",
    name: "Atelier Lumen",
    slug: "atelier-lumen",
    tagline: "Sculptural ceramics for slow living",
    instagram: "@atelierlumen",
    verified: true,
  },
  {
    id: "b2",
    name: "Nocturne Studio",
    slug: "nocturne-studio",
    tagline: "Light as atmosphere",
    instagram: "@nocturnestudio",
    verified: true,
  },
  {
    id: "b3",
    name: "Field Notes Co.",
    slug: "field-notes-co",
    tagline: "Paper for wandering minds",
    instagram: "@fieldnotesco",
    verified: true,
  },
  {
    id: "b4",
    name: "Lune Atelier",
    slug: "lune-atelier",
    tagline: "Jewelry with irregular beauty",
    instagram: "@luneatelier",
    verified: true,
  },
  {
    id: "b5",
    name: "Ether Scents",
    slug: "ether-scents",
    tagline: "Fragrance as memory",
    instagram: "@etherscents",
    verified: false,
  },
  {
    id: "b6",
    name: "Somnus",
    slug: "somnus",
    tagline: "Rest, reimagined",
    instagram: "@somnusrest",
    verified: true,
  },
];

export function getBrand(id: string): Brand | undefined {
  return BRANDS.find((b) => b.id === id);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
