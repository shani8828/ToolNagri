"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileImage, Upload, RefreshCw, Download, AlertTriangle, Play } from "lucide-react";

interface RenderedPage {
  pageNumber: number;
  url: string;
  width: number;
  height: number;
}

export default function PdfToImage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [renderedPages, setRenderedPages] = useState<RenderedPage[]>([]);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Dynamically load pdf.js from CDN
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if ((window as any).pdfjsLib) {
      setPdfjsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfjsLoaded(true);
    };
    script.onerror = () => {
      setError("Failed to load the PDF rendering engine from CDN. Please check your network connection.");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setRenderedPages([]);
    setTotalPages(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    if (!pdfjsLoaded) {
      setError("PDF engine is still loading. Please wait a few seconds and try again.");
      return;
    }

    setPdfFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = (window as any).pdfjsLib;
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);
    } catch (err: any) {
      setError("Error parsing PDF metadata. The file may be password protected or corrupted.");
    }
  };

  const startRendering = async () => {
    if (!pdfFile || totalPages === null) {
      setError("Please select a PDF document first.");
      return;
    }

    setError(null);
    setRenderedPages([]);
    setRendering(true);
    setProgress(0);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfjsLib = (window as any).pdfjsLib;
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const pagesList: RenderedPage[] = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setProgress(Math.round(((pageNum - 1) / totalPages) * 100));

        const page = await pdf.getPage(pageNum);
        // Scale 2.0 yields crisp high-resolution images
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Could not acquire 2D drawing context.");
        }

        // Draw white background
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const mime = format === "png" ? "image/png" : "image/jpeg";
        const url = canvas.toDataURL(mime);
        
        pagesList.push({
          pageNumber: pageNum,
          url,
          width: canvas.width,
          height: canvas.height
        });
      }

      setRenderedPages(pagesList);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || "Failed to render PDF pages into images.");
    } finally {
      setRendering(false);
    }
  };

  const downloadPageImage = (page: RenderedPage) => {
    if (!pdfFile) return;
    const baseName = pdfFile.name.substring(0, pdfFile.name.lastIndexOf("."));
    const a = document.createElement("a");
    a.href = page.url;
    a.download = `${baseName}-page-${page.pageNumber}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const howToUse = [
    "Upload your local PDF file using the drop-zone. The tool will parse the page count.",
    "Select the export format (PNG for transparency and lossless compression, or JPG for photographs).",
    "Click the Render Pages to Images button to start parsing the PDF pages in-browser.",
    "Check the rendered thumbnails list, click individual download links, or review resolutions."
  ];

  const benefits = [
    "Converts PDF flyers, pages, or forms into clean images for presentation slides.",
    "Ensures 100% security by performing layout conversions locally on your CPU.",
    "Renders crisp, high-resolution 2.0x scaled graphics suitable for zooming.",
    "Correctly processes embedded SVG vectors and text layers."
  ];

  const faqs = [
    {
      question: "Why does the tool run in-browser?",
      answer: "Processing client-side saves you from uploading sensitive corporate documents, IDs, or statements to third-party database nodes, ensuring total privacy.",
    },
    {
      question: "Can I convert large PDFs?",
      answer: "Yes. However, rendering pages client-side consumes computer memory. For documents exceeding 50 pages, we recommend converting in batches to avoid browser tab crashes."
    }
  ];

  const relatedTools = [
    { name: "Image to PDF Converter", url: "/image-to-pdf", description: "Compile images to a PDF file." },
    { name: "PDF Page Splitter", url: "/pdf-split", description: "Extract pages from a PDF document." }
  ];

  return (
    <ToolLayout
      title="PDF to Image Converter"
      description="Convert PDF document pages into high-resolution PNG or JPG images client-side."
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
                {pdfFile ? `Size: ${(pdfFile.size / 1024).toFixed(1)} KB` : "Requires a valid PDF file"}
              </div>
            </div>
          </div>
        </div>

        {/* Selected PDF configuration */}
        {pdfFile && totalPages !== null && (
          <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Output Image Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => { setFormat(e.target.value as any); setRenderedPages([]); }}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-sm text-primary-text font-semibold focus:outline-none"
                >
                  <option value="png">PNG (Lossless, High Quality)</option>
                  <option value="jpeg">JPEG (Compressed, Standard Quality)</option>
                </select>
              </div>

              {/* PDF Info */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
                <span className="text-xs text-secondary-text font-semibold">Pages Detected:</span>
                <span className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-full ring-1 ring-inset ring-accent/20">
                  {totalPages}
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Action Button */}
        {pdfFile && totalPages !== null && (
          <div className="flex justify-center">
            <button
              onClick={startRendering}
              disabled={rendering || !pdfjsLoaded}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {rendering ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {rendering ? "Rendering..." : "Render Pages to Images"}
            </button>
          </div>
        )}

        {/* Rendering Progress Bar */}
        {rendering && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-secondary-text">
              <span>Converting PDF Pages...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-border-color h-2 rounded-full overflow-hidden">
              <div className="bg-accent h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            {error}
          </div>
        )}

        {/* Rendered images output grid */}
        {renderedPages.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border-color">
            <h4 className="text-sm font-bold text-primary-text">
              Rendered Page Images ({renderedPages.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {renderedPages.map((page) => (
                <div
                  key={page.pageNumber}
                  className="rounded-xl border border-border-color bg-card-bg overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  {/* Page Preview Thumbnail */}
                  <div className="aspect-w-16 aspect-h-9 bg-secondary-bg/25 border-b border-border-color flex items-center justify-center p-4">
                    <img
                      src={page.url}
                      alt={`Page ${page.pageNumber}`}
                      className="max-h-40 object-contain shadow-card"
                    />
                  </div>

                  {/* Info and download */}
                  <div className="p-3 flex items-center justify-between text-xs">
                    <div className="font-semibold text-primary-text">
                      Page {page.pageNumber}
                      <span className="text-[10px] text-secondary-text block font-normal">
                        {page.width} x {page.height} px
                      </span>
                    </div>

                    <button
                      onClick={() => downloadPageImage(page)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-accent hover:bg-accent/90 text-white rounded font-bold cursor-pointer transition-colors"
                    >
                      <Download className="h-3 w-3" /> Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
