import type { NextConfig } from "next";

function aestheticsOnlyFromEnv() {
  if (process.env.PRODUCT_SURFACE === "aesthetics") return true;
  const hosts = [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL,
  ];
  for (const raw of hosts) {
    if (!raw) continue;
    const h = (raw.includes("://") ? (() => { try { return new URL(raw).hostname; } catch { return raw; } })() : raw)
      .toLowerCase();
    if (h.includes("yashlp") || h.includes("civiclens")) continue;
    if (/onlyaesthetic/.test(h)) return true;
  }
  return false;
}

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "react-leaflet"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async redirects() {
    const aestheticsOnly = aestheticsOnlyFromEnv();
    return [
      ...(aestheticsOnly
        ? [
            {
              source: "/",
              destination: "/aesthetics",
              permanent: false,
            },
          ]
        : []),
      {
        source: "/aesthetic-demo",
        destination: "/aesthetics",
        permanent: true,
      },
      {
        source: "/aesthetic-demo/:path*",
        destination: "/aesthetics",
        permanent: true,
      },
      {
        source: "/aesthetics/discover",
        destination: "/aesthetics/shop",
        permanent: true,
      },
      {
        source: "/metals/index.html",
        destination: "/metals",
        permanent: false,
      },
      {
        source: "/platform-admin",
        destination: "/admin/login",
        permanent: true,
      },
      {
        source: "/platform-admin/:path*",
        destination: "/admin/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
