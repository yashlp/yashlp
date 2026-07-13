import { NextResponse } from "next/server";
import { clearAdminUnlockSession } from "@/lib/admin-password";

export async function POST() {
  await clearAdminUnlockSession();
  return NextResponse.json({ ok: true });
}

