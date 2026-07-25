import { headers } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { isAestheticsOnlyDeploy } from "@/lib/commerce/aesthetics-surface";
import { isCommercePlatformPath } from "@/lib/commerce-platform-routes";

/**
 * Skips CivicLens chrome for commerce/admin routes and for aesthetics-only deploys
 * so onlyaesthetic.in never shows CivicLens UI.
 */
export async function RootShell({ children }: { children: React.ReactNode }) {
  if (isAestheticsOnlyDeploy()) {
    return <>{children}</>;
  }

  const h = await headers();
  const pathname = h.get("x-pathname") || h.get("x-invoke-path") || "";

  if (
    isCommercePlatformPath(pathname) ||
    pathname.startsWith("/aesthetics") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/commerce") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/seller")
  ) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
