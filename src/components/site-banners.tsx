"use client";

export type PublicSiteConfig = {
  demoMode: boolean;
  announcement: string | null;
  maintenanceMode: boolean;
  authMode?: "sms" | "demo" | "unavailable";
};

export function SiteBanners({
  config,
  isAdmin,
}: {
  config: PublicSiteConfig | null;
  isAdmin?: boolean;
}) {
  if (!config) return null;

  if (config.maintenanceMode) {
    return (
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
        <strong>Maintenance:</strong> CivicLens is briefly unavailable. Please check back soon.
      </div>
    );
  }

  return (
    <>
      {config.demoMode && isAdmin && (
        <div className="border-b border-violet-200 bg-violet-50 px-4 py-1.5 text-center text-xs font-medium text-violet-900">
          Admin preview · Demo data · Reports are previews
        </div>
      )}
      {config.announcement && (
        <div className="border-b border-orange-200 bg-orange-50 px-4 py-2 text-center text-sm text-orange-900">
          {config.announcement}
        </div>
      )}
    </>
  );
}
