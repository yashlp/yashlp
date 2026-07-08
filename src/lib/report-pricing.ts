import type { ReportProductId, ReportTier } from "./report-demo-data";
import { getReportPrice, REPORT_PRICING } from "./report-demo-data";

export type PricingMarket = "india" | "international";

export type LocalizedPrice = {
  market: PricingMarket;
  amount: number;
  currency: "INR" | "USD";
  formatted: string;
  altFormatted: string;
};

/** India bounding box (approximate) for report-area pricing. */
export function marketFromCoords(lat: number, lng: number): PricingMarket {
  if (lat >= 6 && lat <= 37 && lng >= 68 && lng <= 98) return "india";
  return "international";
}

export function marketFromCountryCode(code: string | null | undefined): PricingMarket {
  if (code?.toUpperCase() === "IN") return "india";
  return "international";
}

export function resolvePricingMarket(input: {
  areaLat?: number | null;
  areaLng?: number | null;
  countryCode?: string | null;
}): PricingMarket {
  const code = input.countryCode?.toUpperCase();
  if (code && code !== "INT") {
    return marketFromCountryCode(code);
  }
  if (input.areaLat != null && input.areaLng != null) {
    return marketFromCoords(input.areaLat, input.areaLng);
  }
  return "international";
}

export function getLocalizedTierPrice(tier: ReportTier, market: PricingMarket): LocalizedPrice {
  const { inr, usd } = REPORT_PRICING[tier];
  if (market === "india") {
    return {
      market,
      amount: inr,
      currency: "INR",
      formatted: `₹${inr}`,
      altFormatted: `$${usd} USD`,
    };
  }
  return {
    market,
    amount: usd,
    currency: "USD",
    formatted: `$${usd}`,
    altFormatted: `₹${inr}`,
  };
}

export function getLocalizedReportPrice(productId: ReportProductId, market: PricingMarket): LocalizedPrice {
  const { tier } = getReportPrice(productId);
  return getLocalizedTierPrice(tier, market);
}

export function pricingRegionLabel(
  market: PricingMarket,
  options?: { areaBased?: boolean; countryName?: string }
): string {
  if (options?.areaBased) {
    return market === "india" ? "India (report area)" : "International (report area)";
  }
  if (options?.countryName && options.countryName !== "International") {
    return options.countryName;
  }
  return market === "india" ? "India" : "International";
}
