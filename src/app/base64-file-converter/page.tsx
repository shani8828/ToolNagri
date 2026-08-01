"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, FileIcon, Copy, Check, RefreshCw, AlertCircle, Download, FileText, Binary } from "lucide-react";
import confetti from "canvas-confetti";

interface ExtractedFile {
  name: string;
  size: number;
  type: string;
  base64: string;
  dataUrl: string;
}

export default function Base64FileConverter() {
  const [activeMode, setActiveMode] = useState<"encode" | "decode">("encode");
  
  // Encode state
  const [encodedFile, setEncodedFile] = useState<ExtractedFile | null>(null);
  const [outputFormat, setOutputFormat] = useState<"dataurl" | "raw" | "html" | "css">("dataurl");
  const [encodeCopied, setEncodeCopied] = useState(false);
  const [encodeError, setEncodeError] = useState("");

  // Decode state
  const [decodeInput, setDecodeInput] = useState("");
  const [customExtension, setCustomExtension] = useState("txt");
  const [decodeError, setDecodeError] = useState("");
  const [decodeSuccess, setDecodeSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const processFile = (file: File) => {
    setEncodeError("");
    setEncodedFile(null);

    // Limit to 6MB to prevent browser tab freeze
    if (file.size > 6 * 1024 * 1024) {
      setEncodeError("File is too large. Please select a file smaller than 6MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(",")[1] || "";
      
      setEncodedFile({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        base64,
        dataUrl
      });

      confetti({
        particleCount: 15,
        spread: 20,
        origin: { y: 0.8 },
        colors: ["#2563eb", "#10b981"],
      });
    };
    reader.onerror = () => {
      setEncodeError("Failed to read the file locally.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const getEncodeOutputText = (): string => {
    if (!encodedFile) return "";
    switch (outputFormat) {
      case "dataurl":
        return encodedFile.dataUrl;
      case "raw":
        return encodedFile.base64;
      case "html":
        if (encodedFile.type.startsWith("image/")) {
          return `<img src="${encodedFile.dataUrl}" alt="${encodedFile.name}" />`;
        }
        return `<a href="${encodedFile.dataUrl}" download="${encodedFile.name}">Download File</a>`;
      case "css":
        return `background-image: url("${encodedFile.dataUrl}");`;
      default:
        return encodedFile.dataUrl;
    }
  };

  const handleCopyEncoded = () => {
    const text = getEncodeOutputText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setEncodeCopied(true);
    setTimeout(() => setEncodeCopied(false), 2000);
  };

  // Decode Action
  const handleDecode = () => {
    setDecodeError("");
    setDecodeSuccess(false);

    if (!decodeInput.trim()) {
      setDecodeError("Please input a Base64 string to decode.");
      return;
    }

    try {
      let base64String = decodeInput.trim();
      let mimeType = "application/octet-stream";
      let extension = customExtension;

      // Detect if it is a Data URL (e.g. data:image/png;base64,iVBOR...)
      const matches = base64String.match(/^data:([^;]+);base64,(.*)$/);
      if (matches) {
        mimeType = matches[1];
        base64String = matches[2];
        
        // Infer extension from mimetype
        const mimeParts = mimeType.split("/");
        if (mimeParts[1]) {
          extension = mimeParts[1];
          if (extension === "jpeg") extension = "jpg";
          else if (extension === "svg+xml") extension = "svg";
          else if (extension === "plain") extension = "txt";
        }
      }

      // Clean whitespaces or linebreaks that might break atob
      const cleanedBase64 = base64String.replace(/\s/g, "");
      
      // Validate Base64 format by running window.atob
      const binaryString = window.atob(cleanedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `decoded-file.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDecodeSuccess(true);
      setTimeout(() => setDecodeSuccess(false), 3000);

      confetti({
        particleCount: 15,
        spread: 20,
        origin: { y: 0.8 },
        colors: ["#10b981"],
      });

    } catch (err: any) {
      setDecodeError(`Decoding failed: ${err.message}. Ensure the Base64 code matches valid cryptographic boundaries.`);
    }
  };

  const handleReset = () => {
    setEncodedFile(null);
    setEncodeError("");
    setDecodeInput("");
    setDecodeError("");
    setDecodeSuccess(false);
  };

  const howToUse = [
    "Select your target mode: Encode File (to Base64) or Decode Base64 (back to File).",
    "For Encoding: Upload any file (up to 6MB) like images, PDFs, or text documents.",
    "For Decoding: Paste a Base64 text string or full Data URL block into the input area.",
    "Inspect sizes and mime-types or choose a fallback file download format.",
    "Copy code results or trigger a local browser binary download."
  ];

  const benefits = [
    "Supports all file extensions including images, PDFs, archives, and spreadsheets.",
    "Instantly generates HTML tags, CSS url backgrounds, or raw outputs.",
    "Automatically parses Data URL mime-types to infer the download extension.",
    "100% Client-Side calculation operates securely offline."
  ];

  const faqs = [
    {
      question: "Is there a file size limit?",
      answer: "Yes, we limit files to 6MB. Because Base64 encoding expands file size by roughly 33%, processing very large files in the main browser thread can cause performance lag."
    },
    {
      question: "Are my files uploaded to any servers?",
      answer: "No. The entire conversion uses the HTML5 FileReader API directly in your browser memory. Your files are never uploaded, keeping your proprietary documents completely secure."
    }
  ];

  const relatedTools = [
    { name: "URL Encoder / Decoder", url: "/url-encoder-decoder", description: "Encode text keys for URL query scopes." },
    { name: "Hash Generator", url: "/hash-generator", description: "Compute MD5, SHA-1 and SHA-256 hashes." }
  ];

  return (
    <ToolLayout
      title="Base64 File Converter"
      description="Convert any file (images, PDFs, documents) into Base64 Data URLs, or decode Base64 text blocks back into original files for download. 100% client-side."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Mode Selector */}
        <div className="flex rounded-lg border border-border-color p-0.5 bg-background font-semibold w-fit text-xs">
          <button
            onClick={() => { setActiveMode("encode"); handleReset(); }}
            className={`py-1.5 px-4 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeMode === "encode" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> File to Base64 (Encode)
          </button>
          <button
            onClick={() => { setActiveMode("decode"); handleReset(); }}
            className={`py-1.5 px-4 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeMode === "decode" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
            }`}
          >
            <Binary className="h-3.5 w-3.5" /> Base64 to File (Decode)
          </button>
        </div>

        {/* Encode Mode Layout */}
        {activeMode === "encode" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div className="space-y-3.5">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="h-4.5 w-4.5 text-accent" /> Select Source File
              </label>

              {encodedFile ? (
                <div className="border border-border-color rounded-2xl bg-card-bg p-5 space-y-4 min-h-62.5 flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 bg-accent/10 text-accent rounded-xl">
                      <FileIcon className="h-8 w-8" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-bold text-primary-text truncate">{encodedFile.name}</p>
                      <p className="text-xs text-secondary-text font-semibold">{formatSize(encodedFile.size)}</p>
                      <p className="text-[10px] text-accent font-mono bg-accent/5 py-0.5 px-1.5 rounded w-fit border border-accent/10">
                        {encodedFile.type}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-2 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Upload Another File
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-color hover:border-accent rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-card-bg transition-colors min-h-62.5"
                >
                  <Upload className="h-10 w-10 text-secondary-text mb-3 animate-pulse" />
                  <span className="text-sm font-semibold text-primary-text mb-1">Drag & Drop File Here</span>
                  <span className="text-xs text-secondary-text">Select any image, PDF, zip or document (max 6MB)</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Output Display Area */}
            <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
              <div className="space-y-4 w-full">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 block">
                  Base64 Code Results
                </span>

                {encodedFile ? (
                  <div className="space-y-3.5">
                    {/* Format Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary-text uppercase tracking-wider block">Output Format</label>
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value as any)}
                        className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="dataurl">Data URL (Includes prefix & mime-type)</option>
                        <option value="raw">Raw Base64 Code</option>
                        <option value="html">HTML Code Embed</option>
                        <option value="css">CSS url() Definition</option>
                      </select>
                    </div>

                    {/* Text area */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary-text uppercase tracking-wider block">Generated String</label>
                      <textarea
                        readOnly
                        value={getEncodeOutputText()}
                        rows={6}
                        className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-3 py-2 text-xs text-primary-text font-mono focus:outline-none select-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-14 text-center text-xs text-secondary-text italic leading-relaxed">
                    Upload a file on the left to generate its Base64 encoding.
                  </div>
                )}
              </div>

              {encodedFile && (
                <div className="pt-4">
                  <button
                    onClick={handleCopyEncoded}
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-accent hover:bg-accent/90 text-white cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {encodeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {encodeCopied ? "Copied Base64!" : "Copy Code"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Decode Mode Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input area */}
            <div className="space-y-3.5">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">
                Paste Base64 Code
              </label>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Paste raw Base64 strings or full data URLs here (e.g. data:image/png;base64,iVBOR...)"
                rows={11}
                className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
              />
            </div>

            {/* Downloader box */}
            <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
              <div className="space-y-4 w-full">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 block">
                  File Decoder Settings
                </span>

                <div className="space-y-3.5">
                  {/* Extension selection (Fallback in case of raw base64) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary-text uppercase tracking-wider block">
                      Fallback File Extension
                    </label>
                    <select
                      value={customExtension}
                      onChange={(e) => setCustomExtension(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="txt">Text File (.txt)</option>
                      <option value="png">PNG Image (.png)</option>
                      <option value="jpg">JPG Image (.jpg)</option>
                      <option value="pdf">PDF Document (.pdf)</option>
                      <option value="zip">ZIP Archive (.zip)</option>
                      <option value="json">JSON File (.json)</option>
                      <option value="bin">Binary File (.bin)</option>
                    </select>
                    <p className="text-[9px] text-secondary-text font-medium leading-relaxed">
                      * If the pasted Base64 includes a Data URL prefix, the extension is parsed automatically.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <button
                  onClick={handleDecode}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-accent hover:bg-accent/90 text-white cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="h-4 w-4" /> Decode & Save File
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full py-2 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset Inputs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Notifications */}
        {decodeSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3.5 text-sm text-success border border-success/20">
            <Check className="h-4 w-4 shrink-0 font-medium" />
            <span>Base64 decoded successfully! Your file download has started.</span>
          </div>
        )}

        {/* Error notifications */}
        {encodeError && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
            <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
            <span>{encodeError}</span>
          </div>
        )}

        {decodeError && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
            <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
            <span>{decodeError}</span>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
