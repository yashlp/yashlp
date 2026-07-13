import { NextResponse } from "next/server";
import { formatAdminPhoneDisplay, getPrimaryAdminPhone } from "@/lib/admin-phone";
import { getPublicSiteConfig } from "@/lib/site-settings";

export async function GET() {
  try {
    const phone = getPrimaryAdminPhone();
    const config = await getPublicSiteConfig();
    return NextResponse.json({
      phoneDisplay: formatAdminPhoneDisplay(phone),
      email: config.contactEmail,
    });
  } catch {
    return NextResponse.json({ error: "Admin login is not configured" }, { status: 503 });
  }
}
