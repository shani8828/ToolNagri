import type { MetadataRoute } from "next";

import { absoluteUrl, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          // User-generated short links. These are 307 redirects to third-party
          // destinations - no reason to spend crawl budget on them, and no
          // reason for our domain to pass signals to whatever they point at.
          "/s/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
