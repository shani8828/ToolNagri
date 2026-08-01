"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Plus, Trash2, Sliders, Palette, Eye } from "lucide-react";
import confetti from "canvas-confetti";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

export default function CssGradientGenerator() {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState<number>(135);
  const [radialShape, setRadialShape] = useState<"circle" | "ellipse">("circle");
  
  const [stops, setStops] = useState<ColorStop[]>([
    { id: "1", color: "#2563eb", position: 0 },
    { id: "2", color: "#9333ea", position: 100 }
  ]);

  const [cssCode, setCssCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Sort stops by position ascending
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");

    let gradientRule = "";
    if (gradientType === "linear") {
      gradientRule = `linear-gradient(${angle}deg, ${stopStrings})`;
    } else {
      gradientRule = `radial-gradient(${radialShape} at center, ${stopStrings})`;
    }

    setCssCode(`background: ${gradientRule};`);
  }, [gradientType, angle, radialShape, stops]);

  const handleAddStop = () => {
    if (stops.length >= 8) return; // Limit to 8 stops
    const nextPosition = Math.min(
      100,
      Math.max(0, Math.round(stops[stops.length - 1].position / 2 + 50))
    );
    setStops((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        color: "#3b82f6",
        position: nextPosition
      }
    ]);
  };

  const handleUpdateStop = (id: string, key: keyof ColorStop, value: any) => {
    setStops((prev) =>
      prev.map((stop) => (stop.id === id ? { ...stop, [key]: value } : stop))
    );
  };

  const handleDeleteStop = (id: string) => {
    if (stops.length <= 2) return; // Keep at least 2 stops
    setStops((prev) => prev.filter((stop) => stop.id !== id));
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
      colors: ["#2563eb", "#9333ea"],
    });
  };

  const handleReset = () => {
    setGradientType("linear");
    setAngle(135);
    setRadialShape("circle");
    setStops([
      { id: "1", color: "#2563eb", position: 0 },
      { id: "2", color: "#9333ea", position: 100 }
    ]);
  };

  // Inline preview style helper
  const getPreviewStyle = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");

    if (gradientType === "linear") {
      return { background: `linear-gradient(${angle}deg, ${stopStrings})` };
    }
    return { background: `radial-gradient(${radialShape} at center, ${stopStrings})` };
  };

  const howToUse = [
    "Choose between Linear or Radial gradient direction flow styles.",
    "Adjust the angle dial parameter (for linear) or select a radial center shape.",
    "Drag sliders to change stop locations, or click Add Stop to append a node.",
    "Inspect the dynamic preview canvas showing your colors real-time.",
    "Click Copy CSS to output background properties for your stylesheet."
  ];

  const benefits = [
    "Includes multi-stop color inputs (up to 8 custom colors).",
    "Generates clean standard linear/radial CSS syntax properties.",
    "Real-time visual editor responds instantly as settings change.",
    "100% Client-Side generation keeps style ideas local."
  ];

  const faqs = [
    {
      question: "What is the difference between linear and radial gradients?",
      answer: "Linear gradients blend colors along a straight line at a specified angle. Radial gradients blend colors outward from a center focal point in circular or elliptical patterns."
    },
    {
      question: "Why should I sort color stops?",
      answer: "Sorting color stops from 0% to 100% ensures smooth blending transitions. Overlapping stop positions can create hard lines or unexpected stripes."
    }
  ];

  const relatedTools = [
    { name: "Color Converter", url: "/color-converter", description: "Convert RGB, HEX and HSL color values." },
    { name: "CSS Box-Shadow Generator", url: "/css-box-shadow-generator", description: "Design layered box-shadow styles." }
  ];

  return (
    <ToolLayout
      title="CSS Gradient Generator"
      description="Create visual linear and radial CSS gradients. Add custom color stops, modify angles and shapes, preview gradients in real-time, and copy clean CSS properties."
      category="CSS & Design Utilities"
      categoryUrl="/#design"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Settings panel */}
          <div className="lg:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-5">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-accent" /> Gradient Configurations
            </span>

            {/* Type selector and specific modifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Gradient Type</label>
                <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                  <button
                    onClick={() => setGradientType("linear")}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      gradientType === "linear" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    Linear Flow
                  </button>
                  <button
                    onClick={() => setGradientType("radial")}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      gradientType === "radial" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    Radial Center
                  </button>
                </div>
              </div>

              {gradientType === "linear" ? (
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <label className="font-bold text-secondary-text uppercase tracking-wider">Flow Angle</label>
                    <span className="font-mono font-bold text-accent">{angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Radial Shape</label>
                  <select
                    value={radialShape}
                    onChange={(e) => setRadialShape(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="circle">Circle</option>
                    <option value="ellipse">Ellipse</option>
                  </select>
                </div>
              )}
            </div>

            {/* Color stops editor */}
            <div className="space-y-3.5 pt-3 border-t border-border-color">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Color Stops (2 to 8)</label>
                {stops.length < 8 && (
                  <button
                    onClick={handleAddStop}
                    className="py-1 px-2 text-[10px] font-bold text-white bg-accent hover:bg-accent/90 rounded-md cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Stop
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-55 overflow-y-auto pr-1">
                {stops.map((stop) => (
                  <div key={stop.id} className="flex gap-4 items-center bg-secondary-bg/25 p-2.5 rounded-xl border border-border-color/60">
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => handleUpdateStop(stop.id, "color", e.target.value)}
                        className="h-8 w-8 rounded border border-border-color cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={stop.color}
                        onChange={(e) => handleUpdateStop(stop.id, "color", e.target.value)}
                        className="w-18 py-1 px-1.5 border border-border-color rounded bg-background text-[10px] font-mono font-bold focus:outline-none text-center"
                      />
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) => handleUpdateStop(stop.id, "position", parseInt(e.target.value))}
                        className="flex-1 h-1 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                      <span className="font-mono text-[10px] font-bold text-secondary-text shrink-0 w-8 text-right">
                        {stop.position}%
                      </span>
                    </div>

                    {stops.length > 2 && (
                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="text-warning hover:text-warning/80 p-1 rounded hover:bg-hover-bg transition-colors cursor-pointer shrink-0"
                        title="Delete stop"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Preview Panel */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 items-center gap-1.5 flex">
                <Eye className="h-4 w-4 text-success animate-pulse" /> Gradient Canvas
              </span>

              {/* Visual preview box */}
              <div
                style={getPreviewStyle()}
                className="w-full h-44 rounded-xl border border-border-color/60 shadow-inner flex items-center justify-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Export Rule Box */}
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
                {copied ? "Copied CSS!" : "Copy CSS"}
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
