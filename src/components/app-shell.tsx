"use client";

import { usePathname } from "next/navigation";
import { CivicLensShell } from "@/components/civiclens-shell";
import { isAestheticsOnlyDeploy } from "@/lib/commerce/aesthetics-surface";
import { isCommercePlatformPath } from "@/lib/commerce-platform-routes";

/**
 * Routes Aesthetics commerce pages around CivicLens entirely.
 * CivicLens auth, banners, nav, and terms gate never mount on commerce routes
 * or on Only Aesthetic–only deploys (onlyaesthetic.in).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  if (isAestheticsOnlyDeploy() || isCommercePlatformPath(pathname)) {
    return <>{children}</>;
  }

  return <CivicLensShell>{children}</CivicLensShell>;
}
