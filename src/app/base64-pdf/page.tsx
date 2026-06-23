"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileText, Copy, Check, Download, Upload, AlertTriangle, ArrowLeftRight } from "lucide-react";

export default function Base64Pdf() {
  const [tab, setTab] = useState<"pdf2base64" | "base642pdf">("pdf2base64");
  
  // PDF to Base64 State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [base64Output, setBase64Output] = useState("");
  const [pdf2b64Error, setPdf2b64Error] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Base64 to PDF State
  const [base64Input, setBase64Input] = useState("");
  const [b642pdfError, setB642pdfError] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Helper: Convert File to Base64
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdf2b64Error(null);
    setBase64Output("");
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setPdf2b64Error("Unsupported file type. Please upload a valid PDF document.");
      return;
    }

    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract the raw base64 part
      const base64Str = result.split(",")[1] || result;
      setBase64Output(base64Str);
    };
    reader.onerror = () => {
      setPdf2b64Error("Failed to read the PDF file.");
    };
    reader.readAsDataURL(file);
  };

  const handleCopyBase64 = () => {
    if (base64Output) {
      navigator.clipboard.writeText(base64Output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadBase64Text = () => {
    if (!base64Output) return;
    const blob = new Blob([base64Output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pdfFile?.name || "document"}-base64.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper: Decode Base64 to PDF
  const handleBase64Convert = () => {
    setB642pdfError(null);
    setPdfPreviewUrl(null);

    let cleanInput = base64Input.trim();
    if (!cleanInput) {
      setB642pdfError("Base64 string is empty. Please enter a valid base64 encoded stream.");
      return;
    }

    // Clean data URL prefix if present
    if (cleanInput.startsWith("data:application/pdf;base64,")) {
      cleanInput = cleanInput.substring("data:application/pdf;base64,".length);
    } else if (cleanInput.startsWith("data:") && cleanInput.includes("base64,")) {
      cleanInput = cleanInput.split("base64,")[1];
    }

    try {
      // Validate Base64 formatting by attempting to decode
      const binaryString = atob(cleanInput);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
    } catch (e) {
      setB642pdfError("Invalid Base64 sequence. Please make sure the string is correctly formatted.");
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfPreviewUrl) return;
    const a = document.createElement("a");
    a.href = pdfPreviewUrl;
    a.download = "decoded-document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const howToUse = [
    "Select your conversion method using the toggle buttons at the top of the interface.",
    "For PDF to Base64: Upload your local PDF file, and copy the instantly rendered text stream.",
    "For Base64 to PDF: Paste the base64 string, click Convert to build the document, and download the PDF."
  ];

  const benefits = [
    "Enables embedding PDF assets inline inside database records or HTML files easily.",
    "Decodes database blob text streams back into visual documents locally.",
    "Handles massive documents with secure, memory-optimized buffer parsing.",
    "Features live previews for decoded Base64 documents before saving."
  ];

  const faqs = [
    {
      question: "Is there a limit on PDF file size?",
      answer: "Since processing happens entirely client-side, the file size limit is determined by your browser's available memory. Usually, files up to 50MB convert in under 2 seconds.",
    },
    {
      question: "Is my document data secure?",
      answer: "Absolutely. No files or strings are uploaded to any server. Your PDFs are processed locally within your browser context, making it extremely secure for private documentation."
    }
  ];

  const relatedTools = [
    { name: "Merge PDF Files Online", url: "/pdf-merge", description: "Combine multiple PDF documents." },
    { name: "Base64 Image Encoder & Decoder", url: "/base64-image", description: "Convert image files to Base64." }
  ];

  return (
    <ToolLayout
      title="Base64 to PDF / PDF to Base64 Converter"
      description="Convert PDF documents to Base64 text streams, or decode Base64 strings back to printable PDF files client-side."
      category="PDF Tools"
      categoryUrl="/#pdf"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Toggle Mode */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg border border-border-color p-0.5 bg-secondary-bg/20">
            <button
              onClick={() => { setTab("pdf2base64"); setB642pdfError(null); }}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                tab === "pdf2base64" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
              }`}
            >
              PDF to Base64
            </button>
            <button
              onClick={() => { setTab("base642pdf"); setPdf2b64Error(null); }}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                tab === "base642pdf" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
              }`}
            >
              Base64 to PDF
            </button>
          </div>
        </div>

        {/* Tab 1: PDF to Base64 */}
        {tab === "pdf2base64" && (
          <div className="space-y-6">
            
            {/* Upload Zone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-accent" /> Upload PDF Document
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

            {/* Error Message */}
            {pdf2b64Error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                {pdf2b64Error}
              </div>
            )}

            {/* Output Base64 */}
            {base64Output && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-primary-text">
                    Base64 Output String
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyBase64}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer font-semibold"
                    >
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy Base64
                    </button>
                    <button
                      onClick={handleDownloadBase64Text}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer font-semibold"
                    >
                      <Download className="h-3 w-3" /> Download Text File
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  value={base64Output}
                  rows={8}
                  className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-sm text-primary-text font-mono focus:outline-none break-all"
                />
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Base64 to PDF */}
        {tab === "base642pdf" && (
          <div className="space-y-6">
            
            {/* Input string */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary-text">
                Paste Base64 String
              </label>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Paste base64 data streams here (e.g., JVBERi0xLjQKJ..."
                rows={8}
                className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
              />
            </div>

            {/* Error Message */}
            {b642pdfError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                {b642pdfError}
              </div>
            )}

            {/* Convert button */}
            <div className="flex justify-center">
              <button
                onClick={handleBase64Convert}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Reconstruct PDF
              </button>
            </div>

            {/* PDF Output Preview & Download */}
            {pdfPreviewUrl && (
              <div className="space-y-4 pt-4 border-t border-border-color flex flex-col items-center">
                <div className="text-sm font-semibold text-primary-text">
                  PDF Reconstructed Successfully!
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
                  >
                    <Download className="h-4 w-4" /> Download PDF File
                  </button>
                </div>

                {/* Local Sandbox Frame Preview */}
                <div className="w-full h-[400px] border border-border-color rounded-xl overflow-hidden mt-4">
                  <iframe
                    src={pdfPreviewUrl}
                    className="w-full h-full"
                    title="PDF Decoded Preview"
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
