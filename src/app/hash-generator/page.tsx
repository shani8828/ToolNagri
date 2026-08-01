"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, RefreshCw, AlertCircle, Copy, Check, ShieldCheck, FileCheck } from "lucide-react";
import confetti from "canvas-confetti";

type HashAlgo = "SHA-256" | "MD5" | "SHA-512" | "SHA-1" | "SHA-384";

export default function HashGenerator() {
  const [inputText, setInputText] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  
  const [algorithm, setAlgorithm] = useState<HashAlgo>("SHA-256");
  const [mode, setMode] = useState<"text" | "file">("text");
  const [hashResult, setHashResult] = useState("");
  const [hexCase, setHexCase] = useState<"lower" | "upper">("lower");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-run hashing when settings or input text changes
  useEffect(() => {
    if (mode === "text") {
      handleHashText();
    }
  }, [inputText, algorithm, hexCase, mode]);

  const handleHashText = async () => {
    setError("");
    if (!inputText) {
      setHashResult("");
      return;
    }

    try {
      let hash = "";
      if (algorithm === "MD5") {
        hash = md5Encode(inputText);
      } else {
        const buffer = new TextEncoder().encode(inputText);
        hash = await webCryptoHash(algorithm, buffer);
      }
      setHashResult(hexCase === "upper" ? hash.toUpperCase() : hash.toLowerCase());
    } catch (err) {
      console.error(err);
      setError("Failed to compute text checksum.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setHashResult("");
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInput(file);
  };

  const handleHashFile = async () => {
    if (!fileInput) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setHashResult("");

    try {
      const arrayBuffer = await fileInput.arrayBuffer();
      let hash = "";

      if (algorithm === "MD5") {
        hash = md5Encode(arrayBuffer);
      } else {
        hash = await webCryptoHash(algorithm, arrayBuffer);
      }

      setHashResult(hexCase === "upper" ? hash.toUpperCase() : hash.toLowerCase());
      confetti({
        particleCount: 30,
        spread: 35,
        origin: { y: 0.8 },
        colors: ["#2563eb", "#22c55e"],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to read file bytes. Verify that the file is not corrupted or locked.");
    } finally {
      setLoading(false);
    }
  };

  // Web Crypto API Digest Helper
  const webCryptoHash = async (algo: string, buffer: BufferSource): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest(algo, buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  // Compact MD5 Algorithm Implementation in Pure JS
  const md5Encode = (stringOrBuffer: string | ArrayBuffer): string => {
    const k = [
      0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
      0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
      0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
      0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
      0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
      0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
      0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
      0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ];

    let buffer: Uint8Array;
    if (typeof stringOrBuffer === "string") {
      buffer = new TextEncoder().encode(stringOrBuffer);
    } else {
      buffer = new Uint8Array(stringOrBuffer);
    }

    const words: number[] = [];
    const len = buffer.length;
    for (let i = 0; i < len; i++) {
      words[i >> 2] |= buffer[i] << ((i % 4) * 8);
    }

    words[(len >> 2)] |= 0x80 << ((len % 4) * 8);
    const wordsLen = (((len + 8) >> 6) + 1) * 16;
    while (words.length < wordsLen) words.push(0);
    words[wordsLen - 2] = len * 8;

    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;

    const leftRotate = (x: number, c: number) => (x << c) | (x >>> (32 - c));

    for (let i = 0; i < wordsLen; i += 16) {
      let a = h0, b = h1, c = h2, d = h3;

      for (let j = 0; j < 64; j++) {
        let f = 0, g = 0;
        if (j < 16) {
          f = (b & c) | (~b & d);
          g = j;
        } else if (j < 32) {
          f = (d & b) | (~d & c);
          g = (5 * j + 1) % 16;
        } else if (j < 48) {
          f = b ^ c ^ d;
          g = (3 * j + 5) % 16;
        } else {
          f = c ^ (b | ~d);
          g = (7 * j) % 16;
        }

        const temp = d;
        d = c;
        c = b;
        b = (b + leftRotate(a + f + k[j] + (words[i + g] || 0), [
          7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
          5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
          4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
          6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
        ][j])) | 0;
        a = temp;
      }

      h0 = (h0 + a) | 0;
      h1 = (h1 + b) | 0;
      h2 = (h2 + c) | 0;
      h3 = (h3 + d) | 0;
    }

    const toHex = (n: number) => {
      let s = "";
      for (let i = 0; i < 4; i++) {
        s += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
      }
      return s;
    };

    return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3);
  };

  const handleCopyToClipboard = () => {
    if (!hashResult) return;
    navigator.clipboard.writeText(hashResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputText("");
    setFileInput(null);
    setHashResult("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const howToUse = [
    "Select your hash encoding target mode: Text Hash or File Hash.",
    "Choose a cryptographic algorithm from the selector (SHA-256, MD5, SHA-512, etc.).",
    "For text: type or paste content to compute hashes in real-time as you edit.",
    "For files: drag and drop your document/file and click Generate Checksum.",
    "Toggle between lowercase and uppercase styles, then copy your generated hash."
  ];

  const benefits = [
    "Supports multiple secure standard hashes: SHA-256, SHA-512, SHA-384, SHA-1, and MD5.",
    "100% Client-Side processing: Strings and binary file buffers never upload.",
    "Computes hashes for large files efficiently using in-browser buffers.",
    "Real-time calculations for text input require zero page clicks."
  ];

  const faqs = [
    {
      question: "Are my files uploaded to your servers for hash calculation?",
      answer: "No. All hash digests are computed locally inside your browser sandbox using Web Cryptography APIs and client-side binary memory blocks. No file bytes leave your device."
    },
    {
      question: "Why is MD5 considered insecure?",
      answer: "MD5 is susceptible to hash collisions where two different inputs can produce the identical hash output. While insecure for password cryptography, it remains highly popular for quick file integrity checks."
    }
  ];

  const relatedTools = [
    { name: "UUID Generator", url: "/uuid-generator", description: "Generate bulk RFC 4122 identifiers." },
    { name: "JSON Formatter", url: "/json-formatter", description: "Format and validate JSON payloads." }
  ];

  return (
    <ToolLayout
      title="Hash Generator"
      description="Compute secure cryptographic hashes (SHA-256, MD5, SHA-512, SHA-1, SHA-384) of plain text strings or binary files locally in your browser."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Tab Selector & Configurations */}
        <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
          <span className="text-xs font-bold text-primary-text uppercase tracking-wider block border-b border-border-color/60 pb-1.5">
            Hash Settings
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            {/* Mode Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Hashing Mode</label>
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                <button
                  onClick={() => { setMode("text"); handleReset(); }}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    mode === "text" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  Text
                </button>
                <button
                  onClick={() => { setMode("file"); handleReset(); }}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    mode === "file" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  File
                </button>
              </div>
            </div>

            {/* Algorithm Select */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block font-heading">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as HashAlgo)}
                className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
              >
                <option value="SHA-256">SHA-256 (Secure Standard)</option>
                <option value="MD5">MD5 (File Checksums)</option>
                <option value="SHA-512">SHA-512 (High Security)</option>
                <option value="SHA-1">SHA-1 (Legacy)</option>
                <option value="SHA-384">SHA-384</option>
              </select>
            </div>

            {/* Hex Case Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Hex Case</label>
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                <button
                  onClick={() => setHexCase("lower")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    hexCase === "lower" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  Lower
                </button>
                <button
                  onClick={() => setHexCase("upper")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    hexCase === "upper" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  Upper
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Input workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Input Pane */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Text input */}
            {mode === "text" ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Plain Text</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type or paste text content to hash live..."
                  rows={8}
                  className="w-full rounded-xl border border-border-color bg-background p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
                />
              </div>
            ) : (
              // File input
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="h-4.5 w-4.5 text-accent" /> Select Binary File
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border-color hover:border-accent rounded-xl p-8 text-center bg-secondary-bg/10 hover:bg-secondary-bg/25 transition-all duration-200 cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="mx-auto h-8 w-8 text-secondary-text group-hover:text-accent transition-colors mb-2" />
                    <div className="text-sm font-semibold text-primary-text">
                      {fileInput ? fileInput.name : "Drag & drop file here, or click to upload"}
                    </div>
                    <div className="text-xs text-secondary-text mt-1.5">
                      {fileInput ? `Size: ${formatSize(fileInput.size)}` : "Supports any file format (up to 150MB recommended)"}
                    </div>
                  </div>
                </div>

                {/* File Hash compute action */}
                {fileInput && (
                  <button
                    onClick={handleHashFile}
                    disabled={loading}
                    className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Computing Checksum..." : `Generate ${algorithm} Checksum`}
                  </button>
                )}
              </div>
            )}

            {/* Error alerts */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
                <span>{error}</span>
              </div>
            )}

            {/* Clear option */}
            {(inputText || fileInput) && (
              <div className="flex justify-end">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Start Over
                </button>
              </div>
            )}

          </div>

          {/* Sidebar Computed Output Results */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-55">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-accent animate-pulse" />
                {algorithm} Checksum
              </span>

              {loading ? (
                <div className="py-8 text-center space-y-3">
                  <RefreshCw className="h-7 w-7 text-accent animate-spin mx-auto" />
                  <p className="text-xs text-secondary-text font-semibold animate-pulse">Hashing file streams...</p>
                </div>
              ) : hashResult ? (
                <div className="space-y-4 w-full">
                  <div className="bg-secondary-bg/30 p-3 rounded-lg border border-border-color/40 font-mono font-bold text-xs text-primary-text break-all select-all leading-normal text-center shadow-xs">
                    {hashResult}
                  </div>
                  
                  <button
                    onClick={handleCopyToClipboard}
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-success hover:bg-success/90 text-white cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Hash Copied!" : "Copy Checksum"}
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-secondary-text italic leading-relaxed">
                  {mode === "text"
                    ? "Start typing or paste text to compute checksum."
                    : "Upload file and click generate checksum."}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
