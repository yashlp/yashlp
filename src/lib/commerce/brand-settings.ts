import { prisma } from "@/lib/db";
import {
  DEFAULT_BRAND_NAME,
  DEFAULT_BRAND_SETTINGS,
  DEFAULT_SUPPORT_EMAIL,
  type BrandSettings,
} from "./brand-defaults";

export type { BrandSettings };
export { DEFAULT_BRAND_NAME, DEFAULT_SUPPORT_EMAIL, DEFAULT_BRAND_SETTINGS };

function pick(map: Record<string, string>, key: string, fallback: string) {
  const v = map[key]?.trim();
  return v || fallback;
}

export async function getBrandSettings(): Promise<BrandSettings> {
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
    supportEmail: pick(map, "support_email", DEFAULT_SUPPORT_EMAIL),
    supportPhone: pick(map, "support_phone", ""),
    siteUrl: pick(
      map,
      "site_url",
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_BRAND_SETTINGS.siteUrl
    ),
  };
}
