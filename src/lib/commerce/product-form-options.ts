import type { ProductMood } from "@/lib/aesthetics/types";

/** Core mood filters used across the storefront */
export const PRODUCT_MOOD_OPTIONS: { value: ProductMood; label: string; hint: string }[] = [
  { value: "calm", label: "Calm", hint: "Soft, quiet, restorative" },
  { value: "bold", label: "Bold", hint: "Statement, contrast, presence" },
  { value: "romantic", label: "Romantic", hint: "Warm, intimate, soft light" },
  { value: "earthy", label: "Earthy", hint: "Natural, grounded, tactile" },
  { value: "modern", label: "Modern", hint: "Clean lines, contemporary" },
];

export type DimensionHint = {
  label: string;
  placeholder: string;
  fields: string[];
  tip: string;
};

/** Suggest which dimensions to collect based on product category (and optional image cues). */
export function dimensionHintForProduct(input: {
  categorySlug?: string;
  categoryName?: string;
  productName?: string;
  description?: string;
}): DimensionHint {
  const hay = `${input.categorySlug || ""} ${input.categoryName || ""} ${input.productName || ""} ${input.description || ""}`.toLowerCase();

  if (/wear|apparel|cloth|scrunchie|scarf|jewellery|jewelry|ring|earring/.test(hay)) {
    return {
      label: "Size / fit",
      placeholder: "e.g. One size · Diameter 6 cm",
      fields: ["Size", "Diameter / length (cm)"],
      tip: "Wearables need size or circumference more than box dimensions.",
    };
  }
  if (/light|lamp|pendant|candle|sconce/.test(hay)) {
    return {
      label: "Lighting dimensions",
      placeholder: "e.g. Height 28 cm · Shade Ø 15 cm",
      fields: ["Height (cm)", "Shade / base diameter (cm)"],
      tip: "For lamps, height + shade diameter helps customers judge scale.",
    };
  }
  if (/fragrance|perfume|diffuser|oil|bottle/.test(hay)) {
    return {
      label: "Bottle / fill volume",
      placeholder: "e.g. 50 ml · Height 12 cm",
      fields: ["Volume (ml)", "Height (cm)"],
      tip: "Fragrance products usually need fill volume first.",
    };
  }
  if (/stationery|journal|notebook|paper|card/.test(hay)) {
    return {
      label: "Page / cover size",
      placeholder: "e.g. A5 · 14.8 × 21 cm · 120 pages",
      fields: ["Format", "W × H (cm)", "Pages"],
      tip: "Stationery is easiest as width × height (and page count if relevant).",
    };
  }
  if (/throw|blanket|textile|linen|cushion|pillow/.test(hay)) {
    return {
      label: "Textile size",
      placeholder: "e.g. 130 × 180 cm",
      fields: ["Width (cm)", "Length (cm)"],
      tip: "Soft goods are usually flat width × length.",
    };
  }
  if (/art|print|frame|poster|mirror/.test(hay)) {
    return {
      label: "Artwork / frame size",
      placeholder: "e.g. 30 × 40 cm (framed)",
      fields: ["Width (cm)", "Height (cm)", "Depth (cm)"],
      tip: "Art and mirrors need face size; add depth if framed.",
    };
  }

  // Default home / object
  return {
    label: "Object dimensions",
    placeholder: "e.g. 12 × 8 × 10 cm (L × W × H)",
    fields: ["Length (cm)", "Width (cm)", "Height (cm)"],
    tip: "Most home objects ship best with length × width × height in cm.",
  };
}

export function slugifyProduct(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

export function defaultProductName(description: string) {
  const cleaned = description.trim().replace(/\s+/g, " ");
  if (!cleaned) return "Untitled piece";
  const firstSentence = cleaned.split(/[.!?]/)[0] || cleaned;
  return firstSentence.slice(0, 80).trim() || "Untitled piece";
}
