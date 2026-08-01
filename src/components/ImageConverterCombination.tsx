"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface ImageConverterCombinationProps {
  from: "jpg" | "png" | "webp" | "bmp";
  to: "jpg" | "png" | "webp" | "bmp";
}

export default function ImageConverterCombination({ from, to }: ImageConverterCombinationProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fromFormatUpper = from === "jpg" ? "JPG/JPEG" : from.toUpperCase();
  const toFormatUpper = to === "jpg" ? "JPG/JPEG" : to.toUpperCase();
  const toExtension = to === "jpg" ? "jpg" : to;

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

      // Render white background for JPEG target to prevent alpha channel turning black
      if (to === "jpg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // Map format name to mime type
      let mimeType = `image/${to}`;
      if (to === "jpg") {
        mimeType = "image/jpeg";
      } else if (to === "bmp") {
        mimeType = "image/bmp";
      }

      try {
        // High quality conversion
        canvas.toBlob((blob) => {
          if (!blob) {
            setError("Failed to render canvas buffer to file blob.");
            setLoading(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          setConvertedSrc(url);
          setConvertedSize(blob.size);
          setLoading(false);

          // Confetti for premium feedback
          confetti({
            particleCount: 50,
            spread: 40,
            origin: { y: 0.7 },
            colors: ["#2563eb", "#22c55e"],
          });
        }, mimeType, to === "png" || to === "bmp" ? undefined : 0.85);
      } catch (err) {
        console.error(err);
        setError(`Your browser does not support encoding to ${toFormatUpper}. Try updating your browser.`);
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
    `Select or drop your ${fromFormatUpper} image file into the upload block.`,
    `Click the Convert to ${toFormatUpper} button to render the translation.`,
    "Wait a split second for client-side drawing to finish.",
    "Inspect the target size saving comparison.",
    `Click Download ${toFormatUpper} Image to save the converted file.`
  ];

  const benefits = [
    `Convert ${fromFormatUpper} images to ${toFormatUpper} format instantly in your browser.`,
    "100% Client-Side processing: Images stay secure inside your own device.",
    "High quality conversion preserving dimensions and color maps.",
    "No registration or subscription fees required."
  ];

  const faqs = [
    {
      question: `Why should I convert ${fromFormatUpper} to ${toFormatUpper}?`,
      answer: `Converting ${fromFormatUpper} to ${toFormatUpper} can optimize compatibility, storage space, or formatting parameters depending on where you intend to publish the image file.`
    },
    {
      question: "Are transparency values retained?",
      answer: to === "png" || to === "webp"
        ? "Yes. PNG and WebP support alpha transparency channels, so transparent backgrounds are preserved."
        : `No. ${toFormatUpper} does not support alpha transparency channels. Transparent pixels will automatically blend with a solid white background.`
    },
    {
      question: "Does this conversion cost anything?",
      answer: "No, ToolNagri provides all image conversions completely free of charge."
    }
  ];

  const relatedTools = [
    {
      name: "Universal Image Converter",
      url: "/image-converter",
      description: "Convert images between PNG, JPG, WebP, and BMP format."
    },
    {
      name: "Image Compressor",
      url: "/image-compressor",
      description: "Compress image file sizes client-side while maintaining high quality."
    }
  ];

  return (
    <ToolLayout
      title={`${fromFormatUpper} to ${toFormatUpper} Converter`}
      description={`Convert your ${fromFormatUpper} images into modern, high-quality ${toFormatUpper} format. Reduce file sizes, optimize performance, and keep processing 100% local in your browser.`}
      category="Image Tools"
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
              accept={`image/${from === "jpg" ? "jpeg, image/jpg" : from}`}
              className="hidden"
            />
            <Upload className="h-10 w-10 text-secondary-text/60 mx-auto mb-4" />
            <p className="font-heading font-semibold text-primary-text text-base">
              Upload {fromFormatUpper} File
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Processes entirely in the browser. Safe and secure.
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
                <div className="relative border border-border-color/30 rounded-lg overflow-hidden bg-white max-h-62.5 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt="Source file" className="max-h-62.5 w-auto object-contain" />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-primary-text truncate max-w-xs">{fileName}</p>
                  <p className="text-xs text-secondary-text mt-0.5">{formatSize(fileSize)}</p>
                </div>
              </div>

              {/* Converted Preview */}
              <div className="border border-border-color rounded-xl p-4 bg-secondary-bg flex flex-col items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                  {toFormatUpper} Result
                </span>
                <div className="relative border border-border-color/30 rounded-lg overflow-hidden bg-white min-h-62.5 max-h-62.5 flex items-center justify-center w-full">
                  {convertedSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={convertedSrc} alt={`${toFormatUpper} output preview`} className="max-h-62.5 w-auto object-contain" />
                  ) : (
                    <div className="text-center text-xs text-secondary-text p-6">
                      Click the convert button below to generate a preview of your {toFormatUpper} file.
                    </div>
                  )}
                </div>
                {convertedSrc && (
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-success">
                      File generated successfully!
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
                  {loading ? "Converting..." : `Convert to ${toFormatUpper}`}
                </button>
              ) : (
                <a
                  href={convertedSrc}
                  download={`${fileName.substring(0, fileName.lastIndexOf("."))}.${toExtension}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success hover:bg-success/80 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Download {toFormatUpper} Image
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
