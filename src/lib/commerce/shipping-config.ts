import { prisma } from "@/lib/db";

export type ShippingConfig = {
  /** Flat delivery fee in INR when free delivery does not apply */
  flatRate: number;
  /** Cart subtotal at/above which delivery is free (ignored when alwaysFree) */
  freeThreshold: number;
  /** When true, delivery is always free regardless of cart total */
  alwaysFree: boolean;
  /** GST rate as percent, e.g. 18 */
  gstRatePercent: number;
};

const DEFAULTS: ShippingConfig = {
  flatRate: 49,
  freeThreshold: 999,
  alwaysFree: false,
  gstRatePercent: 18,
};

function parseNumber(value: string | undefined, fallback: number) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function parseBool(value: string | undefined, fallback: boolean) {
  if (value == null || value === "") return fallback;
  const v = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(v)) return true;
  if (["false", "0", "no", "off"].includes(v)) return false;
  return fallback;
}

export async function getShippingConfig(): Promise<ShippingConfig> {
  const rows = await prisma.commerceSetting.findMany({
    where: {
      key: {
        in: ["shipping_flat_rate", "free_shipping_threshold", "free_delivery_enabled", "gst_rate"],
      },
    },
  });

  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return {
    flatRate: parseNumber(map.shipping_flat_rate, DEFAULTS.flatRate),
    freeThreshold: parseNumber(map.free_shipping_threshold, DEFAULTS.freeThreshold),
    alwaysFree: parseBool(map.free_delivery_enabled, DEFAULTS.alwaysFree),
    gstRatePercent: parseNumber(map.gst_rate, DEFAULTS.gstRatePercent),
  };
}

/** Compute shipping fee for a cart subtotal using admin settings. */
export function computeShippingFee(subtotal: number, config: ShippingConfig): number {
  if (config.alwaysFree) return 0;
  if (config.freeThreshold > 0 && subtotal >= config.freeThreshold) return 0;
  return Math.max(0, config.flatRate);
}

export function computeTax(subtotal: number, config: ShippingConfig): number {
  const rate = config.gstRatePercent / 100;
  return Math.round(subtotal * rate * 100) / 100;
}
