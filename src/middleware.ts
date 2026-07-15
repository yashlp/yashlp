import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "aes_admin_session";

function withPathHeader(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

function hasAdminCookie(request: NextRequest) {
  return Boolean(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Keep admins isolated:
  // - /admin*           → Only Aesthetics commerce admin
  // - /civic-admin*     → CivicLens community admin
  const response = withPathHeader(request);

  if (path.startsWith("/_next/") || path === "/favicon.ico") {
    return response;
  }

  // Soft gate for Only Aesthetics admin UI (API still validates sessions via withAdminAuth).
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!hasAdminCookie(request)) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
  }

  // Soft gate for admin APIs (except auth bootstrap routes).
  if (
    path.startsWith("/api/admin/") &&
    !path.startsWith("/api/admin/auth/") &&
    !hasAdminCookie(request)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.openstreetmap.org https://images.unsplash.com https://*.public.blob.vercel-storage.com",
      "connect-src 'self' https://nominatim.openstreetmap.org https://*.tile.openstreetmap.org https://api.razorpay.com https://checkout.razorpay.com https://api.stripe.com",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com https://js.stripe.com https://hooks.stripe.com",
      "font-src 'self' data: https://api.fontshare.com https://cdn.fontshare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  const isAuth =
    path.startsWith("/api/auth/") ||
    path.startsWith("/api/commerce/auth/") ||
    path.startsWith("/api/admin/auth/");
  const isMutation = request.method !== "GET";

  if (path.startsWith("/api/") && (isAuth || isMutation)) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
