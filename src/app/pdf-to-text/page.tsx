"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle, Copy, Check, FileText } from "lucide-react";
import confetti from "canvas-confetti";

export default function PdfToText() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic injection of PDF.js
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
      script.onerror = () => reject(new Error("Failed to load PDF extraction engine."));
      document.head.appendChild(script);
    });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setExtractedText("");
    setCopied(false);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    setPdfFile(file);
    setLoading(true);
    setStatusMessage("Loading parser engine...");

    try {
      const pdfjs = await loadPdfJs();
      setStatusMessage("Reading document bytes...");
      const arrayBuffer = await file.arrayBuffer();

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      const totalCount = pdfDoc.numPages;

      let fullText = "";

      for (let i = 1; i <= totalCount; i++) {
        setStatusMessage(`Extracting text from page ${i} of ${totalCount}...`);
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        // Map individual text elements into a clean page string
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setExtractedText(fullText.trim());

      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#2563eb", "#22c55e"],
      });
    } catch (err: any) {
      console.error(err);
      setError("Failed to extract text. The PDF might be scanned/image-only or secured.");
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const handleCopyToClipboard = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!extractedText || !pdfFile) return;

    const baseName = pdfFile.name.substring(0, pdfFile.name.lastIndexOf("."));
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}-extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setPdfFile(null);
    setExtractedText("");
    setError("");
    setCopied(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const howToUse = [
    "Upload a PDF document that contains digital text elements.",
    "The tool will dynamically initialize PDF.js client-side.",
    "The parser reads text layout elements page-by-page inside the browser.",
    "Review the extracted content in the text editor space.",
    "Click Copy to Clipboard or Download TXT to save your text file locally."
  ];

  const benefits = [
    "Quickly extract readable text without copying page-by-page manually.",
    "100% Client-Side processing: Your documents are never uploaded to any server.",
    "Formats text output with convenient page separators.",
    "Works without registering or logging in."
  ];

  const faqs = [
    {
      question: "Why is the output text blank or missing letters?",
      answer: "This tool extracts embedded digital text elements. If your PDF is a scanned document or consist of direct photo snapshots, it contains image pixels instead of digital characters. Scanned PDFs require OCR (Optical Character Recognition) to parse letters."
    },
    {
      question: "Does it preserve tables and bold/italic styles?",
      answer: "PDF layouts store text in individual positioning nodes. This tool reads and lists those nodes in logical reading order. While spacing is preserved, text styling (like bolding, italics, or grid tables) is flattened to plain text."
    }
  ];

  const relatedTools = [
    { name: "Merge PDF Files", url: "/pdf-merge", description: "Combine multiple PDF files." },
    { name: "PDF Page Organizer", url: "/pdf-organizer", description: "Rearrange pages visually." }
  ];

  return (
    <ToolLayout
      title="PDF to Text"
      description="Extract clean, editable text content from PDF pages. View and copy the parsed text, or download it as a plain text (.txt) file locally in your browser."
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
              Upload PDF to Extract Text
            </p>
            <p className="text-xs text-secondary-text mt-1.5">
              Processes completely locally. Safe for business and personal docs.
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
        {pdfFile && extractedText && !loading && (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex flex-wrap justify-between items-center bg-secondary-bg/20 p-4 rounded-xl border border-border-color gap-3">
              <div className="text-sm font-semibold text-primary-text truncate max-w-sm">
                File: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold border border-border-color bg-background hover:bg-hover-bg text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-accent hover:bg-accent/90 text-white cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" /> Download TXT
                </button>
              </div>
            </div>

            {/* Extracted Text Box */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-accent" /> Extracted Text Content
              </label>
              <textarea
                value={extractedText}
                readOnly
                rows={15}
                className="w-full rounded-xl border border-border-color bg-background p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Reset */}
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-semibold"
              >
                <RefreshCw className="h-4 w-4" /> Start Over
              </button>
            </div>

          </div>
        )}

        {/* Error when uploading fails */}
        {error && !extractedText && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
              <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-semibold mx-auto"
            >
              <RefreshCw className="h-4 w-4" /> Upload Again
            </button>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
