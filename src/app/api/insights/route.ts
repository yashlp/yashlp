import { NextResponse } from "next/server";
import { getRankings, getTrends } from "@/lib/health-score";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "trends";

  if (type === "rankings") {
    const rankings = await getRankings(10);
    return NextResponse.json({ rankings });
  }

  const trends = await getTrends(30);
  return NextResponse.json({ trends });
}
