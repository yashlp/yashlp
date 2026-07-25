/**
 * Detect Only Aesthetic–only deploys.
 *
 * Prefer PRODUCT_SURFACE=aesthetics on the store Vercel project.
 * Also auto-detect store hostnames so onlyaesthetic* / onlyaesthetic.in
 * serve the shop even if the env var was forgotten.
 */

const STORE_HOST_RE =
  /(^|\.)onlyaesthetic(s)?(\.|$)|onlyaesthetic(s)?-[\w-]+\.vercel\.app$/i;

export function hostLooksLikeOnlyAesthetic(host: string | null | undefined): boolean {
  if (!host) return false;
  const h = host.split(":")[0].trim().toLowerCase();
  if (!h || h === "localhost" || h === "127.0.0.1") return false;
  // Never flip CivicLens / yashlp projects into store mode.
  if (h.includes("yashlp") || h.includes("civiclens")) return false;
  return STORE_HOST_RE.test(h);
}

/** Build-time / server: env or Vercel production URL. */
export function isAestheticsOnlyDeploy(): boolean {
  if (process.env.PRODUCT_SURFACE === "aesthetics") return true;
  const candidates = [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL,
  ];
  for (const c of candidates) {
    if (!c) continue;
    try {
      const host = c.includes("://") ? new URL(c).hostname : c;
      if (hostLooksLikeOnlyAesthetic(host)) return true;
    } catch {
      if (hostLooksLikeOnlyAesthetic(c)) return true;
    }
  }
  return false;
}

/** Request-time: prefer Host header so custom domains work immediately. */
export function isAestheticsOnlyRequest(host: string | null | undefined): boolean {
  if (process.env.PRODUCT_SURFACE === "aesthetics") return true;
  if (hostLooksLikeOnlyAesthetic(host)) return true;
  return isAestheticsOnlyDeploy();
}
