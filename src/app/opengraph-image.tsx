import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

/**
 * Default social preview card, generated at build time.
 *
 * The site previously shipped no og:image at all, so every share on WhatsApp,
 * X, LinkedIn or Slack rendered as a bare link. Individual routes can override
 * this by adding their own opengraph-image file.
 */
export const alt = `${SITE_NAME} - free online tools that run in your browser`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8fbfd",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "#111113",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 700, color: "#111113" }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              color: "#0a0a0a",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            Free online tools that run in your browser
          </div>
          {/* Single text child: Satori treats an expression plus adjacent
              text as two nodes and requires an explicit display on the parent. */}
          <div style={{ fontSize: 30, color: "#6b7280", marginTop: "26px" }}>
            {`${TOOLS.length} utilities · No signup · Nothing uploaded`}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {["PDF", "Image", "Text", "Developer", "Calculators", "SEO"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                fontSize: 22,
                color: "#6b7280",
                border: "1px solid #e7e7e9",
                borderRadius: "999px",
                padding: "8px 20px",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
