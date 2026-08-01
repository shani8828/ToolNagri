"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { ArrowLeftRight, Copy, Check, RefreshCw, Eye, Settings, Columns, AlignLeft } from "lucide-react";
import confetti from "canvas-confetti";

interface DiffSegment {
  type: "add" | "delete" | "equal";
  text: string;
  subDiffs?: TokenSegment[];
}

interface TokenSegment {
  type: "add" | "delete" | "equal";
  text: string;
}

export default function TextDiff() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [diffResult, setDiffResult] = useState<DiffSegment[] | null>(null);

  const [viewMode, setViewMode] = useState<"split" | "inline">("split");
  const [diffLevel, setDiffLevel] = useState<"line" | "word" | "char">("word");
  const [ignoreCase, setIgnoreCase] = useState(false);

  const [copied, setCopied] = useState(false);

  // LCS Matrix Diff Generator
  const lcsDiff = <T,>(
    oldArr: T[],
    newArr: T[],
    compareFn: (a: T, b: T) => boolean
  ): { type: "add" | "delete" | "equal"; value: T }[] => {
    const matrix = Array(oldArr.length + 1)
      .fill(0)
      .map(() => Array(newArr.length + 1).fill(0));

    for (let i = 1; i <= oldArr.length; i++) {
      for (let j = 1; j <= newArr.length; j++) {
        if (compareFn(oldArr[i - 1], newArr[j - 1])) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }

    let i = oldArr.length;
    let j = newArr.length;
    const result: { type: "add" | "delete" | "equal"; value: T }[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && compareFn(oldArr[i - 1], newArr[j - 1])) {
        result.unshift({ type: "equal", value: oldArr[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
        result.unshift({ type: "add", value: newArr[j - 1] });
        j--;
      } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
        result.unshift({ type: "delete", value: oldArr[i - 1] });
        i--;
      }
    }
    return result;
  };

  const getSubDiffTokens = (oldStr: string, newStr: string): TokenSegment[] => {
    const compare = (a: string, b: string) =>
      ignoreCase ? a.toLowerCase() === b.toLowerCase() : a === b;

    if (diffLevel === "char") {
      const oldChars = oldStr.split("");
      const newChars = newStr.split("");
      return lcsDiff(oldChars, newChars, compare).map((item) => ({
        type: item.type,
        text: item.value
      }));
    } else {
      // Word level: split by word boundary while keeping spacing tokens
      const oldWords = oldStr.split(/(\s+)/);
      const newWords = newStr.split(/(\s+)/);
      return lcsDiff(oldWords, newWords, compare).map((item) => ({
        type: item.type,
        text: item.value
      }));
    }
  };

  const handleCompare = () => {
    const oldLines = oldText.split(/\r?\n/);
    const newLines = newText.split(/\r?\n/);

    const compareLine = (a: string, b: string) =>
      ignoreCase ? a.toLowerCase() === b.toLowerCase() : a === b;

    const lineDiff = lcsDiff(oldLines, newLines, compareLine);

    // If word or char diff is requested, post-process deleted/added line pairs to sub-diff them
    const result: DiffSegment[] = [];
    
    for (let i = 0; i < lineDiff.length; i++) {
      const current = lineDiff[i];
      const next = lineDiff[i + 1];

      // If we see a deleted line followed by an added line, pair them for sub-word/char diffing
      if (
        diffLevel !== "line" &&
        current.type === "delete" &&
        next &&
        next.type === "add"
      ) {
        const subDiffs = getSubDiffTokens(current.value, next.value);
        
        result.push({
          type: "delete",
          text: current.value,
          subDiffs: subDiffs.filter((s) => s.type !== "add") // Filter out the added tokens for deletion display
        });
        result.push({
          type: "add",
          text: next.value,
          subDiffs: subDiffs.filter((s) => s.type !== "delete") // Filter out the deleted tokens for addition display
        });

        i++; // skip next since we paired it
      } else {
        result.push({
          type: current.type,
          text: current.value
        });
      }
    }

    setDiffResult(result);
  };

  useEffect(() => {
    if (oldText || newText) {
      handleCompare();
    }
  }, [diffLevel, ignoreCase]);

  const handleCopyToClipboard = () => {
    if (!diffResult) return;
    const summary = diffResult
      .map((item) => `${item.type === "add" ? "+" : item.type === "delete" ? "-" : " "} ${item.text}`)
      .join("\n");
    
    navigator.clipboard.writeText(summary);
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
    setOldText("");
    setNewText("");
    setDiffResult(null);
  };

  const renderSubDiff = (item: DiffSegment) => {
    if (!item.subDiffs) return <span>{item.text}</span>;

    return (
      <>
        {item.subDiffs.map((sub, idx) => (
          <span
            key={idx}
            className={
              sub.type === "add"
                ? "bg-green-300/60 dark:bg-green-700/65 font-bold px-0.5 rounded text-green-950 dark:text-green-50"
                : sub.type === "delete"
                ? "bg-red-300/60 dark:bg-red-700/65 font-bold line-through px-0.5 rounded text-red-950 dark:text-red-50"
                : ""
            }
          >
            {sub.text}
          </span>
        ))}
      </>
    );
  };

  const howToUse = [
    "Paste your original baseline content in the left panel.",
    "Paste your modified updated content in the right panel.",
    "Choose your view output layout: Split (side-by-side) or Inline (merged rows).",
    "Adjust sensitivity switches: Line level matching, Word level, or Character level details.",
    "Check Case Sensitivity if you want letter capitalization changes flagged."
  ];

  const benefits = [
    "Upgraded multi-resolution matching (supports Line, Word, and Character precision).",
    "Interactive view selector toggles side-by-side and inline grids.",
    "Paired alignment highlights inner additions/removals with nested highlight layers.",
    "100% Client-Side parsing handles sensitive code and parameters locally."
  ];

  const faqs = [
    {
      question: "How does the sub-word checker align lines?",
      answer: "When a deleted line is adjacent to an added line, the engine runs a secondary LCS alignment pass on words or characters, highlighting exact insertions/deletions inside the line itself."
    },
    {
      question: "What is the limit of text comparisons?",
      answer: "Because LCS uses quadratic space-time dimensions, we suggest files under 2,000 lines to preserve instant response rates without loading down browser tabs."
    }
  ];

  const relatedTools = [
    { name: "Word Counter", url: "/word-counter", description: "Count words, lines, and spaces." },
    { name: "JSON Formatter", url: "/json-formatter", description: "Format, validate, and prettify JSON structures." }
  ];

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two text blocks. Highlight exact line, word, or character changes side-by-side or inline."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Configuration Bars */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary-bg/25 p-4 rounded-xl border border-border-color/60 text-xs">
          
          <div className="flex flex-wrap items-center gap-4">
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-secondary-text uppercase tracking-wider">View Mode:</span>
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background font-semibold">
                <button
                  onClick={() => setViewMode("split")}
                  className={`py-1 px-3 rounded-md cursor-pointer transition-colors flex items-center gap-1 ${
                    viewMode === "split" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  <Columns className="h-3 w-3" /> Split
                </button>
                <button
                  onClick={() => setViewMode("inline")}
                  className={`py-1 px-3 rounded-md cursor-pointer transition-colors flex items-center gap-1 ${
                    viewMode === "inline" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  <AlignLeft className="h-3 w-3" /> Inline
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-secondary-text uppercase tracking-wider">Resolution:</span>
              <select
                value={diffLevel}
                onChange={(e) => setDiffLevel(e.target.value as any)}
                className="py-1.5 px-2.5 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none cursor-pointer"
              >
                <option value="line">Line Level Only</option>
                <option value="word">Word Highlights</option>
                <option value="char">Character Highlights</option>
              </select>
            </div>

          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border-color pt-3 md:pt-0 md:pl-4">
            <label className="flex items-center gap-1.5 font-bold text-secondary-text hover:text-primary-text cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="accent-accent h-3.5 w-3.5"
              />
              Ignore Case
            </label>
          </div>

        </div>

        {/* Inputs Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-accent" /> Original Text (Old)
            </label>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste original copy versions here..."
              rows={8}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-accent" /> Modified Text (New)
            </label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste updated changes here..."
              rows={8}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleCompare}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <ArrowLeftRight className="h-4 w-4" /> Run Text Comparison
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 border border-border-color hover:bg-hover-bg text-secondary-text hover:text-primary-text rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Clear Fields
          </button>
        </div>

        {/* Diff Output Results */}
        {diffResult !== null && (
          <div className="border border-border-color rounded-2xl overflow-hidden bg-card-bg">
            <div className="bg-secondary-bg/20 px-4 py-3 border-b border-border-color flex justify-between items-center">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-success" /> Diff Output Results
              </span>
              <div className="flex gap-4 text-[10px] font-bold text-secondary-text">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-green-200/60 border border-green-300 rounded" /> Added
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-red-200/60 border border-red-300 rounded" /> Deleted
                </span>
                {diffResult.length > 0 && (
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-1 ml-2 border border-border-color hover:bg-hover-bg px-2 py-0.5 rounded text-[10px] font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied" : "Copy Diff"}
                  </button>
                )}
              </div>
            </div>

            {/* Split View Rendering */}
            {viewMode === "split" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-color font-mono text-[11px] overflow-x-auto select-text bg-slate-50/50 dark:bg-zinc-950/20 max-h-90 overflow-y-auto">
                
                {/* Left Side: Old (Deletions + Equals) */}
                <div className="p-4 space-y-0.5">
                  <div className="text-[10px] font-bold text-secondary-text uppercase tracking-wider pb-2 border-b border-border-color/40 mb-2 select-none">
                    Original Baseline
                  </div>
                  {diffResult.filter((item) => item.type !== "add").length === 0 ? (
                    <div className="text-center text-secondary-text py-8 italic">No entries.</div>
                  ) : (
                    diffResult
                      .filter((item) => item.type !== "add")
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2 py-0.5 px-2 rounded ${
                            item.type === "delete"
                              ? "bg-red-100/50 dark:bg-red-950/20 text-red-800 dark:text-red-200 border-l-2 border-red-500"
                              : "text-secondary-text border-l-2 border-transparent"
                          }`}
                        >
                          <span className="w-4 select-none opacity-40">
                            {item.type === "delete" ? "-" : " "}
                          </span>
                          <span className="whitespace-pre-wrap">{renderSubDiff(item)}</span>
                        </div>
                      ))
                  )}
                </div>

                {/* Right Side: New (Additions + Equals) */}
                <div className="p-4 space-y-0.5">
                  <div className="text-[10px] font-bold text-secondary-text uppercase tracking-wider pb-2 border-b border-border-color/40 mb-2 select-none">
                    Modified Output
                  </div>
                  {diffResult.filter((item) => item.type !== "delete").length === 0 ? (
                    <div className="text-center text-secondary-text py-8 italic">No entries.</div>
                  ) : (
                    diffResult
                      .filter((item) => item.type !== "delete")
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2 py-0.5 px-2 rounded ${
                            item.type === "add"
                              ? "bg-green-100/50 dark:bg-green-950/20 text-green-800 dark:text-green-200 border-l-2 border-green-500"
                              : "text-secondary-text border-l-2 border-transparent"
                          }`}
                        >
                          <span className="w-4 select-none opacity-40">
                            {item.type === "add" ? "+" : " "}
                          </span>
                          <span className="whitespace-pre-wrap">{renderSubDiff(item)}</span>
                        </div>
                      ))
                  )}
                </div>

              </div>
            ) : (
              /* Inline Unified View Rendering */
              <div className="p-4 font-mono text-[11px] overflow-x-auto select-text bg-slate-50/50 dark:bg-zinc-950/20 max-h-90 overflow-y-auto space-y-0.5">
                {diffResult.length === 0 ? (
                  <div className="text-center text-secondary-text py-8 italic">No differences found. Texts match perfectly.</div>
                ) : (
                  diffResult.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 py-0.5 px-2 rounded ${
                        item.type === "add"
                          ? "bg-green-100/50 dark:bg-green-950/20 text-green-800 dark:text-green-200 border-l-2 border-green-500"
                          : item.type === "delete"
                          ? "bg-red-100/50 dark:bg-red-950/20 text-red-800 dark:text-red-200 border-l-2 border-red-500"
                          : "text-secondary-text border-l-2 border-transparent"
                      }`}
                    >
                      <span className="w-4 select-none opacity-40">
                        {item.type === "add" ? "+" : item.type === "delete" ? "-" : " "}
                      </span>
                      <span className="whitespace-pre-wrap">{renderSubDiff(item)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
