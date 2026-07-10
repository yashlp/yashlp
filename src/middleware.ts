import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;

  // Never process Next.js static/runtime assets through app security middleware.
  // This avoids bad-request responses for chunk/css fetches in production mode.
  if (path.startsWith("/_next/") || path === "/favicon.ico") {
    return response;
  }

  const isProd = process.env.NODE_ENV === "production";

  // In development, skip strict CSP so Turbopack/HMR and dev tooling work reliably.
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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.openstreetmap.org",
      "connect-src 'self' https://nominatim.openstreetmap.org https://*.tile.openstreetmap.org https://api.razorpay.com https://checkout.razorpay.com https://api.stripe.com",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com https://js.stripe.com https://hooks.stripe.com",
      "font-src 'self'",
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
