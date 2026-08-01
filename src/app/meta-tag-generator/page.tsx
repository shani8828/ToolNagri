"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Eye, Code, Search, Globe, Share2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function MetaTagGenerator() {
  // Inputs state
  const [title, setTitle] = useState("My Awesome Website");
  const [description, setDescription] = useState("Explore unique services and local developer tools securely in your browser.");
  const [keywords, setKeywords] = useState("seo, tools, meta tags, developer");
  const [author, setAuthor] = useState("ToolNagri");
  const [siteUrl, setSiteUrl] = useState("https://example.com");

  // OG State
  const [ogImage, setOgImage] = useState("https://example.com/og-image.jpg");

  // Twitter State
  const [twitterHandle, setTwitterHandle] = useState("@toolnagri");
  const [twitterCard, setTwitterCard] = useState<"summary" | "summary_large_image">("summary_large_image");

  // Preview tab state
  const [previewTab, setPreviewTab] = useState<"google" | "facebook" | "twitter">("google");

  const [generatedHtml, setGeneratedHtml] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let html = `<!-- Standard SEO Metadata -->\n`;
    if (title.trim()) html += `<title>${title.trim()}</title>\n`;
    if (description.trim()) html += `<meta name="description" content="${description.trim()}" />\n`;
    if (keywords.trim()) html += `<meta name="keywords" content="${keywords.trim()}" />\n`;
    if (author.trim()) html += `<meta name="author" content="${author.trim()}" />\n`;
    
    html += `\n<!-- Open Graph / Facebook Metadata -->\n`;
    html += `<meta property="og:type" content="website" />\n`;
    if (siteUrl.trim()) html += `<meta property="og:url" content="${siteUrl.trim()}" />\n`;
    if (title.trim()) html += `<meta property="og:title" content="${title.trim()}" />\n`;
    if (description.trim()) html += `<meta property="og:description" content="${description.trim()}" />\n`;
    if (ogImage.trim()) html += `<meta property="og:image" content="${ogImage.trim()}" />\n`;

    html += `\n<!-- Twitter Card Metadata -->\n`;
    html += `<meta name="twitter:card" content="${twitterCard}" />\n`;
    if (twitterHandle.trim()) html += `<meta name="twitter:creator" content="${twitterHandle.trim()}" />\n`;
    if (title.trim()) html += `<meta name="twitter:title" content="${title.trim()}" />\n`;
    if (description.trim()) html += `<meta name="twitter:description" content="${description.trim()}" />\n`;
    if (ogImage.trim()) html += `<meta name="twitter:image" content="${ogImage.trim()}" />\n`;

    setGeneratedHtml(html.trim());
  }, [title, description, keywords, author, siteUrl, ogImage, twitterHandle, twitterCard]);

  const handleCopyToClipboard = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setKeywords("");
    setAuthor("");
    setSiteUrl("");
    setOgImage("");
    setTwitterHandle("");
    setTwitterCard("summary_large_image");
  };

  // Helper to extract clean hostname
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return "example.com";
    }
  };

  const howToUse = [
    "Enter basic metadata fields (Title, Description, Keywords, Author).",
    "Specify your absolute Site URL and OG Cover Image link.",
    "Input your Twitter handle and select Twitter Card layouts.",
    "Toggle preview tabs to mock Google snippet, Facebook post, or Twitter Card.",
    "Verify layout correctness, click Copy Code, and paste it into your HTML <head> section."
  ];

  const benefits = [
    "Generates clean, standardized HTML metadata tags.",
    "Includes Open Graph and Twitter Card tags to increase click-through rates.",
    "Features live visual mockup simulators for Google, Facebook, and Twitter.",
    "100% Client-Side generation keeps site configurations private."
  ];

  const faqs = [
    {
      question: "Why are meta tags important for SEO?",
      answer: "Meta tags provide search engines with structured information about your web page content. Title tags and descriptions directly determine how your site appears in Search Engine Results Pages (SERPs)."
    },
    {
      question: "What are Open Graph tags?",
      answer: "Open Graph (OG) is a protocol introduced by Facebook that allows web pages to become rich objects in social graphs. They dictate the thumbnail, title, and description displayed when sharing links on Facebook, LinkedIn, or Discord."
    }
  ];

  const relatedTools = [
    { name: "Robots.txt Builder", url: "/robots-txt-generator", description: "Generate standardized crawlers rules." },
    { name: "Slug Generator", url: "/slug-generator", description: "Convert headlines into clean URL permalinks." }
  ];

  return (
    <ToolLayout
      title="Meta Tag Generator"
      description="Generate HTML meta tags for title, description, keywords, Open Graph, and Twitter Cards. Simulates visual snippet previews for Google, Facebook, and Twitter."
      category="SEO & Marketing Tools"
      categoryUrl="/#seo"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Input Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Code className="h-4 w-4 text-accent" /> Metadata Parameters
            </span>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Site Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My Website Title"
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Site URL</label>
                <input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="e.g. https://yoursite.com"
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Meta Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter page summary description..."
                  rows={2}
                  maxLength={200}
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none resize-none"
                />
                <div className="text-[10px] text-secondary-text text-right font-mono font-normal">
                  {description.length}/200 characters (150-160 recommended)
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. seo, web design, tools"
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. ToolNagri"
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>

              {/* Social Specifics */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Open Graph Image URL</label>
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="e.g. https://yoursite.com/og-image.jpg"
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Twitter Username</label>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="e.g. @username"
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Twitter Card Layout</label>
                <select
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value as any)}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                >
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="summary">Summary Small Image</option>
                </select>
              </div>

            </div>
          </div>

          {/* Previews / Mockups */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <div className="flex justify-between items-baseline border-b border-border-color pb-1.5">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Eye className="h-4.5 w-4.5 text-accent animate-pulse" /> Live Card Previews
              </span>
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background text-[10px] font-bold">
                {(["google", "facebook", "twitter"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPreviewTab(tab)}
                    className={`py-1 px-2.5 rounded-md cursor-pointer capitalize transition-all ${
                      previewTab === tab ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Google Mock */}
            {previewTab === "google" && (
              <div className="bg-white p-4 rounded-xl border border-border-color/60 text-left font-sans select-none space-y-1 shadow-xs">
                <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                  <Search className="h-3 w-3" /> {siteUrl || "https://example.com"}
                </div>
                <div className="text-lg text-blue-800 hover:underline font-medium cursor-pointer leading-tight font-heading">
                  {title || "My Awesome Title"}
                </div>
                <div className="text-xs text-gray-600 leading-normal wrap-break-word pt-0.5">
                  {description || "Explore unique tools locally in your browser."}
                </div>
              </div>
            )}

            {/* Facebook Mock */}
            {previewTab === "facebook" && (
              <div className="bg-[#f0f2f5] p-3 rounded-xl border border-border-color/60 font-sans select-none space-y-3 shadow-xs">
                <div className="flex gap-2 items-center">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">OG</div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{author || "Page Name"}</div>
                    <div className="text-[10px] text-gray-500 font-normal">Sponsored • 🌐</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-44 bg-gray-200 flex items-center justify-center relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ogImage} alt="OG Card" className="w-full h-full object-cover error-fallback" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300/30 text-gray-500 font-bold text-xs">Image Preview</div>
                  </div>
                  <div className="p-3 bg-[#f0f2f5]/40 text-left border-t border-gray-150 space-y-1">
                    <span className="text-[10px] uppercase text-gray-500 font-mono tracking-wider font-bold">
                      {getHostname(siteUrl)}
                    </span>
                    <div className="text-sm font-bold text-gray-800 line-clamp-1">{title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{description}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Twitter Mock */}
            {previewTab === "twitter" && (
              <div className="bg-[#15202b] text-white p-4 rounded-xl border border-border-color/60 font-sans select-none space-y-3 shadow-xs">
                <div className="flex gap-2.5 items-start">
                  <div className="h-9 w-9 bg-gray-600 rounded-full flex items-center justify-center font-bold text-sm text-gray-300 shrink-0">TW</div>
                  <div className="space-y-1 w-full text-left">
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span>{author || "Developer"}</span>
                      <span className="text-gray-400 font-normal">{twitterHandle || "@handle"} • 1m</span>
                    </div>
                    <div className="text-xs text-white leading-normal pt-0.5">
                      Check out this website! {siteUrl}
                    </div>

                    {/* Twitter Card UI */}
                    <div className="border border-gray-800 rounded-xl overflow-hidden mt-2 bg-[#15202b]">
                      {twitterCard === "summary_large_image" ? (
                        // Large Image layout
                        <div>
                          <div className="h-40 bg-gray-700 flex items-center justify-center relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ogImage} alt="Twitter Card" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/20 text-gray-400 font-bold text-[10px]">Large Cover Image Preview</div>
                          </div>
                          <div className="p-2.5 text-left space-y-1 border-t border-gray-800 bg-[#15202b]">
                            <span className="text-[10px] text-gray-400 font-mono">{getHostname(siteUrl)}</span>
                            <div className="text-xs font-bold text-white line-clamp-1">{title}</div>
                            <div className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{description}</div>
                          </div>
                        </div>
                      ) : (
                        // Small Image layout
                        <div className="flex items-center">
                          <div className="p-2.5 text-left space-y-1 flex-1 bg-[#15202b]">
                            <span className="text-[10px] text-gray-400 font-mono block">{getHostname(siteUrl)}</span>
                            <div className="text-xs font-bold text-white line-clamp-1">{title}</div>
                            <div className="text-[11px] text-gray-400 line-clamp-1 leading-normal">{description}</div>
                          </div>
                          <div className="h-20 w-20 bg-gray-700 shrink-0 border-l border-gray-800 flex items-center justify-center relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ogImage} alt="Twitter Card small" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/20 text-gray-400 font-bold text-[8px] text-center p-1">Image</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Code Output */}
            <div className="space-y-2 pt-2 border-t border-border-color/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-secondary-text uppercase tracking-wider block">Generated Header HTML</span>
                <button
                  onClick={handleCopyToClipboard}
                  className="py-1 px-2.5 rounded border border-border-color bg-background hover:bg-hover-bg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="bg-secondary-bg/30 p-3 rounded-lg border border-border-color/40 font-mono text-[10px] text-primary-text whitespace-pre-wrap leading-normal h-30 overflow-y-auto select-all">
                {generatedHtml}
              </pre>
            </div>

          </div>
        </div>

        {/* Start over trigger */}
        {(title || description || keywords || author || siteUrl || ogImage) && (
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Start Over
            </button>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
