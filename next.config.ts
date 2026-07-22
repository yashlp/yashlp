import type { NextConfig } from "next";

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
    const aestheticsOnly = process.env.PRODUCT_SURFACE === "aesthetics";
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
