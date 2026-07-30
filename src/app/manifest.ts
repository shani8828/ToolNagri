import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/**
 * Web app manifest. Lets the site be installed to a home screen, which for a
 * utility site is a real retention channel - repeat visits stop depending on
 * the user searching again.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Free Online Tools`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    // Keep in step with --background in globals.css so the PWA splash screen
    // doesn't flash pure white before the tinted page paints.
    background_color: "#f8fbfd",
    theme_color: "#f8fbfd",
    orientation: "portrait-primary",
    categories: ["productivity", "utilities", "developer"],
    icons: [
      {
        src: "/brandings/Logo-bgless.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
