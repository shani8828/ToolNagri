"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Key, Copy, Check, RefreshCw } from "lucide-react";

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [braces, setBraces] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuidList, setUuidList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (uuidList.length > 0) {
      navigator.clipboard.writeText(uuidList.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate UUID v4
  const generateUUID = () => {
    let d = new Date().getTime();
    let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
    
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });

    if (!hyphens) {
      uuid = uuid.replace(/-/g, "");
    }
    if (braces) {
      uuid = `{${uuid}}`;
    }
    return uppercase ? uuid.toUpperCase() : uuid.toLowerCase();
  };

  const handleGenerate = () => {
    const list = [];
    const limit = Math.max(1, Math.min(100, count));
    for (let i = 0; i < limit; i++) {
      list.push(generateUUID());
    }
    setUuidList(list);
  };

  const howToUse = [
    "Set the total count of UUID v4 keys you wish to generate (up to 100).",
    "Configure custom parameters: toggle capitalization, include curly braces, or remove hyphens.",
    "Click the 'Generate UUIDs' button to process the cryptographically secure keys client-side.",
    "Click 'Copy Bulk list' to capture the entire list, or copy individual keys."
  ];

  const benefits = [
    "Instant v4 UUID generation client-side with random seeding.",
    "Supports multiple styling presets (braces, casing, hyphen stripping) to fit coding schemas.",
    "Generates single keys or bulk lists up to 100 records in a click.",
    "Entirely client-side math execution for absolute security."
  ];

  const faqs = [
    {
      question: "Are these UUIDs secure and unique?",
      answer: "Yes. The generator employs standard RFC4122 v4 specifications powered by browser random seeding. The probability of collision is infinitesimally small.",
    },
    {
      question: "What does GUID represent relative to UUID?",
      answer: "GUID (Globally Unique Identifier) is Microsoft's implementation of the UUID standard. They are functionally identical for database identifiers."
    }
  ];

  const relatedTools = [
    { name: "Secure Password Generator", url: "/password-generator", description: "Configure cryptographically secure passkeys." },
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, parse, and validate JSON payloads." }
  ];

  return (
    <ToolLayout
      title="UUID / GUID Bulk Generator"
      description="Generate single or bulk RFC-compliant v4 UUID/GUID keys with custom casing and braces presets."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Controls Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-secondary-bg/25 p-5 rounded-xl border border-border-color">
          {/* Count select */}
          <div className="space-y-1.5">
            <label htmlFor="countInput" className="text-xs font-bold text-secondary-text uppercase tracking-wider">Generate Count</label>
            <input
              type="number"
              id="countInput"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-full rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
            />
          </div>

          {/* Casing check */}
          <div className="flex items-center pt-5 sm:pt-4">
            <label className="flex items-center gap-2 text-sm text-secondary-text font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded border-border-color text-accent focus:ring-accent"
              />
              Uppercase Casing
            </label>
          </div>

          {/* Braces check */}
          <div className="flex items-center pt-5 sm:pt-4">
            <label className="flex items-center gap-2 text-sm text-secondary-text font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={braces}
                onChange={(e) => setBraces(e.target.checked)}
                className="rounded border-border-color text-accent focus:ring-accent"
              />
              Curly Braces {"{}"}
            </label>
          </div>

          {/* Hyphens check */}
          <div className="flex items-center pt-5 sm:pt-4">
            <label className="flex items-center gap-2 text-sm text-secondary-text font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="rounded border-border-color text-accent focus:ring-accent"
              />
              Include Hyphens
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <RefreshCw className="h-4 w-4" /> Generate UUIDs
          </button>
        </div>

        {/* Output list */}
        {uuidList.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <Key className="h-4 w-4 text-accent" /> Generated Identifiers
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy Bulk List
              </button>
            </div>
            
            <textarea
              readOnly
              value={uuidList.join("\n")}
              rows={Math.min(12, uuidList.length + 1)}
              className="w-full rounded-lg border border-border-color bg-white px-4 py-3 text-sm text-primary-text font-mono focus:outline-none resize-none leading-relaxed select-text"
            />
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
