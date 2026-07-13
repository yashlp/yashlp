import { NextResponse } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin";
import { SITE_SETTING_KEYS } from "@/lib/site-setting-keys";
import { CUSTOMER_LAUNCH_ANNOUNCEMENT, getAllSiteSettings, setSiteSetting } from "@/lib/site-settings";

/** One-click production settings for customer traffic (no redeploy). */
export async function POST() {
  try {
    const admin = await requireAdmin();

    const updates: Record<string, string> = {
      [SITE_SETTING_KEYS.DEMO_MODE]: "false",
      [SITE_SETTING_KEYS.MAINTENANCE_MODE]: "false",
      [SITE_SETTING_KEYS.ANNOUNCEMENT]: CUSTOMER_LAUNCH_ANNOUNCEMENT,
    };

    for (const [key, value] of Object.entries(updates)) {
      await setSiteSetting(key, value, admin.id);
    }

    const settings = await getAllSiteSettings();
    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    return adminErrorResponse(e);
  }
}
