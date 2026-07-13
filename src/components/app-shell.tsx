"use client";

import { usePathname } from "next/navigation";
import { CivicLensShell } from "@/components/civiclens-shell";
import { isCommercePlatformPath } from "@/lib/commerce-platform-routes";

/**
 * Routes Aesthetics commerce pages around CivicLens entirely.
 * CivicLens auth, banners, nav, and terms gate never mount on commerce routes.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isCommercePlatformPath(pathname)) {
    return <>{children}</>;
  }

  return <CivicLensShell>{children}</CivicLensShell>;
}
