"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { FileText, Upload, RefreshCw, Download, AlertTriangle, FilePen } from "lucide-react";
import confetti from "canvas-confetti";

export default function PdfWatermark() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  
  // Custom Watermark Settings
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.25);
  const [rotationAngle, setRotationAngle] = useState(45);
  const [fontSize, setFontSize] = useState(54);
  const [textColor, setTextColor] = useState("#FF0000");
  const [position, setPosition] = useState<"center" | "top-left" | "top-right" | "bottom-left" | "bottom-right">("center");
  const [rangeInput, setRangeInput] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watermarkedPdfUrl, setWatermarkedPdfUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setWatermarkedPdfUrl(null);
    setTotalPages(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    setPdfFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdfDoc.getPageCount());
    } catch (err: any) {
      setError("Failed to load PDF file. The file might be corrupted or password-protected.");
    }
  };

  // Reusable page range parser
  const parsePageRanges = (rangeStr: string, maxPages: number): number[] => {
    const cleanStr = rangeStr.trim().toLowerCase();
    if (cleanStr === "all") {
      return Array.from({ length: maxPages }, (_, i) => i);
    }

    const indices: number[] = [];
    const tokens = rangeStr.split(",");

    for (let token of tokens) {
      token = token.trim();
      if (!token) continue;

      if (token.includes("-")) {
        const parts = token.split("-");
        if (parts.length !== 2) throw new Error("Invalid page range format (e.g. use 1-4).");
        const start = parseInt(parts[0].trim());
        const end = parseInt(parts[1].trim());

        if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end) {
          throw new Error("Invalid range. The start number must be less than the end number.");
        }
        if (end > maxPages) {
          throw new Error(`Range value ${end} exceeds total pages of ${maxPages}.`);
        }

        for (let i = start; i <= end; i++) {
          indices.push(i - 1);
        }
      } else {
        const val = parseInt(token);
        if (isNaN(val) || val < 1 || val > maxPages) {
          throw new Error(`Page ${token} is invalid or out of bounds (1 to ${maxPages}).`);
        }
        indices.push(val - 1);
      }
    }

    return Array.from(new Set(indices)).sort((a, b) => a - b);
  };

  // Helper to parse hex colors to 0.0-1.0 rgb values
  const hexToRgbRatio = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 0, b: 0 }; // fallback Red
  };

  const handleAddWatermark = async () => {
    if (!pdfFile || totalPages === null) {
      setError("Please upload a PDF document first.");
      return;
    }

    if (!watermarkText.trim()) {
      setError("Please enter watermark text.");
      return;
    }

    setError(null);
    setWatermarkedPdfUrl(null);
    setLoading(true);

    try {
      const pageIndices = parsePageRanges(rangeInput, totalPages);
      if (pageIndices.length === 0) {
        throw new Error("No pages matched your range settings.");
      }

      const originalBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(originalBytes);
      
      // Embed standard Helvetica Bold font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const colorRatio = hexToRgbRatio(textColor);

      for (const idx of pageIndices) {
        const page = pdfDoc.getPage(idx);
        const { width, height } = page.getSize();

        // Calculate text metrics to align positioning
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = helveticaFont.heightAtSize(fontSize);

        let drawX = width / 2;
        let drawY = height / 2;

        if (position === "center") {
          drawX = width / 2 - textWidth / 2;
          drawY = height / 2 - textHeight / 2;
        } else if (position === "top-left") {
          drawX = 35;
          drawY = height - textHeight - 35;
        } else if (position === "top-right") {
          drawX = width - textWidth - 35;
          drawY = height - textHeight - 35;
        } else if (position === "bottom-left") {
          drawX = 35;
          drawY = 35;
        } else if (position === "bottom-right") {
          drawX = width - textWidth - 35;
          drawY = 35;
        }

        page.drawText(watermarkText, {
          x: drawX,
          y: drawY,
          size: fontSize,
          font: helveticaFont,
          color: rgb(colorRatio.r, colorRatio.g, colorRatio.b),
          opacity: opacity,
          rotate: degrees(rotationAngle),
        });
      }

      const watermarkedBytes = await pdfDoc.save();
      const blob = new Blob([watermarkedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setWatermarkedPdfUrl(url);

      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#2563eb", "#22c55e"],
      });
    } catch (err: any) {
      setError(err.message || "Failed to add watermark onto PDF pages.");
    } finally {
      setLoading(false);
    }
  };

  const downloadWatermarkedPdf = () => {
    if (!watermarkedPdfUrl || !pdfFile) return;
    const baseName = pdfFile.name.substring(0, pdfFile.name.lastIndexOf("."));
    const a = document.createElement("a");
    a.href = watermarkedPdfUrl;
    a.download = `${baseName}-watermarked.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setPdfFile(null);
    setTotalPages(null);
    setWatermarkedPdfUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const howToUse = [
    "Upload your PDF document in the workspace upload zone.",
    "Type your desired watermark text (e.g. CONFIDENTIAL, DRAFT, DO NOT COPY).",
    "Customize watermark opacity, text color, font size, and rotation angle.",
    "Select the page range (All, or e.g. 1, 3-5) and select a placement preset.",
    "Click Add Watermark to PDF, review the preview, and download your updated PDF."
  ];

  const benefits = [
    "Secure your PDF pages against unauthorized copying or distribution.",
    "100% Client-Side processing: Your documents are never uploaded to any server.",
    "Fully customizable font dimensions, rotation angles, colors, and opacity filters.",
    "Optionally target only specific pages or ranges to keep other pages clean."
  ];

  const faqs = [
    {
      question: "Will adding a watermark flatten my PDF text?",
      answer: "No. The watermark text overlay is drawn on top of the existing page canvas buffer. Your original text structures, fonts, and vector paths remain fully selectable and intact."
    },
    {
      question: "How secure is a text watermark added this way?",
      answer: "A digital watermark is an effective deterrent against print copying and screenshot leaks. However, because it is drawn as vector PDF text, technical users can programmatically edit PDF structures to strip overlays. For absolute security, flat image watermarking is required."
    }
  ];

  const relatedTools = [
    { name: "PDF Page Organizer", url: "/pdf-organizer", description: "Rearrange pages of your PDF document." },
    { name: "Rotate PDF Pages", url: "/pdf-rotate", description: "Rotate selected PDF pages." }
  ];

  return (
    <ToolLayout
      title="Add PDF Watermark"
      description="Draw custom text watermarks onto PDF pages. Fine-tune font sizes, color values, opacity levels, rotation angles, position placements, and page ranges client-side."
      category="PDF Tools"
      categoryUrl="/#pdf"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Upload Block */}
        {!pdfFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border-color hover:border-accent rounded-2xl p-12 text-center bg-secondary-bg/30 hover:bg-hover-bg/30 cursor-pointer transition-all duration-200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfUpload}
              accept="application/pdf"
              className="hidden"
            />
            <Upload className="h-10 w-10 text-secondary-text/60 mx-auto mb-4" />
            <p className="font-heading font-semibold text-primary-text text-base">
              Upload PDF to Watermark
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Processes completely locally in your browser.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Editor grid workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Document Info Card */}
              <div className="border border-border-color rounded-2xl p-4 bg-secondary-bg/30 flex flex-col items-center justify-center min-h-55">
                <FileText className="h-12 w-12 text-accent mb-3" />
                <p className="text-xs text-primary-text font-bold truncate max-w-50 text-center">{pdfFile.name}</p>
                <p className="text-[10px] text-secondary-text mt-1 font-mono">
                  Pages: {totalPages} | Size: {(pdfFile.size / 1024).toFixed(1)} KB
                </p>
              </div>

              {/* Watermark customizer settings card */}
              <div className="lg:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 block">
                  Watermark Settings
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Watermark text */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. CONFIDENTIAL"
                      className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                    />
                  </div>

                  {/* Range Page inputs */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Target Pages</label>
                    <input
                      type="text"
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder="e.g. All, 1, 3-5"
                      className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-mono text-primary-text focus:outline-none"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border-color/60">
                  
                  {/* Font Size */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-secondary-text uppercase">
                      <span>Font Size</span>
                      <span className="text-accent">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="96"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full accent-accent h-1 bg-border-color rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Opacity */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-secondary-text uppercase">
                      <span>Opacity</span>
                      <span className="text-accent">{Math.round(opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1.0"
                      step="0.05"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="w-full accent-accent h-1 bg-border-color rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Angle */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-secondary-text uppercase">
                      <span>Rotation</span>
                      <span className="text-accent">{rotationAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="5"
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                      className="w-full accent-accent h-1 bg-border-color rounded-lg cursor-pointer"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-color/60">
                  
                  {/* Position */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Position Placement</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="center">Center of Page</option>
                      <option value="top-left">Top Left Margin</option>
                      <option value="top-right">Top Right Margin</option>
                      <option value="bottom-left">Bottom Left Margin</option>
                      <option value="bottom-right">Bottom Right Margin</option>
                    </select>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary-text uppercase block">Watermark Color</label>
                    <div className="flex gap-2.5 items-center">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-7 h-7 rounded border border-border-color cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold">{textColor}</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Error message */}
            {error && (
              <div className="p-3.5 bg-warning/10 border border-warning/20 text-warning text-xs rounded-lg flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddWatermark}
                disabled={loading}
                className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 flex justify-center items-center gap-1.5"
              >
                <FilePen className="h-4.5 w-4.5" />
                {loading ? "Adding Watermark..." : "Add Watermark to PDF"}
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Upload another file"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            {/* Success panel */}
            {watermarkedPdfUrl && (
              <div className="pt-5 flex flex-col items-center space-y-4 bg-success/5 p-4 rounded-xl border border-success/20 animate-fade-in animate-duration-200">
                <div className="text-sm font-semibold text-primary-text">
                  Watermarks Applied Successfully!
                </div>
                
                <button
                  onClick={downloadWatermarkedPdf}
                  className="flex items-center gap-1.5 px-6 py-3 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="h-4.5 w-4.5" /> Download Watermarked PDF
                </button>

                {/* Local Preview */}
                <div className="w-full h-100 border border-border-color rounded-xl overflow-hidden mt-2">
                  <iframe
                    src={watermarkedPdfUrl}
                    className="w-full h-full"
                    title="Watermarked PDF Preview"
                  />
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </ToolLayout>
  );
}
