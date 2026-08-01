"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle, Maximize2, Move } from "lucide-react";
import confetti from "canvas-confetti";

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0);
  
  // Natural image dimensions
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);

  // Crop parameters (natural coordinates)
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);

  // Resize output parameters
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  
  const [aspectRatio, setAspectRatio] = useState<"free" | "1:1" | "16:9" | "4:3" | "9:16">("free");
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "webp">("png");
  
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle preset aspect ratio change
  useEffect(() => {
    if (naturalWidth === 0 || naturalHeight === 0) return;

    let nextWidth = cropWidth;
    let nextHeight = cropHeight;

    if (aspectRatio === "1:1") {
      const size = Math.min(cropWidth, cropHeight);
      nextWidth = size;
      nextHeight = size;
    } else if (aspectRatio === "16:9") {
      nextHeight = Math.min(cropHeight, Math.round(cropWidth * 9 / 16));
      nextWidth = Math.round(nextHeight * 16 / 9);
    } else if (aspectRatio === "4:3") {
      nextHeight = Math.min(cropHeight, Math.round(cropWidth * 3 / 4));
      nextWidth = Math.round(nextHeight * 4 / 3);
    } else if (aspectRatio === "9:16") {
      nextWidth = Math.min(cropWidth, Math.round(cropHeight * 9 / 16));
      nextHeight = Math.round(nextWidth * 16 / 9);
    }

    // Safeguard coordinates bounds
    if (cropX + nextWidth > naturalWidth) {
      setCropX(Math.max(0, naturalWidth - nextWidth));
    }
    if (cropY + nextHeight > naturalHeight) {
      setCropY(Math.max(0, naturalHeight - nextHeight));
    }

    setCropWidth(nextWidth);
    setCropHeight(nextHeight);
    setTargetWidth(nextWidth);
    setTargetHeight(nextHeight);
    setConvertedSrc(null);
  }, [aspectRatio, naturalWidth, naturalHeight]);

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
    setAspectRatio("free");

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const src = event.target.result as string;
        setImageSrc(src);

        // Load image to read natural size
        const img = new Image();
        img.onload = () => {
          setNaturalWidth(img.width);
          setNaturalHeight(img.height);
          setCropX(0);
          setCropY(0);
          setCropWidth(img.width);
          setCropHeight(img.height);
          setTargetWidth(img.width);
          setTargetHeight(img.height);
        };
        img.src = src;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResize = () => {
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

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw white background for jpeg
      if (exportFormat === "jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Draw crop segment
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );

      const mimeType = exportFormat === "png" ? "image/png" : exportFormat === "jpeg" ? "image/jpeg" : "image/webp";

      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            setError("Failed to export canvas image.");
            setLoading(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          setConvertedSrc(url);
          setConvertedSize(blob.size);
          setLoading(false);

          confetti({
            particleCount: 50,
            spread: 40,
            origin: { y: 0.7 },
            colors: ["#2563eb", "#22c55e"],
          });
        }, mimeType, exportFormat === "png" ? undefined : 0.85);
      } catch (err) {
        console.error(err);
        setError("Your browser does not support this canvas format export.");
        setLoading(false);
      }
    };
    img.onerror = () => {
      setError("Failed to process image drawing.");
      setLoading(false);
    };
  };

  const handleReset = () => {
    setImageSrc(null);
    setFileName("");
    setFileSize(0);
    setNaturalWidth(0);
    setNaturalHeight(0);
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
    "Upload a JPG, PNG, or WebP image into the local sandbox block.",
    "Adjust crop offsets (X, Y) and select custom selection dimensions (Width, Height).",
    "Choose a preset aspect ratio (1:1, 16:9, etc.) to force specific proportions.",
    "Change the target output dimensions to resize (scale down) the exported image.",
    "Choose target format (PNG/JPG/WebP) and click Resize Image to save locally."
  ];

  const benefits = [
    "Provides visual crop boundaries that align with responsive image dimensions.",
    "100% Client-Side processing: Images stay secure inside your own device.",
    "Supports aspect ratio locks to maintain exact outputs (e.g. squares or banner shapes).",
    "No registration or subscription fees required."
  ];

  const faqs = [
    {
      question: "Is my image uploaded to any server?",
      answer: "No. The resizing and cropping happen completely client-side in your browser using the HTML5 Canvas API. Your image never leaves your device."
    },
    {
      question: "Why should I choose PNG over JPEG?",
      answer: "PNG is a lossless format that preserves crisp lines and transparency. JPEG is lossy but compresses photos taken by cameras to significantly smaller sizes."
    }
  ];

  const relatedTools = [
    { name: "Universal Image Converter", url: "/image-converter", description: "Convert between PNG, JPG, WebP, and BMP format." },
    { name: "Image Compressor", url: "/image-compressor", description: "Reduce image file sizes instantly." }
  ];

  return (
    <ToolLayout
      title="Image Resizer & Cropper"
      description="Crop and resize JPG, PNG, and WebP images. Lock aspect ratios, adjust cropping coordinates, downscale output resolution, and download optimized files client-side."
      category="Image Tools"
      categoryUrl="/#image"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Upload Container */}
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border-color hover:border-accent rounded-2xl p-12 text-center bg-secondary-bg/30 hover:bg-hover-bg/30 cursor-pointer transition-all duration-200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/jpg, image/png, image/webp"
              className="hidden"
            />
            <Upload className="h-10 w-10 text-secondary-text/60 mx-auto mb-4" />
            <p className="font-heading font-semibold text-primary-text text-base">
              Upload Photo for Resizing
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Supports JPG, PNG, and WebP. Done locally inside your browser.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Visual Editor Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Cropping / Preview Workspace */}
              <div className="lg:col-span-2 border border-border-color rounded-2xl p-4 bg-secondary-bg/30 flex flex-col items-center justify-center relative min-h-75">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider mb-2 self-start">
                  Crop & Preview Box
                </span>
                
                <div className="relative border border-border-color bg-white rounded-lg overflow-hidden max-h-87.5 flex items-center justify-center select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Editor workspace"
                    className="max-h-87.5 w-auto object-contain"
                  />
                  
                  {/* Crop Box Overlay */}
                  {naturalWidth > 0 && (
                    <div
                      className="absolute border-2 border-dashed border-accent bg-accent/15 flex items-center justify-center pointer-events-none"
                      style={{
                        left: `${(cropX / naturalWidth) * 100}%`,
                        top: `${(cropY / naturalHeight) * 100}%`,
                        width: `${(cropWidth / naturalWidth) * 100}%`,
                        height: `${(cropHeight / naturalHeight) * 100}%`,
                      }}
                    >
                      <div className="bg-accent/80 text-[9px] text-white px-1.5 py-0.5 rounded font-mono font-bold select-none uppercase tracking-wide">
                        {cropWidth} × {cropHeight}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs text-secondary-text font-semibold truncate max-w-xs">{fileName} ({formatSize(fileSize)})</p>
                  <p className="text-[10px] text-secondary-text mt-0.5 font-mono">Original: {naturalWidth}px × {naturalHeight}px</p>
                </div>
              </div>

              {/* Editor controls Sidebar */}
              <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-5">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 block">
                  Resize Configurations
                </span>

                {/* Aspect Ratio Presets */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["free", "1:1", "16:9", "4:3", "9:16"].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio as any)}
                        className={`py-1 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer capitalize ${
                          aspectRatio === ratio
                            ? "bg-accent text-white border-accent"
                            : "bg-background border-border-color text-secondary-text hover:text-primary-text"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders for Crop Boundary */}
                <div className="space-y-4 pt-1">
                  <div className="text-[11px] font-bold text-primary-text uppercase tracking-wider border-b border-border-color/60 pb-1">
                    Crop Region (Pixels)
                  </div>

                  {/* Width & Height */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-secondary-text uppercase block">Crop Width</label>
                      <input
                        type="number"
                        min="20"
                        max={naturalWidth - cropX}
                        value={cropWidth}
                        onChange={(e) => {
                          const w = Math.min(naturalWidth - cropX, Math.max(20, parseInt(e.target.value) || 20));
                          setCropWidth(w);
                          if (aspectRatio === "free") setTargetWidth(w);
                        }}
                        disabled={aspectRatio !== "free"}
                        className="w-full py-1.5 px-2 border border-border-color rounded bg-background text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-secondary-text uppercase block">Crop Height</label>
                      <input
                        type="number"
                        min="20"
                        max={naturalHeight - cropY}
                        value={cropHeight}
                        onChange={(e) => {
                          const h = Math.min(naturalHeight - cropY, Math.max(20, parseInt(e.target.value) || 20));
                          setCropHeight(h);
                          if (aspectRatio === "free") setTargetHeight(h);
                        }}
                        disabled={aspectRatio !== "free"}
                        className="w-full py-1.5 px-2 border border-border-color rounded bg-background text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Offset X & Offset Y */}
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-secondary-text uppercase">
                        <span>Offset X ({cropX}px)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={Math.max(0, naturalWidth - cropWidth)}
                        value={cropX}
                        onChange={(e) => { setCropX(parseInt(e.target.value)); setConvertedSrc(null); }}
                        className="w-full accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-secondary-text uppercase">
                        <span>Offset Y ({cropY}px)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={Math.max(0, naturalHeight - cropHeight)}
                        value={cropY}
                        onChange={(e) => { setCropY(parseInt(e.target.value)); setConvertedSrc(null); }}
                        className="w-full accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Resize Target Dimensions */}
                <div className="space-y-3 pt-2 border-t border-border-color">
                  <div className="text-[11px] font-bold text-primary-text uppercase tracking-wider">
                    Scale Output Target
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-secondary-text uppercase block">Export Width</label>
                      <input
                        type="number"
                        min="10"
                        max={naturalWidth * 2}
                        value={targetWidth}
                        onChange={(e) => {
                          const w = Math.max(10, parseInt(e.target.value) || 10);
                          setTargetWidth(w);
                          if (aspectRatio !== "free") {
                            // Scale proportionally
                            let ratio = 1;
                            if (aspectRatio === "1:1") ratio = 1;
                            else if (aspectRatio === "16:9") ratio = 9 / 16;
                            else if (aspectRatio === "4:3") ratio = 3 / 4;
                            else if (aspectRatio === "9:16") ratio = 16 / 9;
                            setTargetHeight(Math.round(w * ratio));
                          }
                          setConvertedSrc(null);
                        }}
                        className="w-full py-1.5 px-2 border border-border-color rounded bg-background text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-secondary-text uppercase block">Export Height</label>
                      <input
                        type="number"
                        min="10"
                        max={naturalHeight * 2}
                        value={targetHeight}
                        onChange={(e) => {
                          const h = Math.max(10, parseInt(e.target.value) || 10);
                          setTargetHeight(h);
                          if (aspectRatio !== "free") {
                            // Scale proportionally
                            let ratio = 1;
                            if (aspectRatio === "1:1") ratio = 1;
                            else if (aspectRatio === "16:9") ratio = 16 / 9;
                            else if (aspectRatio === "4:3") ratio = 4 / 3;
                            else if (aspectRatio === "9:16") ratio = 9 / 16;
                            setTargetWidth(Math.round(h * ratio));
                          }
                          setConvertedSrc(null);
                        }}
                        className="w-full py-1.5 px-2 border border-border-color rounded bg-background text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Format */}
                <div className="space-y-2 pt-2 border-t border-border-color">
                  <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Format</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => { setExportFormat(e.target.value as any); setConvertedSrc(null); }}
                    className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="png">PNG (Lossless, Transparent)</option>
                    <option value="jpeg">JPEG (Compressed, White Bg)</option>
                    <option value="webp">WebP (Optimized file size)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleResize}
                disabled={loading}
                className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Processing..." : "Apply Crop & Resize"}
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Upload another file"
              >
                <RefreshCw className="size-5" />
              </button>
            </div>

            {/* Download section on Success */}
            {convertedSrc && (
              <div className="pt-5 space-y-4 flex flex-col items-center bg-success/5 p-4 rounded-xl border border-success/20">
                <div className="text-sm font-semibold text-primary-text flex flex-wrap justify-center items-center gap-2">
                  Image resized successfully! Size: <span className="text-success font-bold">{formatSize(convertedSize)}</span>
                  <span className="text-xs text-secondary-text font-normal">
                    ({Math.round(((convertedSize - fileSize) / fileSize) * 100)}% size change)
                  </span>
                </div>

                <a
                  href={convertedSrc}
                  download={`${fileName.substring(0, fileName.lastIndexOf("."))}_resized.${exportFormat}`}
                  className="flex items-center gap-1.5 px-6 py-3 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="h-4.5 w-4.5" /> Download Resized Image
                </a>
              </div>
            )}

          </div>
        )}

      </div>
    </ToolLayout>
  );
}
