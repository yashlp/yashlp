"use client";

import { useEffect, useMemo, useState } from "react";
import { getCountryName } from "@/lib/countries";
import { LEGAL_COUNTRY_KEY } from "@/lib/constants";
import {
  marketFromCoords,
  marketFromCountryCode,
  pricingRegionLabel,
  resolvePricingMarket,
  type PricingMarket,
} from "@/lib/report-pricing";

type AreaCoords = { lat: number; lng: number };

type PricingRegionOptions = {
  areaCoords?: AreaCoords | null;
  /** Country from place search picker or selected place — drives ₹ vs $ */
  countryCode?: string | null;
};

export function usePricingRegion(options?: PricingRegionOptions | AreaCoords | null) {
  const normalized: PricingRegionOptions =
    options && "lat" in options ? { areaCoords: options } : (options ?? {});

  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [detectedName, setDetectedName] = useState("");

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(LEGAL_COUNTRY_KEY) : null;
    const query = stored ? `?country=${encodeURIComponent(stored)}` : "";

    fetch(`/api/legal/detect${query}`)
      .then((r) => r.json())
      .then((d: { countryCode?: string; country?: string }) => {
        if (d.countryCode) setDetectedCountry(d.countryCode);
        if (d.country) setDetectedName(d.country);
        if (d.countryCode && d.countryCode !== "INT" && typeof window !== "undefined") {
          localStorage.setItem(LEGAL_COUNTRY_KEY, d.countryCode);
        }
      })
      .catch(() => {});
  }, []);

  const effectiveCountry = normalized.countryCode ?? detectedCountry;

  const market: PricingMarket = useMemo(
    () =>
      resolvePricingMarket({
        areaLat: normalized.areaCoords?.lat,
        areaLng: normalized.areaCoords?.lng,
        countryCode: effectiveCountry,
      }),
    [normalized.areaCoords?.lat, normalized.areaCoords?.lng, effectiveCountry]
  );

  const regionLabel = useMemo(() => {
    const code = effectiveCountry?.toUpperCase();
    if (code && code !== "INT") {
      const name = getCountryName(code);
      if (code === "IN") return "India";
      return name || "International";
    }
    if (normalized.areaCoords) {
      return pricingRegionLabel(marketFromCoords(normalized.areaCoords.lat, normalized.areaCoords.lng), {
        areaBased: true,
      });
    }
    return pricingRegionLabel(market, { countryName: detectedName });
  }, [effectiveCountry, normalized.areaCoords, market, detectedName]);

  return {
    market,
    regionLabel,
    countryCode: effectiveCountry,
    areaBased: Boolean(normalized.areaCoords),
  };
}
