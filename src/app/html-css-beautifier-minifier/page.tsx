"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, AlertCircle, Sparkles, Zap, Code2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function HtmlCssBeautifierMinifier() {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [mode, setMode] = useState<"html" | "css">("html");
  const [action, setAction] = useState<"beautify" | "minify">("beautify");
  const [indentSize, setIndentSize] = useState<"2" | "4" | "tab">("2");
  
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleFormat = () => {
    setError("");
    setOutputCode("");
    
    if (!inputCode.trim()) {
      setError("Please paste or type some code first.");
      return;
    }

    try {
      const indent = indentSize === "tab" ? "\t" : " ".repeat(parseInt(indentSize));
      let result = "";

      if (mode === "css") {
        if (action === "minify") {
          result = minifyCss(inputCode);
        } else {
          result = beautifyCss(inputCode, indent);
        }
      } else {
        if (action === "minify") {
          result = minifyHtml(inputCode);
        } else {
          result = beautifyHtml(inputCode, indent);
        }
      }

      setOutputCode(result);
      confetti({
        particleCount: 30,
        spread: 30,
        origin: { y: 0.8 },
        colors: ["#2563eb", "#22c55e"],
      });
    } catch (err) {
      setError("Failed to parse code. Please verify that your syntax is valid.");
    }
  };

  // CSS Formatter Algorithms
  const minifyCss = (css: string) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
      .replace(/\s+/g, " ")             // Collapse spaces
      .replace(/\s*([\{\}:;,])\s*/g, "$1") // Trim spaces around markers
      .replace(/;\}/g, "}")            // Trim last semicolon
      .trim();
  };

  const beautifyCss = (css: string, indent: string) => {
    let clean = css
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
      .replace(/\s+/g, " ")             // Collapse spaces
      .trim();
    
    let formatted = "";
    let depth = 0;
    
    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      if (char === "{") {
        depth++;
        formatted += " {\n" + indent.repeat(depth);
      } else if (char === "}") {
        depth = Math.max(0, depth - 1);
        formatted = formatted.trimEnd() + "\n" + indent.repeat(depth) + "}\n\n" + indent.repeat(depth);
      } else if (char === ";") {
        formatted += ";\n" + indent.repeat(depth);
      } else if (char === ":") {
        formatted += ": ";
      } else if (char === ",") {
        formatted += ", ";
      } else {
        if (char === " " && (formatted.endsWith(" ") || formatted.endsWith("\n") || formatted.endsWith(indent))) {
          continue;
        }
        formatted += char;
      }
    }
    
    return formatted.replace(/\n\s*\n/g, "\n\n").trim();
  };

  // HTML Formatter Algorithms
  const minifyHtml = (html: string) => {
    return html
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/\s+/g, " ")            // Collapse spaces
      .replace(/>\s+</g, "><")         // Strip gaps between tags
      .trim();
  };

  const beautifyHtml = (html: string, indent: string) => {
    let clean = html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim();

    let result = "";
    let depth = 0;
    
    // Tag matching regex
    const tokens = clean.split(/(<\/?[a-zA-Z0-9_\-:]+(?:\s+[^>]*?)?>)/);

    for (let token of tokens) {
      token = token.trim();
      if (!token) continue;

      if (token.startsWith("</")) {
        depth = Math.max(0, depth - 1);
        result += "\n" + indent.repeat(depth) + token;
      } else if (
        token.startsWith("<") &&
        !token.endsWith("/>") &&
        !token.startsWith("<!") &&
        !["img", "br", "hr", "input", "meta", "link", "source", "embed"].includes(
          token.match(/<([a-zA-Z0-9_\-]+)/)?.[1] || ""
        )
      ) {
        result += "\n" + indent.repeat(depth) + token;
        depth++;
      } else if (token.startsWith("<")) {
        result += "\n" + indent.repeat(depth) + token;
      } else {
        result += "\n" + indent.repeat(depth) + token;
      }
    }
    return result.trim();
  };

  const handleCopyToClipboard = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputCode("");
    setOutputCode("");
    setError("");
  };

  const howToUse = [
    "Select the code mode (HTML or CSS) at the top of the configurations panel.",
    "Choose your action: Beautify (to add indents and spaces) or Minify (to compress size).",
    "If beautifying, select your indentation size preference (2 spaces, 4 spaces, or Tabs).",
    "Paste your messy source code in the input area and click Format Code.",
    "Review the parsed syntax and click Copy Formatted Code to save."
  ];

  const benefits = [
    "Supports dual language formats (HTML markup structures & CSS stylesheets).",
    "100% Client-Side execution: Code fragments remain private inside your device.",
    "Implements lightweight, high-performance regexp parsing with zero external bundles.",
    "Prettifies complex nesting layers cleanly or compresses assets to production sizes."
  ];

  const faqs = [
    {
      question: "Will formatting change the behavior of my markup or styling?",
      answer: "No. The beautifier/minifier merely removes, adds, or reformats white spaces, indentation tabs, comments, and line breaks. It does not rename selectors, classes, tag nodes, or CSS parameters, ensuring zero change in layout execution."
    },
    {
      question: "Is there a limit to the length of code I can input?",
      answer: "No. Since execution runs locally in your browser, there is no network timeout or file size ceiling. Large template sheets parse smoothly in milliseconds."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, minify and validate JSON payloads." },
    { name: "SQL Formatter", url: "/sql-formatter", description: "Clean and format database queries." }
  ];

  return (
    <ToolLayout
      title="HTML/CSS Formatter"
      description="Beautify or minify HTML markup and CSS stylesheets. Apply clean indentation sizes, remove comments and unnecessary whitespaces, and compress production assets client-side."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Configuration Bar */}
        <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
          <span className="text-xs font-bold text-primary-text uppercase tracking-wider block border-b border-border-color/60 pb-1.5">
            Formatter Configurations
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Format Mode Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Code Mode</label>
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                <button
                  onClick={() => setMode("html")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    mode === "html" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setMode("css")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    mode === "css" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  CSS
                </button>
              </div>
            </div>

            {/* Action Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Formatter Action</label>
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                <button
                  onClick={() => setAction("beautify")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1 ${
                    action === "beautify" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" /> Beautify
                </button>
                <button
                  onClick={() => setAction("minify")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1 ${
                    action === "minify" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" /> Minify
                </button>
              </div>
            </div>

            {/* Indent Sizes */}
            {action === "beautify" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Indentation Size</label>
                <div className="grid grid-cols-3 gap-1 rounded-lg border border-border-color p-0.5 bg-background">
                  {(["2", "4", "tab"] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setIndentSize(sz)}
                      className={`py-1.5 px-2 rounded-md text-xs font-semibold cursor-pointer capitalize transition-colors ${
                        indentSize === sz ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                      }`}
                    >
                      {sz === "tab" ? "Tab" : `${sz} Spaces`}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Input and Output Textareas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input block */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1">
              <Code2 className="h-4 w-4 text-accent" /> Source Code Input
            </label>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder={`Paste your raw, messy ${mode.toUpperCase()} code here...`}
              rows={16}
              className="w-full rounded-xl border border-border-color bg-background p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
            />
          </div>

          {/* Output block */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1">
                <Code2 className="h-4 w-4 text-success" /> Formatted Output
              </label>
              {outputCode && (
                <button
                  onClick={handleCopyToClipboard}
                  className="py-1 px-2.5 rounded border border-border-color bg-background hover:bg-hover-bg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              )}
            </div>
            <textarea
              value={outputCode}
              readOnly
              placeholder={`Formatted output will display here after clicking format...`}
              rows={16}
              className="w-full rounded-xl border border-border-color bg-secondary-bg/10 p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
            />
          </div>

        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
            <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Triggers */}
        <div className="flex gap-3">
          <button
            onClick={handleFormat}
            className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer"
          >
            Format Code
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
            title="Clear all"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

      </div>
    </ToolLayout>
  );
}
