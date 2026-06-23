"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";
import { FileText, Upload, RefreshCw, Download, AlertTriangle, ArrowRight } from "lucide-react";

export default function PdfSplitter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  
  const [splitting, setSplitting] = useState(false);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSplitPdfUrl(null);
    setTotalPages(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Unsupported file format. Please upload a valid PDF document.");
      return;
    }

    setPdfFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdfDoc.getPageCount());
      setRangeInput(`1-${Math.min(pdfDoc.getPageCount(), 3)}`);
    } catch (err: any) {
      setError("Failed to parse the PDF document. It might be password-protected or corrupted.");
    }
  };

  // Parses comma-separated and hyphenated page ranges (e.g. "1, 3-5, 8")
  const parsePageRanges = (rangeStr: string, maxPages: number): number[] => {
    const indices: number[] = [];
    const tokens = rangeStr.split(",");

    for (let token of tokens) {
      token = token.trim();
      if (!token) continue;

      if (token.includes("-")) {
        const parts = token.split("-");
        if (parts.length !== 2) throw new Error("Invalid range format (e.g. use 1-3).");
        const start = parseInt(parts[0].trim());
        const end = parseInt(parts[1].trim());

        if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end) {
          throw new Error("Invalid range values. Check that start is less than end.");
        }
        if (end > maxPages) {
          throw new Error(`Range value ${end} exceeds total pages of ${maxPages}.`);
        }

        // Convert to 0-based index
        for (let i = start; i <= end; i++) {
          indices.push(i - 1);
        }
      } else {
        const val = parseInt(token);
        if (isNaN(val) || val < 1 || val > maxPages) {
          throw new Error(`Invalid page number ${token}. Check bounds between 1 and ${maxPages}.`);
        }
        indices.push(val - 1);
      }
    }

    // De-duplicate indices and sort them
    return Array.from(new Set(indices)).sort((a, b) => a - b);
  };

  const handleSplitPdf = async () => {
    if (!pdfFile || totalPages === null) {
      setError("Please upload a PDF document first.");
      return;
    }

    setError(null);
    setSplitPdfUrl(null);
    setSplitting(true);

    try {
      const pageIndices = parsePageRanges(rangeInput, totalPages);
      if (pageIndices.length === 0) {
        throw new Error("No page indices resolved. Enter ranges like 1-3, 5.");
      }

      const originalBytes = await pdfFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(originalBytes);
      const destDoc = await PDFDocument.create();

      // Copy selected pages
      const copiedPages = await destDoc.copyPages(srcDoc, pageIndices);
      for (const page of copiedPages) {
        destDoc.addPage(page);
      }

      const destBytes = await destDoc.save();
      const blob = new Blob([destBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setSplitPdfUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to split PDF.");
    } finally {
      setSplitting(false);
    }
  };

  const downloadSplitPdf = () => {
    if (!splitPdfUrl || !pdfFile) return;
    const baseName = pdfFile.name.substring(0, pdfFile.name.lastIndexOf("."));
    const a = document.createElement("a");
    a.href = splitPdfUrl;
    a.download = `${baseName}-extracted.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const howToUse = [
    "Upload your PDF document in the drag-and-drop workspace container.",
    "Inspect the total page capacity displayed automatically upon loading.",
    "Input your page ranges using comma values or dash intervals (e.g., '1, 3-5, 9').",
    "Click Extract Pages to create a new PDF containing only your selected scope, preview, and download."
  ];

  const benefits = [
    "Allows extracting isolated sections of massive ebooks, invoices, or guides easily.",
    "Runs 100% locally to protect private reports and sensitive contract sheets.",
    "Supports customized, non-contiguous page combinations (e.g. pages 1, 3, and 7-9).",
    "Generates optimized outputs with proper metadata and page proportions."
  ];

  const faqs = [
    {
      question: "Can I extract pages in non-sequential order?",
      answer: "Yes, you can input pages in any order (e.g., '5, 2, 8'). Our compiler will automatically order them numerically when creating the output document.",
    },
    {
      question: "Are external assets like links and images preserved?",
      answer: "Yes, copying pages via pdf-lib transfers the raw drawing buffers, text layouts, images, and standard link references intact."
    }
  ];

  const relatedTools = [
    { name: "Merge PDF Files Online", url: "/pdf-merge", description: "Combine multiple PDF documents." },
    { name: "Image to PDF Converter", url: "/image-to-pdf", description: "Compile images to a PDF file." }
  ];

  return (
    <ToolLayout
      title="PDF Page Splitter"
      description="Extract specific pages or page ranges from any PDF document client-side to create a new PDF."
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
                {pdfFile ? `Size: ${(pdfFile.size / 1024).toFixed(1)} KB` : "Supports PDF files up to 50MB"}
              </div>
            </div>
          </div>
        </div>

        {/* Selected PDF Information & Ranges */}
        {pdfFile && totalPages !== null && (
          <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-color pb-2 gap-2">
              <span className="text-sm font-semibold text-primary-text">
                Document Details
              </span>
              <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full ring-1 ring-inset ring-accent/20">
                Total Pages: {totalPages}
              </span>
            </div>

            {/* Range Input field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
                Page Range to Extract
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1, 3-5, 7"
                className="w-full rounded-lg border border-border-color bg-background px-4 py-2.5 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
              />
              <span className="text-[10px] text-secondary-text block">
                Use commas for individual pages and dashes for ranges. Example: <span className="font-mono text-accent">1, 3-5, 7</span> (Extracts page 1, pages 3, 4, 5, and page 7).
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {pdfFile && totalPages !== null && (
          <div className="flex justify-center">
            <button
              onClick={handleSplitPdf}
              disabled={splitting}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {splitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
              {splitting ? "Extracting..." : "Extract Pages"}
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
        {splitPdfUrl && (
          <div className="pt-4 border-t border-border-color flex flex-col items-center space-y-4">
            <div className="text-sm font-semibold text-primary-text">
              Pages Extracted Successfully!
            </div>
            
            <button
              onClick={downloadSplitPdf}
              className="flex items-center gap-1.5 px-6 py-3 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <Download className="h-4.5 w-4.5" /> Download Extracted PDF
            </button>

            {/* Embedded Iframe Preview */}
            <div className="w-full h-[400px] border border-border-color rounded-xl overflow-hidden mt-4">
              <iframe
                src={splitPdfUrl}
                className="w-full h-full"
                title="Split PDF Preview"
              />
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
