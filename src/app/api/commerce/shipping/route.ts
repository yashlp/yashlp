import { NextResponse } from "next/server";
import { getShippingConfig } from "@/lib/commerce/shipping-config";

/** Public storefront shipping + tax rates from admin settings. */
export async function GET() {
  try {
    const config = await getShippingConfig();
    return NextResponse.json(
      {
        shipping: {
          flatRate: config.flatRate,
          freeThreshold: config.freeThreshold,
          alwaysFree: config.alwaysFree,
        },
        tax: {
          gstRatePercent: config.gstRatePercent,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        shipping: { flatRate: 49, freeThreshold: 999, alwaysFree: false },
        tax: { gstRatePercent: 18 },
      },
      { status: 200 }
    );
  }
}
