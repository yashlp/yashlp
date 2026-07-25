export const DEFAULT_BRAND_NAME = "Only Aesthetic";
export const DEFAULT_SUPPORT_EMAIL = "customercare@onlyaesthetic.in";

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
