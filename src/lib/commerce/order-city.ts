/** Normalize city labels for grouping (e.g. "mumbai" → "Mumbai"). */
export function normalizeCityName(city: string): string {
  return city
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Extract city from structured field or legacy multi-line shippingAddress.
 * Address format written at checkout:
 *   Name
 *   line1
 *   line2?
 *   City, State PIN   OR   City PIN
 *   IN
 *   Phone: …
 *   Email: …
 */
export function extractOrderCity(input: {
  shippingCity?: string | null;
  shippingAddress?: string | null;
}): string | null {
  if (input.shippingCity?.trim()) {
    return normalizeCityName(input.shippingCity);
  }

  const address = input.shippingAddress?.trim();
  if (!address) return null;

  const lines = address
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^phone:/i.test(l) && !/^email:/i.test(l) && !/^(IN|US|India)$/i.test(l));

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    // "Mumbai, Maharashtra 400001" or "Mumbai 400001"
    const withPin = line.match(/^(.+?)(?:,\s*[^,\d]+)?\s+(\d{5,6})$/);
    if (withPin) {
      const cityPart = withPin[1].includes(",")
        ? withPin[1].split(",")[0]
        : withPin[1];
      return normalizeCityName(cityPart);
    }
  }

  return null;
}
