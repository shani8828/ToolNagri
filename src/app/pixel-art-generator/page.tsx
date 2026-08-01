"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle, Eye, Palette } from "lucide-react";
import confetti from "canvas-confetti";

export default function PixelArtGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0);
  
  // Pixelation parameters
  const [pixelSize, setPixelSize] = useState(12); // Block size in pixels
  const [colorBins, setColorBins] = useState(8);   // Posterization bins (2 to 16, or 32 for unlimited)
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState("#000000");
  const [gridOpacity, setGridOpacity] = useState(0.2);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redraw loops when params change
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw original matching size
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Create a temporary small canvas for pixel downsampling
      const smallCanvas = document.createElement("canvas");
      const smallW = Math.max(4, Math.round(canvas.width / pixelSize));
      const smallH = Math.max(4, Math.round(canvas.height / pixelSize));
      smallCanvas.width = smallW;
      smallCanvas.height = smallH;
      const smallCtx = smallCanvas.getContext("2d");
      
      if (!smallCtx) return;

      // Step 1: Draw downscaled image onto the small canvas
      smallCtx.drawImage(img, 0, 0, smallW, smallH);

      // Step 2: Quantize/Posterize colors on the small canvas if colorBins < 32
      if (colorBins < 32) {
        try {
          const imgData = smallCtx.getImageData(0, 0, smallW, smallH);
          const data = imgData.data;
          const bins = Math.max(2, colorBins);
          
          for (let i = 0; i < data.length; i += 4) {
            // Apply standard RGB color grouping
            data[i] = Math.round(data[i] / 255 * (bins - 1)) * (255 / (bins - 1));
            data[i + 1] = Math.round(data[i + 1] / 255 * (bins - 1)) * (255 / (bins - 1));
            data[i + 2] = Math.round(data[i + 2] / 255 * (bins - 1)) * (255 / (bins - 1));
          }
          smallCtx.putImageData(imgData, 0, 0);
        } catch (e) {
          console.warn("Color quantization failed:", e);
        }
      }

      // Step 3: Draw the small canvas upscaled back onto the main canvas with smoothing disabled
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(smallCanvas, 0, 0, smallW, smallH, 0, 0, canvas.width, canvas.height);

      // Step 4: Draw grid overlay boundaries
      if (showGrid && pixelSize >= 4) {
        ctx.strokeStyle = gridColor;
        ctx.globalAlpha = gridOpacity;
        ctx.lineWidth = 1;
        ctx.beginPath();

        // Calculate dynamic spacing
        const spacingX = canvas.width / smallW;
        const spacingY = canvas.height / smallH;

        // Vertical lines
        for (let x = 0; x <= canvas.width; x += spacingX) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
        }
        // Horizontal lines
        for (let y = 0; y <= canvas.height; y += spacingY) {
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0; // Reset
      }
    };
    img.src = imageSrc;
  }, [imageSrc, pixelSize, colorBins, showGrid, gridColor, gridOpacity]);

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

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    try {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `pixel_${fileName || "art.png"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#2563eb", "#22c55e"],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to compile output download stream.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setFileName("");
    setFileSize(0);
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
    "Upload any JPEG, PNG, or WebP photo to pixelate.",
    "Adjust the Pixel Size slider to control the size of the pixelated blocks.",
    "Tune the Color Palette slider to group similar colors (creates a retro 8-bit/16-bit color constraints).",
    "Toggle the Grid Overlay and adjust its opacity to add authentic grid border sheets.",
    "Click Download Pixel Image to save your retro artwork."
  ];

  const benefits = [
    "Instantly pixelates any photo using local, high-speed Canvas downsampling.",
    "100% Client-Side processing: Photos never touch external servers.",
    "Customizable color posterization to simulate retro console graphics (NES, GameBoy, Sega).",
    "No registration or subscription fees required."
  ];

  const faqs = [
    {
      question: "How do I make the colors look like an 8-bit console?",
      answer: "Slide the Color Palette slider down to 4 or 8. This groups colors into standard bins, recreating the retro look of classic hardware limitations."
    },
    {
      question: "Does the output size match my original photo?",
      answer: "Yes. The output matches your original photo's natural pixel dimensions, ensuring high resolution even when pixelated."
    }
  ];

  const relatedTools = [
    { name: "Meme Generator", url: "/meme-generator", description: "Create captioned memes instantly." },
    { name: "Image Resizer", url: "/image-resizer", description: "Crop and resize image dimensions." }
  ];

  return (
    <ToolLayout
      title="Pixel Art Converter"
      description="Turn your photos into retro 8-bit or 16-bit pixel art. Customize pixelation sizes, group color ranges, toggle alignment grid lines, and export your retro canvas locally in your browser."
      category="Image Tools"
      categoryUrl="/#image"
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
              accept="image/jpeg, image/jpg, image/png, image/webp"
              className="hidden"
            />
            <Upload className="h-10 w-10 text-secondary-text/60 mx-auto mb-4" />
            <p className="font-heading font-semibold text-primary-text text-base">
              Upload Photo
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              PNG, JPG, or WebP. Done locally in your browser.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Canvas Preview */}
              <div className="lg:col-span-2 border border-border-color rounded-2xl p-4 bg-secondary-bg/30 flex flex-col items-center justify-center min-h-75">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider mb-3 self-start">
                  Live Pixel Art Preview
                </span>
                
                <div className="border border-border-color bg-white rounded-lg overflow-hidden max-h-87.5 flex items-center justify-center w-full relative">
                  <canvas
                    ref={canvasRef}
                    className="max-h-87.5 w-auto object-contain max-w-full"
                  />
                </div>
                
                <div className="mt-3 text-center">
                  <p className="text-xs text-secondary-text font-semibold truncate max-w-xs">{fileName} ({formatSize(fileSize)})</p>
                </div>
              </div>

              {/* Pixelation Tuning Controls */}
              <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 block">
                  Pixel Settings
                </span>

                {/* Pixel Block size slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-secondary-text uppercase tracking-wider">
                    <span>Pixel Block Size</span>
                    <span className="text-accent">{pixelSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    step="2"
                    value={pixelSize}
                    onChange={(e) => setPixelSize(parseInt(e.target.value))}
                    className="w-full accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                  />
                </div>

                {/* Color Posterize slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-bold text-secondary-text uppercase tracking-wider">
                    <span>Color Palette</span>
                    <span className="text-accent">
                      {colorBins >= 32 ? "Unlimited" : `${colorBins} colors`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="32"
                    step="2"
                    value={colorBins}
                    onChange={(e) => setColorBins(parseInt(e.target.value))}
                    className="w-full accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                  />
                </div>

                {/* Grid controls */}
                <div className="space-y-3 pt-3 border-t border-border-color">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-secondary-text uppercase tracking-wider">Show Grid Lines</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="sr-only peer hover:cursor-pointer"
                      />
                      <div className="w-9 h-5 bg-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent" />
                    </label>
                  </div>

                  {showGrid && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-secondary-text uppercase block">Grid Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={gridColor}
                            onChange={(e) => setGridColor(e.target.value)}
                            className="w-7 h-7 rounded border border-border-color cursor-pointer bg-transparent"
                          />
                          <span className="text-xs font-mono font-bold">{gridColor}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-secondary-text uppercase flex justify-between">
                          <span>Opacity</span>
                          <span>{Math.round(gridOpacity * 100)}%</span>
                        </label>
                        <input
                          type="range"
                          min="0.05"
                          max="0.8"
                          step="0.05"
                          value={gridOpacity}
                          onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
                          className="w-full accent-accent h-1 bg-border-color rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={loading}
                className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 flex justify-center items-center gap-1.5"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Processing..." : "Download Pixel Art Image"}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Upload another photo"
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
