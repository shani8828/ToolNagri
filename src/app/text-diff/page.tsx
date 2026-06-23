"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { ArrowLeftRight, Copy, Check, Info } from "lucide-react";

interface DiffSegment {
  type: "add" | "delete" | "equal";
  text: string;
}

// LCS Line diff engine
function diffLines(oldLines: string[], newLines: string[]): DiffSegment[] {
  const matrix = Array(oldLines.length + 1).fill(0).map(() => Array(newLines.length + 1).fill(0));
  
  for (let i = 1; i <= oldLines.length; i++) {
    for (let j = 1; j <= newLines.length; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }
  
  let i = oldLines.length;
  let j = newLines.length;
  const result: DiffSegment[] = [];
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: "equal", text: oldLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      result.unshift({ type: "add", text: newLines[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      result.unshift({ type: "delete", text: oldLines[i - 1] });
      i--;
    }
  }
  return result;
}

export default function TextDiff() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [diffResult, setDiffResult] = useState<DiffSegment[] | null>(null);

  const handleCompare = () => {
    const oldLines = oldText.split(/\r?\n/);
    const newLines = newText.split(/\r?\n/);
    setDiffResult(diffLines(oldLines, newLines));
  };

  const clearAll = () => {
    setOldText("");
    setNewText("");
    setDiffResult(null);
  };

  const howToUse = [
    "Enter your original base text in the left input textarea.",
    "Enter your modified text in the right input textarea.",
    "Click the 'Compare Texts' button to run the LCS line difference analyzer.",
    "Review highlighted deletions (red highlights) and additions (green highlights) line-by-line."
  ];

  const benefits = [
    "Checks differences line-by-line using a precise Longest Common Subsequence (LCS) algorithm.",
    "Color-coded highlights show additions (green) and deletions (red) in real-time.",
    "100% browser-side processing ensuring copy-paste files remain private.",
    "Excellent for reviewing code versions, articles, and text adjustments."
  ];

  const faqs = [
    {
      question: "How does the side-by-side or inline view show changes?",
      answer: "Deleted lines are highlighted in red with a minus (-) sign, representing content present in the original but removed in the modified version. Added lines are highlighted in green with a plus (+) sign.",
    },
    {
      question: "Is there a limit on text length?",
      answer: "The LCS matrix algorithm runs in O(N*M) space and time. We recommend text files under 2,000 lines to maintain immediate response speeds."
    }
  ];

  const relatedTools = [
    { name: "Word Counter", url: "/word-counter", description: "Analyze characters, paragraphs, and reading times." },
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, parse, and validate JSON payloads." }
  ];

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two text blocks side-by-side to highlight line additions, deletions, and structural edits instantly."
      category="Text Tools"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Input columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Text */}
          <div className="space-y-1.5">
            <label htmlFor="oldTextArea" className="text-sm font-semibold text-primary-text">Original Text (Old)</label>
            <textarea
              id="oldTextArea"
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste original copy here..."
              rows={10}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none"
            />
          </div>

          {/* Modified Text */}
          <div className="space-y-1.5">
            <label htmlFor="newTextArea" className="text-sm font-semibold text-primary-text">Modified Text (New)</label>
            <textarea
              id="newTextArea"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste modified copy here..."
              rows={10}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleCompare}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <ArrowLeftRight className="h-4 w-4" /> Compare Texts
          </button>
          <button
            onClick={clearAll}
            className="px-6 py-2.5 border border-border-color hover:bg-hover-bg text-secondary-text hover:text-primary-text rounded-lg text-sm font-semibold cursor-pointer transition-colors"
          >
            Clear Fields
          </button>
        </div>

        {/* Diff Output Results */}
        {diffResult !== null && (
          <div className="border border-border-color rounded-xl overflow-hidden shadow-xs bg-white">
            <div className="bg-secondary-bg px-4 py-3 border-b border-border-color flex justify-between items-center">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider">Comparison Output</span>
              <div className="flex gap-4 text-xs font-semibold text-secondary-text">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-150 border border-green-300 rounded" /> Added</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-150 border border-red-300 rounded" /> Deleted</span>
              </div>
            </div>
            
            <div className="p-4 font-mono text-xs overflow-x-auto max-h-[350px] overflow-y-auto space-y-0.5 scrollbar-thin select-text bg-slate-50">
              {diffResult.length === 0 ? (
                <div className="text-center text-secondary-text p-6">No lines found. Texts match perfectly.</div>
              ) : (
                diffResult.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-2 py-0.5 px-2 rounded font-mono ${
                      item.type === "add" 
                        ? "bg-green-100/50 text-green-800 border-l-2 border-green-500" 
                        : item.type === "delete" 
                        ? "bg-red-100/50 text-red-800 line-through border-l-2 border-red-500" 
                        : "text-secondary-text border-l-2 border-transparent"
                    }`}
                  >
                    <span className="w-4 select-none opacity-40">
                      {item.type === "add" ? "+" : item.type === "delete" ? "-" : " "}
                    </span>
                    <span className="whitespace-pre">{item.text || " "}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
