"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Key, Download, AlertTriangle, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export default function StringRandomizer() {
  const [length, setLength] = useState<number>(16);
  const [count, setCount] = useState<number>(10);
  
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  
  const [customPool, setCustomPool] = useState("");
  const [excludeSimilar, setExcludeSimilar] = useState(true);

  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const generateStrings = () => {
    setErrorMsg("");
    setResults([]);

    let pool = "";
    
    if (customPool.trim()) {
      pool = customPool;
    } else {
      if (useUppercase) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (useLowercase) pool += "abcdefghijklmnopqrstuvwxyz";
      if (useNumbers) pool += "0123456789";
      if (useSymbols) pool += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    }

    if (excludeSimilar) {
      // Exclude: 1, l, I, 0, O, o, etc.
      pool = pool.replace(/[1lI0Oo]/g, "");
    }

    if (!pool) {
      setErrorMsg("Character pool is empty. Please select at least one character type or enter a custom pool.");
      return;
    }

    const tempResults: string[] = [];
    const poolLength = pool.length;

    try {
      const buffer = new Uint32Array(length);
      for (let c = 0; c < count; c++) {
        // Generate cryptographically random bytes
        window.crypto.getRandomValues(buffer);
        let str = "";
        for (let i = 0; i < length; i++) {
          str += pool[buffer[i] % poolLength];
        }
        tempResults.push(str);
      }
      setResults(tempResults);
    } catch (err: any) {
      setErrorMsg("Failed to generate secure random bytes.");
    }
  };

  useEffect(() => {
    generateStrings();
  }, [length, count, useUppercase, useLowercase, useNumbers, useSymbols, customPool, excludeSimilar]);

  const handleCopySingle = (str: string, index: number) => {
    navigator.clipboard.writeText(str);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCopyAll = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);

    confetti({
      particleCount: 15,
      spread: 20,
      origin: { y: 0.8 },
      colors: ["#2563eb", "#10b981"],
    });
  };

  const handleDownload = () => {
    if (results.length === 0) return;
    const blob = new Blob([results.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `generated-strings.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setLength(16);
    setCount(10);
    setUseUppercase(true);
    setUseLowercase(true);
    setUseNumbers(true);
    setUseSymbols(false);
    setCustomPool("");
    setExcludeSimilar(true);
    setResults([]);
    setErrorMsg("");
  };

  const howToUse = [
    "Adjust string length and total count parameters using the sliders.",
    "Toggle checkboxes for character sets (letters, numbers, symbols) or input a custom pool.",
    "Choose whether to exclude similar characters (like 1, I, l, 0, O) to avoid reading errors.",
    "View the generated list instantly. Click copy on any row or click Copy All to save the whole batch."
  ];

  const benefits = [
    "Uses cryptographically secure random number generators (Web Crypto API).",
    "Generates bulk lists of up to 100 random strings simultaneously.",
    "Filters similar characters to output highly readable passwords and vouchers.",
    "100% Client-Side generation keeps API keys and passwords secure."
  ];

  const faqs = [
    {
      question: "Are these passwords secure?",
      answer: "Yes. They use `window.crypto.getRandomValues()` which is a cryptographically strong pseudorandom number generator (CSPRNG) backed by operating system entropy."
    },
    {
      question: "Does this tool save generated keys?",
      answer: "No. All strings are generated directly in your browser's local memory and are never sent or logged to any servers."
    }
  ];

  const relatedTools = [
    { name: "Passphrase Generator", url: "/passphrase-generator", description: "Generate memorable word-based passwords." },
    { name: "Password Generator", url: "/password-generator", description: "Standard secure single password generator." }
  ];

  return (
    <ToolLayout
      title="String Randomizer & Generator"
      description="Generate bulk random string patterns (e.g. API keys, codes, passwords) with customizable character sets, lengths, and ambiguous filters."
      category="Text Tools"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Configurations workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls Panel */}
          <div className="lg:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-4 text-xs">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Key className="h-4 w-4 text-accent" /> Randomizer Configurations
            </span>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-secondary-text">
                  <span>String Length</span>
                  <span className="font-bold text-accent">{length} chars</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="128"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-secondary-text">
                  <span>Quantity Count</span>
                  <span className="font-bold text-accent">{count} strings</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

            </div>

            {/* Checkboxes pool */}
            <div className="space-y-2 pt-2 border-t border-border-color/60">
              <label className="text-secondary-text font-bold uppercase tracking-wider block">Character Sets</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-semibold text-secondary-text">
                <label className="flex items-center gap-1.5 hover:text-primary-text cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useUppercase}
                    onChange={(e) => setUseUppercase(e.target.checked)}
                    disabled={!!customPool}
                    className="accent-accent h-3.5 w-3.5"
                  />
                  A-Z Uppercase
                </label>

                <label className="flex items-center gap-1.5 hover:text-primary-text cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useLowercase}
                    onChange={(e) => setUseLowercase(e.target.checked)}
                    disabled={!!customPool}
                    className="accent-accent h-3.5 w-3.5"
                  />
                  a-z Lowercase
                </label>

                <label className="flex items-center gap-1.5 hover:text-primary-text cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useNumbers}
                    onChange={(e) => setUseNumbers(e.target.checked)}
                    disabled={!!customPool}
                    className="accent-accent h-3.5 w-3.5"
                  />
                  0-9 Numbers
                </label>

                <label className="flex items-center gap-1.5 hover:text-primary-text cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useSymbols}
                    onChange={(e) => setUseSymbols(e.target.checked)}
                    disabled={!!customPool}
                    className="accent-accent h-3.5 w-3.5"
                  />
                  Special Symbols
                </label>
              </div>
            </div>

            {/* Custom pool input */}
            <div className="space-y-1 pt-2 border-t border-border-color/60">
              <label className="text-secondary-text font-bold uppercase tracking-wider block">Custom Character Pool (Optional)</label>
              <input
                type="text"
                value={customPool}
                onChange={(e) => setCustomPool(e.target.value)}
                placeholder="e.g. ABCDEF123456 (Overrides above checkboxes)"
                className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
              />
            </div>

            {/* Ambiguous filter */}
            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-1.5 font-bold text-secondary-text hover:text-primary-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  className="accent-accent h-3.5 w-3.5"
                />
                Exclude Ambiguous Characters (e.g. 1, l, I, 0, O, o)
              </label>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={generateStrings}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Re-Generate Codes
              </button>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" /> Generated Batches
              </span>

              {errorMsg ? (
                <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-xs text-warning border border-warning/20">
                  <AlertTriangle className="h-4 w-4 shrink-0 font-medium" />
                  <span>{errorMsg}</span>
                </div>
              ) : results.length === 0 ? (
                <div className="py-14 text-center text-xs text-secondary-text italic leading-relaxed">
                  No strings generated yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-55 overflow-y-auto pr-1">
                  {results.map((str, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-secondary-bg/25 p-2 rounded-xl border border-border-color/60">
                      <span className="w-6 text-center text-[9px] font-bold text-secondary-text shrink-0 select-none">
                        #{idx + 1}
                      </span>
                      <code className="flex-1 min-w-0 text-[10px] font-mono font-bold text-primary-text truncate select-all px-1">
                        {str}
                      </code>
                      <button
                        onClick={() => handleCopySingle(str, idx)}
                        className="text-secondary-text hover:text-primary-text p-1.5 rounded hover:bg-hover-bg transition-colors cursor-pointer shrink-0"
                        title="Copy string"
                      >
                        {copiedIndex === idx ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {results.length > 0 && (
              <div className="pt-4 border-t border-border-color/60 space-y-2">
                <button
                  onClick={handleCopyAll}
                  className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-accent hover:bg-accent/90 text-white cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedAll ? "Copied All Batches!" : "Copy All Strings"}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-1.5 border border-border-color hover:bg-hover-bg rounded-lg text-[9px] font-bold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="h-3 w-3" /> Download TXT
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-1.5 border border-border-color hover:bg-hover-bg rounded-lg text-[9px] font-bold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Reset Page
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
