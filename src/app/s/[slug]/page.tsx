import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { resolveShortLink } from "@/lib/shortlinks";
import ExpiredLink from "@/components/ExpiredLink";

/**
 * Short-link resolver.
 *
 * Implemented as a page rather than a route handler so a miss can call
 * `notFound()` and produce a genuine 404 with the site's own 404 UI. The old
 * root-level route handler redirected misses to `/?error=not-found`, so every
 * unknown URL answered 307 → 200 and Google saw soft 404s without limit.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ShortLinkPage({
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

  // Must be outside any try/catch - redirect() signals by throwing.
  redirect(result.url);
}
