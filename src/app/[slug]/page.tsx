import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { resolveShortLink } from "@/lib/shortlinks";
import ExpiredLink from "@/components/ExpiredLink";

/**
 * Legacy short-link path.
 *
 * Links created before the move to /s/<slug> are already printed, shared and
 * pasted in the wild, so this root-level catch-all stays to honour them. The
 * behavioural change is what happens on a miss: `notFound()` now returns a
 * real 404 instead of redirecting to the homepage.
 *
 * Static routes take precedence over this dynamic segment in Next.js routing,
 * so /all-tools, /qr-generator and friends are unaffected. `resolveShortLink`
 * also pattern-checks the slug before querying, so crawlers walking invented
 * URLs don't turn into a stream of database reads.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LegacyShortLinkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await resolveShortLink(slug);

  if (result.status === "missing" || result.status === "error") {
    notFound();
  }

  if (result.status === "expired") {
    return <ExpiredLink slug={slug} />;
  }

  redirect(result.url);
}
