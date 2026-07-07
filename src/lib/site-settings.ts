import { prisma } from "./db";
import { SITE_SETTING_KEYS, type SiteSettingKey } from "./site-setting-keys";

export { SITE_SETTING_KEYS, type SiteSettingKey };

const DEFAULTS: Record<SiteSettingKey, string> = {
  [SITE_SETTING_KEYS.DEMO_MODE]: "true",
  [SITE_SETTING_KEYS.ANNOUNCEMENT]: "",
  [SITE_SETTING_KEYS.MAINTENANCE_MODE]: "false",
  [SITE_SETTING_KEYS.DEFAULT_MAP_LAT]: "19.076",
  [SITE_SETTING_KEYS.DEFAULT_MAP_LNG]: "72.8777",
  [SITE_SETTING_KEYS.SITE_NAME]: "CivicLens",
};

export async function getSiteSetting(key: SiteSettingKey): Promise<string> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (row) return row.value;
  return DEFAULTS[key] ?? "";
}

export async function getAllSiteSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const map = { ...DEFAULTS };
  for (const row of rows) {
    map[row.key as SiteSettingKey] = row.value;
  }
  return map;
}

export async function setSiteSetting(key: string, value: string, updatedBy?: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value, updatedBy: updatedBy ?? null },
    create: { key, value, updatedBy: updatedBy ?? null },
  });
}

export async function getPublicSiteConfig() {
  const settings = await getAllSiteSettings();
  return {
    demoMode: settings[SITE_SETTING_KEYS.DEMO_MODE] === "true",
    announcement: settings[SITE_SETTING_KEYS.ANNOUNCEMENT] || null,
    maintenanceMode: settings[SITE_SETTING_KEYS.MAINTENANCE_MODE] === "true",
    defaultMap: {
      lat: parseFloat(settings[SITE_SETTING_KEYS.DEFAULT_MAP_LAT]) || 19.076,
      lng: parseFloat(settings[SITE_SETTING_KEYS.DEFAULT_MAP_LNG]) || 72.8777,
    },
    siteName: settings[SITE_SETTING_KEYS.SITE_NAME] || "CivicLens",
  };
}

export async function seedDefaultSiteSettings() {
  for (const [key, value] of Object.entries(DEFAULTS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
}
