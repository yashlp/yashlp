import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yashlp.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/civic-admin/", "/seller/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
