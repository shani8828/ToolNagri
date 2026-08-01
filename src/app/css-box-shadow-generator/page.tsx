"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Plus, Trash2, Sliders, Layers, Eye } from "lucide-react";
import confetti from "canvas-confetti";

interface ShadowLayer {
  id: string;
  active: boolean;
  inset: boolean;
  hOffset: number;
  vOffset: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

export default function CssBoxShadowGenerator() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    {
      id: "1",
      active: true,
      inset: false,
      hOffset: 0,
      vOffset: 4,
      blur: 6,
      spread: -1,
      color: "#000000",
      opacity: 0.1
    },
    {
      id: "2",
      active: true,
      inset: false,
      hOffset: 0,
      vOffset: 2,
      blur: 4,
      spread: -1,
      color: "#000000",
      opacity: 0.06
    }
  ]);

  const [canvasBgColor, setCanvasBgColor] = useState("#f3f4f6");
  const [cardBgColor, setCardBgColor] = useState("#ffffff");

  const [cssCode, setCssCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number) => {
    let c = hex.substring(1);
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  useEffect(() => {
    const activeLayers = layers.filter((l) => l.active);
    if (activeLayers.length === 0) {
      setCssCode("box-shadow: none;");
      return;
    }

    const shadowStrings = activeLayers.map((l) => {
      const insetStr = l.inset ? "inset " : "";
      const colorStr = hexToRgba(l.color, l.opacity);
      return `${insetStr}${l.hOffset}px ${l.vOffset}px ${l.blur}px ${l.spread}px ${colorStr}`;
    });

    setCssCode(`box-shadow: ${shadowStrings.join(", ")};`);
  }, [layers]);

  const handleAddLayer = () => {
    if (layers.length >= 5) return; // Limit to 5 shadow layers
    setLayers((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        active: true,
        inset: false,
        hOffset: 0,
        vOffset: 8,
        blur: 16,
        spread: -2,
        color: "#000000",
        opacity: 0.08
      }
    ]);
  };

  const handleUpdateLayer = (id: string, key: keyof ShadowLayer, value: any) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, [key]: value } : layer))
    );
  };

  const handleDeleteLayer = (id: string) => {
    if (layers.length <= 1) return;
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
  };

  const handleCopyToClipboard = () => {
    if (!cssCode) return;
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    confetti({
      particleCount: 20,
      spread: 20,
      origin: { y: 0.8 },
      colors: ["#2563eb", "#22c55e"],
    });
  };

  const handleReset = () => {
    setLayers([
      {
        id: "1",
        active: true,
        inset: false,
        hOffset: 0,
        vOffset: 4,
        blur: 6,
        spread: -1,
        color: "#000000",
        opacity: 0.1
      },
      {
        id: "2",
        active: true,
        inset: false,
        hOffset: 0,
        vOffset: 2,
        blur: 4,
        spread: -1,
        color: "#000000",
        opacity: 0.06
      }
    ]);
    setCanvasBgColor("#f3f4f6");
    setCardBgColor("#ffffff");
  };

  // Inline styling for mockup element
  const getShadowStyle = () => {
    const activeLayers = layers.filter((l) => l.active);
    if (activeLayers.length === 0) return { boxShadow: "none", backgroundColor: cardBgColor };

    const shadowStrings = activeLayers.map((l) => {
      const insetStr = l.inset ? "inset " : "";
      const colorStr = hexToRgba(l.color, l.opacity);
      return `${insetStr}${l.hOffset}px ${l.vOffset}px ${l.blur}px ${l.spread}px ${colorStr}`;
    });

    return {
      boxShadow: shadowStrings.join(", "),
      backgroundColor: cardBgColor
    };
  };

  const howToUse = [
    "Verify layer settings or click Add Layer to stack multiple shadows.",
    "Adjust horizontal/vertical offset directions, blur, and spread sizing.",
    "Toggle the Inset parameter if you want an inner card shadow.",
    "Configure custom card background colors and screen backdrop contrasts.",
    "Click Copy CSS to output the full box-shadow properties block."
  ];

  const benefits = [
    "Supports multi-layer stacking (up to 5 separate shadows).",
    "Generates clean standard inset and drop-shadow parameters.",
    "Real-time visual preview frame renders live changes.",
    "100% Client-Side generation keeps style code secure."
  ];

  const faqs = [
    {
      question: "Why stack multiple shadow layers?",
      answer: "Stacking multiple shadows mimics real-world light scattering. Stacking a sharp shadow with a broad, soft shadow creates smooth, premium-feeling volumetric layouts."
    },
    {
      question: "What is the difference between spread and blur?",
      answer: "Blur radius softens and smudges the shadow edges. Spread radius expands or shrinks the actual size of the shadow block before the blur is applied."
    }
  ];

  const relatedTools = [
    { name: "Color Converter", url: "/color-converter", description: "Convert RGB, HEX and HSL color values." },
    { name: "CSS Gradient Generator", url: "/css-gradient-generator", description: "Generate custom linear and radial gradients." }
  ];

  return (
    <ToolLayout
      title="CSS Box-Shadow Generator"
      description="Create visual, multi-layered CSS box shadows. Stack multiple shadow nodes, adjust offsets, blurs, spreads, opacities, and copy ready-to-use CSS rules."
      category="CSS & Design Utilities"
      categoryUrl="/#design"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Workspaces panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls list */}
          <div className="lg:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-5">
            <div className="flex justify-between items-baseline border-b border-border-color pb-1.5">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-accent" /> Box-Shadow Parameters
              </span>
              {layers.length < 5 && (
                <button
                  onClick={handleAddLayer}
                  className="py-1 px-2 text-[10px] font-bold text-white bg-accent hover:bg-accent/90 rounded-md cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Layer
                </button>
              )}
            </div>

            {/* List of layers */}
            <div className="space-y-4 max-h-55 overflow-y-auto pr-1">
              {layers.map((layer, idx) => (
                <div key={layer.id} className="bg-secondary-bg/25 p-4 rounded-xl border border-border-color/60 space-y-3.5 relative">
                  
                  {/* Layer Header */}
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-accent flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" /> Layer #{idx + 1}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-[10px] text-secondary-text hover:text-primary-text cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={layer.inset}
                          onChange={(e) => handleUpdateLayer(layer.id, "inset", e.target.checked)}
                          className="accent-accent h-3.5 w-3.5"
                        />
                        Inset
                      </label>

                      <label className="flex items-center gap-1 text-[10px] text-secondary-text hover:text-primary-text cursor-pointer select-none ml-2">
                        <input
                          type="checkbox"
                          checked={layer.active}
                          onChange={(e) => handleUpdateLayer(layer.id, "active", e.target.checked)}
                          className="accent-accent h-3.5 w-3.5"
                        />
                        Active
                      </label>

                      {layers.length > 1 && (
                        <button
                          onClick={() => handleDeleteLayer(layer.id)}
                          className="text-warning hover:text-warning/80 p-1 rounded hover:bg-hover-bg transition-colors cursor-pointer ml-1"
                          title="Delete Layer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sliders Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    {/* H Offset */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Horizontal Offset</span>
                        <span className="font-mono">{layer.hOffset}px</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={layer.hOffset}
                        onChange={(e) => handleUpdateLayer(layer.id, "hOffset", parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    {/* V Offset */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Vertical Offset</span>
                        <span className="font-mono">{layer.vOffset}px</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={layer.vOffset}
                        onChange={(e) => handleUpdateLayer(layer.id, "vOffset", parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    {/* Blur */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Blur Radius</span>
                        <span className="font-mono">{layer.blur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={layer.blur}
                        onChange={(e) => handleUpdateLayer(layer.id, "blur", parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    {/* Spread */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Spread Radius</span>
                        <span className="font-mono">{layer.spread}px</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={layer.spread}
                        onChange={(e) => handleUpdateLayer(layer.id, "spread", parseInt(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    {/* Color and Opacity */}
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={layer.color}
                        onChange={(e) => handleUpdateLayer(layer.id, "color", e.target.value)}
                        className="h-8 w-8 rounded border border-border-color cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={layer.color}
                        onChange={(e) => handleUpdateLayer(layer.id, "color", e.target.value)}
                        className="w-18 py-1 px-1.5 border border-border-color rounded bg-background text-[10px] font-mono font-bold focus:outline-none text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-secondary-text">
                        <span>Opacity</span>
                        <span className="font-mono">{Math.round(layer.opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={layer.opacity}
                        onChange={(e) => handleUpdateLayer(layer.id, "opacity", parseFloat(e.target.value))}
                        className="w-full h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Custom Palette Preview Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border-color text-xs">
              <div className="space-y-1">
                <label className="text-secondary-text font-bold uppercase tracking-wider block">Mockup Canvas Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={canvasBgColor}
                    onChange={(e) => setCanvasBgColor(e.target.value)}
                    className="h-7 w-7 rounded border border-border-color cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={canvasBgColor}
                    onChange={(e) => setCanvasBgColor(e.target.value)}
                    className="w-18 py-1 px-1 border border-border-color rounded bg-background text-[10px] font-mono font-bold focus:outline-none text-center"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-bold uppercase tracking-wider block">Mockup Box Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={cardBgColor}
                    onChange={(e) => setCardBgColor(e.target.value)}
                    className="h-7 w-7 rounded border border-border-color cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={cardBgColor}
                    onChange={(e) => setCardBgColor(e.target.value)}
                    className="w-18 py-1 px-1 border border-border-color rounded bg-background text-[10px] font-mono font-bold focus:outline-none text-center"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Preview canvas */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-success animate-pulse" /> Shadow Visualizer
              </span>

              {/* Box frame with shadow */}
              <div
                style={{ backgroundColor: canvasBgColor }}
                className="w-full h-44 rounded-xl border border-border-color/65 flex items-center justify-center relative overflow-hidden transition-colors"
              >
                <div
                  style={getShadowStyle()}
                  className="h-20 w-20 rounded-xl transition-all duration-150"
                />
              </div>

              {/* Code display */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider block">CSS Code</span>
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
