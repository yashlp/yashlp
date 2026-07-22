import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isCommercePath, isIndiaRequest } from "@/lib/commerce/geo";

/** Separate Vercel project for the store — set PRODUCT_SURFACE=aesthetics */
function isAestheticsOnlyDeploy() {
  return process.env.PRODUCT_SURFACE === "aesthetics";
}

const CIVIC_PATH_PREFIXES = [
  "/civic-admin",
  "/api/civic-admin",
  "/api/auth",
  "/api/incidents",
  "/api/payments",
  "/api/reports",
  "/reports",
  "/report",
  "/ask",
  "/compare",
  "/login",
  "/map",
];

function withPathHeader(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

function indiaBlockedResponse(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api/")) {
    return NextResponse.json(
      {
        error: "Only Aesthetics is available in India only",
        code: "INDIA_ONLY",
      },
      { status: 403 }
    );
  }
  const url = request.nextUrl.clone();
  url.pathname = "/aesthetics/india-only";
  return NextResponse.rewrite(url);
}

function isCivicPath(path: string) {
  return CIVIC_PATH_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/_next/") || path === "/favicon.ico") {
    return withPathHeader(request);
  }

  // Dedicated Only Aesthetics Vercel project: keep CivicLens off this hostname.
  if (isAestheticsOnlyDeploy()) {
    if (path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/aesthetics";
      return NextResponse.redirect(url);
    }
    if (isCivicPath(path)) {
      if (path.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Not available on Only Aesthetics", code: "AESTHETICS_ONLY" },
          { status: 404 }
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = "/aesthetics";
      return NextResponse.redirect(url);
    }
  }

  if (isCommercePath(path) && path !== "/aesthetics/india-only" && !isIndiaRequest(request)) {
    return indiaBlockedResponse(request);
  }

  const response = withPathHeader(request);

  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    return response;
  }

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("Permissions-Policy", "camera=(self), microphone=(), geolocation=(self)");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.openstreetmap.org https://images.unsplash.com https://*.public.blob.vercel-storage.com",
      "connect-src 'self' https://nominatim.openstreetmap.org https://*.tile.openstreetmap.org https://api.razorpay.com https://checkout.razorpay.com https://api.stripe.com",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com https://js.stripe.com https://hooks.stripe.com",
      "font-src 'self' data: https://api.fontshare.com https://cdn.fontshare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  const isAuth = path.startsWith("/api/auth/");
  const isMutation = request.method !== "GET";

  if (path.startsWith("/api/") && (isAuth || isMutation)) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
