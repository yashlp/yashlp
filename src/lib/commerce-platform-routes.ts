/** Routes that belong to the Aesthetics commerce platform — never wrap with CivicLens UI. */
const COMMERCE_PLATFORM_PREFIXES = ["/aesthetics", "/admin", "/seller", "/metals"] as const;

export function isCommercePlatformPath(pathname: string): boolean {
  if (!pathname) return false;
  return COMMERCE_PLATFORM_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
