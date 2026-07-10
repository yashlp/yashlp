import { getPublicSiteConfig } from "@/lib/site-settings";
import { jsonWithCache } from "@/lib/api-cache";
import { isDemoOtpAllowed, isSmsConfigured } from "@/lib/env";
import { isResendConfigured } from "@/lib/email";

export async function GET() {
  const config = await getPublicSiteConfig();
  const authMode = isSmsConfigured() ? "sms" : isDemoOtpAllowed() ? "demo" : "unavailable";
  return jsonWithCache(
    { ...config, authMode, supportFormEnabled: isResendConfigured() },
    "public, s-maxage=30, stale-while-revalidate=60"
  );
}
