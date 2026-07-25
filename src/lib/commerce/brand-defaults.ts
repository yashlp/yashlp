export const DEFAULT_BRAND_NAME = "Only Aesthetic";

/** Customer care inbox — also used for refunds / returns contact */
const FALLBACK_SUPPORT_EMAIL = "customercare@onlyaesthetic.in";

/** Prefer env so Vercel/GoDaddy mailbox can be set without a code change */
export function getConfiguredSupportEmail(): string {
  const fromEnv =
    process.env.COMMERCE_SUPPORT_EMAIL?.trim() ||
    process.env.SUPPORT_EMAIL_TO?.trim() ||
    process.env.SUPPORT_REPLY_TO?.trim();
  return fromEnv || FALLBACK_SUPPORT_EMAIL;
}

export const DEFAULT_SUPPORT_EMAIL = FALLBACK_SUPPORT_EMAIL;

export type BrandSettings = {
  siteName: string;
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  siteUrl: string;
};

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  siteName: DEFAULT_BRAND_NAME,
  companyName: DEFAULT_BRAND_NAME,
  supportEmail: DEFAULT_SUPPORT_EMAIL,
  supportPhone: "",
  siteUrl: "https://onlyaesthetic.in",
};
