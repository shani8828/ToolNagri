"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Image as ImageIcon, Copy, Check, RefreshCw, AlertCircle, Palette } from "lucide-react";
import confetti from "canvas-confetti";

interface ExtractedColor {
  hex: string;
  rgb: string;
  hsl: string;
  percentage: number;
}

export default function ImagePaletteExtractor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) => {
      const hex = Math.max(0, Math.min(255, c)).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const processImage = (file: File) => {
    setError("");
    setLoading(true);
    setColors([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            setError("Failed to initialize canvas context.");
            setLoading(false);
            return;
          }

          // Scale down image to analyze faster
          const maxDim = 150;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);

          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          // Color bucketing quantization
          const colorCounts: Record<string, number> = {};
          let totalSampled = 0;

          // Step by 3 pixels to keep it fast
          for (let i = 0; i < data.length; i += 12) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Ignore transparent pixels
            if (a < 125) continue;

            // Reduce color space by grouping close values (bucket size 24)
            const rB = Math.round(r / 24) * 24;
            const gB = Math.round(g / 24) * 24;
            const bB = Math.round(b / 24) * 24;

            const key = `${rB},${gB},${bB}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
            totalSampled++;
          }

          const sortedColors = Object.entries(colorCounts)
            .map(([key, count]) => {
              const [r, g, b] = key.split(",").map(Number);
              return {
                hex: rgbToHex(r, g, b),
                rgb: `rgb(${r}, ${g}, ${b})`,
                hsl: rgbToHsl(r, g, b),
                count
              };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Extract top 8 colors

          const extracted = sortedColors.map((item) => ({
            hex: item.hex,
            rgb: item.rgb,
            hsl: item.hsl,
            percentage: parseFloat(((item.count / totalSampled) * 100).toFixed(1))
          }));

          setColors(extracted);
          setLoading(false);

          confetti({
            particleCount: 20,
            spread: 25,
            origin: { y: 0.8 },
            colors: extracted.map((c) => c.hex),
          });

        } catch (err: any) {
          setError("Failed to extract color channels from canvas.");
          setLoading(false);
        }
      };
      img.onerror = () => {
        setError("Failed to load image element.");
        setLoading(false);
      };
      img.src = src;
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    } else {
      setError("Please drop a valid image file (PNG, JPG, WebP).");
    }
  };

  const handleCopyColor = (colorStr: string) => {
    navigator.clipboard.writeText(colorStr);
    setCopiedColor(colorStr);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleReset = () => {
    setImageSrc(null);
    setColors([]);
    setError("");
  };

  const howToUse = [
    "Upload a PNG, JPG, or WebP graphic file by dragging it to the Drop Zone.",
    "Observe the rendered image mockup and loading status indicator.",
    "Review extracted dominant colors showing HEX, RGB, HSL values and ratios.",
    "Click on any color code string to instantly copy it to your clipboard."
  ];

  const benefits = [
    "Uses HTML5 Canvas API local calculations (0ms server latency).",
    "Extracts up to 8 of the most dominant color nodes.",
    "Outputs values in web standard HEX, RGB, and HSL formats.",
    "100% Client-Side parsing keeps uploaded photos private."
  ];

  const faqs = [
    {
      question: "How does color quantization work?",
      answer: "The tool groups similar pixel color clusters (RGB values) into bucket ranges. It counts matching occurrences to find the most frequent color nodes, filtering out unique outlier pixels."
    },
    {
      question: "Are my uploaded photos safe?",
      answer: "Yes. Your images are parsed fully inside your browser sandbox using canvas memory buffers. No image files are ever uploaded or transmitted over the network."
    }
  ];

  const relatedTools = [
    { name: "Color Converter", url: "/color-converter", description: "Convert RGB, HEX and HSL values." },
    { name: "CSS Gradient Generator", url: "/css-gradient-generator", description: "Design multi-stop CSS gradients." }
  ];

  return (
    <ToolLayout
      title="Image Palette Extractor"
      description="Extract dominant color palettes from any image. Drag and drop PNG, JPG, or WebP files to generate HEX, RGB, and HSL codes fully client-side."
      category="CSS & Design Utilities"
      categoryUrl="/#design"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Upload workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Dropzone area */}
          <div className="space-y-3.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="h-4.5 w-4.5 text-accent" /> Source Image
            </label>

            {imageSrc ? (
              <div className="border border-border-color rounded-2xl overflow-hidden bg-card-bg p-4 flex flex-col items-center justify-center relative min-h-62.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Source preview"
                  className="max-h-60 w-auto rounded-lg object-contain shadow-sm border border-border-color/40"
                />
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border-color hover:border-accent rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-card-bg transition-colors min-h-62.5"
              >
                <Upload className="h-10 w-10 text-secondary-text mb-3 animate-pulse" />
                <span className="text-sm font-semibold text-primary-text mb-1">Drag & Drop Image Here</span>
                <span className="text-xs text-secondary-text">PNG, JPG, JPEG, or WebP files accepted</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Palette list results */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Palette className="h-4.5 w-4.5 text-success" /> Extracted Palette
              </span>

              {loading ? (
                <div className="py-14 text-center text-xs text-secondary-text font-semibold animate-pulse">
                  Analyzing pixels...
                </div>
              ) : colors.length === 0 ? (
                <div className="py-14 text-center text-xs text-secondary-text italic leading-relaxed">
                  Upload an image to extract its color palette.
                </div>
              ) : (
                <div className="space-y-3 max-h-55 overflow-y-auto pr-1">
                  {colors.map((color, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-secondary-bg/25 p-2.5 rounded-xl border border-border-color/60">
                      
                      {/* Color Preview Block */}
                      <div
                        style={{ backgroundColor: color.hex }}
                        className="h-10 w-10 rounded-lg border border-border-color/60 shrink-0 shadow-xs"
                      />

                      {/* Code representations */}
                      <div className="flex-1 min-w-0 grid grid-cols-3 gap-2 text-[10px] font-mono font-bold text-primary-text">
                        <button
                          onClick={() => handleCopyColor(color.hex)}
                          className="py-1 px-1.5 border border-border-color rounded bg-background hover:bg-hover-bg text-center cursor-pointer truncate transition-colors flex items-center justify-center gap-1"
                        >
                          {copiedColor === color.hex ? <Check className="h-3 w-3 text-success" /> : null}
                          {color.hex}
                        </button>

                        <button
                          onClick={() => handleCopyColor(color.rgb)}
                          className="py-1 px-1.5 border border-border-color rounded bg-background hover:bg-hover-bg text-center cursor-pointer truncate transition-colors flex items-center justify-center gap-1"
                        >
                          {copiedColor === color.rgb ? <Check className="h-3 w-3 text-success" /> : null}
                          RGB
                        </button>

                        <button
                          onClick={() => handleCopyColor(color.hsl)}
                          className="py-1 px-1.5 border border-border-color rounded bg-background hover:bg-hover-bg text-center cursor-pointer truncate transition-colors flex items-center justify-center gap-1"
                        >
                          {copiedColor === color.hsl ? <Check className="h-3 w-3 text-success" /> : null}
                          HSL
                        </button>
                      </div>

                      {/* Percentage display */}
                      <div className="text-[10px] font-semibold text-secondary-text shrink-0 w-10 text-right">
                        {color.percentage}%
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
            <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
            <span>{error}</span>
          </div>
        )}

        {/* Start over trigger */}
        {imageSrc && (
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Clear / Reset
            </button>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
