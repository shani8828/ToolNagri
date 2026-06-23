"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Link2, Copy, Check, QrCode, RefreshCw, Sparkles, ExternalLink } from "lucide-react";
import QRCode from "qrcode";

export default function UtmBuilder() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (!websiteUrl) {
      setGeneratedUrl("");
      setQrCodeUrl("");
      return;
    }

    try {
      let formattedUrl = websiteUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = "https://" + formattedUrl;
      }

      const urlObj = new URL(formattedUrl);
      
      if (source.trim()) urlObj.searchParams.set("utm_source", source.trim());
      if (medium.trim()) urlObj.searchParams.set("utm_medium", medium.trim());
      if (campaign.trim()) urlObj.searchParams.set("utm_campaign", campaign.trim());
      if (term.trim()) urlObj.searchParams.set("utm_term", term.trim());
      if (content.trim()) urlObj.searchParams.set("utm_content", content.trim());

      const fullUrl = urlObj.toString();
      setGeneratedUrl(fullUrl);

      // Generate QR Code preview
      QRCode.toDataURL(fullUrl, { width: 200, margin: 1 })
        .then((url) => setQrCodeUrl(url))
        .catch((e) => console.error("QR fail:", e));

    } catch (err) {
      setGeneratedUrl("Invalid URL format.");
      setQrCodeUrl("");
    }
  }, [websiteUrl, source, medium, campaign, term, content]);

  const handleCopy = async () => {
    if (!generatedUrl || generatedUrl === "Invalid URL format.") return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setWebsiteUrl("");
    setSource("");
    setMedium("");
    setCampaign("");
    setTerm("");
    setContent("");
  };

  const howToUse = [
    "Type your destination landing page URL into the Website URL box.",
    "Add the Campaign Source (e.g. newsletter, google) and Campaign Medium (e.g. email, cpc).",
    "Enter a Campaign Name (e.g. spring_sale) to group traffic analytics.",
    "Add optional Campaign Term or Campaign Content parameters for keyword/A-B testing tracking.",
    "Copy the fully compiled campaign URL or scan its QR code immediately."
  ];

  const benefits = [
    "Standardized syntax formatting: Adheres to standard Google Analytics UTM schemas.",
    "Live real-time compilation shows you the URL structure immediately.",
    "Seamless URL shortener integration to compact long tracking parameters.",
    "Instant QR Code generator output built-in.",
    "Private and secure client-side calculation."
  ];

  const faqs = [
    {
      question: "What is a UTM parameter?",
      answer: "UTM (Urgent Tracker Module) parameters are query parameters appended to URLs. When a user clicks, analytics platforms (like Google Analytics) parse these tags to record exactly where the visit originated."
    },
    {
      question: "Which parameters are mandatory?",
      answer: "While none are technically hardcoded, Google Analytics generally requires 'Campaign Source' (utm_source) to register custom campaigns correctly."
    },
    {
      question: "Why should I shorten my UTM link?",
      answer: "UTM links contain multiple tracking queries, which makes them extremely long. Shortening makes them look clean and user-friendly for posting on social media bios or print sheets."
    }
  ];

  const relatedTools = [
    {
      name: "Free URL Shortener",
      url: "/url-shortener",
      description: "Shorten links, generate QR codes, and view analytics parameters."
    },
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully styled QR codes with customized sizing and colors."
    },
    {
      name: "Password Generator",
      url: "/password-generator",
      description: "Configure secure passwords with custom specifications client-side."
    }
  ];

  // Send the UTM url directly to URL Shortener page in browser
  const handleShortenLinkClick = () => {
    if (!generatedUrl || generatedUrl === "Invalid URL format.") return;
    // We can redirect or simply copy it. Let's redirect, but since URL shortener is a route:
    // We can copy it and navigate
    navigator.clipboard.writeText(generatedUrl).then(() => {
      window.location.href = `/url-shortener?url=${encodeURIComponent(generatedUrl)}`;
    });
  };

  return (
    <ToolLayout
      title="UTM Campaign URL Builder"
      description="Build campaign URLs with Google Analytics UTM tracking tags. Enter your target landing page details, campaign metrics, and copy the tracking link or QR code instantly."
      category="SEO Tools"
      categoryUrl="/#social-seo"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input parameters panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="webUrl" className="block text-sm font-semibold text-primary-text">
              Website URL *
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Link2 className="h-4 w-4 text-secondary-text" />
              </div>
              <input
                type="text"
                id="webUrl"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com/product-page"
                className="block w-full rounded-lg border border-border-color py-2.5 pl-9 pr-4 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="source" className="block text-sm font-semibold text-primary-text">
                Campaign Source *
              </label>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. google, newsletter, facebook"
                className="block w-full rounded-lg border border-border-color px-3 py-2 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="medium" className="block text-sm font-semibold text-primary-text">
                Campaign Medium
              </label>
              <input
                type="text"
                id="medium"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. cpc, email, social"
                className="block w-full rounded-lg border border-border-color px-3 py-2 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="campaignName" className="block text-sm font-semibold text-primary-text">
                Campaign Name
              </label>
              <input
                type="text"
                id="campaignName"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="e.g. summer_promo_2026"
                className="block w-full rounded-lg border border-border-color px-3 py-2 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="term" className="block text-sm font-semibold text-primary-text">
                Campaign Term
              </label>
              <input
                type="text"
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. running+shoes (keywords)"
                className="block w-full rounded-lg border border-border-color px-3 py-2 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="content" className="block text-sm font-semibold text-primary-text">
              Campaign Content
            </label>
            <input
              type="text"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. banner_ad_top, text_link_footer (A/B testing details)"
              className="block w-full rounded-lg border border-border-color px-3 py-2 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-color hover:bg-hover-bg py-2.5 text-xs font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Clear All Parameters
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-border-color rounded-2xl p-5 bg-secondary-bg/50">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Generated Campaign Link
            </span>
            <div className="border border-border-color bg-background rounded-xl p-3 text-xs font-mono text-primary-text break-all select-all min-h-[100px] shadow-sm">
              {generatedUrl || "Fill out the fields on the left to review your tracked campaign URL."}
            </div>

            {generatedUrl && generatedUrl !== "Invalid URL format." && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent hover:bg-accent-light py-2 px-3 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Campaign Link"}
                </button>
                <button
                  onClick={handleShortenLinkClick}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white py-2 px-3 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Shorten Link <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {qrCodeUrl && (
            <div className="border-t border-border-color pt-4 mt-4 flex items-center gap-4">
              <div className="border border-border-color rounded-lg bg-white p-1.5 shadow-sm shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeUrl} alt="Campaign QR Code" className="w-20 h-20" />
              </div>
              <div className="text-xs text-secondary-text space-y-1">
                <p className="font-semibold text-primary-text flex items-center gap-1">
                  <QrCode className="h-3.5 w-3.5" /> Campaign QR Code
                </p>
                <p>Scan to test on mobile.</p>
                <a href={qrCodeUrl} download="utm-campaign-qr.png" className="text-accent hover:underline">
                  Download PNG QR
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
