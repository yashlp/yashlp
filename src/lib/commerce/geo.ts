import type { NextRequest } from "next/server";

const INDIA_COUNTRY = "IN";

/** Vercel: x-vercel-ip-country. Cloudflare: cf-ipcountry. */
export function getRequestCountry(req: NextRequest): string | null {
  const raw =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code");
  return raw?.trim().toUpperCase() || null;
}

export function isIndiaOnlyEnforced(): boolean {
  if (process.env.ALLOW_NON_INDIA_ACCESS === "true") return false;
  if (process.env.INDIA_ONLY_STOREFRONT === "false") return false;
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

export function isIndiaRequest(req: NextRequest): boolean {
  if (!isIndiaOnlyEnforced()) return true;
  const country = getRequestCountry(req);
  // Unknown geo header: allow so checkout is not blocked by proxy/header gaps.
  if (!country) return true;
  return country === INDIA_COUNTRY;
}

export function isCommercePath(path: string): boolean {
  return (
    path.startsWith("/aesthetics") ||
    path.startsWith("/admin") ||
    path.startsWith("/api/commerce") ||
    path.startsWith("/api/admin")
  );
}
