import type { MetadataRoute } from "next";

import { CATEGORIES } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import { absoluteUrl } from "@/lib/site";

/**
 * Every entry carries a real content date.
 *
 * The previous version used `lastModified: new Date()` for all URLs, which
 * reported "changed just now" on every deploy. Crawlers learn to ignore a
 * lastmod that always moves, so it stops helping recrawl scheduling. Tool
 * dates now come from `updated` in the catalogue and only change when the
 * page content actually does.
 */

/** Legal and support pages: real URLs, but not competing for rankings. */
const SUPPORT_PAGES = [
  { path: "/contact", updated: "2026-07-30", priority: 0.4 },
  { path: "/privacy", updated: "2026-07-30", priority: 0.3 },
  { path: "/terms", updated: "2026-07-30", priority: 0.3 },
  { path: "/disclaimer", updated: "2026-07-30", priority: 0.3 },
];

/** Newest tool date, used as the homepage and directory lastmod. */
function latestToolDate(): Date {
  return TOOLS.reduce<Date>((newest, tool) => {
    const date = new Date(tool.updated);
    return date > newest ? date : newest;
  }, new Date(0));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = latestToolDate();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/all-tools"),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Category hubs - the pages targeting "free pdf tools online" and friends.
    ...CATEGORIES.map((category) => ({
      url: absoluteUrl(`/tools/${category.slug}`),
      lastModified: latest,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    // Individual tools.
    ...TOOLS.map((tool) => ({
      url: absoluteUrl(`/${tool.slug}`),
      lastModified: new Date(tool.updated),
      changeFrequency: "monthly" as const,
      priority: tool.popular ? 0.8 : 0.7,
    })),

    ...SUPPORT_PAGES.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: new Date(page.updated),
      changeFrequency: "yearly" as const,
      priority: page.priority,
    })),
  ];
}
