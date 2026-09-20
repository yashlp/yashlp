import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAestheticsOnlyRequest } from "@/lib/commerce/aesthetics-surface";
import { isIndiaRequest } from "@/lib/commerce/geo";

/** CivicLens routes — blocked / redirected on Only Aesthetic hosts */
const CIVIC_PATH_PREFIXES = [
  "/civic-admin",
  "/api/civic-admin",
  "/api/auth",
  "/api/incidents",
  "/api/payments",
  "/api/reports",
  "/api/geocode",
  "/reports",
  "/report",
  "/ask",
  "/compare",
  "/login",
  "/map",
  "/insights",
  "/profile",
  "/try",
  "/content-policy",
  "/logo-preview",
];

function requestWithPath(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return { request: { headers: requestHeaders } };
}

function withPathHeader(request: NextRequest) {
  const path = request.nextUrl.pathname;
  return NextResponse.next(requestWithPath(request, path));
}

function indiaBlockedResponse(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api/")) {
    return NextResponse.json(
      {
        error: "Only Aesthetic is available in India only",
        code: "INDIA_ONLY",
      },
      { status: 403 }
    );
  }
  const url = request.nextUrl.clone();
  url.pathname = "/aesthetics/india-only";
  // Keep commerce pathname so metadata/shell never fall back to CivicLens
  return NextResponse.rewrite(url, requestWithPath(request, "/aesthetics/india-only"));
}

function isCivicPath(path: string) {
  return CIVIC_PATH_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

function isStaticAsset(path: string) {
  return /\.(?:png|jpe?g|gif|webp|svg|ico|avif|woff2?|ttf|css|js|map|txt|xml|json)$/i.test(
    path
  );
}

function redirectToStore(request: NextRequest, pathname = "/aesthetics") {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Never geo-block or rewrite brand / mood image files
  if (
    path.startsWith("/_next/") ||
    path === "/favicon.ico" ||
    path.startsWith("/brand/") ||
    path.startsWith("/oa/") ||
    isStaticAsset(path)
  ) {
    return withPathHeader(request);
  }

  // Store project / onlyaesthetic* hosts: CivicLens must never appear.
  const host = request.headers.get("host");
  if (isAestheticsOnlyRequest(host)) {
    if (path === "/") {
      // Rewrite (not redirect) so the public URL can stay on the apex domain
      const url = request.nextUrl.clone();
      url.pathname = "/aesthetics";
      return NextResponse.rewrite(url, requestWithPath(request, "/aesthetics"));
    }

    // Civic root legal pages → store legal pages
    if (path === "/privacy") return redirectToStore(request, "/aesthetics/privacy");
    if (path === "/terms") return redirectToStore(request, "/aesthetics/terms");

    if (isCivicPath(path)) {
      if (path.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Not available on Only Aesthetic", code: "AESTHETICS_ONLY" },
          { status: 404 }
        );
      }
      return redirectToStore(request, "/aesthetics");
    }

    // Any other non-store path → store home (keeps CivicLens pages unreachable)
    const allowed =
      path.startsWith("/aesthetics") ||
      path.startsWith("/admin") ||
      path.startsWith("/api/commerce") ||
      path.startsWith("/api/admin") ||
      path.startsWith("/seller") ||
      path === "/robots.txt" ||
      path === "/sitemap.xml";
    if (!allowed) {
      return redirectToStore(request, "/aesthetics");
    }
  }

  // India geo: browse + login work worldwide; checkout/payments stay India-only.
  // Razorpay webhooks originate outside India — never geo-block them.
  const indiaCheckoutOnly =
    path.startsWith("/aesthetics/checkout") ||
    path.startsWith("/api/commerce/checkout") ||
    path.startsWith("/api/commerce/orders") ||
    (path.startsWith("/api/commerce/payments") &&
      !path.startsWith("/api/commerce/payments/razorpay-webhook")) ||
    path.startsWith("/api/commerce/razorpay");

  if (indiaCheckoutOnly && !isIndiaRequest(request)) {
    return indiaBlockedResponse(request);
  }

  const response = withPathHeader(request);

  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    return response;
  }

  // Shah Family Guest List needs EtherCalc sync + Excel CDN + Google Fonts.
  if (path.startsWith("/wedding-guests")) {
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Cache-Control", "no-store");
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob:",
        "connect-src 'self' https://ethercalc.net https://cdn.jsdelivr.net",
        "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ")
    );
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
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
