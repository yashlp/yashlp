import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { hasReportPurchase } from "@/lib/payments/access";
import { isPaymentsConfigured } from "@/lib/payments/config";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ paid: false, authenticated: false });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (!productId || Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: "productId, lat, and lng are required" }, { status: 400 });
  }

  const paid = await hasReportPurchase(user.id, productId, lat, lng);

  return NextResponse.json({
    paid,
    authenticated: true,
    paymentsConfigured: isPaymentsConfigured(),
  });
}