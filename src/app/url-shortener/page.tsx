"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { createShortUrlAction, getShortUrlsAnalyticsAction } from "@/app/actions/shortener";
import { Link2, Copy, Check, QrCode, ArrowRight, BarChart2, Trash2, Calendar, ShieldAlert } from "lucide-react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";

interface SavedLink {
  slug: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clicks: number;
}

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiryOption, setExpiryOption] = useState("never");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string; slug: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  
  // Dashboard states
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Fetch analytics for user's shortened links
  const fetchAnalytics = useCallback(async () => {
    try {
      const storedSlugsStr = localStorage.getItem("toolnagri_shortened_slugs");
      if (!storedSlugsStr) return;
      
      const slugs: string[] = JSON.parse(storedSlugsStr);
      if (slugs.length === 0) return;

      setAnalyticsLoading(true);
      const res = await getShortUrlsAnalyticsAction(slugs);
      
      if (res.success && res.data) {
        const data = res.data as SavedLink[];
        // Sort by creation date descending
        const sorted = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSavedLinks(sorted);

        // Sync local storage if any slugs have been deleted from db (e.g. expired)
        const activeSlugs = data.map(d => d.slug);
        if (activeSlugs.length !== slugs.length) {
          localStorage.setItem("toolnagri_shortened_slugs", JSON.stringify(activeSlugs));
        }
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Load saved links on component mount
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setQrCodeDataUrl("");

    if (!url) {
      setError("Please enter a valid URL.");
      setLoading(false);
      return;
    }

    const res = await createShortUrlAction(url, customSlug, expiryOption);

    if (res.success && res.slug) {
      const host = window.location.origin;
      const shortened = `${host}/${res.slug}`;
      setResult({ shortUrl: shortened, slug: res.slug });

      // Save to localStorage
      try {
        const storedSlugsStr = localStorage.getItem("toolnagri_shortened_slugs");
        const slugs: string[] = storedSlugsStr ? JSON.parse(storedSlugsStr) : [];
        if (!slugs.includes(res.slug)) {
          slugs.push(res.slug);
          localStorage.setItem("toolnagri_shortened_slugs", JSON.stringify(slugs));
        }
      } catch (e) {
        console.error("Local storage error:", e);
      }

      // Generate QR Code
      try {
        const qrUrl = await QRCode.toDataURL(shortened, {
          width: 300,
          margin: 2,
          color: {
            dark: "#111827",
            light: "#ffffff",
          },
        });
        setQrCodeDataUrl(qrUrl);
      } catch (err) {
        console.error("QR Code generation error:", err);
      }

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#60a5fa", "#22c55e"],
      });

      // Clear input fields
      setUrl("");
      setCustomSlug("");
      setExpiryOption("never");

      // Reload analytics dashboard
      fetchAnalytics();
    } else {
      setError(res.error || "An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const deleteLocalLink = (slugToDelete: string) => {
    try {
      const storedSlugsStr = localStorage.getItem("toolnagri_shortened_slugs");
      if (!storedSlugsStr) return;
      const slugs: string[] = JSON.parse(storedSlugsStr);
      const filtered = slugs.filter(s => s !== slugToDelete);
      localStorage.setItem("toolnagri_shortened_slugs", JSON.stringify(filtered));
      setSavedLinks(prev => prev.filter(item => item.slug !== slugToDelete));
    } catch (e) {
      console.error(e);
    }
  };

  const howToUse = [
    "Enter the long URL you wish to shorten into the destination input.",
    "Optionally, type a custom name (slug) to create a custom-branded short link.",
    "Select an link expiration date (1 Hour, 1 Day, 1 Week, or Never).",
    "Click the Shorten URL button to generate your short link and instant QR code.",
    "Copy, share, and track clicks using the built-in analytics dashboard below."
  ];

  const benefits = [
    "100% Free & Unlimited link shortening.",
    "Custom slugs to create professional branded links.",
    "Instant high-resolution QR code generated automatically for every link.",
    "Set expiry timers for temporary sharing protection.",
    "Sleek click analytics dashboard to count visitor numbers.",
    "Secure database storage hosted on MongoDB Atlas."
  ];

  const faqs = [
    {
      question: "Are shortened links permanent?",
      answer: "Yes, by default, links are set to 'Never Expire' and will remain active forever. However, you can select custom expiry durations like 1 Hour, 1 Day, or 1 Week to automatically deactivate temporary links."
    },
    {
      question: "How do I check click statistics?",
      answer: "Every link you shorten on this device will automatically appear in your Analytics Dashboard at the bottom of the page. You can see the original destination, creation timestamp, expiry details, and the total clicks."
    },
    {
      question: "Is there a limit on shortening custom links?",
      answer: "No, you can generate as many short links and custom alias links as you need, completely free of charge."
    },
    {
      question: "Can I delete a short URL I generated?",
      answer: "You can remove shortened links from your local dashboard visibility by clicking the delete icon. This removes it from your device dashboard."
    }
  ];

  const relatedTools = [
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully custom styling QR codes for text, emails, Wi-Fi networks, and contact details."
    },
    {
      name: "UTM Builder",
      url: "/utm-builder",
      description: "Quickly build UTM marketing campaign tags to append to your landing page URLs."
    },
    {
      name: "Password Generator",
      url: "/password-generator",
      description: "Generate highly secure passwords client-side to protect your personal account login details."
    }
  ];

  return (
    <ToolLayout
      title="Free URL Shortener"
      description="Create premium, short, and memorable URLs instantly. Brand your links with custom aliases, configure temporary expiration dates, and get real-time click metrics on our unified dashboard."
      category="Utility Tools"
      categoryUrl="/#utility"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-8">
        
        {/* Form and Input Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="url" className="block text-sm font-semibold text-primary-text">
              Destination URL
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Link2 className="h-5 w-5 text-secondary-text" />
              </div>
              <input
                type="text"
                name="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-landing-page-url-path"
                className="block w-full rounded-lg border border-border-color py-3 pl-10 pr-4 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="customSlug" className="block text-sm font-semibold text-primary-text">
                Custom Alias (Optional)
              </label>
              <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border-color bg-secondary-bg px-3 text-xs text-secondary-text">
                  toolnagri.app/
                </span>
                <input
                  type="text"
                  name="customSlug"
                  id="customSlug"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="my-link-name"
                  className="block w-full min-w-0 flex-1 rounded-r-lg border border-border-color px-3 py-2 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="expiry" className="block text-sm font-semibold text-primary-text">
                Link Expiration
              </label>
              <select
                id="expiry"
                name="expiry"
                value={expiryOption}
                onChange={(e) => setExpiryOption(e.target.value)}
                className="block w-full rounded-lg border border-border-color px-3 py-2 bg-background text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={loading}
              >
                <option value="never">Never Expire</option>
                <option value="1h">Expire in 1 Hour</option>
                <option value="1d">Expire in 1 Day</option>
                <option value="1w">Expire in 1 Week</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-light focus:outline-none transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Shortening Link..." : "Shorten URL"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Results Card */}
        {result && (
          <div className="rounded-xl border border-border-color bg-secondary-bg p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Your Shortened URL
                </span>
                <div className="flex rounded-lg shadow-sm w-full">
                  <input
                    type="text"
                    readOnly
                    value={result.shortUrl}
                    className="block w-full rounded-l-lg border border-border-color bg-background px-3 py-2.5 text-sm text-primary-text font-medium focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(result.shortUrl)}
                    className="inline-flex items-center justify-center rounded-r-lg border border-l-0 border-border-color bg-background hover:bg-hover-bg px-4 text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border-color">
              {/* QR Code display */}
              {qrCodeDataUrl && (
                <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left md:col-span-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text flex items-center gap-1">
                    <QrCode className="h-3.5 w-3.5" /> Link QR Code
                  </span>
                  <div className="border border-border-color rounded-lg bg-white p-2 mt-1 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCodeDataUrl} alt="Short URL QR Code" className="w-32 h-32" />
                  </div>
                  <a
                    href={qrCodeDataUrl}
                    download={`qr-${result.slug}.png`}
                    className="mt-2 text-xs font-semibold text-accent hover:text-accent-light transition-colors"
                  >
                    Download QR Image (PNG)
                  </a>
                </div>
              )}

              {/* Success Tips */}
              <div className="flex flex-col justify-center gap-2 md:col-span-2 text-sm text-secondary-text">
                <h4 className="font-heading font-semibold text-primary-text">Next Steps</h4>
                <p>🚀 Copy your link and use it in social media captions, newsletters, and flyers.</p>
                <p>📊 Below you can see the number of times this link has been clicked in real-time.</p>
                <p>🔒 If you set an expiration, the link will redirect to the home page after the date passes.</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        <div className="border-t border-border-color pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-primary-text flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-accent" />
              Your Links Dashboard
            </h3>
            <button
              onClick={fetchAnalytics}
              disabled={analyticsLoading}
              className="text-xs font-semibold text-accent hover:text-accent-light transition-colors cursor-pointer"
            >
              {analyticsLoading ? "Updating Stats..." : "Refresh Stats"}
            </button>
          </div>

          {savedLinks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-color p-8 text-center text-sm text-secondary-text bg-secondary-bg">
              Shorten some links above to start tracking clicks and expiration analytics here.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border-color bg-card-bg shadow-sm">
              <table className="min-w-full divide-y divide-border-color text-left text-sm">
                <thead className="bg-secondary-bg text-xs font-semibold uppercase tracking-wider text-secondary-text">
                  <tr>
                    <th className="px-4 py-3">Short URL</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Destination</th>
                    <th className="px-4 py-3">Clicks</th>
                    <th className="px-4 py-3 hidden md:table-cell">Expiry</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {savedLinks.map((link) => {
                    const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
                    return (
                      <tr key={link.slug} className="hover:bg-hover-bg transition-colors">
                        <td className="px-4 py-3.5 font-medium text-primary-text">
                          <a
                            href={`/${link.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-accent flex items-center gap-1.5"
                          >
                            /{link.slug}
                          </a>
                        </td>
                        <td className="px-4 py-3.5 text-secondary-text hidden sm:table-cell max-w-xs truncate">
                          {link.originalUrl}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-primary-text">
                          {link.clicks}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-secondary-text hidden md:table-cell">
                          {link.expiresAt ? (
                            isExpired ? (
                              <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning">
                                Expired
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-primary-text">
                                <Calendar className="h-3 w-3" />
                                {new Date(link.expiresAt).toLocaleDateString()}
                              </span>
                            )
                          ) : (
                            <span className="text-secondary-text">Never</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleCopy(`${window.location.origin}/${link.slug}`)}
                            className="p-1 hover:text-accent text-secondary-text rounded transition-colors cursor-pointer"
                            title="Copy link"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteLocalLink(link.slug)}
                            className="p-1 hover:text-warning text-secondary-text rounded transition-colors cursor-pointer"
                            title="Remove from Dashboard"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
