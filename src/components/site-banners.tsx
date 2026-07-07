"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export type PublicSiteConfig = {
  demoMode: boolean;
  announcement: string | null;
  maintenanceMode: boolean;
};

export function SiteBanners({ config }: { config: PublicSiteConfig | null }) {
  if (!config) return null;

  if (config.maintenanceMode) {
    return (
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
        <strong>Maintenance:</strong> CivicLens is briefly unavailable. Admins can still use{" "}
        <Link href="/admin" className="underline">
          /admin
        </Link>
        .
      </div>
    );
  }

  return (
    <>
      {config.demoMode && (
        <div className="flex items-center justify-center gap-2 border-b border-violet-200 bg-violet-50 px-4 py-1.5 text-center text-xs font-medium text-violet-900">
          <Shield className="h-3.5 w-3.5 shrink-0" />
          Demo mode · Sample data · Reports are previews
          <Link href="/admin" className="underline hover:text-violet-700">
            Admin
          </Link>
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
