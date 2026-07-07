export const SITE_SETTING_KEYS = {
  DEMO_MODE: "demo_mode",
  ANNOUNCEMENT: "announcement",
  MAINTENANCE_MODE: "maintenance_mode",
  DEFAULT_MAP_LAT: "default_map_lat",
  DEFAULT_MAP_LNG: "default_map_lng",
  SITE_NAME: "site_name",
  CONTACT_EMAIL: "contact_email",
} as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[keyof typeof SITE_SETTING_KEYS];
