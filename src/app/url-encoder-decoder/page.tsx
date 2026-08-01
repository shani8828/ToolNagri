"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, ArrowLeftRight, Link2, AlertTriangle, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export default function UrlEncoderDecoder() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeMode, setEncodeMode] = useState<"component" | "uri">("component");
  const [liveMode, setLiveMode] = useState(true);
  
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConvert = () => {
    setErrorMsg(null);
    if (!inputText) {
      setOutputText("");
      return;
    }

    try {
      if (mode === "encode") {
        if (encodeMode === "component") {
          setOutputText(encodeURIComponent(inputText));
        } else {
          setOutputText(encodeURI(inputText));
        }
      } else {
        if (encodeMode === "component") {
          setOutputText(decodeURIComponent(inputText));
        } else {
          setOutputText(decodeURI(inputText));
        }
      }
    } catch (err: any) {
      setErrorMsg(`Decoding error: ${err.message}. Make sure your percent-encoded format is correct.`);
      setOutputText("");
    }
  };

  useEffect(() => {
    if (liveMode) {
      handleConvert();
    }
  }, [inputText, mode, encodeMode, liveMode]);

  const handleSwap = () => {
    const nextMode = mode === "encode" ? "decode" : "encode";
    setMode(nextMode);
    setInputText(outputText);
    setOutputText("");
    setErrorMsg(null);
  };

  const handleCopyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    confetti({
      particleCount: 15,
      spread: 20,
      origin: { y: 0.8 },
      colors: ["#2563eb", "#3b82f6"],
    });
  };

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setMode("encode");
    setEncodeMode("component");
    setLiveMode(true);
    setErrorMsg(null);
  };

  const howToUse = [
    "Enter your target text or URL query parameters in the input box.",
    "Toggle between Encode or Decode depending on your parameters.",
    "Select the parameter specificity: URI Component (all characters) or URI (keep structural slashes/question marks).",
    "Inspect output values instantly or click Run Translation manually.",
    "Click Copy Output to store the formatted text to your clipboard."
  ];

  const benefits = [
    "Supports both standard URI and Component-level percent-encodings.",
    "Real-time instant rendering helps view translation output instantly.",
    "Interactive Swap button moves output parameters to the inputs for double processing.",
    "100% Client-Side execution keeps tokens and queries local."
  ];

  const faqs = [
    {
      question: "What is the difference between URI and URI Component modes?",
      answer: "URI Component mode (encodeURIComponent) encodes all special characters (including /, ?, :, &, =, +) to make them completely safe inside single URL parameters. URI mode (encodeURI) leaves structural characters unchanged to preserve the URL syntax structure."
    },
    {
      question: "Why does decode return errors?",
      answer: "Decoding errors happen when the string has malformed percent sequences, such as a `%` sign followed by invalid hexadecimal characters."
    }
  ];

  const relatedTools = [
    { name: "Base64 Encoder / Decoder", url: "/base64", description: "Convert text parameters to/from Base64." },
    { name: "Slug Generator", url: "/slug-generator", description: "Format titles into URL-safe paths." }
  ];

  return (
    <ToolLayout
      title="URL Encoder / Decoder"
      description="Encode and decode text strings for URLs. Instantly convert special characters using percent-encoding or reverse it safely client-side."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Configurations Header */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-secondary-bg/25 p-4 rounded-xl border border-border-color/60 text-xs">
          
          {/* Main direction mode */}
          <div className="flex rounded-lg border border-border-color p-0.5 bg-background font-semibold w-full sm:w-auto">
            <button
              onClick={() => setMode("encode")}
              className={`flex-1 sm:flex-none py-1.5 px-4 rounded-md cursor-pointer transition-colors ${
                mode === "encode" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
              }`}
            >
              Encode URL
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`flex-1 sm:flex-none py-1.5 px-4 rounded-md cursor-pointer transition-colors ${
                mode === "decode" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
              }`}
            >
              Decode URL
            </button>
          </div>

          {/* Selector options and swaps */}
          <div className="flex flex-wrap items-center gap-4">
            
            <div className="flex items-center gap-2">
              <label className="text-secondary-text font-bold uppercase tracking-wider block">Mode:</label>
              <select
                value={encodeMode}
                onChange={(e) => setEncodeMode(e.target.value as any)}
                className="py-1.5 px-2.5 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none cursor-pointer"
              >
                <option value="component">URI Component (All characters)</option>
                <option value="uri">Full URI (Preserve structure)</option>
              </select>
            </div>

            <div className="flex items-center gap-4 border-l border-border-color pl-4">
              <label className="flex items-center gap-1.5 font-bold text-secondary-text hover:text-primary-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={liveMode}
                  onChange={(e) => setLiveMode(e.target.checked)}
                  className="accent-accent h-3.5 w-3.5"
                />
                Live Convert
              </label>

              <button
                onClick={handleSwap}
                className="py-1.5 px-2.5 border border-border-color hover:bg-hover-bg rounded-lg font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1"
                title="Swap Input & Output"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" /> Swap
              </button>
            </div>

          </div>

        </div>

        {/* Inputs / Outputs Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Input Area */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="h-4 w-4 text-accent" /> Source Text / URL
            </span>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "https://example.com/search?query=hello world & name=johndoe"
                  : "https%3A%2F%2Fexample.com%2Fsearch%3Fquery%3Dhello%2520world%20%26%20name%3Djohndoe"
              }
              rows={11}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>

          {/* Output Area */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" /> Converted Result
              </span>
              {outputText && (
                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder="Converted URL string will appear here..."
              rows={11}
              className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-sm text-primary-text font-mono focus:outline-none"
            />
          </div>

        </div>

        {/* Error messaging */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
            <AlertTriangle className="h-4 w-4 shrink-0 font-medium" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Start Over
          </button>

          {!liveMode && (
            <button
              onClick={handleConvert}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm"
            >
              Run Translation
            </button>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
