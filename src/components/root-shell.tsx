import { headers } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { isCommercePlatformPath } from "@/lib/commerce-platform-routes";

/**
 * Skips CivicLens chrome for commerce/admin routes so the first paint is Only
 * Aesthetics (never a CivicLens terms gate / loading screen over the storefront).
 */
export async function RootShell({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get("x-pathname") || h.get("x-invoke-path") || "";

  // Only Aesthetic commerce UI — never wrap with CivicLens chrome.
  // CivicLens admin lives at /civic-admin and uses CivicLens AppShell.
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
