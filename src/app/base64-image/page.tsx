"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileImage, Copy, Check, Download, Upload, RefreshCw, AlertTriangle } from "lucide-react";

export default function Base64ImageTool() {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  
  // Encode States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [encodedStr, setEncodedStr] = useState("");
  const [imageSize, setImageSize] = useState<string | null>(null);
  
  // Decode States
  const [decodeInput, setDecodeInput] = useState("");
  const [decodedSrc, setDecodedSrc] = useState("");
  
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // FileReader to encode image to Base64
  const handleImageFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Selected file is not an image. Please upload a valid image file.");
      return;
    }

    setImageFile(file);
    setImageSize((file.size / 1024).toFixed(2) + " KB");

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setEncodedStr(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // Decode logic
  const handleDecode = () => {
    setErrorMsg(null);
    setDecodedSrc("");
    
    let trimmedInput = decodeInput.trim();
    if (!trimmedInput) {
      setErrorMsg("Please enter a Base64 string to decode.");
      return;
    }

    // Auto-prepend standard Data URL header if only raw Base64 is pasted
    if (!trimmedInput.startsWith("data:image/")) {
      // Guess image type (default to png if not sure)
      trimmedInput = `data:image/png;base64,${trimmedInput}`;
    }

    setDecodedSrc(trimmedInput);
  };

  const handleDownloadDecoded = () => {
    if (!decodedSrc) return;
    
    // Guess file type from data url
    const matches = decodedSrc.match(/^data:image\/([a-zA-Z+]+);base64,/);
    const ext = matches ? matches[1] : "png";

    const a = document.createElement("a");
    a.href = decodedSrc;
    a.download = `decoded-image.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetAll = () => {
    setImageFile(null);
    setEncodedStr("");
    setImageSize(null);
    setDecodeInput("");
    setDecodedSrc("");
    setErrorMsg(null);
  };

  const howToUse = [
    "Choose 'Encode Image' to convert a local file to Base64, or 'Decode String' to convert a string to a visual image.",
    "For encoding, drag-and-drop or select an image file from your system.",
    "For decoding, paste your Base64 Data URL or string in the input field.",
    "Copy the resulting string output to your clipboard, or click download to save the decoded image graphic."
  ];

  const benefits = [
    "Upload local file types and encode to CSS/HTML inline embeds.",
    "Decodes raw base64 data URLs to instantly reconstruct JPG, PNG, and SVG graphics.",
    "100% browser-side parsing ensuring your media files are never uploaded to any server.",
    "Saves loading overhead by serving files directly inline in CSS variables."
  ];

  const faqs = [
    {
      question: "What is a Base64 Data URL?",
      answer: "A Base64 Data URL is a scheme to embed image media files directly inline inside HTML src tags or CSS stylesheets, formatted as 'data:image/[type];base64,[data]'.",
    },
    {
      question: "Are there image file size limits?",
      answer: "Since processing happens completely client-side in the browser tab memory, we recommend files under 10MB to prevent rendering delays or memory overflows."
    }
  ];

  const relatedTools = [
    { name: "Image Compressor", url: "/image-compressor", description: "Compress images client-side before encoding." },
    { name: "JPG to WebP Converter", url: "/jpg-to-webp", description: "Convert legacy images to lightweight formats." }
  ];

  return (
    <ToolLayout
      title="Base64 Image Encoder & Decoder"
      description="Convert image files into HTML-embeddable Base64 strings, or reconstruct Base64 strings back to visual images."
      category="Image Tools"
      categoryUrl="/#pdf-image"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-border-color gap-4">
          <button
            onClick={() => { setActiveTab("encode"); resetAll(); }}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "encode" ? "border-accent text-accent" : "border-transparent text-secondary-text hover:text-primary-text"
            }`}
          >
            Encode Image to Base64
          </button>
          <button
            onClick={() => { setActiveTab("decode"); resetAll(); }}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "decode" ? "border-accent text-accent" : "border-transparent text-secondary-text hover:text-primary-text"
            }`}
          >
            Decode Base64 to Image
          </button>
        </div>

        {/* Encode Mode */}
        {activeTab === "encode" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
                <FileImage className="h-4.5 w-4.5 text-accent" /> Upload Image File
              </label>
              
              <div 
                className="border-2 border-dashed border-border-color hover:border-accent/50 rounded-2xl p-8 text-center bg-secondary-bg/25 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[220px]"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="h-8 w-8 text-secondary-text mb-3" />
                <p className="text-sm font-semibold text-primary-text">Click to choose image</p>
                <p className="text-xs text-secondary-text mt-1">PNG, JPG, WebP, GIF, or SVG</p>
                {imageFile && (
                  <div className="mt-4 p-2 bg-white border border-border-color rounded-lg text-xs font-mono text-secondary-text">
                    {imageFile.name} ({imageSize})
                  </div>
                )}
              </div>
            </div>

            {/* Base64 Output */}
            <div className="space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-primary-text">Base64 Output String</label>
                  {encodedStr && (
                    <button
                      onClick={() => handleCopy(encodedStr)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy String
                    </button>
                  )}
                </div>
                <textarea
                  readOnly
                  value={encodedStr}
                  placeholder="The Base64 encoded string output will appear here..."
                  rows={8}
                  className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-xs text-primary-text font-mono focus:outline-none resize-none"
                />
              </div>

              {encodedStr && (
                <div className="p-3 bg-white border border-border-color rounded-xl flex items-center gap-3">
                  {/* Small preview block */}
                  <img 
                    src={encodedStr} 
                    alt="Encoded Preview" 
                    className="w-12 h-12 object-contain border border-border-color rounded bg-secondary-bg"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-primary-text">Embed Ready</div>
                    <div className="text-secondary-text">Valid Data URL format string.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Decode Mode */}
        {activeTab === "decode" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-primary-text">
                Paste Base64 Code
              </label>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="data:image/png;base64,iVBORw0KGgoAAA..."
                rows={10}
                className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-xs text-primary-text font-mono focus:border-accent focus:outline-none"
              />
              <div className="flex justify-center">
                <button
                  onClick={handleDecode}
                  className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  Decode to Image
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-primary-text">Decoded Image Preview</label>
                  {decodedSrc && (
                    <button
                      onClick={handleDownloadDecoded}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" /> Download Image
                    </button>
                  )}
                </div>
                
                <div className="border border-border-color rounded-xl bg-secondary-bg/25 min-h-[220px] flex items-center justify-center p-4">
                  {decodedSrc ? (
                    <img
                      src={decodedSrc}
                      alt="Decoded output"
                      className="max-h-[200px] max-w-full object-contain rounded shadow-sm bg-white"
                      onError={() => setErrorMsg("Failed to render decoded image. Invalid Base64 image stream.")}
                    />
                  ) : (
                    <span className="text-xs text-secondary-text">Paste base64 code to see preview</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            {errorMsg}
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
