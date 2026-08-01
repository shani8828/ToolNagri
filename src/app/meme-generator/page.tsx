"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle, Type, Palette } from "lucide-react";
import confetti from "canvas-confetti";

export default function MemeGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0);
  
  // Meme captions
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  
  // Tuning sliders
  const [fontSizePercent, setFontSizePercent] = useState(8); // % of image height
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [forceUppercase, setForceUppercase] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redraw loop on options change
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size matching the natural resolution of the source
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw background image
      ctx.drawImage(img, 0, 0);

      // Compute font parameters
      const fontSizePx = Math.max(12, Math.round((fontSizePercent / 100) * canvas.height));
      ctx.font = `800 ${fontSizePx}px Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.max(2, Math.round(fontSizePx / 6));
      ctx.lineJoin = "round";

      const maxTextWidth = canvas.width * 0.9;
      const lineHeight = fontSizePx * 1.15;

      const tText = forceUppercase ? topText.toUpperCase() : topText;
      const bText = forceUppercase ? bottomText.toUpperCase() : bottomText;

      // Draw top text (top-down wrapping)
      if (tText) {
        ctx.textBaseline = "top";
        const topY = canvas.height * 0.04;
        drawWrappedText(ctx, tText, canvas.width / 2, topY, maxTextWidth, lineHeight, false);
      }

      // Draw bottom text (bottom-up wrapping)
      if (bText) {
        ctx.textBaseline = "bottom";
        const bottomY = canvas.height - (canvas.height * 0.04);
        drawWrappedText(ctx, bText, canvas.width / 2, bottomY, maxTextWidth, lineHeight, true);
      }
    };
    img.src = imageSrc;
  }, [imageSrc, topText, bottomText, fontSizePercent, textColor, strokeColor, forceUppercase]);

  // Handle word wrapping
  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    isBottom: boolean
  ) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + " " + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width < maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    // Render text lines onto canvas
    if (isBottom) {
      // Draw bottom-up (stacking lines from the bottom margin)
      for (let i = lines.length - 1; i >= 0; i--) {
        const lineY = y - (lines.length - 1 - i) * lineHeight;
        ctx.fillText(lines[i], x, lineY);
        ctx.strokeText(lines[i], x, lineY);
      }
    } else {
      // Draw top-down (stacking lines from the top margin)
      for (let i = 0; i < lines.length; i++) {
        const lineY = y + i * lineHeight;
        ctx.fillText(lines[i], x, lineY);
        ctx.strokeText(lines[i], x, lineY);
      }
    }
  };

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
    setTopText("");
    setBottomText("");

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
      a.download = `meme_${fileName || "generator.png"}`;
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
      setError("Failed to compile target download stream.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setFileName("");
    setFileSize(0);
    setTopText("");
    setBottomText("");
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
    "Upload a JPEG or PNG image to use as your meme template.",
    "Type your top caption in the Top Text field, and your bottom caption in the Bottom Text field.",
    "Adjust the font size percentage to scale text relative to the image canvas.",
    "Modify text colors or outline colors using the color selectors.",
    "Click Download Meme Image to save your high-resolution PNG meme."
  ];

  const benefits = [
    "Features automatic word wrapping to keep long text within borders.",
    "100% Client-Side processing: Templates and creations remain private.",
    "Outputs high-resolution PNG copies matching original file sizes.",
    "No registration or watermark marks added."
  ];

  const faqs = [
    {
      question: "Are my photos uploaded to ToolNagri?",
      answer: "No. The entire editing process runs in your browser canvas buffer. Your files never touch our servers."
    },
    {
      question: "How do I format text outlines?",
      answer: "We automatically apply a black stroke outline proportional to your chosen font size. You can modify this using the Outline Color pickers."
    }
  ];

  const relatedTools = [
    { name: "Image Resizer", url: "/image-resizer", description: "Crop and resize image dimensions." },
    { name: "Pixel Art Converter", url: "/pixel-art-generator", description: "Turn photos into pixelated art." }
  ];

  return (
    <ToolLayout
      title="Meme Generator"
      description="Create custom memes instantly. Upload your templates, add top/bottom text overlays, tune colors and sizes, and download high-resolution files locally in your browser."
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
              accept="image/jpeg, image/jpg, image/png"
              className="hidden"
            />
            <Upload className="h-10 w-10 text-secondary-text/60 mx-auto mb-4" />
            <p className="font-heading font-semibold text-primary-text text-base">
              Upload Meme Template
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Processes locally in your browser. PNG, JPG, and JPEG.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Canvas Editor Workspace */}
              <div className="lg:col-span-2 border border-border-color rounded-2xl p-4 bg-secondary-bg/30 flex flex-col items-center justify-center min-h-75">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider mb-3 self-start">
                  Live Canvas Preview
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

              {/* Meme Text Controls Sidebar */}
              <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 block">
                  Meme Customizer
                </span>

                {/* Top Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1">
                    <Type className="h-3.5 w-3.5 text-accent" /> Top Text
                  </label>
                  <input
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="ENTER TOP CAPTION"
                    className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                  />
                </div>

                {/* Bottom Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1">
                    <Type className="h-3.5 w-3.5 text-accent" /> Bottom Text
                  </label>
                  <input
                    type="text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="ENTER BOTTOM CAPTION"
                    className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                  />
                </div>

                {/* Font Sizing Slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-bold text-secondary-text uppercase tracking-wider">
                    <span>Text Font Size</span>
                    <span className="text-accent">{fontSizePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="0.5"
                    value={fontSizePercent}
                    onChange={(e) => setFontSizePercent(parseFloat(e.target.value))}
                    className="w-full accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                  />
                </div>

                {/* Typography Color Settings */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-color">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary-text uppercase block">Text Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-7 h-7 rounded border border-border-color cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold">{textColor}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary-text uppercase block">Stroke Border</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="w-7 h-7 rounded border border-border-color cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold">{strokeColor}</span>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between pt-3 border-t border-border-color">
                  <span className="text-xs font-bold text-secondary-text uppercase tracking-wider">Force Uppercase</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={forceUppercase}
                      onChange={(e) => setForceUppercase(e.target.checked)}
                      className="sr-only peer hover:cursor-pointer"
                    />
                    <div className="w-9 h-5 bg-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent" />
                  </label>
                </div>

              </div>
            </div>

            {/* Error display */}
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
                <Download className="h-4 w-4" /> Download Meme Image
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Upload another template"
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
