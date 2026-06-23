"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Palette, Copy, Check, Info } from "lucide-react";

// Standard Tailwind CSS Colors mapping
const TAILWIND_COLORS: Record<string, string> = {
  // Slate
  "slate-50": "#f8fafc", "slate-100": "#f1f5f9", "slate-200": "#e2e8f0", "slate-300": "#cbd5e1",
  "slate-400": "#94a3b8", "slate-500": "#64748b", "slate-600": "#475569", "slate-700": "#334155",
  "slate-800": "#1e293b", "slate-900": "#0f172a", "slate-950": "#020617",
  // Gray
  "gray-50": "#f9fafb", "gray-100": "#f3f4f6", "gray-200": "#e5e7eb", "gray-300": "#d1d5db",
  "gray-400": "#9ca3af", "gray-500": "#6b7280", "gray-600": "#4b5563", "gray-700": "#374151",
  "gray-800": "#1f2937", "gray-900": "#111827", "gray-950": "#030712",
  // Zinc
  "zinc-50": "#fafafa", "zinc-100": "#f4f4f5", "zinc-200": "#e4e4e7", "zinc-300": "#d4d4d8",
  "zinc-400": "#a1a1aa", "zinc-500": "#71717a", "zinc-600": "#52525b", "zinc-700": "#3f3f46",
  "zinc-800": "#27272a", "zinc-900": "#18181b", "zinc-950": "#09090b",
  // Neutral
  "neutral-50": "#fafafa", "neutral-100": "#f5f5f5", "neutral-200": "#e5e5e5", "neutral-300": "#d4d4d4",
  "neutral-400": "#a3a3a3", "neutral-500": "#737373", "neutral-600": "#525252", "neutral-700": "#404040",
  "neutral-800": "#262626", "neutral-900": "#171717", "neutral-950": "#0a0a0a",
  // Stone
  "stone-50": "#fafaf9", "stone-100": "#f5f5f4", "stone-200": "#e7e5e4", "stone-300": "#d6d3d1",
  "stone-400": "#a8a29e", "stone-500": "#78716c", "stone-600": "#57534e", "stone-700": "#44403c",
  "stone-800": "#292524", "stone-900": "#1c1917", "stone-950": "#0c0a09",
  // Red
  "red-50": "#fef2f2", "red-100": "#fee2e2", "red-200": "#fecaca", "red-300": "#fca5a5",
  "red-400": "#f87171", "red-500": "#ef4444", "red-600": "#dc2626", "red-700": "#b91c1c",
  "red-800": "#991b1b", "red-900": "#7f1d1d", "red-950": "#450a0a",
  // Orange
  "orange-50": "#fff7ed", "orange-100": "#ffedd5", "orange-200": "#fed7aa", "orange-300": "#fdbb2f",
  "orange-400": "#fb923c", "orange-500": "#f97316", "orange-600": "#ea580c", "orange-700": "#c2410c",
  "orange-800": "#9a3412", "orange-900": "#7c2d12", "orange-950": "#431407",
  // Amber
  "amber-50": "#fffbeb", "amber-100": "#fef3c7", "amber-200": "#fde68a", "amber-300": "#fcd34d",
  "amber-400": "#fbbf24", "amber-500": "#f59e0b", "amber-600": "#d97706", "amber-700": "#b45309",
  "amber-800": "#92400e", "amber-900": "#78350f", "amber-950": "#451a03",
  // Yellow
  "yellow-50": "#fefce8", "yellow-100": "#fef9c3", "yellow-200": "#fef08a", "yellow-300": "#fde047",
  "yellow-400": "#facc15", "yellow-500": "#eab308", "yellow-600": "#ca8a04", "yellow-700": "#a16207",
  "yellow-800": "#854d0e", "yellow-900": "#713f12", "yellow-950": "#422006",
  // Lime
  "lime-50": "#f7fee7", "lime-100": "#ecfccb", "lime-200": "#d9f99d", "lime-300": "#bef264",
  "lime-400": "#a3e635", "lime-500": "#84cc16", "lime-600": "#65a30d", "lime-700": "#4d7c0f",
  "lime-800": "#3f6212", "lime-900": "#365314", "lime-950": "#1a2e05",
  // Green
  "green-50": "#f0fdf4", "green-100": "#dcfce7", "green-200": "#bbf7d0", "green-300": "#86efac",
  "green-400": "#4ade80", "green-500": "#22c55e", "green-600": "#16a34a", "green-700": "#15803d",
  "green-800": "#166534", "green-900": "#14532d", "green-950": "#052e16",
  // Emerald
  "emerald-50": "#ecfdf5", "emerald-100": "#d1fae5", "emerald-200": "#a7f3d0", "emerald-300": "#6ee7b7",
  "emerald-400": "#34d399", "emerald-500": "#10b981", "emerald-600": "#059669", "emerald-700": "#047857",
  "emerald-800": "#065f46", "emerald-900": "#064e3b", "emerald-950": "#022c22",
  // Teal
  "teal-50": "#f0fdfa", "teal-100": "#ccfbf1", "teal-200": "#99f6e4", "teal-300": "#5eead4",
  "teal-400": "#2dd4bf", "teal-500": "#14b8a6", "teal-600": "#0d9488", "teal-700": "#0f766e",
  "teal-800": "#115e59", "teal-900": "#134e4a", "teal-950": "#042f2e",
  // Cyan
  "cyan-50": "#ecfeff", "cyan-100": "#cffafe", "cyan-200": "#a5f3fc", "cyan-300": "#67e8f9",
  "cyan-400": "#22d3ee", "cyan-500": "#06b6d4", "cyan-600": "#0891b2", "cyan-700": "#0e7490",
  "cyan-800": "#155e75", "cyan-900": "#164e63", "cyan-950": "#083344",
  // Sky
  "sky-50": "#f0f9ff", "sky-100": "#e0f2fe", "sky-200": "#bae6fd", "sky-300": "#7dd3fc",
  "sky-400": "#38bdf8", "sky-500": "#0ea5e9", "sky-600": "#0284c7", "sky-700": "#0369a1",
  "sky-800": "#075985", "sky-900": "#0c4a6e", "sky-950": "#082f49",
  // Blue
  "blue-50": "#eff6ff", "blue-100": "#dbeafe", "blue-200": "#bfdbfe", "blue-300": "#93c5fd",
  "blue-400": "#60a5fa", "blue-500": "#3b82f6", "blue-600": "#2563eb", "blue-700": "#1d4ed8",
  "blue-800": "#1e40af", "blue-900": "#1e3a8a", "blue-950": "#172554",
  // Indigo
  "indigo-50": "#eef2ff", "indigo-100": "#e0e7ff", "indigo-200": "#c7d2fe", "indigo-300": "#a5b4fc",
  "indigo-400": "#818cf8", "indigo-500": "#6366f1", "indigo-600": "#4f46e5", "indigo-700": "#3730a3",
  "indigo-800": "#312e81", "indigo-900": "#1e1b4b", "indigo-950": "#0f0f35",
  // Violet
  "violet-50": "#f5f3ff", "violet-100": "#ede9fe", "violet-200": "#ddd6fe", "violet-300": "#c4b5fd",
  "violet-400": "#a78bfa", "violet-500": "#8b5cf6", "violet-600": "#7c3aed", "violet-700": "#6d28d9",
  "violet-800": "#5b21b6", "violet-900": "#4c1d95", "violet-950": "#2e1065",
  // Purple
  "purple-50": "#faf5ff", "purple-100": "#f3e8ff", "purple-200": "#e9d5ff", "purple-300": "#d8b4fe",
  "purple-400": "#c084fc", "purple-500": "#a855f7", "purple-600": "#9333ea", "purple-700": "#7e22ce",
  "purple-800": "#6b21a8", "purple-900": "#581c87", "purple-950": "#3b0764",
  // Fuchsia
  "fuchsia-50": "#fdf4ff", "fuchsia-100": "#fae8ff", "fuchsia-200": "#f5d0fe", "fuchsia-300": "#f0abfc",
  "fuchsia-400": "#e879f9", "fuchsia-500": "#d946ef", "fuchsia-600": "#c026d3", "fuchsia-700": "#a21caf",
  "fuchsia-800": "#86198f", "fuchsia-900": "#701a75", "fuchsia-950": "#4a044e",
  // Pink
  "pink-50": "#fdf2f8", "pink-100": "#fce7f3", "pink-200": "#fbcfe8", "pink-300": "#f472b6",
  "pink-400": "#f472b6", "pink-500": "#ec4899", "pink-600": "#db2777", "pink-700": "#be185d",
  "pink-800": "#9d174d", "pink-900": "#831843", "pink-950": "#500724",
  // Rose
  "rose-50": "#fff1f2", "rose-100": "#ffe4e6", "rose-200": "#fecdd3", "rose-300": "#fda4af",
  "rose-400": "#fb7185", "rose-500": "#f43f5e", "rose-600": "#e11d48", "rose-700": "#be123c",
  "rose-800": "#9f1239", "rose-900": "#881337", "rose-950": "#4c0519"
};

