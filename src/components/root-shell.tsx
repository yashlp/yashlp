import { headers } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { isCommercePlatformPath } from "@/lib/commerce-platform-routes";

/**
 * Skips CivicLens chrome on the server for commerce/admin routes so the first
 * paint is the D2C portal (not "Loading CivicLens…").
 */
export async function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";

  if (isCommercePlatformPath(pathname)) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
