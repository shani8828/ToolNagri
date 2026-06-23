"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileImage, Upload, RefreshCw, Download, AlertTriangle, ArrowRight } from "lucide-react";

export default function ImageConverter() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<"png" | "jpeg" | "webp" | "bmp">("png");
  const [quality, setQuality] = useState(0.85);
  const [converting, setConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setConvertedUrl(null);
    setConvertedSize(null);
    setImagePreview(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File type not supported. Please select an image file (PNG, JPG, WebP, BMP).");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
      img.src = reader.result as string;
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleConvert = () => {
    if (!imagePreview || !imageFile) {
      setError("Please select an image file to convert.");
      return;
    }

    setConverting(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error("Canvas is not ready.");
        }
        
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not acquire 2D drawing context.");
        }

        // Draw image onto canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // For JPEG conversions, render white background first to avoid transparency turning black
        if (targetFormat === "jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        let mimeType = `image/${targetFormat}`;
        if (targetFormat === "bmp") {
          // Standard canvas toDataURL supports png/jpeg/webp natively. 
          // BMP fallback to image/png or handle bmp wrapper. 
          // Most browsers support image/bmp encoding, but fallback to png/jpeg quality.
          mimeType = "image/bmp";
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Conversion failed. Please try a different quality scale or image file.");
              setConverting(false);
              return;
            }
            const url = URL.createObjectURL(blob);
            setConvertedUrl(url);
            setConvertedSize(blob.size);
            setConverting(false);
          },
          mimeType,
          targetFormat === "png" || targetFormat === "bmp" ? undefined : quality
        );
      } catch (err: any) {
        setError(err.message || "Failed during format compilation.");
        setConverting(false);
      }
    };
    
    img.onerror = () => {
      setError("Failed to load preview buffer.");
      setConverting(false);
    };

    img.src = imagePreview;
  };

  const handleDownload = () => {
    if (!convertedUrl || !imageFile) return;
    const baseName = imageFile.name.substring(0, imageFile.name.lastIndexOf("."));
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `${baseName}.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const howToUse = [
    "Choose a local image file (PNG, JPG, WebP, or BMP) using the drag-and-drop upload container.",
    "Select your target export format from the dropdown menu (e.g. convert JPG to PNG or PNG to WebP).",
    "For JPEG and WebP targets, adjust the quality compression slider to balance clarity and file weight.",
    "Click Convert Format to render client-side, review the target file size, and download."
  ];

  const benefits = [
    "Consolidates single converter pages into one universal workspace utility.",
    "Supports conversions between WebP, PNG, JPG, and BMP formats instantly.",
    "Preserves image proportions and outputs optimal alpha-channel values.",
    "Processes images locally inside your sandboxed browser environment."
  ];

  const faqs = [
    {
      question: "Will transparent backgrounds convert cleanly?",
      answer: "When converting transparent PNGs or WebPs to JPEG, the transparent pixels will automatically blend with a solid white background since JPEG doesn't support alpha transparency channels.",
    },
    {
      question: "Is there an image size limit?",
      answer: "We support image resolutions up to 8K. Very large image renders may take a split second longer as your system's canvas GPU buffer processes the draw commands."
    }
  ];

  const relatedTools = [
    { name: "Image Compressor", url: "/image-compressor", description: "Reduce image file sizes instantly." },
    { name: "Base64 Image Encoder & Decoder", url: "/base64-image", description: "Convert images to Base64 code." }
  ];

  return (
    <ToolLayout
      title="Universal Image Converter"
      description="Translate image file formats between WebP, PNG, JPG, JPEG, and BMP client-side in seconds."
      category="Image Tools"
      categoryUrl="/#image"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Upload Zone */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
            <FileImage className="h-4.5 w-4.5 text-accent" /> Upload Image File
          </label>
          
          <div className="relative border-2 border-dashed border-border-color hover:border-accent rounded-xl p-8 text-center bg-secondary-bg/10 hover:bg-secondary-bg/25 transition-all duration-200 group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2.5">
              <Upload className="mx-auto h-8 w-8 text-secondary-text group-hover:text-accent transition-colors" />
              <div className="text-sm font-semibold text-primary-text">
                {imageFile ? imageFile.name : "Drag & drop image here, or click to upload"}
              </div>
              <div className="text-xs text-secondary-text">
                {imageFile ? `Original Size: ${(imageFile.size / 1024).toFixed(1)} KB` : "Supports PNG, JPG, JPEG, WebP, BMP, and GIF"}
              </div>
            </div>
          </div>
        </div>

        {/* Image information & layout preview */}
        {imagePreview && dimensions && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-secondary-bg/15 p-4 rounded-xl border border-border-color">
            <div className="flex justify-center max-h-48 overflow-hidden rounded-lg border border-border-color/60 bg-white">
              <img
                src={imagePreview}
                alt="Original Preview"
                className="object-contain max-h-44 w-auto"
              />
            </div>
            
            <div className="space-y-2 text-sm text-primary-text font-semibold">
              <div className="border-b border-border-color pb-1 text-xs text-secondary-text uppercase tracking-wider font-bold">Image Telemetry</div>
              <div>File Name: <span className="font-mono text-xs text-accent font-bold">{imageFile?.name}</span></div>
              <div>Resolution: <span className="font-mono text-xs text-accent font-bold">{dimensions.width}px × {dimensions.height}px</span></div>
              <div>Format: <span className="font-mono text-xs text-accent font-bold uppercase">{imageFile?.type.split("/")[1]}</span></div>
            </div>
          </div>
        )}

        {/* Options Row */}
        {imagePreview && (
          <div className="bg-secondary-bg/30 p-4 rounded-xl border border-border-color space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Target Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Target Format</label>
                <select
                  value={targetFormat}
                  onChange={(e) => { setTargetFormat(e.target.value as any); setConvertedUrl(null); }}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-sm text-primary-text font-semibold focus:outline-none"
                >
                  <option value="png">PNG (Lossless, Transparency)</option>
                  <option value="jpeg">JPEG (Compressed, No Transparency)</option>
                  <option value="webp">WebP (High Compression, Transparency)</option>
                  <option value="bmp">BMP (Bitmap Image)</option>
                </select>
              </div>

              {/* Quality Slider (for JPG/WebP) */}
              {(targetFormat === "jpeg" || targetFormat === "webp") && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-secondary-text uppercase tracking-wider">
                    <span>Export Quality</span>
                    <span className="text-accent font-bold">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => { setQuality(parseFloat(e.target.value)); setConvertedUrl(null); }}
                    className="w-full accent-accent h-2 bg-border-color rounded-lg cursor-pointer"
                  />
                </div>
              )}

            </div>
          </div>
        )}

        {/* Conversion Action */}
        {imagePreview && (
          <div className="flex justify-center">
            <button
              onClick={handleConvert}
              disabled={converting}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {converting ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
              {converting ? "Converting..." : "Convert Format"}
            </button>
          </div>
        )}

        {/* Conversion Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            {error}
          </div>
        )}

        {/* Conversion Success Display */}
        {convertedUrl && convertedSize !== null && (
          <div className="pt-4 border-t border-border-color space-y-4 flex flex-col items-center">
            <div className="text-sm font-semibold text-primary-text flex items-center gap-1">
              Conversion Successful! Size: <span className="text-accent font-bold">{(convertedSize / 1024).toFixed(1)} KB</span>
              {imageFile && (
                <span className="text-xs text-secondary-text flex items-center gap-1 font-normal ml-2">
                  ({Math.round(((convertedSize - imageFile.size) / imageFile.size) * 100)}% size change)
                </span>
              )}
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-6 py-3 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <Download className="h-4.5 w-4.5" /> Download Converted Image
            </button>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
