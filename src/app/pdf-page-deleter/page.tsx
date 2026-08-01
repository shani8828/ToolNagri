"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle, Trash2, CheckSquare, Square, Layers } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";

interface PageItem {
  id: string;
  originalIndex: number;
  thumbnail: string;
  selectedForDeletion: boolean;
}

export default function PdfPageDeleter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF.js preview engine dynamically
  const loadPdfJs = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        const pdfjs = (window as any).pdfjsLib;
        pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(pdfjs);
      };
      script.onerror = () => reject(new Error("Failed to load PDF preview engine."));
      document.head.appendChild(script);
    });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setPages([]);
    setExportUrl(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF document.");
      return;
    }

    setPdfFile(file);
    setLoading(true);
    setStatusMessage("Initializing PDF render engine...");

    try {
      const pdfjs = await loadPdfJs();
      setStatusMessage("Reading document bytes...");
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      const totalCount = pdfDoc.numPages;

      const pageItems: PageItem[] = [];

      for (let i = 1; i <= totalCount; i++) {
        setStatusMessage(`Rendering page preview ${i} of ${totalCount}...`);
        const page = await pdfDoc.getPage(i);
        
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const thumbnail = canvas.toDataURL("image/jpeg", 0.75);
          pageItems.push({
            id: `del-p-${i}-${Date.now()}`,
            originalIndex: i - 1,
            thumbnail,
            selectedForDeletion: false
          });
        }
      }

      setPages(pageItems);
    } catch (err: any) {
      console.error(err);
      setError("Failed to parse PDF pages. The file might be corrupted or encrypted.");
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  // Toggle deletion state of page card
  const togglePageDeletion = (index: number) => {
    setExportUrl(null);
    const items = [...pages];
    items[index].selectedForDeletion = !items[index].selectedForDeletion;
    setPages(items);
  };

  // Selection Helpers
  const selectAll = (shouldDelete: boolean) => {
    setExportUrl(null);
    setPages(pages.map(p => ({ ...p, selectedForDeletion: shouldDelete })));
  };

  const selectEven = () => {
    setExportUrl(null);
    setPages(pages.map(p => ({ ...p, selectedForDeletion: p.originalIndex % 2 !== 0 }))); // Page 2, 4, 6... are index 1, 3, 5
  };

  const selectOdd = () => {
    setExportUrl(null);
    setPages(pages.map(p => ({ ...p, selectedForDeletion: p.originalIndex % 2 === 0 }))); // Page 1, 3, 5... are index 0, 2, 4
  };

  const invertSelection = () => {
    setExportUrl(null);
    setPages(pages.map(p => ({ ...p, selectedForDeletion: !p.selectedForDeletion })));
  };

  const handleCompilePdf = async () => {
    if (!pdfFile || pages.length === 0) return;

    // Remaining pages
    const remainingPages = pages.filter(p => !p.selectedForDeletion);
    if (remainingPages.length === 0) {
      setError("You cannot delete all pages. At least one page must remain.");
      return;
    }

    setLoading(true);
    setStatusMessage("Compiling document...");
    setError("");

    try {
      const originalBytes = await pdfFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(originalBytes);
      const outDoc = await PDFDocument.create();

      const pageIndices = remainingPages.map(p => p.originalIndex);
      const copiedPages = await outDoc.copyPages(srcDoc, pageIndices);

      copiedPages.forEach(page => outDoc.addPage(page));

      const outBytes = await outDoc.save();
      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setExportUrl(url);

      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#2563eb", "#22c55e"],
      });
    } catch (err: any) {
      console.error(err);
      setError("Failed to compile trimmed PDF document.");
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setPages([]);
    setExportUrl(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const howToUse = [
    "Upload the PDF document you want to trim inside the sandbox upload zone.",
    "The tool renders thumbnails for all pages of your PDF document.",
    "Click on any page thumbnail to toggle its deletion state, or use the quick selection buttons.",
    "Selected pages will be marked with a trash bin icon and grayed out.",
    "Click Delete Pages & Save to generate and download a clean PDF with only remaining pages."
  ];

  const benefits = [
    "Delete unwanted pages visually with a single click.",
    "100% Client-Side processing: Your documents are never uploaded to any server.",
    "Provides quick filter selectors to delete odd pages, even pages, or invert choices.",
    "Ensures high-fidelity output compliance, preserving links, layouts, and vector structures."
  ];

  const faqs = [
    {
      question: "Is there a limit to the file size or number of pages?",
      answer: "No. Since calculations are handled entirely in your browser using WebAssembly and Javascript engines, there are no artificial file size, watermark, or page count limitations."
    },
    {
      question: "What happens if I try to delete all pages of a PDF?",
      answer: "A PDF document must contain at least one page. The tool will display a warning and prevent you from exporting if you select every page for deletion."
    }
  ];

  const relatedTools = [
    { name: "PDF Page Organizer", url: "/pdf-organizer", description: "Rearrange and reorder pages visually." },
    { name: "Split PDF Pages", url: "/pdf-split", description: "Extract individual page ranges." }
  ];

  const deletedCount = pages.filter(p => p.selectedForDeletion).length;

  return (
    <ToolLayout
      title="Delete PDF Pages"
      description="Remove selected pages from a PDF document visually. Choose even, odd, or custom pages to discard, and download a clean PDF client-side."
      category="PDF Tools"
      categoryUrl="/#pdf"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Upload Container */}
        {!pdfFile && (
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
              Upload PDF to Trim Pages
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Secure client-side extraction. Works locally in your browser.
            </p>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-8 space-y-3">
            <RefreshCw className="h-8 w-8 text-accent animate-spin mx-auto" />
            <p className="text-sm font-semibold text-primary-text">{statusMessage}</p>
          </div>
        )}

        {/* Workspace Display */}
        {pdfFile && pages.length > 0 && !loading && (
          <div className="space-y-6">
            
            {/* Header info & filters */}
            <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-border-color/60">
                <div className="text-sm font-semibold text-primary-text truncate max-w-sm">
                  File: {pdfFile.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-secondary-text">
                    Total: {pages.length} Pages
                  </span>
                  {deletedCount > 0 && (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      Delete: {deletedCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Selection helpers */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => selectAll(true)}
                  className="py-1 px-2.5 rounded-lg text-xs font-semibold border border-border-color bg-background hover:bg-hover-bg text-secondary-text hover:text-primary-text cursor-pointer transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={() => selectAll(false)}
                  className="py-1 px-2.5 rounded-lg text-xs font-semibold border border-border-color bg-background hover:bg-hover-bg text-secondary-text hover:text-primary-text cursor-pointer transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={selectEven}
                  className="py-1 px-2.5 rounded-lg text-xs font-semibold border border-border-color bg-background hover:bg-hover-bg text-secondary-text hover:text-primary-text cursor-pointer transition-colors"
                >
                  Select Even Pages
                </button>
                <button
                  onClick={selectOdd}
                  className="py-1 px-2.5 rounded-lg text-xs font-semibold border border-border-color bg-background hover:bg-hover-bg text-secondary-text hover:text-primary-text cursor-pointer transition-colors"
                >
                  Select Odd Pages
                </button>
                <button
                  onClick={invertSelection}
                  className="py-1 px-2.5 rounded-lg text-xs font-semibold border border-border-color bg-background hover:bg-hover-bg text-secondary-text hover:text-primary-text cursor-pointer transition-colors"
                >
                  Invert
                </button>
              </div>
            </div>

            {/* Thumbnail Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => togglePageDeletion(idx)}
                  className={`border rounded-xl p-3 bg-card-bg flex flex-col justify-between items-center transition-all cursor-pointer select-none hover:shadow-xs relative ${
                    item.selectedForDeletion
                      ? "border-red-400 bg-red-50/20 ring-1 ring-red-400"
                      : "border-border-color hover:border-accent"
                  }`}
                >
                  {/* Status Indicator Badge */}
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.selectedForDeletion
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-secondary-bg/80 border-border-color/50"
                  }`}>
                    Page {item.originalIndex + 1}
                  </span>

                  {/* Check icon */}
                  <div className="absolute top-2 right-2">
                    {item.selectedForDeletion ? (
                      <CheckSquare className="h-4.5 w-4.5 text-red-500" />
                    ) : (
                      <Square className="h-4.5 w-4.5 text-secondary-text/30" />
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className={`w-full aspect-3/4 bg-white rounded-lg border border-border-color flex items-center justify-center p-1.5 overflow-hidden mt-6 mb-3 relative ${
                    item.selectedForDeletion ? "opacity-35" : ""
                  }`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={`Page ${item.originalIndex + 1}`}
                      className="max-h-full max-w-full object-contain shadow-sm"
                    />

                    {/* Trash Overlay */}
                    {item.selectedForDeletion && (
                      <div className="absolute inset-0 bg-red-100/10 flex items-center justify-center">
                        <Trash2 className="h-10 w-10 text-red-500 bg-white/90 p-2.5 rounded-full shadow-md border border-red-200" />
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] font-bold text-secondary-text text-center w-full uppercase tracking-wider">
                    {item.selectedForDeletion ? (
                      <span className="text-red-500">Will Be Deleted</span>
                    ) : (
                      <span className="text-success">Will Be Kept</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
                <span>{error}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCompilePdf}
                disabled={pages.length === 0}
                className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                Delete Selected Pages & Save
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Start over"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            {/* Compiled download pane */}
            {exportUrl && (
              <div className="pt-5 flex flex-col items-center space-y-4 bg-success/5 p-4 rounded-xl border border-success/20 animate-fade-in">
                <div className="text-sm font-semibold text-primary-text">
                  PDF Trimmed Successfully! Kept {pages.length - deletedCount} pages.
                </div>
                
                <a
                  href={exportUrl}
                  download={`${pdfFile.name.substring(0, pdfFile.name.lastIndexOf("."))}-trimmed.pdf`}
                  className="flex items-center gap-1.5 px-6 py-3 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="h-4.5 w-4.5" /> Download Trimmed PDF
                </a>

                {/* Preview panel */}
                <div className="w-full h-100 border border-border-color rounded-xl overflow-hidden mt-2">
                  <iframe
                    src={exportUrl}
                    className="w-full h-full"
                    title="Trimmed PDF Preview"
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
