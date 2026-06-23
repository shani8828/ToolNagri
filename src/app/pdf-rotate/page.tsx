"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument, degrees } from "pdf-lib";
import { FileText, Upload, RefreshCw, Download, AlertTriangle, RotateCw } from "lucide-react";

export default function PdfRotator() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState("All");
  const [rotationAngle, setRotationAngle] = useState(90);
  
  const [rotating, setRotating] = useState(false);
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setRotatedPdfUrl(null);
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
      setError("Failed to load PDF file. The file might be corrupted or protected.");
    }
  };

  const parsePageRanges = (rangeStr: string, maxPages: number): number[] => {
    const cleanStr = rangeStr.trim().toLowerCase();
    if (cleanStr === "all") {
      // Return all 0-based indices
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

  const handleRotatePdf = async () => {
    if (!pdfFile || totalPages === null) {
      setError("Please upload a PDF document first.");
      return;
    }

    setError(null);
    setRotatedPdfUrl(null);
    setRotating(true);

    try {
      const pageIndices = parsePageRanges(rangeInput, totalPages);
      if (pageIndices.length === 0) {
        throw new Error("No pages found to rotate. Please double-check your page range values.");
      }

      const originalBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(originalBytes);

      for (const idx of pageIndices) {
        const page = pdfDoc.getPage(idx);
        const currentRotation = page.getRotation().angle;
        // Compute new angle (normalized to 0-360)
        const newAngle = (currentRotation + rotationAngle) % 360;
        page.setRotation(degrees(newAngle));
      }

      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setRotatedPdfUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to rotate PDF pages.");
    } finally {
      setRotating(false);
    }
  };

  const downloadRotatedPdf = () => {
    if (!rotatedPdfUrl || !pdfFile) return;
    const baseName = pdfFile.name.substring(0, pdfFile.name.lastIndexOf("."));
    const a = document.createElement("a");
    a.href = rotatedPdfUrl;
    a.download = `${baseName}-rotated.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const howToUse = [
    "Upload your PDF document in the workspace drop-zone.",
    "Choose which pages to rotate. You can input 'All' or type specific pages (e.g. '1, 3-5').",
    "Select the rotation angle (90 degrees clockwise, 180 degrees, or 270 degrees).",
    "Click Rotate PDF Pages, review the output preview, and download your rotated file."
  ];

  const benefits = [
    "Allows correcting misaligned scans, landscape sheets, or sideways pages instantly.",
    "Ensures absolute file confidentiality by converting PDF bytes entirely inside the browser.",
    "Supports selective page rotation, letting you leave correctly oriented pages untouched.",
    "Builds highly compliant PDF versions, preserving links and annotation parameters."
  ];

  const faqs = [
    {
      question: "Will rotating pages decrease the PDF quality?",
      answer: "No. PDF rotation merely changes the orientation attribute metadata of the page layout. It does not re-compress images or modify text buffers, ensuring zero quality loss.",
    },
    {
      question: "What page rotation options are supported?",
      answer: "We support rotating pages clockwise by 90 degrees, 180 degrees, or 270 degrees. You can apply this rotation repeatedly to achieve any orientation."
    }
  ];

  const relatedTools = [
    { name: "PDF Page Splitter", url: "/pdf-split", description: "Extract pages from a PDF document." },
    { name: "Merge PDF Files Online", url: "/pdf-merge", description: "Combine multiple PDF documents." }
  ];

  return (
    <ToolLayout
      title="PDF Page Rotator"
      description="Rotate specific pages or entire PDF documents clockwise by 90, 180, or 270 degrees client-side."
      category="PDF Tools"
      categoryUrl="/#pdf"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Upload Zone */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
            <Upload className="h-4.5 w-4.5 text-accent" /> Upload PDF Document
          </label>
          <div className="relative border-2 border-dashed border-border-color hover:border-accent rounded-xl p-8 text-center bg-secondary-bg/10 hover:bg-secondary-bg/25 transition-all duration-200 group">
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2.5">
              <Upload className="mx-auto h-8 w-8 text-secondary-text group-hover:text-accent transition-colors" />
              <div className="text-sm font-semibold text-primary-text">
                {pdfFile ? pdfFile.name : "Drag & drop PDF here, or click to upload"}
              </div>
              <div className="text-xs text-secondary-text">
                {pdfFile ? `Size: ${(pdfFile.size / 1024).toFixed(1)} KB` : "Supports PDF documents"}
              </div>
            </div>
          </div>
        </div>

        {/* Configurations */}
        {pdfFile && totalPages !== null && (
          <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-color pb-2 gap-2">
              <span className="text-sm font-semibold text-primary-text">
                Rotation Settings
              </span>
              <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full ring-1 ring-inset ring-accent/20">
                Total Pages: {totalPages}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pages to Rotate */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
                  Pages to Rotate
                </label>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g. All, 1, 3-5, 8"
                  className="w-full rounded-lg border border-border-color bg-background px-4 py-2 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
                />
                <span className="text-[10px] text-secondary-text block">
                  Enter <span className="font-semibold text-accent font-mono">All</span> to rotate every page, or specify ranges.
                </span>
              </div>

              {/* Rotation Angle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
                  Rotation Angle
                </label>
                <select
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-sm text-primary-text font-semibold focus:outline-none"
                >
                  <option value={90}>90° Clockwise</option>
                  <option value={180}>180° Flip</option>
                  <option value={270}>270° Counter-Clockwise</option>
                </select>
              </div>

            </div>
          </div>
        )}

        {/* Rotate trigger */}
        {pdfFile && totalPages !== null && (
          <div className="flex justify-center">
            <button
              onClick={handleRotatePdf}
              disabled={rotating}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {rotating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
              {rotating ? "Rotating..." : "Rotate PDF Pages"}
            </button>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            {error}
          </div>
        )}

        {/* Download & Preview Panel */}
        {rotatedPdfUrl && (
          <div className="pt-4 border-t border-border-color flex flex-col items-center space-y-4">
            <div className="text-sm font-semibold text-primary-text">
              Pages Rotated Successfully!
            </div>
            
            <button
              onClick={downloadRotatedPdf}
              className="flex items-center gap-1.5 px-6 py-3 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <Download className="h-4.5 w-4.5" /> Download Rotated PDF
            </button>

            {/* Embedded Iframe Preview */}
            <div className="w-full h-[400px] border border-border-color rounded-xl overflow-hidden mt-4">
              <iframe
                src={rotatedPdfUrl}
                className="w-full h-full"
                title="Rotated PDF Preview"
              />
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
