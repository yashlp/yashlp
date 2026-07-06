import { NextResponse } from "next/server";

/** 60s CDN cache, 5 min stale-while-revalidate */
export const CACHE_PUBLIC_SHORT = "public, s-maxage=60, stale-while-revalidate=300";

/** 5 min CDN cache for rarely-changing data */
export const CACHE_PUBLIC_LONG = "public, s-maxage=300, stale-while-revalidate=600";

export function jsonWithCache<T>(data: T, cacheControl: string = CACHE_PUBLIC_SHORT) {
  return NextResponse.json(data, {
    headers: { "Cache-Control": cacheControl },
  });
}
