"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Check, Copy, AlertCircle, Sparkles, FileText, Minimize2 } from "lucide-react";

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    valid: boolean;
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const handleFormat = () => {
    if (!jsonInput.trim()) {
      setValidationStatus({ valid: false, message: "Please input some JSON content first.", type: "error" });
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setJsonInput(formatted);
      setValidationStatus({ valid: true, message: "Valid JSON! Formatted successfully.", type: "success" });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Invalid JSON structure.";
      setValidationStatus({ valid: false, message: `Invalid JSON: ${errMsg}`, type: "error" });
    }
  };

  const handleMinify = () => {
    if (!jsonInput.trim()) {
      setValidationStatus({ valid: false, message: "Please input some JSON content first.", type: "error" });
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setValidationStatus({ valid: true, message: "Valid JSON! Minified successfully.", type: "success" });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Invalid JSON structure.";
      setValidationStatus({ valid: false, message: `Invalid JSON: ${errMsg}`, type: "error" });
    }
  };

  const handleValidate = () => {
    if (!jsonInput.trim()) {
      setValidationStatus({ valid: false, message: "Please input some JSON content first.", type: "error" });
      return;
    }
    try {
      JSON.parse(jsonInput);
      setValidationStatus({ valid: true, message: "JSON is perfectly valid and compliant!", type: "success" });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Invalid JSON structure.";
      setValidationStatus({ valid: false, message: `Invalid JSON: ${errMsg}`, type: "error" });
    }
  };

  const handleCopy = async () => {
    if (!jsonInput.trim()) return;
    try {
      await navigator.clipboard.writeText(jsonInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setValidationStatus(null);
  };

  const howToUse = [
    "Paste your raw JSON content into the editor text area.",
    "Choose your preferred indentation size (2 spaces or 4 spaces).",
    "Click Format to beautify and add clean indentation.",
    "Click Minify to collapse the JSON code into a single condensed line.",
    "Use the Validate button to test compliance and check syntax errors."
  ];

  const benefits = [
    "Locally sandboxed processing: JSON parameters are parsed inside your browser (great for sensitive key API payloads).",
    "Interactive error indicators display character offsets and line details.",
    "Beautifier and Minifier support for multiple workflows.",
    "Easy clipboard actions for quick copy-pasting."
  ];

  const faqs = [
    {
      question: "Is there a file size limit for formatting JSON?",
      answer: "No hard limits, but large files (above 10MB) might temporarily cause performance delays depending on your device's browser memory capacity."
    },
    {
      question: "Why does the tool show a syntax error for my valid keys?",
      answer: "Standard JSON requires double quotes (`\"`) for keys and values, not single quotes (`'`). Ensure your payload adheres strictly to JSON standards."
    },
    {
      question: "Is my JSON data uploaded to any databases?",
      answer: "Never. All data parsing, validation, and layout updates occur locally within your browser context."
    }
  ];

  const relatedTools = [
    {
      name: "Password Generator",
      url: "/password-generator",
      description: "Configure secure passwords with custom specifications client-side."
    },
    {
      name: "Base64 Encoder/Decoder",
      url: "/base64",
      description: "Convert raw strings or files to Base64 schema encoding and decode back."
    },
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully styled QR codes with customized sizing and colors."
    }
  ];

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, minify, and validate JSON snippets. Easily beautify raw data for readability or compress it for payload transport, with live syntax linting checks."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Editor controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-color pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-secondary-text uppercase">Indentation:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="rounded-lg border border-border-color bg-background px-2.5 py-1 text-xs text-primary-text font-medium focus:border-accent focus:outline-none"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleFormat}
              className="inline-flex items-center gap-1 rounded-lg border border-border-color bg-background hover:bg-hover-bg px-3 py-1.5 text-xs font-semibold text-primary-text cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Format
            </button>
            <button
              onClick={handleMinify}
              className="inline-flex items-center gap-1 rounded-lg border border-border-color bg-background hover:bg-hover-bg px-3 py-1.5 text-xs font-semibold text-primary-text cursor-pointer"
            >
              <Minimize2 className="h-3.5 w-3.5 text-secondary-text" /> Minify
            </button>
            <button
              onClick={handleValidate}
              className="inline-flex items-center gap-1 rounded-lg border border-border-color bg-background hover:bg-hover-bg px-3 py-1.5 text-xs font-semibold text-primary-text cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 text-success" /> Validate
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg bg-accent hover:bg-accent-light px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleClear}
              className="rounded-lg border border-border-color hover:bg-hover-bg px-3 py-1.5 text-xs font-semibold text-secondary-text cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Text Area Container */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your raw JSON content here... E.g. {"name": "ToolNagri", "active": true}'
              rows={15}
              className="block w-full rounded-xl border border-border-color bg-secondary-bg/30 p-4 font-mono text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Validation Alert */}
          {validationStatus && (
            <div
              className={`flex items-start gap-3 rounded-lg border p-4 text-sm transition-all duration-200 ${
                validationStatus.type === "success"
                  ? "bg-success/15 border-success/35 text-success"
                  : "bg-warning/15 border-warning/35 text-warning"
              }`}
            >
              {validationStatus.type === "success" ? (
                <FileText className="h-5 w-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">
                  {validationStatus.type === "success" ? "Success!" : "Validation Error"}
                </p>
                <p className="mt-1 font-mono text-xs">{validationStatus.message}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
