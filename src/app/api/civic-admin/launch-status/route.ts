import { NextResponse } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin";
import { getLaunchStatus, isLaunchReady } from "@/lib/launch-status";

export async function GET() {
  try {
    await requireAdmin();
    const checks = getLaunchStatus();
    return NextResponse.json({
      ready: isLaunchReady(),
      checks,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yashlp.vercel.app",
    });
  } catch (e) {
    return adminErrorResponse(e);
  }
}
