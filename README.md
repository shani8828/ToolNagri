# 🛠️ ToolNagri

> **ToolNagri** is a suite of 44 free online utilities that run entirely in the visitor's browser. No signup, no uploads, no file limits. Built for speed, privacy and search visibility.
>
> 🌐 **Live:** [toolnagri.vercel.app](https://toolnagri.vercel.app)
> 🏢 **Parent Organization:** [Ayodhya Serenity](https://ayodhyaserenity.vercel.app)

---

## 🎨 Design Principles

* **Neutral by default.** White, black and gray carry the interface; colour is reserved for meaning (success, warning, danger), not decoration.
* **Privacy-first.** Image, PDF and text tools use browser APIs (Canvas, `pdf-lib`, `qrcode`). Files are never uploaded, so there is no server-side copy to leak.
* **Cheap motion.** Entrance and hover effects are CSS keyframes. No animation library ships to the client.
* **Responsive from 320px.** Verified with no horizontal overflow at mobile, tablet and desktop widths.
* **Reduced-motion aware.** Animations collapse to their end state when the OS requests it.

---

## 🗂️ Tool Catalogue

44 tools across 8 categories. Every category has an indexable hub page at `/tools/<slug>`.

| Category | Hub | Tools |
| :--- | :--- | ---: |
| PDF Tools | `/tools/pdf` | 6 |
| Image Tools | `/tools/image` | 5 |
| Text Tools | `/tools/text` | 6 |
| Developer Tools | `/tools/developer` | 12 |
| Calculators & Converters | `/tools/calculators` | 5 |
| SEO & Marketing Tools | `/tools/seo` | 4 |
| Social & Downloads | `/tools/social` | 3 |
| Network & Security Tools | `/tools/network` | 3 |

The full list is at [`/all-tools`](https://toolnagri.vercel.app/all-tools).

---

## ⚡ Tech Stack

* **Framework:** Next.js 16 (App Router), statically prerendered wherever possible
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4 with CSS custom properties
* **Database:** MongoDB Atlas - used only by the URL shortener
* **Icons:** Lucide React
* **Analytics:** Google Tag Manager (configure the GA4 tag inside the container)

---

## 🧭 Architecture Notes

### The catalogue is the single source of truth

`src/lib/tools.ts` holds every tool's slug, category, SEO title, description, keywords and content date. `src/lib/categories.ts` holds the taxonomy. Both are **pure data with no React imports**, so the sitemap, route handlers and server components can read them without pulling UI into the bundle. Icons are referenced by name and resolved through `src/lib/tool-icons.ts`.

Anything derived from a tool - its category badge, breadcrumbs, related tools, sitemap entry, metadata - reads from here. A tool cannot disagree with the catalogue about which category it is in.

### Metadata is generated, not hand-written

Each tool route needs a server `layout.tsx` because its `page.tsx` is a client component and Next.js only reads `metadata` from server components. Those wrappers are generated:

```bash
node src/lib/generate-layouts.js
```

Re-run it after adding a tool to `tools.ts`. The generated files contain no copy of their own - they call `toolMetadata(slug)` in `src/lib/seo.ts`, which builds the title, description, canonical URL and Open Graph block from the catalogue.

> **Why generated:** the root layout previously set `alternates.canonical: "/"`. Next.js merges metadata parent-to-child, so all 42 tool pages inherited it and declared themselves duplicates of the homepage. Routing every route's canonical through one helper makes that class of bug impossible to reintroduce quietly.

### Structured data

`src/lib/seo.ts` builds JSON-LD:

* Tool pages - `SoftwareApplication`, `BreadcrumbList`, `FAQPage`, `HowTo`
* Category hubs and `/all-tools` - `CollectionPage` + `ItemList`, `BreadcrumbList`
* Homepage - `Organization`, `WebSite` with `SearchAction`, category `ItemList`

No `aggregateRating` is emitted: there are no real ratings to report, and fabricating them is both dishonest and a spam signal.

### URL shortener

* Canonical path is `/s/<slug>`.
* The root-level `/<slug>` route is retained so links created before the move keep working.
* A miss on either path calls `notFound()` and returns a genuine **404**. Do not add a `loading.tsx` to these routes - it makes the response stream, and a streamed response cannot set a 404 status.
* Destinations are validated in `src/lib/url-safety.ts` (scheme allow-list, private/loopback host blocking, no credentials in URL, no self-referencing loops).
* Creation is rate limited to 12 links per hour per client via `src/lib/rate-limit.ts`, backed by MongoDB so the limit holds across serverless instances.
* Slug uniqueness is enforced by a unique index, not a check-then-write.
* Reserved slugs are derived from the catalogue, so a short link can never shadow a real page.

### Social media downloaders

`/instagram-reel-downloader` and `/facebook-reel-downloader` are the only tools
that are **not** client-side, and the catalogue records that explicitly:
`processing: "network"` on a tool swaps its trust badges from "Runs in your
browser / Files never uploaded" to "Nothing stored / No signup". The privacy
claim is the main reason people trust the rest of the site, so a tool that
makes a network call must not inherit it.

**Resolution is delegated.** Meta publishes no API that returns media URLs for
arbitrary public posts. The only alternative is scraping their pages, which
breaches their Terms of Service, is blocked from datacenter IPs (Vercel's
included) and breaks whenever the markup changes. So `src/lib/media/resolver.ts`
posts to an external service instead:

```env
MEDIA_RESOLVER_URL=https://your-cobalt-instance.example.com/
MEDIA_RESOLVER_API_KEY=optional-key
```

The wire format is [cobalt](https://github.com/imputnet/cobalt)'s — open source
and self-hostable. Run your own instance somewhere with an unblocked IP, or
point at a commercial provider that speaks the same shape.

**With no resolver set the pages still render** and say plainly that the
downloader isn't switched on, rather than spinning forever. Configure it before
you let these two URLs get indexed, or you are publishing two thin pages that
don't work.

**The download proxy is the riskiest surface on the site.**
`/api/media/download` streams the resolved file back with a
`Content-Disposition` header, because Meta's CDN sets CORS headers that stop the
browser fetching it directly. Without restrictions it would be an open proxy, so:

* the target host must be a subdomain of `cdninstagram.com` or `fbcdn.net`, or
  exactly the configured resolver host — matched on **label boundaries**, since
  a plain `endsWith("fbcdn.net")` also matches the registerable `evil-fbcdn.net`;
* only `https` targets are accepted;
* only `video/*`, `audio/*` and `image/*` responses are passed through;
* responses are capped at 200 MB and 30 s, and sent with `nosniff`,
  `no-store` and a locked-down CSP;
* the filename is rewritten to `[A-Za-z0-9._-]` so it cannot inject a header;
* 40 downloads per client per 10 minutes.

Resolution itself is limited to 20 per client per 10 minutes, and tracking
parameters (`igsh`, `fbclid`, `utm_*`, …) are stripped from the pasted link
before it is forwarded.

**Bandwidth is the cost to watch.** Every proxied download is Vercel egress. At
~15 MB a reel, 10,000 downloads is ~150 GB — over the Hobby allowance and into
paid overage on Pro. Watch this before promoting the tools.

### Loading states

There is deliberately **no root `loading.tsx`**. Nearly every route is statically prerendered, so there is no wait to fill - a root loading boundary made React stream a Suspense placeholder and shipped ~32 skeleton nodes inside every page's HTML. Use the primitives in `src/components/Skeleton.tsx` for genuine waits instead (work a tool performs after interaction, or a route that queries the database).

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18.18 or later
* npm

### Installation

```bash
git clone https://github.com/AyodhyaSerenity/ToolNagari.git
cd ToolNagari
npm install
```

### Environment variables

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional - enables the Instagram/Facebook downloaders.
# Without it those two pages render but say they are not switched on.
MEDIA_RESOLVER_URL=https://your-cobalt-instance.example.com/
MEDIA_RESOLVER_API_KEY=
```

`NEXT_PUBLIC_SITE_URL` drives canonical tags, OG URLs, the sitemap and JSON-LD.

> ⚠️ **In production this must be the real public origin.** `src/lib/site.ts` refuses localhost values when `NODE_ENV === "production"` and falls back to the live domain, but set it correctly on Vercel rather than relying on that guard. When a custom domain is attached, update this one variable.

### Commands

```bash
npm run dev     # development server
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

---

## ⚖️ Legal & Branding

* **Ownership:** ToolNagri is owned, operated and managed by **Ayodhya Serenity**. All rights reserved.
* **Contact:** [info.ayodhyaserenity@gmail.com](mailto:info.ayodhyaserenity@gmail.com)
* **Privacy:** Client-side tools process files inside the browser sandbox. No user-uploaded files, passwords or documents are transmitted to our servers. Two exceptions, both flagged on their own pages: the URL shortener stores the destination URL and a click count, and the social downloaders send the link you paste to a resolver service.
* **Content:** The downloaders reach only publicly accessible posts. Downloaded media remains the copyright of whoever created it, and users are told so on every downloader page.