// Helpers for color conversions
function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number) {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const rh = clamp(r).toString(16).padStart(2, "0");
  const gh = clamp(g).toString(16).padStart(2, "0");
  const bh = clamp(b).toString(16).padStart(2, "0");
  return `#${rh}${gh}${bh}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r = l;
  let g = l;
  let b = l;

  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Calculate relative luminance for WCAG calculations
function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate color distance in RGB space to map closest Tailwind color
function getClosestTailwind(r: number, g: number, b: number) {
  let closestName = "";
  let minDistance = Infinity;

  Object.entries(TAILWIND_COLORS).forEach(([name, hex]) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      const distance = Math.sqrt(
        Math.pow(rgb.r - r, 2) +
        Math.pow(rgb.g - g, 2) +
        Math.pow(rgb.b - b, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestName = name;
      }
    }
  });

  return { name: closestName, hex: TAILWIND_COLORS[closestName] };
}

export default function ColorConverter() {
  const [colorInput, setColorInput] = useState("#2563eb");
  const [hexVal, setHexVal] = useState("#2563eb");
  const [rgbVal, setRgbVal] = useState({ r: 37, g: 99, b: 235 });
  const [hslVal, setHslVal] = useState({ h: 221, s: 83, l: 53 });
  const [closestTailwind, setClosestTailwind] = useState({ name: "blue-600", hex: "#2563eb" });

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Synchronize color representations
  useEffect(() => {
    // Check if it is a valid hex color
    const cleanHex = colorInput.trim();
    if (/^#?([a-f\d]{3}){1,2}$/i.test(cleanHex)) {
      const formattedHex = cleanHex.startsWith("#") ? cleanHex : `#${cleanHex}`;
      setHexVal(formattedHex);
      const rgb = hexToRgb(formattedHex);
      if (rgb) {
        setRgbVal(rgb);
        setHslVal(rgbToHsl(rgb.r, rgb.g, rgb.b));
        setClosestTailwind(getClosestTailwind(rgb.r, rgb.g, rgb.b));
      }
    }
  }, [colorInput]);

  // Handle RGB slide changes
  const handleRgbChange = (key: "r" | "g" | "b", val: number) => {
    const updated = { ...rgbVal, [key]: val };
    setRgbVal(updated);
    const hex = rgbToHex(updated.r, updated.g, updated.b);
    setHexVal(hex);
    setColorInput(hex);
    setHslVal(rgbToHsl(updated.r, updated.g, updated.b));
    setClosestTailwind(getClosestTailwind(updated.r, updated.g, updated.b));
  };

  // WCAG Accessibility Score
  const bgLuminance = getLuminance(rgbVal.r, rgbVal.g, rgbVal.b);
  const whiteContrast = (1 + 0.05) / (bgLuminance + 0.05);
  const blackContrast = (bgLuminance + 0.05) / (0 + 0.05);

  const textContrastWhite = whiteContrast >= 4.5 ? "AAA" : whiteContrast >= 3 ? "AA" : "Fail";
  const textContrastBlack = blackContrast >= 4.5 ? "AAA" : blackContrast >= 3 ? "AA" : "Fail";

  const howToUse = [
    "Enter a custom HEX color code, or modify the red, green, and blue slider bars.",
    "Observe real-time color translations across HEX, RGB, HSL, and closest Tailwind color schemas.",
    "Review contrast accessibility ratios for white and black typography overlays.",
    "Click the copy button adjacent to any calculated value to append it to your project clipboard."
  ];

  const benefits = [
    "Real-time color parameter conversion on the client side.",
    "Automatic mapping to the closest Tailwind CSS color naming convention (e.g. blue-600).",
    "Built-in WCAG contrast accessibility reports for black/white text visibility.",
    "Single-click copy utility for fast development integration."
  ];

  const faqs = [
    {
      question: "How is the closest Tailwind CSS color determined?",
      answer: "The tool converts the input color into RGB space and compares it using Euclidean distance against the values of all standard Tailwind CSS palette codes (50-950). The closest coordinate distance matches the named color.",
    },
    {
      question: "What do the WCAG AA and AAA ratings represent?",
      answer: "AA rating requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. AAA rating is more strict, requiring a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text.",
    }
  ];

  const relatedTools = [
    { name: "QR Code Generator", url: "/qr-generator", description: "Design QR tags with customized colors." },
    { name: "SVG Code Optimizer", url: "/svg-optimizer", description: "View and optimize vector graphic code markup." }
  ];

  return (
    <ToolLayout
      title="Color Space Converter"
      description="Translate color values across HEX, RGB, and HSL spaces, find closest Tailwind CSS names, and test contrast scores."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Color Picker & Sliders */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-2">
              <label htmlFor="hexInput" className="text-sm font-semibold text-primary-text">
                HEX Color Value
              </label>
              <div className="flex gap-2">
                <div 
                  className="w-11 h-11 rounded-lg border border-border-color shrink-0 transition-transform shadow-xs" 
                  style={{ backgroundColor: hexVal }}
                />
                <input
                  type="text"
                  id="hexInput"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="#ffffff"
                  className="w-full rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* RGB Sliders */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-secondary-text">
                  <span>Red (R)</span>
                  <span className="font-mono">{rgbVal.r}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbVal.r}
                  onChange={(e) => handleRgbChange("r", parseInt(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer h-1.5 bg-border-color rounded-lg appearance-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-secondary-text">
                  <span>Green (G)</span>
                  <span className="font-mono">{rgbVal.g}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbVal.g}
                  onChange={(e) => handleRgbChange("g", parseInt(e.target.value))}
                  className="w-full accent-green-500 cursor-pointer h-1.5 bg-border-color rounded-lg appearance-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-secondary-text">
                  <span>Blue (B)</span>
                  <span className="font-mono">{rgbVal.b}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbVal.b}
                  onChange={(e) => handleRgbChange("b", parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-border-color rounded-lg appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Conversions Output */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
              <Palette className="h-4 w-4 text-accent" /> Translated Code References
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* HEX Card */}
              <div className="p-4 rounded-xl border border-border-color bg-secondary-bg/25 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">HEX Code</span>
                  <div className="font-mono text-base font-bold text-primary-text mt-0.5">{hexVal}</div>
                </div>
                <button
                  onClick={() => handleCopy(hexVal, "hex")}
                  className="p-2 hover:bg-hover-bg text-secondary-text hover:text-primary-text rounded-lg transition-colors cursor-pointer"
                  title="Copy HEX"
                >
                  {copiedText === "hex" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* RGB Card */}
              <div className="p-4 rounded-xl border border-border-color bg-secondary-bg/25 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">RGB Code</span>
                  <div className="font-mono text-base font-bold text-primary-text mt-0.5">
                    rgb({rgbVal.r}, {rgbVal.g}, {rgbVal.b})
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`, "rgb")}
                  className="p-2 hover:bg-hover-bg text-secondary-text hover:text-primary-text rounded-lg transition-colors cursor-pointer"
                  title="Copy RGB"
                >
                  {copiedText === "rgb" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* HSL Card */}
              <div className="p-4 rounded-xl border border-border-color bg-secondary-bg/25 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">HSL Code</span>
                  <div className="font-mono text-base font-bold text-primary-text mt-0.5">
                    hsl({hslVal.h}, {hslVal.s}%, {hslVal.l}%)
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`, "hsl")}
                  className="p-2 hover:bg-hover-bg text-secondary-text hover:text-primary-text rounded-lg transition-colors cursor-pointer"
                  title="Copy HSL"
                >
                  {copiedText === "hsl" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* Tailwind CSS Card */}
              <div className="p-4 rounded-xl border border-border-color bg-secondary-bg/25 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">Tailwind Name (Closest)</span>
                  <div className="font-mono text-base font-bold text-primary-text mt-0.5 flex items-center gap-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-border-color/60 shrink-0" 
                      style={{ backgroundColor: closestTailwind.hex }}
                    />
                    {closestTailwind.name}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(closestTailwind.name, "tw")}
                  className="p-2 hover:bg-hover-bg text-secondary-text hover:text-primary-text rounded-lg transition-colors cursor-pointer"
                  title="Copy Tailwind CSS class name"
                >
                  {copiedText === "tw" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

            </div>

            {/* Accessibility / Contrast scores */}
            <div className="p-5 rounded-xl border border-border-color bg-secondary-bg/15 space-y-4">
              <h4 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1">
                <Info className="h-4 w-4 text-accent" /> WCAG Typography Contrast Test
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* White text test */}
                <div 
                  className="p-4 rounded-lg flex flex-col justify-between h-20 transition-all border border-border-color/30"
                  style={{ backgroundColor: hexVal, color: "#ffffff" }}
                >
                  <span className="text-xs font-semibold">White Text Overlay</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs opacity-80">Ratio: {whiteContrast.toFixed(2)}:1</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${whiteContrast >= 4.5 ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"}`}>
                      {textContrastWhite}
                    </span>
                  </div>
                </div>

                {/* Black text test */}
                <div 
                  className="p-4 rounded-lg flex flex-col justify-between h-20 transition-all border border-border-color/30"
                  style={{ backgroundColor: hexVal, color: "#000000" }}
                >
                  <span className="text-xs font-semibold">Black Text Overlay</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs opacity-80">Ratio: {blackContrast.toFixed(2)}:1</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${blackContrast >= 4.5 ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"}`}>
                      {textContrastBlack}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
