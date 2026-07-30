import type { NextConfig } from "next";

/**
 * Baseline security headers.
 *
 * A Content-Security-Policy is deliberately not set here. Google Tag Manager
 * injects scripts at runtime, so a workable CSP needs a per-request nonce
 * threaded through the response — worth doing, but it belongs in middleware
 * where that nonce can be generated. Shipping a CSP loose enough to
 * accommodate GTM without a nonce ('unsafe-inline' plus wildcards) would look
 * like protection while providing almost none.
 */
const securityHeaders = [
  // Don't let the browser second-guess declared content types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy clickjacking defence; frame-ancestors is the modern equivalent.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Origin only cross-site, full path same-site.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // No tool on this site needs any of these capabilities.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework version.
  poweredByHeader: false,

  // Trailing-slash variants would otherwise be a second URL for every page.
  trailingSlash: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
