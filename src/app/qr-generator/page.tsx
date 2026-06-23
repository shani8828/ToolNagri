"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { Download, QrCode, Sliders, RefreshCw, Palette } from "lucide-react";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [darkColor, setDarkColor] = useState("#111827");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQrCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const url = await QRCode.toDataURL(text.trim(), {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });
      setQrDataUrl(url);

      // Trigger short elegant confetti
      confetti({
        particleCount: 60,
        spread: 40,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#60a5fa", "#22c55e"],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to generate QR Code. Please check the input text and custom colors.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText("");
    setSize(256);
    setDarkColor("#111827");
    setLightColor("#ffffff");
    setErrorCorrection("M");
    setQrDataUrl("");
  };

  const howToUse = [
    "Enter the text, web URL, or contact details into the QR text input field.",
    "Adjust custom settings including size, background color, and QR block color.",
    "Choose an Error Correction Level (Higher levels let the QR stay readable if damaged).",
    "Click the Generate QR Code button.",
    "Click the Download PNG link to save the QR code image locally on your device."
  ];

  const benefits = [
    "Generate QR Codes instantly for links, text, contacts, and Wi-Fi networks.",
    "Full color customisation supporting custom branding schemes.",
    "Adjustable sizing settings for print or screen usage.",
    "High-performance client-side generation ensures data privacy.",
    "One-click high-resolution download support."
  ];

  const faqs = [
    {
      question: "Are these QR codes permanent?",
      answer: "Yes! QR codes are static representations of the text you input. They will work forever and will never expire."
    },
    {
      question: "What is Error Correction Level?",
      answer: "Error correction allows a QR code to be scanned even if part of it is dirty or damaged. Level L handles ~7% damage, M ~15%, Q ~25%, and H ~30%. Higher levels increase density and make the QR blocks smaller."
    },
    {
      question: "Can I use these QR codes for commercial projects?",
      answer: "Absolutely. The generated QR codes are standard-compliant and free for both personal and commercial use without any restrictions."
    }
  ];

  const relatedTools = [
    {
      name: "Free URL Shortener",
      url: "/url-shortener",
      description: "Shorten links, generate QR codes, and view analytics parameters."
    },
    {
      name: "Password Generator",
      url: "/password-generator",
      description: "Configure secure passwords with custom specifications client-side."
    },
    {
      name: "UTM Builder",
      url: "/utm-builder",
      description: "Quickly build UTM marketing campaign tags to append to your landing page URLs."
    }
  ];

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create custom, high-resolution QR codes in seconds. Enter text or URLs, personalize the branding colors, adjust sizing, and download static QR codes ready for print and media."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Panel */}
        <form onSubmit={generateQrCode} className="lg:col-span-7 space-y-5">
          <div className="space-y-2">
            <label htmlFor="text" className="block text-sm font-semibold text-primary-text">
              QR Code Content (Text, Link, Email)
            </label>
            <textarea
              id="text"
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL (e.g. https://ayodhyaserenity.vercel.app) or raw text content..."
              className="block w-full rounded-lg border border-border-color px-4 py-3 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="size" className="block text-sm font-semibold text-primary-text items-center gap-1">
                <Sliders className="h-4 w-4 text-accent" /> Size (pixels)
              </label>
              <select
                id="size"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="block w-full rounded-lg border border-border-color px-3 py-2 bg-background text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="128">128 x 128 px (Small)</option>
                <option value="256">256 x 256 px (Medium)</option>
                <option value="512">512 x 512 px (Large)</option>
                <option value="1024">1024 x 1024 px (Print/HD)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="ecc" className="block text-sm font-semibold text-primary-text">
                Error Correction Level
              </label>
              <select
                id="ecc"
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as "L" | "M" | "Q" | "H")}
                className="block w-full rounded-lg border border-border-color px-3 py-2 bg-background text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="L">Level L (~7% Correction)</option>
                <option value="M">Level M (~15% Correction)</option>
                <option value="Q">Level Q (~25% Correction)</option>
                <option value="H">Level H (~30% Correction - Safe)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="darkColor" className="text-sm font-semibold text-primary-text flex items-center gap-1">
                <Palette className="h-4 w-4 text-accent" /> QR Code Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="darkColor"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="h-10 w-12 rounded border border-border-color cursor-pointer bg-background p-1"
                />
                <input
                  type="text"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 rounded-lg border border-border-color px-3 py-2 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="lightColor" className="text-sm font-semibold text-primary-text flex items-center gap-1">
                <Palette className="h-4 w-4 text-secondary-text" /> Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="lightColor"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="h-10 w-12 rounded border border-border-color cursor-pointer bg-background p-1"
                />
                <input
                  type="text"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 rounded-lg border border-border-color px-3 py-2 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate QR Code"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
              title="Reset configuration"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Right Preview Panel */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center border border-border-color rounded-2xl p-6 bg-secondary-bg min-h-[300px]">
          {qrDataUrl ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1">
                <QrCode className="h-3.5 w-3.5" /> Preview Generated QR
              </span>
              <div className="border border-border-color rounded-xl bg-white p-4 shadow-md max-w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="Generated Custom QR Code"
                  width={200}
                  height={200}
                  className="max-w-[200px] h-auto"
                />
              </div>
              <a
                href={qrDataUrl}
                download="toolnagri-qrcode.png"
                className="inline-flex items-center gap-2 rounded-lg bg-accent hover:bg-accent-light px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download PNG
              </a>
            </div>
          ) : (
            <div className="text-center text-secondary-text p-6 space-y-2">
              <QrCode className="h-10 w-10 text-secondary-text/40 mx-auto" />
              <p className="text-sm font-semibold">No QR Code Generated Yet</p>
              <p className="text-xs">Fill out the left form and hit Generate to render your QR code.</p>
            </div>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
