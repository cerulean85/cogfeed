import type { MetadataRoute } from "next";
import { siteUrl } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/register/terms"],
        disallow: ["/dashboard", "/records", "/feedback", "/settings", "/contact", "/onboarding", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
