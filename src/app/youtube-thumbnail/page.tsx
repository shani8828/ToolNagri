"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Youtube, Download, RefreshCw, AlertCircle, Image as ImageIcon } from "lucide-react";

interface ThumbnailItem {
  resolution: string;
  url: string;
  width: string;
}

export default function YoutubeThumbnail() {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnails, setThumbnails] = useState<ThumbnailItem[]>([]);
  const [error, setError] = useState("");

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setThumbnails([]);

    if (!videoUrl.trim()) return;

    const videoId = extractVideoId(videoUrl.trim());
    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid watch link or sharing shortcode.");
      return;
    }

    const fetchedThumbnails: ThumbnailItem[] = [
      {
        resolution: "HD Resolution (1080p / Max Res)",
        url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        width: "1280x720",
      },
      {
        resolution: "SD Resolution (640p)",
        url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        width: "640x480",
      },
      {
        resolution: "HQ Resolution (480p / High Quality)",
        url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        width: "480x360",
      },
      {
        resolution: "Medium Resolution (320p)",
        url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        width: "320x180",
      },
    ];

    setThumbnails(fetchedThumbnails);
  };

  const handleReset = () => {
    setVideoUrl("");
    setThumbnails([]);
    setError("");
  };

  const howToUse = [
    "Copy the YouTube video link from your browser or sharing app.",
    "Paste the URL into the search bar input field above.",
    "Click the Extract Thumbnails button.",
    "Preview the thumbnail sizes (HD, SD, Medium) on the layout cards.",
    "Right-click and save, or click the Download links to save each image."
  ];

  const benefits = [
    "100% Free: No fees or hidden registrations.",
    "Supports multiple resolutions from HD max-resolution to standard previews.",
    "Client-side processing avoids heavy background APIs and operates instantly.",
    "Adheres fully to YouTube static asset endpoints (safe and legal)."
  ];

  const faqs = [
    {
      question: "Why doesn't the HD (Max Res) image load?",
      answer: "YouTube only generates the 'maxresdefault' thumbnail if the creator uploaded an HD video thumbnail. If the video was uploaded in low resolution, the HD image card might show a placeholder or fail to load. In that case, use the SD or HQ resolutions."
    },
    {
      question: "Which YouTube link styles are supported?",
      answer: "We support standard browser watch URLs (youtube.com/watch?v=...), mobile share links (youtu.be/...), embed links, and short codes."
    },
    {
      question: "Is it legal to download YouTube thumbnails?",
      answer: "Yes, downloading thumbnails for personal reference, cataloging, design feedback, or educational purposes is allowed. Do not re-upload creators' copyrighted assets commercially."
    }
  ];

  const relatedTools = [
    {
      name: "UTM Campaign Builder",
      url: "/utm-builder",
      description: "Quickly build UTM marketing campaign tags to append to your landing page URLs."
    },
    {
      name: "Free URL Shortener",
      url: "/url-shortener",
      description: "Shorten links, generate QR codes, and view analytics parameters."
    },
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully styled QR codes with customized sizing and colors."
    }
  ];

  return (
    <ToolLayout
      title="YouTube Thumbnail Downloader"
      description="Extract and download static thumbnail images from any YouTube video. Get standard preview links, SD cards, or high-definition max-res configurations in one click."
      category="Social Tools"
      categoryUrl="/#social-seo"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* URL Input Form */}
        <form onSubmit={handleFetch} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="videoUrl" className="block text-sm font-semibold text-primary-text">
              YouTube Video URL
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Youtube className="h-5 w-5 text-red-500" />
              </div>
              <input
                type="text"
                id="videoUrl"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
                className="block w-full rounded-lg border border-border-color py-3 pl-10 pr-4 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer"
            >
              Extract Thumbnails
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
              title="Reset search"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Thumbnail Outputs Grid */}
        {thumbnails.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-border-color">
            <h3 className="font-heading text-lg font-bold text-primary-text flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-accent" />
              Available Resolutions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thumbnails.map((thumb, idx) => (
                <div key={idx} className="border border-border-color rounded-2xl p-4 bg-secondary-bg/50 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary-text">{thumb.resolution}</span>
                      <span className="text-xs text-secondary-text border border-border-color bg-background px-2 py-0.5 rounded-full">
                        {thumb.width}
                      </span>
                    </div>
                    <div className="border border-border-color/30 rounded-xl overflow-hidden bg-white aspect-video relative flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb.url}
                        alt={`YouTube Thumbnail ${thumb.resolution}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails, hide or fallback
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="text-xs text-secondary-text p-4 text-center">Resolution format not generated by YouTube for this video.</div>';
                          }
                        }}
                      />
                    </div>
                  </div>

                  <a
                    href={thumb.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-color bg-background hover:bg-hover-bg py-2.5 text-xs font-semibold text-primary-text transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" /> View / Save Image
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
