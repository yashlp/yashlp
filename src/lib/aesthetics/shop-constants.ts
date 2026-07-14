export const SEARCH_MOOD_CHIPS = [
  "Minimal",
  "Japandi",
  "Blue",
  "Gift",
  "Cozy",
  "Relax",
  "Focus",
] as const;

export const SHOP_BY_ROOMS = [
  { slug: "workspace", label: "Workspace", image: "/aesthetics/rooms/workspace.jpg" },
  { slug: "bedroom", label: "Bedroom", image: "/aesthetics/rooms/bedroom.jpg" },
  { slug: "living-room", label: "Living Room", image: "/aesthetics/rooms/living.jpg" },
  { slug: "coffee-corner", label: "Coffee Corner", image: "/aesthetics/rooms/coffee.jpg" },
  { slug: "bathroom", label: "Bathroom", image: "/aesthetics/rooms/bathroom.jpg" },
  { slug: "entryway", label: "Entryway", image: "/aesthetics/rooms/entryway.jpg" },
] as const;

export const FILTER_STYLES = ["Minimal", "Japandi", "Modern", "Vintage", "Botanical"] as const;
export const FILTER_MOODS = ["calm", "bold", "romantic", "earthy", "modern"] as const;
