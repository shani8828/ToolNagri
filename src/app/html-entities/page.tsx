"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Code2, ArrowLeftRight, Copy, Check, Trash2 } from "lucide-react";

export default function HtmlEntities() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeModeType, setEncodeModeType] = useState<"basic" | "extensive">("basic");

  const escapeHtmlBasic = (str: string): string => {
    return str.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case "&": return "&amp;";
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&apos;";
        default: return m;
      }
    });
  };

  const escapeHtmlExtensive = (str: string): string => {
    return str.split("").map((char) => {
      const code = char.charCodeAt(0);
      // Basic special characters
      if (char === "&") return "&amp;";
      if (char === "<") return "&lt;";
      if (char === ">") return "&gt;";
      if (char === '"') return "&quot;";
      if (char === "'") return "&apos;";
      // Numeric entities for other non-alphanumeric/non-ascii
      if (code > 126 || (code < 32 && char !== "\n" && char !== "\r" && char !== "\t")) {
        return `&#${code};`;
      }
      return char;
    }).join("");
  };

  const decodeHtml = (str: string): string => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent || str;
  };

  const handleProcess = () => {
    if (!inputText) {
      setOutputText("");
      return;
    }

    if (mode === "encode") {
      if (encodeModeType === "basic") {
        setOutputText(escapeHtmlBasic(inputText));
      } else {
        setOutputText(escapeHtmlExtensive(inputText));
      }
    } else {
      setOutputText(decodeHtml(inputText));
    }
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const handleSwap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInputText(outputText);
    setOutputText(inputText);
  };

  const howToUse = [
    "Select the process direction (Encode to convert markup tags, or Decode to restore raw tags).",
    "Paste your HTML content or escaped entities string in the input field.",
    "Choose between Basic mode (replaces tag characters like <, >, &) or Extensive mode (converts non-ASCII / symbols too).",
    "Click Process to generate code instantly, then copy the result to your clipboard."
  ];

  const benefits = [
    "Prevents Cross-Site Scripting (XSS) risks by safely escaping HTML tag wrappers.",
    "Decodes decimal, hexadecimal, and named character reference streams instantly.",
    "Supports bi-directional execution for developer scripts and source views.",
    "Runs 100% in-browser without sending raw strings or payloads to outer servers."
  ];

  const faqs = [
    {
      question: "Why should I encode HTML entities?",
      answer: "Encoding HTML entities converts reserved HTML characters like '<' and '>' into characters like '&lt;' and '&gt;'. This stops the browser from interpreting them as actual code, ensuring code fragments render as plain text without execution.",
    },
    {
      question: "What is the difference between Basic and Extensive encode?",
      answer: "Basic encode only escapes standard HTML tags (<, >, &, \", '). Extensive encode translates symbols, accents, and non-ASCII glyphs to safe numeric character references."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify and validate JSON." },
    { name: "Base64 Encoder & Decoder", url: "/base64", description: "Convert text to Base64 and back." }
  ];

  return (
    <ToolLayout
      title="HTML Entity Encoder & Decoder"
      description="Translate code elements into safe HTML-escaped entities or decode character references back to raw text instantly."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Toolbar Mode toggles */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary-bg/30 p-4 rounded-xl border border-border-color">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
              <Code2 className="h-4.5 w-4.5 text-accent" /> Mode:
            </span>
            <div className="inline-flex rounded-lg border border-border-color p-0.5 bg-background">
              <button
                onClick={() => setMode("encode")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  mode === "encode" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode("decode")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  mode === "decode" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Decode
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="flex items-center gap-1 px-3 py-1.5 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" /> Swap
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Extensive option when encoding */}
        {mode === "encode" && (
          <div className="flex items-center gap-6 px-1.5 text-sm text-primary-text font-semibold">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="encodeType"
                checked={encodeModeType === "basic"}
                onChange={() => setEncodeModeType("basic")}
                className="h-4 w-4 border-gray-300 text-accent focus:ring-accent"
              />
              Basic Escape (&lt;, &gt;, &amp;, &quot;, &apos;)
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="encodeType"
                checked={encodeModeType === "extensive"}
                onChange={() => setEncodeModeType("extensive")}
                className="h-4 w-4 border-gray-300 text-accent focus:ring-accent"
              />
              Extensive (All Non-ASCII & special entities)
            </label>
          </div>
        )}

        {/* Input/Output Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-text">
              {mode === "encode" ? "Raw HTML / Text Input" : "HTML Entities Input"}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "encode"
                  ? '<div class="alert">\n  <p>Hello & Welcome to "ToolNagri"!</p>\n</div>'
                  : "&lt;div class=&quot;alert&quot;&gt;\n  &lt;p&gt;Hello &amp; Welcome to &quot;ToolNagri&quot;!&lt;/p&gt;\n&lt;/div&gt;"
              }
              rows={12}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-primary-text">
                {mode === "encode" ? "HTML Entities Output" : "Raw HTML / Text Output"}
              </label>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder="Your processed code output will appear here..."
              rows={12}
              className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-sm text-primary-text font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleProcess}
            className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            Process HTML Entities
          </button>
        </div>

      </div>
    </ToolLayout>
  );
}
