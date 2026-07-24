"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_BRAND_SETTINGS,
  type BrandSettings,
} from "@/lib/commerce/brand-defaults";

export function useBrandSettings() {
  const [brand, setBrand] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/commerce/brand")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.brand) setBrand({ ...DEFAULT_BRAND_SETTINGS, ...d.brand });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return brand;
}
