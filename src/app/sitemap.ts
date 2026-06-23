import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolnagri.vercel.app";
  
  const routes = [
    "",
    "/all-tools",
    "/url-shortener",
    "/age-calculator",
    "/emi-calculator",
    "/qr-generator",
    "/password-generator",
    "/json-formatter",
    "/image-compressor",
    "/jpg-to-webp",
    "/pdf-merge",
    "/unit-converter",
    "/timezone-converter",
    "/word-counter",
    "/character-counter",
    "/youtube-thumbnail",
    "/utm-builder",
    "/base64",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
