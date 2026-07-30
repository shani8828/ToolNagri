import ToolDirectory from "@/components/ToolDirectory";
import { CATEGORIES } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import { breadcrumbNode, jsonLdGraph } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

/** Metadata comes from the generated layout.tsx alongside this file. */
export default function AllToolsPage() {
  const jsonLd = jsonLdGraph([
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "All Tools", path: "/all-tools" },
    ]),
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl("/all-tools")}#collection`,
      url: absoluteUrl("/all-tools"),
      name: "All ToolNagri tools",
      description: `Complete directory of ${TOOLS.length} free online tools across ${CATEGORIES.length} categories.`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: TOOLS.length,
        itemListElement: TOOLS.map((tool, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: tool.name,
          url: absoluteUrl(`/${tool.slug}`),
        })),
      },
    },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <header className="animate-fade-up max-w-2xl">
        <span className="inline-flex items-center rounded-full border border-border-color bg-secondary-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-text">
          Directory
        </span>
        <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-primary-text md:text-[2.75rem] md:leading-[1.08]">
          All {TOOLS.length} free online tools
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-secondary-text md:text-base">
          The complete catalogue, grouped into {CATEGORIES.length} categories. Every tool is free,
          needs no account, and - apart from the few that must query a live service - does all its
          work inside your browser.
        </p>
      </header>

      <ToolDirectory />
    </div>
  );
}
