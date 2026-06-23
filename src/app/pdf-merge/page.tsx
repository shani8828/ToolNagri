"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, FileText, ArrowUp, ArrowDown, Trash2, AlertCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";

interface PdfFileItem {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function PdfMerge() {
  const [pdfList, setPdfList] = useState<PdfFileItem[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: PdfFileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Only PDF files are supported.");
        continue;
      }
      newFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        file: file,
      });
    }

    setPdfList((prev) => [...prev, ...newFiles]);
    setMergedPdfUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    setMergedPdfUrl(null);
    const newList = [...pdfList];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newList.length) return;

    // Swap items
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    setPdfList(newList);
  };

  const removeItem = (id: string) => {
    setMergedPdfUrl(null);
    setPdfList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMerge = async () => {
    if (pdfList.length < 2) {
      setError("Please add at least two PDF files to merge.");
      return;
    }

    setLoading(true);
    setError("");
    setMergedPdfUrl(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfList) {
        // Read file bytes
        const fileBytes = await new Promise<Uint8Array>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
              resolve(new Uint8Array(reader.result));
            } else {
              reject(new Error("Failed to read file as ArrayBuffer"));
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(item.file);
        });

        // Load document
        const pdfDoc = await PDFDocument.load(fileBytes);
        
        // Copy all pages
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save document
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);

      // Trigger Confetti
      confetti({
        particleCount: 70,
        spread: 45,
        origin: { y: 0.7 },
        colors: ["#2563eb", "#60a5fa", "#22c55e"],
      });
    } catch (err) {
      console.error(err);
      setError("An error occurred during PDF merging. Ensure files are not password protected.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPdfList([]);
    setMergedPdfUrl(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const howToUse = [
    "Click the Upload PDF files block to add 2 or more PDFs.",
    "Drag/reorder the files using the Up and Down arrow buttons to adjust compilation sequence.",
    "Click Merge PDFs to launch client-side merging.",
    "Once processed, click the Download Merged PDF button to retrieve your new file."
  ];

  const benefits = [
    "No server uploads: Process giant files securely inside your local browser storage.",
    "Supports multiple PDFs merging in a single operation.",
    "Adjust and audit the compile order with simple sorting controls.",
    "Entirely free without file count or size caps."
  ];

  const faqs = [
    {
      question: "Is there a limit on how many PDF files I can merge?",
      answer: "No, you can compile as many files as your browser memory permits. We recommend joining up to 50 files at once for optimal speed."
    },
    {
      question: "Are encrypted or password-secured PDFs supported?",
      answer: "No, password-protected or strictly encrypted files cannot be processed client-side. Please unlock them before uploading."
    },
    {
      question: "Does merging PDFs reduce document quality?",
      answer: "Not at all. Merging simply copies vector page layers and images without modifying formatting compressions, keeping resolution identical to sources."
    }
  ];

  const relatedTools = [
    {
      name: "JPG to WebP Converter",
      url: "/jpg-to-webp",
      description: "Convert standard images to lightweight WebP format to speed up performance."
    },
    {
      name: "Free URL Shortener",
      url: "/url-shortener",
      description: "Shorten links, generate QR codes, and view analytics parameters."
    },
    {
      name: "JSON Formatter",
      url: "/json-formatter",
      description: "Format, minify, and validate JSON snippets with syntax highlighting."
    }
  ];

  return (
    <ToolLayout
      title="Merge PDF Files Online"
      description="Combine multiple PDF files into a single document. Reorder pages easily, process giant files instantly, with 100% client-side privacy."
      category="PDF Tools"
      categoryUrl="/#pdf-image"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border-color hover:border-accent rounded-2xl p-10 text-center bg-secondary-bg/30 hover:bg-hover-bg/30 cursor-pointer transition-all duration-200"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            multiple
            className="hidden"
          />
          <Upload className="h-10 w-10 text-secondary-text/60 mx-auto mb-3" />
          <p className="font-heading font-semibold text-primary-text text-base">
            Select Multiple PDF Files
          </p>
          <p className="text-xs text-secondary-text mt-1">
            Choose 2 or more PDF documents to compile.
          </p>
        </div>

        {/* PDF File List */}
        {pdfList.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-secondary-text uppercase tracking-wider">
              File Compilation Queue ({pdfList.length} files)
            </h3>

            <div className="border border-border-color rounded-xl overflow-hidden divide-y divide-border-color bg-card-bg shadow-sm">
              {pdfList.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between gap-4 p-4 hover:bg-hover-bg/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-accent shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary-text truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </p>
                      <p className="text-xs text-secondary-text mt-0.5">{formatSize(item.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => moveItem(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 border border-border-color hover:bg-hover-bg disabled:opacity-30 rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, "down")}
                      disabled={idx === pdfList.length - 1}
                      className="p-1.5 border border-border-color hover:bg-hover-bg disabled:opacity-30 rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 border border-border-color hover:border-warning hover:bg-warning/10 rounded text-secondary-text hover:text-warning transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Merge Actions */}
            <div className="flex gap-3 pt-2">
              {!mergedPdfUrl ? (
                <button
                  onClick={handleMerge}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Merging Documents..." : `Merge ${pdfList.length} PDFs`}
                </button>
              ) : (
                <a
                  href={mergedPdfUrl}
                  download="toolnagri-merged.pdf"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success hover:bg-success/80 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Download Merged PDF
                </a>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Reset queue"
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
