"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Eye, Sliders, Settings } from "lucide-react";
import confetti from "canvas-confetti";

export default function BorderRadiusPreviewer() {
  const [organicMode, setOrganicMode] = useState(false);

  // Simple mode corner radii (0-100%)
  const [topLeft, setTopLeft] = useState(30);
  const [topRight, setTopRight] = useState(70);
  const [bottomRight, setBottomRight] = useState(40);
  const [bottomLeft, setBottomLeft] = useState(60);

  // Organic mode horizontal / vertical radii (0-100%)
  const [tlh, setTlh] = useState(30);
  const [trh, setTrh] = useState(70);
  const [brh, setBrh] = useState(70);
  const [blh, setBlh] = useState(30);
  
  const [tlv, setTlv] = useState(30);
  const [trv, setTrv] = useState(30);
  const [brv, setBrv] = useState(70);
  const [blv, setBlv] = useState(70);

  const [cssCode, setCssCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let rule = "";
    if (!organicMode) {
      rule = `${topLeft}% ${100 - topLeft}% ${bottomRight}% ${100 - bottomRight}% / ${bottomLeft}% ${topRight}% ${100 - topRight}% ${100 - bottomLeft}%`;
      // Alternatively, simple format: `${topLeft}% ${topRight}% ${bottomRight}% ${bottomLeft}%`
      // Let's use the standard simple corner format for Simple Mode as it is cleaner:
      rule = `${topLeft}% ${topRight}% ${bottomRight}% ${bottomLeft}%`;
    } else {
      // 8-value syntax format: tlh trh brh blh / tlv trv brv blv
      rule = `${tlh}% ${100 - tlh}% ${brh}% ${100 - brh}% / ${tlv}% ${trv}% ${100 - trv}% ${100 - tlv}%`;
    }
    setCssCode(`border-radius: ${rule};`);
  }, [organicMode, topLeft, topRight, bottomRight, bottomLeft, tlh, trh, brh, blh, tlv, trv, brv, blv]);

  const handleCopyToClipboard = () => {
    if (!cssCode) return;
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    confetti({
      particleCount: 20,
      spread: 20,
      origin: { y: 0.8 },
      colors: ["#2563eb", "#9333ea"],
    });
  };

  const handleReset = () => {
    setOrganicMode(false);
    setTopLeft(30);
    setTopRight(70);
    setBottomRight(40);
    setBottomLeft(60);
    setTlh(30);
    setTrh(70);
    setBrh(70);
    setBlh(30);
    setTlv(30);
    setTrv(30);
    setBrv(70);
    setBlv(70);
  };

  const howToUse = [
    "Select your target configuration mode (Simple Corner vs. Organic Shape).",
    "Drag sliders to adjust corner radii (or individual horizontal/vertical ratios).",
    "Examine the morphing canvas block showing your generated CSS shape live.",
    "Click Copy CSS to output the rule properties block to your stylesheet."
  ];

  const benefits = [
    "Supports both standard corner rounding and 8-point organic shapes.",
    "Renders a live dynamic preview container that morphs instantly.",
    "Generates clean copy-pasteable W3C border-radius syntax rules.",
    "100% Client-Side previewer operates securely offline."
  ];

  const faqs = [
    {
      question: "What is an 8-point border-radius?",
      answer: "Normally, border-radius sets symmetric corner curves. The 8-value syntax (`horizontal / vertical`) separates horizontal and vertical radius vectors, allowing designers to create organic shapes like drops, eggs, and smooth blobs."
    },
    {
      question: "Which browsers support the 8-value syntax?",
      answer: "All modern browsers (Chrome, Safari, Firefox, Edge, Opera) support the 8-value border-radius slash syntax natively."
    }
  ];

  const relatedTools = [
    { name: "CSS Box-Shadow Generator", url: "/css-box-shadow-generator", description: "Design multi-layered card shadows." },
    { name: "CSS Gradient Generator", url: "/css-gradient-generator", description: "Generate linear and radial gradients." }
  ];

  return (
    <ToolLayout
      title="Border Radius Previewer"
      description="Design custom container borders and morphing organic shapes. Adjust corner parameters, compile 8-value border-radius configurations, and export copy-pasteable CSS properties."
      category="CSS & Design Utilities"
      categoryUrl="/#design"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls Panel */}
          <div className="lg:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-5">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-accent" /> Border Parameters
            </span>

            {/* Mode switch */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Editor Mode</label>
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                <button
                  onClick={() => setOrganicMode(false)}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    !organicMode ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  Simple Corners (4 Values)
                </button>
                <button
                  onClick={() => setOrganicMode(true)}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    organicMode ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  Organic Shape (8 Values)
                </button>
              </div>
            </div>

            {/* Sliders Area */}
            {!organicMode ? (
              // Simple Sliders
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-secondary-text">
                    <span>Top-Left Corner</span>
                    <span className="font-mono">{topLeft}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={topLeft}
                    onChange={(e) => setTopLeft(parseInt(e.target.value))}
                    className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-secondary-text">
                    <span>Top-Right Corner</span>
                    <span className="font-mono">{topRight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={topRight}
                    onChange={(e) => setTopRight(parseInt(e.target.value))}
                    className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-secondary-text">
                    <span>Bottom-Right Corner</span>
                    <span className="font-mono">{bottomRight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bottomRight}
                    onChange={(e) => setBottomRight(parseInt(e.target.value))}
                    className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-secondary-text">
                    <span>Bottom-Left Corner</span>
                    <span className="font-mono">{bottomLeft}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bottomLeft}
                    onChange={(e) => setBottomLeft(parseInt(e.target.value))}
                    className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              </div>
            ) : (
              // Organic Sliders (8 Values)
              <div className="space-y-4">
                
                {/* Horizontal Ratios */}
                <div className="space-y-3.5">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                    <Settings className="h-3.5 w-3.5" /> Horizontal Axes
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Top Left (H)</span>
                        <span className="font-mono">{tlh}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={tlh}
                        onChange={(e) => setTlh(parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Top Right (H)</span>
                        <span className="font-mono">{trh}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={trh}
                        onChange={(e) => setTrh(parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Bottom Right (H)</span>
                        <span className="font-mono">{brh}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={brh}
                        onChange={(e) => setBrh(parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Bottom Left (H)</span>
                        <span className="font-mono">{blh}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={blh}
                        onChange={(e) => setBlh(parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* Vertical Ratios */}
                <div className="space-y-3.5 pt-3 border-t border-border-color/60">
                  <span className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                    <Settings className="h-3.5 w-3.5" /> Vertical Axes
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Top Left (V)</span>
                        <span className="font-mono">{tlv}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={tlv}
                        onChange={(e) => setTlv(parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Top Right (V)</span>
                        <span className="font-mono">{trv}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={trv}
                        onChange={(e) => setTrv(parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Bottom Right (V)</span>
                        <span className="font-mono">{brv}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={brv}
                        onChange={(e) => setBrv(parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Bottom Left (V)</span>
                        <span className="font-mono">{blv}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={blv}
                        onChange={(e) => setBlv(parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-success animate-pulse" /> Live Shape Morpher
              </span>

              {/* Morphing element */}
              <div className="w-full h-44 rounded-xl border border-border-color/60 bg-secondary-bg/20 flex items-center justify-center relative overflow-hidden">
                <div
                  style={{ borderRadius: cssCode.replace("border-radius: ", "").replace(";", "") }}
                  className="h-28 w-28 bg-linear-to-tr from-accent to-success shadow-md transition-all duration-150"
                />
              </div>

              {/* CSS Code Box */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider block">CSS Rule</span>
                <pre className="bg-secondary-bg/30 p-2.5 rounded-lg border border-border-color/40 font-mono text-[10px] text-primary-text whitespace-pre-wrap leading-normal select-all">
                  {cssCode}
                </pre>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleCopyToClipboard}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-accent hover:bg-accent/90 text-white cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied CSS!" : "Copy CSS Code"}
              </button>
            </div>
          </div>
        </div>

        {/* Start over trigger */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Start Over
          </button>
        </div>

      </div>
    </ToolLayout>
  );
}
