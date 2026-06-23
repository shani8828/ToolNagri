import { MetadataRoute } from "next";
import { ALL_TOOLS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolnagri.vercel.app";
  
  const staticRoutes = [
    "",
    "/all-tools",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
  ];

  const toolRoutes = ALL_TOOLS.map((tool) => tool.url);
  const allRoutes = Array.from(new Set([...staticRoutes, ...toolRoutes]));

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
