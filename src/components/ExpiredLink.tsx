import Link from "next/link";
import { Clock } from "lucide-react";

/** Shown when a short link resolved but has passed its expiry date. */
export default function ExpiredLink({ slug }: { slug: string }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-color bg-secondary-bg text-secondary-text">
        <Clock aria-hidden className="h-5 w-5" />
      </span>
      <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-primary-text">
        This short link has expired
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-secondary-text">
        The link <code className="rounded bg-secondary-bg px-1.5 py-0.5 text-[13px]">/{slug}</code>{" "}
        was created with an expiry date that has now passed, so it no longer points anywhere.
      </p>
      <Link
        href="/url-shortener"
        className="mt-8 inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-[14px] font-semibold text-background transition-colors hover:bg-accent-light"
      >
        Create a new short link
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
