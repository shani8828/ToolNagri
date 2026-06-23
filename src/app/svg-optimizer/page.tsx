"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Code2, Copy, Check, Download, Info, AlertTriangle } from "lucide-react";

export default function SvgOptimizer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Compression Stats
  const [stats, setStats] = useState<{ original: number; optimized: number; savings: number } | null>(null);

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-graphic.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // SVG Optimization algorithm
  const optimizeSVG = (svgStr: string) => {
    let optimized = svgStr.trim();

    // 1. Remove comments
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, "");

    // 2. Remove metadata blocks (frequently inserted by Illustrator, Inkscape)
    optimized = optimized.replace(/<metadata>[\s\S]*?<\/metadata>/gi, "");
    optimized = optimized.replace(/<sodipodi:namedview[\s\S]*?\/>/gi, "");

    // 3. Remove editor namespaces attributes
    optimized = optimized.replace(/xmlns:odn="[^"]*"/gi, "");
    optimized = optimized.replace(/xmlns:inkscape="[^"]*"/gi, "");
    optimized = optimized.replace(/xmlns:sodipodi="[^"]*"/gi, "");
    optimized = optimized.replace(/inkscape:[a-z-]+="[^"]*"/gi, "");
    optimized = optimized.replace(/sodipodi:[a-z-]+="[^"]*"/gi, "");

    // 4. Remove empty tags
    optimized = optimized.replace(/<g><\/g>/g, "");

    // 5. Compress spacing/newlines
    optimized = optimized.replace(/\s+/g, " ");
    optimized = optimized.replace(/> </g, "><");

    return optimized.trim();
  };

  const handleOptimize = () => {
    setErrorMsg(null);
    setStats(null);
    setOutputText("");

    const cleanInput = inputText.trim();
    if (!cleanInput) {
      setErrorMsg("Input area is empty. Please enter SVG code.");
      return;
    }

    if (!cleanInput.toLowerCase().startsWith("<svg") && !cleanInput.toLowerCase().includes("<svg")) {
      setErrorMsg("Invalid data. Input does not appear to contain a valid XML <svg> wrapper tag.");
      return;
    }

    try {
      const result = optimizeSVG(cleanInput);
      setOutputText(result);
      
      const origSize = new Blob([cleanInput]).size;
      const optSize = new Blob([result]).size;
      const savings = origSize > 0 ? ((origSize - optSize) / origSize) * 100 : 0;
      
      setStats({
        original: origSize,
        optimized: optSize,
        savings: Number(savings.toFixed(1))
      });
    } catch (err: any) {
      setErrorMsg(`Optimization failed: ${err.message}`);
    }
  };

  const howToUse = [
    "Paste your raw SVG code, or open an SVG file in a text editor and copy its contents.",
    "Paste it into the XML input area on the left.",
    "Click the 'Optimize SVG' button to run cleanup operations client-side.",
    "Review the live graphic preview and the size reduction metrics, then copy or download the optimized SVG."
  ];

  const benefits = [
    "Reduces SVG file payload sizes by stripping redundant namespaces, editor metadata, and comments.",
    "Renders a live image canvas preview to check for rendering errors.",
    "Calculates precise byte compression savings and optimization ratios in real-time.",
    "Processes all vector graphics locally ensuring full data security."
  ];

  const faqs = [
    {
      question: "Will optimization remove visual elements from my vector graphics?",
      answer: "No. The optimizer only removes non-rendering metadata, XML namespaces, comments, and white spaces added by design programs (like Adobe Illustrator or Inkscape). Paths and nodes remain untouched.",
    },
    {
      question: "Can I use the output SVG directly in my HTML code?",
      answer: "Yes. The optimized string is a standard, clean inline XML string that can be pasted directly into HTML tags or used as inline background templates in CSS."
    }
  ];

  const relatedTools = [
    { name: "Image Compressor", url: "/image-compressor", description: "Reduce raster image file sizes." },
    { name: "Color Space Converter", url: "/color-converter", description: "Convert color formats and codes." }
  ];

  return (
    <ToolLayout
      title="SVG Code Optimizer & Viewer"
      description="Minify raw SVG vectors, optimize XML paths, strip layout metadata, and preview rendering changes."
      category="Image Tools"
      categoryUrl="/#pdf-image"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Panel */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary-text">
                Input SVG XML Code
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder='<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><!-- Illustrator comments --><circle cx="50" cy="50" r="40" fill="#2563eb" /></svg>'
                rows={10}
                className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-xs text-primary-text font-mono focus:border-accent focus:outline-none"
              />
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleOptimize}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Optimize SVG
              </button>
            </div>
          </div>

          {/* Right: Output Code & Preview */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-primary-text">Optimized SVG Output</label>
                {outputText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                    >
                      <Download className="h-3 w-3" /> Download
                    </button>
                  </div>
                )}
              </div>
              <textarea
                readOnly
                value={outputText}
                placeholder="Optimized code will appear here..."
                rows={6}
                className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-xs text-primary-text font-mono focus:outline-none resize-none"
              />
            </div>

            {/* Live Preview & Stats */}
            {outputText && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Preview Box */}
                <div className="border border-border-color rounded-xl p-4 bg-secondary-bg/25 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider mb-2">Live Rendering</span>
                  <div 
                    className="max-h-[120px] max-w-full overflow-hidden flex items-center justify-center bg-white border border-border-color/40 p-2 rounded shadow-xs"
                    dangerouslySetInnerHTML={{ __html: outputText }}
                  />
                </div>

                {/* Stats Box */}
                {stats && (
                  <div className="border border-border-color rounded-xl p-4 bg-secondary-bg/25 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">Compression Savings</span>
                      <div className="text-2xl font-heading font-extrabold text-success mt-1">
                        {stats.savings}% Saved
                      </div>
                    </div>
                    <div className="text-xs text-secondary-text space-y-0.5">
                      <div>Original: <strong className="text-primary-text font-mono">{stats.original} B</strong></div>
                      <div>Optimized: <strong className="text-primary-text font-mono">{stats.optimized} B</strong></div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

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
