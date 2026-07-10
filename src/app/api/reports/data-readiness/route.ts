import { NextResponse } from "next/server";
import {
  getReportPrice,
  resolveReportProductId,
  type ReportTier,
} from "@/lib/report-demo-data";
import {
  checkReportDataReadinessForProduct,
  REPORT_DATA_REQUIREMENTS,
} from "@/lib/report-data-readiness";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const tierParam = searchParams.get("tier") as ReportTier | null;
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  let tier: ReportTier | null = tierParam;
  if (productId) {
    const resolved = resolveReportProductId(productId);
    if (!resolved) {
      return NextResponse.json({ error: "Invalid report product" }, { status: 400 });
    }
    tier = getReportPrice(resolved).tier;
  }

  if (!tier || !(tier in REPORT_DATA_REQUIREMENTS)) {
    return NextResponse.json({ error: "productId or tier is required" }, { status: 400 });
  }

  const readiness = await checkReportDataReadinessForProduct(tier, lat, lng);
  return NextResponse.json(readiness);
}
