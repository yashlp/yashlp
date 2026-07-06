"use client";

import { useEffect, useMemo, useState } from "react";
import { LEGAL_COUNTRY_KEY } from "@/lib/constants";
import {
  marketFromCoords,
  marketFromCountryCode,
  pricingRegionLabel,
  resolvePricingMarket,
  type PricingMarket,
} from "@/lib/report-pricing";

type AreaCoords = { lat: number; lng: number };

export function usePricingRegion(areaCoords?: AreaCoords | null) {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryName, setCountryName] = useState("");

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(LEGAL_COUNTRY_KEY) : null;
    const query = stored ? `?country=${encodeURIComponent(stored)}` : "";

    fetch(`/api/legal/detect${query}`)
      .then((r) => r.json())
      .then((d: { countryCode?: string; country?: string }) => {
        if (d.countryCode) setCountryCode(d.countryCode);
        if (d.country) setCountryName(d.country);
        if (d.countryCode && d.countryCode !== "INT" && typeof window !== "undefined") {
          localStorage.setItem(LEGAL_COUNTRY_KEY, d.countryCode);
        }
      })
      .catch(() => {});
  }, []);

  const areaBased = areaCoords != null;

  const market: PricingMarket = useMemo(
    () =>
      resolvePricingMarket({
        areaLat: areaCoords?.lat,
        areaLng: areaCoords?.lng,
        countryCode,
      }),
    [areaCoords?.lat, areaCoords?.lng, countryCode]
  );

  const regionLabel = useMemo(() => {
    if (areaCoords) {
      return pricingRegionLabel(marketFromCoords(areaCoords.lat, areaCoords.lng), { areaBased: true });
    }
    return pricingRegionLabel(marketFromCountryCode(countryCode), { countryName });
  }, [areaCoords, countryCode, countryName, market]);

  return { market, regionLabel, countryCode, areaBased };
}
