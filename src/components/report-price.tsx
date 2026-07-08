"use client";

import { usePricingRegion } from "@/hooks/use-pricing-region";
import {
  getLocalizedReportPrice,
  getLocalizedTierPrice,
  type LocalizedPrice,
  type PricingMarket,
} from "@/lib/report-pricing";
import type { ReportProductId, ReportTier } from "@/lib/report-demo-data";
import { cn } from "@/lib/utils";

type AreaCoords = { lat: number; lng: number };

type PricingProps = {
  areaCoords?: AreaCoords | null;
  countryCode?: string | null;
  className?: string;
  showAlt?: boolean;
};

export function ReportPrice({
  productId,
  areaCoords,
  countryCode,
  className,
  showAlt = false,
}: PricingProps & { productId: ReportProductId }) {
  const { market } = usePricingRegion({ areaCoords, countryCode });
  const price = getLocalizedReportPrice(productId, market);
  return <PriceText price={price} className={className} showAlt={showAlt} />;
}

export function TierPrice({
  tier,
  areaCoords,
  countryCode,
  className,
  showAlt = false,
}: PricingProps & { tier: ReportTier }) {
  const { market } = usePricingRegion({ areaCoords, countryCode });
  const price = getLocalizedTierPrice(tier, market);
  return <PriceText price={price} className={className} showAlt={showAlt} />;
}

function PriceText({
  price,
  className,
  showAlt,
}: {
  price: LocalizedPrice;
  className?: string;
  showAlt?: boolean;
}) {
  if (showAlt) {
    return (
      <span className={cn(className)}>
        {price.formatted}
        <span className="text-stone-400"> · {price.altFormatted}</span>
      </span>
    );
  }
  return <span className={cn(className)}>{price.formatted}</span>;
}

export function PricingRegionBanner({
  areaCoords,
  countryCode,
  className,
}: {
  areaCoords?: AreaCoords | null;
  countryCode?: string | null;
  className?: string;
}) {
  const { market, regionLabel } = usePricingRegion({ areaCoords, countryCode });
  const small = getLocalizedTierPrice("small", market);
  const big = getLocalizedTierPrice("big", market);

  return (
    <div
      className={cn(
        "rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-stone-700",
        className
      )}
    >
      <span className="font-semibold text-orange-800">Prices for {regionLabel}:</span>{" "}
      <strong>{small.formatted}</strong> standard · <strong>{big.formatted}</strong> detailed
      <span className="mt-1 block text-xs text-stone-500">
        {market === "india"
          ? "₹ pricing for locations in India."
          : "$ USD pricing for locations outside India."}
      </span>
    </div>
  );
}

/** For use inside components that already have market resolved. */
export function formatPriceForMarket(
  productId: ReportProductId,
  market: PricingMarket
): LocalizedPrice {
  return getLocalizedReportPrice(productId, market);
}
