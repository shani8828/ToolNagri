"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";
import { FileText, Upload, RefreshCw, Download, AlertTriangle, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "letter">("fit");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState<"none" | "small" | "large">("none");
  
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPdfUrl(null);
    const files = e.target.files;
    if (!files) return;

    const newUploaded: UploadedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setError("Only image files (PNG, JPG, WebP, BMP) are supported.");
        continue;
      }
      
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      newUploaded.push({
        id,
        file,
        preview: URL.createObjectURL(file)
      });
    }

    setImages(prev => [...prev, ...newUploaded]);
  };

  const removeImage = (id: string) => {
    setPdfUrl(null);
    setImages(prev => {
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(img => img.id !== id);
    });
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    setPdfUrl(null);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
  };

  // Helper to convert non-standard images (e.g. WebP) to JPEG via Canvas
  const fileToJpgBytes = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context error"));
          return;
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error("Canvas to blob error"));
              return;
            }
            resolve(await blob.arrayBuffer());
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = () => reject(new Error("Failed to load image element"));
      img.src = URL.createObjectURL(file);
    });
  };

  const generatePdf = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setGenerating(true);
    setError(null);
    setPdfUrl(null);

    try {
      const pdfDoc = await PDFDocument.create();

      // Page dimensions in PDF points (1 inch = 72 points)
      // A4: 595.27 x 841.89 points
      // Letter: 612 x 792 points
      const dimensionsMap = {
        a4: { portrait: [595.27, 841.89], landscape: [841.89, 595.27] },
        letter: { portrait: [612, 792], landscape: [792, 612] }
      };

      const marginSizes = {
        none: 0,
        small: 15,
        large: 40
      };

      const mSize = marginSizes[margin];

      for (let i = 0; i < images.length; i++) {
        const { file } = images[i];
        let imageBytes: ArrayBuffer;
        let isPng = file.type === "image/png";
        
        if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg") {
          imageBytes = await file.arrayBuffer();
        } else {
          // Normalize WebP/BMP to JPEG
          imageBytes = await fileToJpgBytes(file);
          isPng = false;
        }

        const embeddedImg = isPng 
          ? await pdfDoc.embedPng(imageBytes)
          : await pdfDoc.embedJpg(imageBytes);

        let pageWidth = embeddedImg.width;
        let pageHeight = embeddedImg.height;

        if (pageSize !== "fit") {
          const dims = dimensionsMap[pageSize][orientation];
          pageWidth = dims[0];
          pageHeight = dims[1];
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Fit image boundaries checking margins
        const contentWidth = pageWidth - mSize * 2;
        const contentHeight = pageHeight - mSize * 2;

        const imgScale = Math.min(
          contentWidth / embeddedImg.width,
          contentHeight / embeddedImg.height
        );

        const drawWidth = embeddedImg.width * imgScale;
        const drawHeight = embeddedImg.height * imgScale;

        // Centered position
        const drawX = mSize + (contentWidth - drawWidth) / 2;
        const drawY = mSize + (contentHeight - drawHeight) / 2;

        page.drawImage(embeddedImg, {
          x: drawX,
          y: drawY,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate PDF. Check if any file is corrupted.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "compiled-images.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const howToUse = [
    "Upload one or multiple images using the file picker (PNG, JPG, WebP, or BMP).",
    "Arrange the page sequence by clicking the Move Up and Move Down buttons.",
    "Adjust page sizing (Fit Image dimensions, A4, or US Letter size), orientation, and page border margins.",
    "Click Compile PDF Document to generate, check the inline browser preview, and download."
  ];

  const benefits = [
    "Compiles scanned receipts, whiteboard drawings, or notes into a single document.",
    "Runs completely locally, meaning confidential visual scans are never transmitted.",
    "Features custom layouts (A4, Letter) with portrait/landscape controls and margins.",
    "Correctly embeds PNG alpha channels and converts WebP/BMP pages automatically."
  ];

  const faqs = [
    {
      question: "Are there limits on image uploads?",
      answer: "No. You can load dozens of images into a single PDF. However, embedding massive high-resolution files will increase the final PDF's output file size.",
    },
    {
      question: "Can I use standard images like WebP?",
      answer: "Yes, our converter automatically converts WebP, BMP, and custom browser graphics into safe JPEG images before drawing them into the PDF."
    }
  ];

  const relatedTools = [
    { name: "Merge PDF Files Online", url: "/pdf-merge", description: "Combine multiple PDF documents." },
    { name: "PDF Page Splitter", url: "/pdf-split", description: "Extract pages from a PDF document." }
  ];

  return (
    <ToolLayout
      title="Image to PDF Converter"
      description="Compile multiple PNG, JPG, JPEG, and WebP images into a single structured PDF file client-side."
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
            <Upload className="h-4.5 w-4.5 text-accent" /> Select Images
          </label>
          <div className="relative border-2 border-dashed border-border-color hover:border-accent rounded-xl p-8 text-center bg-secondary-bg/10 hover:bg-secondary-bg/25 transition-all duration-200 group">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2.5">
              <Upload className="mx-auto h-8 w-8 text-secondary-text group-hover:text-accent transition-colors" />
              <div className="text-sm font-semibold text-primary-text">
                Drag & drop images here, or click to upload multiple
              </div>
              <div className="text-xs text-secondary-text">
                Supports PNG, JPG, JPEG, WebP, BMP
              </div>
            </div>
          </div>
        </div>

        {/* Selected Images List */}
        {images.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              File Order List ({images.length})
            </label>
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border-color bg-secondary-bg/10"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={img.preview}
                      alt="Thumbnail"
                      className="h-10 w-10 object-cover rounded border border-border-color bg-white"
                    />
                    <div className="text-sm font-semibold text-primary-text max-w-xs sm:max-w-md truncate">
                      {img.file.name}
                      <span className="text-xs font-normal text-secondary-text block">
                        {(img.file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, "down")}
                      disabled={idx === images.length - 1}
                      className="p-1 hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-500 cursor-pointer"
                      title="Remove File"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configurations */}
        {images.length > 0 && (
          <div className="bg-secondary-bg/30 p-4 rounded-xl border border-border-color space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Page Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(e.target.value as any); setPdfUrl(null); }}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-sm text-primary-text font-semibold focus:outline-none"
                >
                  <option value="fit">Fit Image Dimensions</option>
                  <option value="a4">A4 Standard</option>
                  <option value="letter">US Letter Standard</option>
                </select>
              </div>

              {/* Orientation */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Orientation</label>
                <select
                  value={orientation}
                  disabled={pageSize === "fit"}
                  onChange={(e) => { setOrientation(e.target.value as any); setPdfUrl(null); }}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-sm text-primary-text font-semibold focus:outline-none disabled:opacity-55"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              {/* Margins */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Margins</label>
                <select
                  value={margin}
                  onChange={(e) => { setMargin(e.target.value as any); setPdfUrl(null); }}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-sm text-primary-text font-semibold focus:outline-none"
                >
                  <option value="none">No Margins (Full Bleed)</option>
                  <option value="small">Small Margin (15pt)</option>
                  <option value="large">Large Margin (40pt)</option>
                </select>
              </div>

            </div>
          </div>
        )}

        {/* Generate Trigger */}
        {images.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={generatePdf}
              disabled={generating}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {generating ? "Compiling PDF..." : "Compile PDF Document"}
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            {error}
          </div>
        )}

        {/* Download & Preview Panel */}
        {pdfUrl && (
          <div className="pt-4 border-t border-border-color flex flex-col items-center space-y-4">
            <div className="text-sm font-semibold text-primary-text">
              PDF Generated Successfully!
            </div>
            
            <button
              onClick={downloadPdf}
              className="flex items-center gap-1.5 px-6 py-3 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <Download className="h-4.5 w-4.5" /> Download PDF File
            </button>

            {/* Embedded Iframe Preview */}
            <div className="w-full h-[400px] border border-border-color rounded-xl overflow-hidden mt-4">
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="Generated PDF Preview"
              />
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
