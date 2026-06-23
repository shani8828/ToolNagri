"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function JpgToWebp() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setConvertedSrc(null);
    setConvertedSize(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConvert = () => {
    if (!imageSrc) return;

    setLoading(true);
    setError("");

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Failed to create canvas context.");
        setLoading(false);
        return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Convert to image/webp format
      try {
        const dataUrl = canvas.toDataURL("image/webp", 0.85); // High quality WebP output
        setConvertedSrc(dataUrl);

        // Estimate size
        const base64Content = dataUrl.substring(dataUrl.indexOf(",") + 1);
        const stringLength = base64Content.length;
        const sizeInBytes = Math.ceil(stringLength * 0.75);
        setConvertedSize(sizeInBytes);

        // Trigger confetti
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.7 },
          colors: ["#2563eb", "#22c55e"],
        });
      } catch (err) {
        console.error(err);
        setError("Your browser does not support WebP encoding. Try updating your browser.");
      } finally {
        setLoading(false);
      }
    };
    img.onerror = () => {
      setError("Failed to process input image.");
      setLoading(false);
    };
  };

  const handleReset = () => {
    setImageSrc(null);
    setFileName("");
    setFileSize(0);
    setConvertedSrc(null);
    setConvertedSize(0);
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
    "Select or drop your JPG, JPEG, or PNG image file into the upload block.",
    "Click the Convert to WebP button.",
    "Wait a split second for client-side drawing to finish.",
    "Inspect the target size saving comparison.",
    "Click Download WebP Image to save the lightweight WebP file."
  ];

  const benefits = [
    "Save up to 80% on file storage size compared to standard JPG formats.",
    "Speeds up webpage image loading for SEO rankings.",
    "100% Client-Side processing: Images stay secure inside your own device.",
    "High quality conversion preserving transparency (from PNG) and color maps.",
    "No registration or subscription fees required."
  ];

  const faqs = [
    {
      question: "Why should I convert to WebP?",
      answer: "WebP is a modern image format developed by Google that provides superior lossless and lossy compression. WebP images are significantly smaller than equivalent JPGs, resulting in faster websites."
    },
    {
      question: "Are transparency values retained?",
      answer: "Yes, if you upload a PNG image with a transparent background, the output WebP file will retain the transparent background values."
    },
    {
      question: "Does this conversion cost anything?",
      answer: "No, ToolNagri provides all image conversions completely free of charge."
    }
  ];

  const relatedTools = [
    {
      name: "Image Compressor",
      url: "/image-compressor",
      description: "Compress image file sizes client-side while maintaining high quality."
    },
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully styled QR codes with customized sizing and colors."
    },
    {
      name: "UTM Builder",
      url: "/utm-builder",
      description: "Quickly build UTM marketing campaign tags to append to your landing page URLs."
    }
  ];

  return (
    <ToolLayout
      title="JPG to WebP Converter"
      description="Convert your JPG, JPEG, and PNG images into modern, lightweight WebP format. Reduce file sizes, optimize performance, and keep processing 100% local in your browser."
      category="Image Tools"
      categoryUrl="/#pdf-image"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Upload Block */}
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border-color hover:border-accent rounded-2xl p-12 text-center bg-secondary-bg/30 hover:bg-hover-bg/30 cursor-pointer transition-all duration-200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/jpg, image/png"
              className="hidden"
            />
            <Upload className="h-10 w-10 text-secondary-text/60 mx-auto mb-4" />
            <p className="font-heading font-semibold text-primary-text text-base">
              Upload JPG / PNG File
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Supports standard image formats. Processes entirely in the browser.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Original Preview */}
              <div className="border border-border-color rounded-xl p-4 bg-secondary-bg flex flex-col items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text mb-3">
                  Original Source
                </span>
                <div className="relative border border-border-color/30 rounded-lg overflow-hidden bg-white max-h-[250px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt="Source file" className="max-h-[250px] w-auto object-contain" />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-primary-text truncate max-w-xs">{fileName}</p>
                  <p className="text-xs text-secondary-text mt-0.5">{formatSize(fileSize)}</p>
                </div>
              </div>

              {/* Converted Preview */}
              <div className="border border-border-color rounded-xl p-4 bg-secondary-bg flex flex-col items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                  WebP Result
                </span>
                <div className="relative border border-border-color/30 rounded-lg overflow-hidden bg-white min-h-[250px] max-h-[250px] flex items-center justify-center w-full">
                  {convertedSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={convertedSrc} alt="WebP output preview" className="max-h-[250px] w-auto object-contain" />
                  ) : (
                    <div className="text-center text-xs text-secondary-text p-6">
                      Click the convert button below to generate a preview of your WebP file.
                    </div>
                  )}
                </div>
                {convertedSrc && (
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-success">
                      WebP file generated successfully!
                    </p>
                    <p className="text-xs text-secondary-text mt-0.5">{formatSize(convertedSize)}</p>
                  </div>
                )}
              </div>

            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {!convertedSrc ? (
                <button
                  onClick={handleConvert}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Converting..." : "Convert to WebP"}
                </button>
              ) : (
                <a
                  href={convertedSrc}
                  download={`${fileName.substring(0, fileName.lastIndexOf("."))}.webp`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success hover:bg-success/80 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Download WebP Image
                </a>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Convert another file"
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
