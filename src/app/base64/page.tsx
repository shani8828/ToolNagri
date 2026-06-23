"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { ArrowLeftRight, Check, Copy, AlertCircle, RefreshCw } from "lucide-react";

export default function Base64Tool() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = () => {
    setError("");
    if (!inputText) {
      setOutputText("");
      return;
    }

    try {
      if (mode === "encode") {
        // UTF-8 encoding support
        const encoder = new TextEncoder();
        const data = encoder.encode(inputText);
        const binString = String.fromCodePoint(...data);
        const encoded = btoa(binString);
        setOutputText(encoded);
      } else {
        // Base64 decoding support
        const decodedBinString = atob(inputText.trim());
        const bytes = Uint8Array.from(decodedBinString, (m) => m.codePointAt(0)!);
        const decoder = new TextDecoder();
        const decoded = decoder.decode(bytes);
        setOutputText(decoded);
      }
    } catch (err) {
      console.error(err);
      if (mode === "decode") {
        setError("Invalid Base64 string. Please check the input formatting and padding characters.");
      } else {
        setError("Failed to encode. The input string contains characters that cannot be processed.");
      }
      setOutputText("");
    }
  };

  const handleSwap = () => {
    setError("");
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setError("");
  };

  const howToUse = [
    "Select the processing mode: Encode (Text to Base64) or Decode (Base64 to Text).",
    "Paste your raw string into the Source Input editor.",
    "Click the Encode or Decode button (or see real-time updates).",
    "Inspect the conversion status for any format anomalies.",
    "Click the Copy Result button to copy the output text directly."
  ];

  const benefits = [
    "Unicode/UTF-8 compliant: Correctly encodes emojis and international special symbols.",
    "Sandboxed client-side processing keeps your API secrets or payload data confidential.",
    "Instant 'Swap' command speeds up round-trip testing workflows.",
    "Clean dual-editor alignment optimized for developers."
  ];

  const faqs = [
    {
      question: "What is Base64 representation?",
      answer: "Base64 is a binary-to-text encoding schema that translates binary bytes into an ASCII string representation of 64 characters (A-Z, a-z, 0-9, +, /, and padding =)."
    },
    {
      question: "Why does decoding fail?",
      answer: "Base64 strings must follow precise formatting patterns: the length must be a multiple of 4 (padded with '='), and contain only valid Base64 characters. Any whitespaces or invalid symbols will break translation."
    },
    {
      question: "Does this handle file-to-base64 conversions?",
      answer: "This tool is built for text encoding and decoding. For converting images or files into base64 data URIs, check our dedicated media conversion tools."
    }
  ];

  const relatedTools = [
    {
      name: "JSON Formatter",
      url: "/json-formatter",
      description: "Format, minify, and validate JSON snippets with syntax highlighting."
    },
    {
      name: "Secure Password Generator",
      url: "/password-generator",
      description: "Create highly secure, cryptographically random passwords client-side."
    },
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully styled QR codes with customized sizing and colors."
    }
  ];

  return (
    <ToolLayout
      title="Base64 Encoder & Decoder"
      description="Encode plain text strings into secure Base64 representations, or decode Base64 strings back to readable text. Process all data locally in real-time."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Toggle Mode and Control Panel */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-color pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-secondary-text uppercase">Mode:</span>
            <div className="inline-flex rounded-lg border border-border-color p-0.5 bg-secondary-bg">
              <button
                type="button"
                onClick={() => {
                  setMode("encode");
                  handleReset();
                }}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  mode === "encode" ? "bg-white text-primary-text shadow-sm" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Encode Text
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("decode");
                  handleReset();
                }}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  mode === "decode" ? "bg-white text-primary-text shadow-sm" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Decode Base64
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="inline-flex items-center gap-1 rounded-lg border border-border-color bg-background hover:bg-hover-bg px-3 py-1.5 text-xs font-semibold text-primary-text cursor-pointer"
              title="Swap fields"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" /> Swap Fields
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-border-color hover:bg-hover-bg px-3 py-1.5 text-xs font-semibold text-secondary-text cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Text Editors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Editor */}
          <div className="space-y-2">
            <label htmlFor="sourceInput" className="block text-sm font-semibold text-primary-text uppercase tracking-wider">
              {mode === "encode" ? "Plain Text Source" : "Base64 String Source"}
            </label>
            <textarea
              id="sourceInput"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              placeholder={mode === "encode" ? "Type raw text here to encode..." : "Paste Base64 code here to decode..."}
              rows={8}
              className="block w-full rounded-xl border border-border-color bg-secondary-bg/30 p-4 font-mono text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Output Editor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="resultOutput" className="block text-sm font-semibold text-primary-text uppercase tracking-wider">
                {mode === "encode" ? "Base64 Encoded Result" : "Plain Text Result"}
              </label>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-light"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy Result"}
                </button>
              )}
            </div>
            <textarea
              id="resultOutput"
              readOnly
              value={outputText}
              placeholder={mode === "encode" ? "Encoded output will render here..." : "Decoded text will render here..."}
              rows={8}
              className="block w-full rounded-xl border border-border-color bg-secondary-bg/10 p-4 font-mono text-sm text-primary-text placeholder-secondary-text focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleProcess}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-light focus:outline-none transition-all duration-200 cursor-pointer"
        >
          {mode === "encode" ? "Convert Text to Base64" : "Convert Base64 to Text"}
        </button>

      </div>
    </ToolLayout>
  );
}
