"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, FileImage, ShieldAlert } from "lucide-react";
import confetti from "canvas-confetti";

export default function ImageCompressor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG).");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setCompressedSrc(null);
    setCompressedSize(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCompress = () => {
    if (!imageSrc) return;

    setLoading(true);
    setError("");

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Failed to initialize canvas context.");
        setLoading(false);
        return;
      }

      // Maintain dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Compress to JPEG using selected quality (divided by 100 for ratio)
      const dataUrl = canvas.toDataURL("image/jpeg", quality / 100);
      setCompressedSrc(dataUrl);

      // Estimate compressed size
      const stringLength = dataUrl.length - "data:image/jpeg;base64,".length;
      const sizeInBytes = Math.ceil(stringLength * 0.75);
      setCompressedSize(sizeInBytes);

      setLoading(false);

      // Trigger Confetti
      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.75 },
        colors: ["#2563eb", "#60a5fa", "#22c55e"],
      });
    };
    img.onerror = () => {
      setError("Failed to load source image for rendering.");
      setLoading(false);
    };
  };

  const handleReset = () => {
    setImageSrc(null);
    setFileName("");
    setFileSize(0);
    setCompressedSrc(null);
    setCompressedSize(0);
    setQuality(80);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const howToUse = [
    "Upload or drag your JPG, JPEG, or PNG image file into the drop zone.",
    "Adjust the compression quality slider (lower values compress the file size further).",
    "Click the Compress Image button to process client-side.",
    "Compare the original file size vs the newly compressed file size.",
    "Click Download Compressed to save your new lightweight image file."
  ];

  const benefits = [
    "100% Safe client-side engine: Images are processed entirely in the browser and never uploaded to any server.",
    "Save hosting bandwidth and speed up website page load times.",
    "Customizable compression levels let you strike the perfect balance between quality and file size.",
    "Works offline without active internet requirements.",
    "Live preview helps you inspect image artifacts before saving."
  ];

  const faqs = [
    {
      question: "Which formats are supported?",
      answer: "You can upload JPG, JPEG, and PNG files. The output will automatically convert to compressed JPEG format to achieve the smallest possible file footprint."
    },
    {
      question: "Will I lose image quality?",
      answer: "A standard quality setting of 75% to 85% dramatically decreases file size (often by 70% or more) while keeping any visual differences virtually unnoticeable to the naked eye."
    },
    {
      question: "Is there a file limit on compression size?",
      answer: "Since processing runs locally on your computer, it depends entirely on your device's memory. We recommend files under 25MB for smooth operation."
    }
  ];

  const relatedTools = [
    {
      name: "JPG to WebP Converter",
      url: "/jpg-to-webp",
      description: "Convert standard images to lightweight WebP format to speed up performance."
    },
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully styled QR codes with customized sizing and colors."
    },
    {
      name: "Free URL Shortener",
      url: "/url-shortener",
      description: "Shorten links, generate QR codes, and view analytics parameters."
    }
  ];

  return (
    <ToolLayout
      title="Client-Side Image Compressor"
      description="Reduce image file sizes instantly. Customise compression levels, compare real-time dimensions and storage savings, with absolute privacy using fully client-side canvas parsing."
      category="Image Tools"
      categoryUrl="/#pdf-image"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Upload Zone */}
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border-color hover:border-accent rounded-2xl p-12 text-center bg-secondary-bg/30 hover:bg-hover-bg/30 cursor-pointer transition-all duration-200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Upload className="h-10 w-10 text-secondary-text/60 mx-auto mb-4" />
            <p className="font-heading font-semibold text-primary-text text-base">
              Select or Drag Image
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Supports PNG, JPG, JPEG files. Processes 100% locally.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Original Preview */}
              <div className="border border-border-color rounded-xl p-4 bg-secondary-bg flex flex-col items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text mb-3">
                  Original Image
                </span>
                <div className="relative border border-border-color/30 rounded-lg overflow-hidden bg-white max-h-[250px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt="Original uploaded file" className="max-h-[250px] w-auto object-contain" />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-primary-text truncate max-w-xs">{fileName}</p>
                  <p className="text-xs text-secondary-text mt-0.5">{formatSize(fileSize)}</p>
                </div>
              </div>

              {/* Compressed Preview */}
              <div className="border border-border-color rounded-xl p-4 bg-secondary-bg flex flex-col items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                  Compressed Image
                </span>
                <div className="relative border border-border-color/30 rounded-lg overflow-hidden bg-white min-h-[250px] max-h-[250px] flex items-center justify-center w-full">
                  {compressedSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={compressedSrc} alt="Compressed result" className="max-h-[250px] w-auto object-contain" />
                  ) : (
                    <div className="text-center text-xs text-secondary-text p-6">
                      Adjust quality slider and click Compress below to generate preview.
                    </div>
                  )}
                </div>
                {compressedSrc && (
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-success">
                      Saved {Math.round(((fileSize - compressedSize) / fileSize) * 100)}% of file size!
                    </p>
                    <p className="text-xs text-secondary-text mt-0.5">{formatSize(compressedSize)}</p>
                  </div>
                )}
              </div>

            </div>

            {/* Quality Adjuster */}
            <div className="border border-border-color rounded-xl p-5 bg-card-bg space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold text-primary-text">
                <span>Compression Quality</span>
                <span className="text-accent">{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xxs text-secondary-text font-semibold uppercase">
                <span>Small File Size (Low Quality)</span>
                <span>Best Balance</span>
                <span>High Quality (Large File)</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!compressedSrc ? (
                <button
                  onClick={handleCompress}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Compressing..." : "Compress Image"}
                </button>
              ) : (
                <a
                  href={compressedSrc}
                  download={`compressed-${fileName.substring(0, fileName.lastIndexOf("."))}.jpg`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success hover:bg-success/80 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Download Compressed
                </a>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Upload different image"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
