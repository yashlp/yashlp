import { prisma } from "@/lib/db";
import {
  DEFAULT_BRAND_NAME,
  DEFAULT_BRAND_SETTINGS,
  DEFAULT_SUPPORT_EMAIL,
  getConfiguredSupportEmail,
  type BrandSettings,
} from "./brand-defaults";

export type { BrandSettings };
export {
  DEFAULT_BRAND_NAME,
  DEFAULT_SUPPORT_EMAIL,
  DEFAULT_BRAND_SETTINGS,
  getConfiguredSupportEmail,
};

function pick(map: Record<string, string>, key: string, fallback: string) {
  const v = map[key]?.trim();
  return v || fallback;
}

/** Old placeholder support emails → current customer-care inbox */
const LEGACY_SUPPORT_EMAILS = new Set([
  "yash.shah.lp2@gmail.com",
  "hello@onlyaesthetics.in",
  "hello@onlyaesthetics.app",
  "hello@onlyaesthetic.in",
]);

function resolveSupportEmail(raw: string | undefined) {
  // Env wins (Vercel COMMERCE_SUPPORT_EMAIL / SUPPORT_EMAIL_TO)
  const fromEnv =
    process.env.COMMERCE_SUPPORT_EMAIL?.trim() ||
    process.env.SUPPORT_EMAIL_TO?.trim() ||
    process.env.SUPPORT_REPLY_TO?.trim();
  if (fromEnv) return fromEnv;

  const v = raw?.trim() || "";
  if (!v || LEGACY_SUPPORT_EMAILS.has(v.toLowerCase())) return getConfiguredSupportEmail();
  return v;
}

export async function getBrandSettings(): Promise<BrandSettings> {
  try {
    const rows = await prisma.commerceSetting.findMany({
      where: {
        key: {
          in: ["site_name", "company_name", "support_email", "support_phone", "site_url"],
        },
      },
    });
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;

    const siteName = pick(map, "site_name", pick(map, "company_name", DEFAULT_BRAND_NAME));
    return {
      siteName,
      companyName: pick(map, "company_name", siteName),
      supportEmail: resolveSupportEmail(map.support_email),
      supportPhone: pick(map, "support_phone", ""),
      siteUrl: pick(
        map,
        "site_url",
        process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_BRAND_SETTINGS.siteUrl
      ),
    };
  } catch {
    // Never crash the storefront if the DB is unreachable
    return {
      ...DEFAULT_BRAND_SETTINGS,
      supportEmail: getConfiguredSupportEmail(),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_BRAND_SETTINGS.siteUrl,
    };
  }
}
