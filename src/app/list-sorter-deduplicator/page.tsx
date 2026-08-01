"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Layers, ListFilter, AlertCircle, FileText } from "lucide-react";
import confetti from "canvas-confetti";

type SortType = "alphabetical-az" | "alphabetical-za" | "numeric-asc" | "numeric-desc" | "length-asc" | "length-desc" | "shuffle" | "none";

export default function ListSorterDeduplicator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const [sortType, setSortType] = useState<SortType>("alphabetical-az");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [trimLines, setTrimLines] = useState(true);

  // Metrics
  const [originalCount, setOriginalCount] = useState(0);
  const [finalCount, setFinalCount] = useState(0);
  const [dupesRemoved, setDupesRemoved] = useState(0);
  const [emptyRemoved, setEmptyRemoved] = useState(0);

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleCleanList = () => {
    setError("");
    setOutputText("");

    if (!inputText.trim()) {
      setError("Please paste or enter some list content first.");
      return;
    }

    try {
      let lines = inputText.split("\n");
      const initialLength = lines.length;
      let emptyCount = 0;
      let dupesCount = 0;

      // 1. Trim line whitespace if selected
      if (trimLines) {
        lines = lines.map((line) => line.trim());
      }

      // 2. Remove empty lines if selected
      if (removeEmptyLines) {
        const filtered = lines.filter((line) => line.length > 0);
        emptyCount = lines.length - filtered.length;
        lines = filtered;
      }

      // 3. Remove duplicate lines if selected
      if (removeDuplicates) {
        const unique = Array.from(new Set(lines));
        dupesCount = lines.length - unique.length;
        lines = unique;
      }

      // 4. Sort lines based on settings
      if (sortType !== "none") {
        if (sortType === "alphabetical-az") {
          lines.sort((a, b) => a.localeCompare(b));
        } else if (sortType === "alphabetical-za") {
          lines.sort((a, b) => b.localeCompare(a));
        } else if (sortType === "numeric-asc") {
          lines.sort((a, b) => {
            const numA = parseFloat(a) || 0;
            const numB = parseFloat(b) || 0;
            return numA - numB;
          });
        } else if (sortType === "numeric-desc") {
          lines.sort((a, b) => {
            const numA = parseFloat(a) || 0;
            const numB = parseFloat(b) || 0;
            return numB - numA;
          });
        } else if (sortType === "length-asc") {
          lines.sort((a, b) => a.length - b.length);
        } else if (sortType === "length-desc") {
          lines.sort((a, b) => b.length - a.length);
        } else if (sortType === "shuffle") {
          // Fisher-Yates Shuffle
          for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lines[i], lines[j]] = [lines[j], lines[i]];
          }
        }
      }

      setOriginalCount(initialLength);
      setFinalCount(lines.length);
      setDupesRemoved(dupesCount);
      setEmptyRemoved(emptyCount);

      setOutputText(lines.join("\n"));
      
      confetti({
        particleCount: 25,
        spread: 25,
        origin: { y: 0.8 },
        colors: ["#2563eb", "#22c55e"],
      });
    } catch (err: any) {
      setError(err.message || "Failed to process list.");
    }
  };

  const handleCopyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setOriginalCount(0);
    setFinalCount(0);
    setDupesRemoved(0);
    setEmptyRemoved(0);
    setError("");
  };

  const howToUse = [
    "Paste your list (one item or entry per line) in the Input List area.",
    "Configure Clean options (e.g. trim whitespace, delete empty rows).",
    "Choose if you want to deduplicate entries by checking Remove Duplicates.",
    "Select your target sorting logic from the dropdown selector (Alphabetical, Numeric, Sizing, or Random Shuffling).",
    "Click Clean & Sort List and copy the result from the Output panel."
  ];

  const benefits = [
    "Cleans raw records lists (extracts clean unique rows) in milliseconds.",
    "Supports multiple sorting priorities including line lengths and numeric sizes.",
    "Provides summary metrics showing duplicates and blank spaces removed.",
    "100% Client-Side execution means list parameters never upload."
  ];

  const faqs = [
    {
      question: "How does numeric sorting handle lines without numbers?",
      answer: "Lines that do not start with numbers or cannot be parsed as valid float numbers are treated as `0` during calculations. For best results, use numeric sorting solely on entries that are primarily numbers."
    },
    {
      question: "Is there a row capacity limit?",
      answer: "No. The sorting and unique array methods execute in-browser using standard Javascript memory blocks. Large lists of up to 10,000+ items format instantly."
    }
  ];

  const relatedTools = [
    { name: "Character Counter", url: "/character-counter", description: "Count letters and lines inside a paragraph." },
    { name: "JSON Formatter", url: "/json-formatter", description: "Clean, format, or minify JSON data structure." }
  ];

  return (
    <ToolLayout
      title="List Sorter & Deduplicator"
      description="Clean, format, and organize list records. Strip duplicate rows, delete empty spaces, trim whitespaces, and sort items alphabetically, numerically, or by length."
      category="Text Utilities"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Configuration settings */}
        <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
          <span className="text-xs font-bold text-primary-text uppercase tracking-wider block border-b border-border-color/60 pb-1.5">
            List Settings
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Sorting mode select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Sorting Logic</label>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
              >
                <option value="alphabetical-az">Alphabetical (A to Z)</option>
                <option value="alphabetical-za">Alphabetical (Z to A)</option>
                <option value="numeric-asc">Numeric Ascending (Small to Large)</option>
                <option value="numeric-desc">Numeric Descending (Large to Small)</option>
                <option value="length-asc">Line Length Ascending (Shortest First)</option>
                <option value="length-desc">Line Length Descending (Longest First)</option>
                <option value="shuffle">Random Shuffle</option>
                <option value="none">No Sorting (Only Clean)</option>
              </select>
            </div>

            {/* Switches */}
            <div className="flex flex-wrap gap-3.5 items-end py-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  className="accent-accent h-4 w-4"
                />
                Remove Duplicates
              </label>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={removeEmptyLines}
                  onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                  className="accent-accent h-4 w-4"
                />
                Remove Empty Lines
              </label>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={trimLines}
                  onChange={(e) => setTrimLines(e.target.checked)}
                  className="accent-accent h-4 w-4"
                />
                Trim Whitespace
              </label>
            </div>

          </div>
        </div>

        {/* Workspaces textareas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input list */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-accent" /> Input List
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste list items here (one entry per line)..."
              rows={14}
              className="w-full rounded-xl border border-border-color bg-background p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
            />
          </div>

          {/* Output list */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <ListFilter className="h-4.5 w-4.5 text-success" /> Clean & Sorted Output
              </label>
              {outputText && (
                <button
                  onClick={handleCopyToClipboard}
                  className="py-1 px-2.5 rounded border border-border-color bg-background hover:bg-hover-bg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Output"}
                </button>
              )}
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="Clean output will display here after processing..."
              rows={14}
              className="w-full rounded-xl border border-border-color bg-secondary-bg/10 p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
            />
          </div>

        </div>

        {/* Metrics Display */}
        {originalCount > 0 && (
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-accent" /> Process Metrics
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-secondary-bg/20 p-2.5 rounded-xl border border-border-color/40">
                <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Original Lines</div>
                <div className="text-base font-mono font-bold text-primary-text mt-0.5">{originalCount}</div>
              </div>
              <div className="bg-secondary-bg/20 p-2.5 rounded-xl border border-border-color/40">
                <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Final Lines</div>
                <div className="text-base font-mono font-bold text-accent mt-0.5">{finalCount}</div>
              </div>
              <div className="bg-success/5 p-2.5 rounded-xl border border-success/15">
                <div className="text-[10px] text-success font-bold uppercase tracking-wider">Duplicates Removed</div>
                <div className="text-base font-mono font-bold text-success mt-0.5">{dupesRemoved}</div>
              </div>
              <div className="bg-success/5 p-2.5 rounded-xl border border-success/15">
                <div className="text-[10px] text-success font-bold uppercase tracking-wider">Empty Removed</div>
                <div className="text-base font-mono font-bold text-success mt-0.5">{emptyRemoved}</div>
              </div>
            </div>
          </div>
        )}

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
            onClick={handleCleanList}
            className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer"
          >
            Clean & Sort List
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
