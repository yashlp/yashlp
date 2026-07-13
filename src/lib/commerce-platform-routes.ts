/** Routes that belong to the Aesthetics commerce platform — never wrap with CivicLens UI. */
const COMMERCE_PLATFORM_PREFIXES = ["/aesthetics", "/seller", "/admin"] as const;

export function isCommercePlatformPath(pathname: string): boolean {
  return COMMERCE_PLATFORM_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
