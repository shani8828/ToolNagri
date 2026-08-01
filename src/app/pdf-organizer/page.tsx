"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle, Trash2, RotateCw, ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";
import confetti from "canvas-confetti";

interface PageItem {
  id: string;
  originalIndex: number;
  thumbnail: string;
  rotation: number; // 0, 90, 180, 270
}

export default function PdfOrganizer() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic injection of PDF.js script
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
        setStatusMessage(`Rendering thumbnail for page ${i} of ${totalCount}...`);
        const page = await pdfDoc.getPage(i);
        
        // Render at small thumbnail resolution
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const thumbnail = canvas.toDataURL("image/jpeg", 0.75);
          pageItems.push({
            id: `p-${i}-${Date.now()}`,
            originalIndex: i - 1,
            thumbnail,
            rotation: 0
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

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    const items = [...pages];
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);
    setPages(items);
    setDraggedIndex(null);
    setExportUrl(null);
  };

  // Manual button shifting for accessibility/mobile
  const shiftPage = (index: number, direction: "left" | "right") => {
    setExportUrl(null);
    const items = [...pages];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    setPages(items);
  };

  const rotatePage = (index: number) => {
    setExportUrl(null);
    const items = [...pages];
    items[index].rotation = (items[index].rotation + 90) % 360;
    setPages(items);
  };

  const deletePage = (index: number) => {
    setExportUrl(null);
    const items = [...pages];
    items.splice(index, 1);
    setPages(items);
  };

  const handleCompilePdf = async () => {
    if (!pdfFile || pages.length === 0) return;

    setLoading(true);
    setStatusMessage("Compiling document...");
    setError("");

    try {
      const originalBytes = await pdfFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(originalBytes);
      const outDoc = await PDFDocument.create();

      // Extract only requested pages in specified order
      const pageIndices = pages.map(p => p.originalIndex);
      const copiedPages = await outDoc.copyPages(srcDoc, pageIndices);

      // Append pages and apply rotation
      copiedPages.forEach((page, i) => {
        const itemRotation = pages[i].rotation;
        if (itemRotation > 0) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + itemRotation) % 360));
        }
        outDoc.addPage(page);
      });

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
      setError("Failed to compile organized PDF file.");
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
    "Upload a multi-page PDF document in the local drop zone.",
    "The tool will load PDF.js client-side to render cards for all pages.",
    "Drag and drop cards to rearrange them, or use the Move Left / Move Right buttons.",
    "Click the Rotate button on any page to rotate it clockwise, or Trash to remove it.",
    "Click Save Organized PDF to compile and download your rearranged PDF document."
  ];

  const benefits = [
    "Visual workspace allows drag-and-drop page sorting.",
    "100% Client-Side processing: PDF contents remain private inside your device.",
    "Combines page reordering, individual page rotation, and page deleting in a single workspace.",
    "Downloads compiled document without watermarks or quality losses."
  ];

  const faqs = [
    {
      question: "Are my documents uploaded to any server?",
      answer: "No. All rendering, page extraction, and assembly happen locally inside your browser using PDF.js and pdf-lib. Nothing is sent to any server."
    },
    {
      question: "Can I combine pages from multiple PDFs?",
      answer: "This tool organizes pages within a single uploaded PDF. If you want to merge pages from multiple PDFs, please use our Merge PDF tool."
    }
  ];

  const relatedTools = [
    { name: "Split PDF Pages", url: "/pdf-split", description: "Split PDF files into pages." },
    { name: "Merge PDF Files", url: "/pdf-merge", description: "Combine multiple PDFs into one document." }
  ];

  return (
    <ToolLayout
      title="PDF Page Organizer"
      description="Rearrange, reorder, rotate, and delete pages from a PDF document visually. Drag and drop thumbnails to organize pages, then save the compiled file client-side."
      category="PDF Tools"
      categoryUrl="/#pdf"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Upload Block */}
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
              Upload PDF to Organize
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Processes completely locally. Secure and instant.
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
            
            {/* Header info */}
            <div className="flex flex-wrap justify-between items-center bg-secondary-bg/20 p-4 rounded-xl border border-border-color gap-3">
              <div className="text-sm font-semibold text-primary-text truncate max-w-sm">
                File: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
              </div>
              <div className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full ring-1 ring-inset ring-accent/20 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" /> Total Pages: {pages.length}
              </div>
            </div>

            {/* Thumbnail Drag & Drop Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((item, idx) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={() => handleDrop(idx)}
                  className={`border border-border-color rounded-xl p-3 bg-card-bg flex flex-col justify-between items-center transition-all cursor-grab active:cursor-grabbing hover:border-accent hover:shadow-xs relative select-none ${
                    draggedIndex === idx ? "opacity-40 scale-95 border-dashed border-accent" : ""
                  }`}
                >
                  <span className="absolute top-2 left-2 bg-secondary-bg/80 text-[10px] font-bold px-2 py-0.5 rounded-full border border-border-color/50">
                    Page {item.originalIndex + 1}
                  </span>

                  {/* Thumbnail Image with rotation styles */}
                  <div className="w-full aspect-3/4 bg-white rounded-lg border border-border-color flex items-center justify-center p-1.5 overflow-hidden mt-6 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={`Page ${item.originalIndex + 1}`}
                      className="max-h-full max-w-full object-contain transition-transform duration-200 shadow-sm"
                      style={{ transform: `rotate(${item.rotation}deg)` }}
                    />
                  </div>

                  {/* Card Controls */}
                  <div className="w-full space-y-2">
                    <div className="text-[10px] text-secondary-text font-bold text-center">
                      Position: {idx + 1}
                    </div>

                    <div className="flex justify-between items-center border-t border-border-color/60 pt-2 gap-1">
                      {/* Shift buttons */}
                      <button
                        onClick={() => shiftPage(idx, "left")}
                        disabled={idx === 0}
                        className="p-1 rounded bg-secondary-bg text-secondary-text hover:text-primary-text disabled:opacity-30 cursor-pointer"
                        title="Move Left"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => rotatePage(idx)}
                        className="p-1 rounded bg-secondary-bg text-secondary-text hover:text-accent cursor-pointer"
                        title="Rotate Page 90°"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => deletePage(idx)}
                        className="p-1 rounded bg-secondary-bg text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Remove Page"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => shiftPage(idx, "right")}
                        disabled={idx === pages.length - 1}
                        className="p-1 rounded bg-secondary-bg text-secondary-text hover:text-primary-text disabled:opacity-30 cursor-pointer"
                        title="Move Right"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Triggers */}
            <div className="flex gap-3">
              <button
                onClick={handleCompilePdf}
                disabled={pages.length === 0}
                className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                Assemble & Save PDF
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Start over"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            {/* Compiled file ready to download */}
            {exportUrl && (
              <div className="pt-5 flex flex-col items-center space-y-4 bg-success/5 p-4 rounded-xl border border-success/20">
                <div className="text-sm font-semibold text-primary-text">
                  PDF Organized Successfully!
                </div>
                
                <a
                  href={exportUrl}
                  download={`${pdfFile.name.substring(0, pdfFile.name.lastIndexOf("."))}-organized.pdf`}
                  className="flex items-center gap-1.5 px-6 py-3 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="h-4.5 w-4.5" /> Download Organized PDF
                </a>

                {/* Embedded preview frame */}
                <div className="w-full h-100 border border-border-color rounded-xl overflow-hidden mt-2">
                  <iframe
                    src={exportUrl}
                    className="w-full h-full"
                    title="Organized PDF Preview"
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
