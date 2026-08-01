"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Replace, Search, AlertCircle, FileText } from "lucide-react";

export default function TextFindReplace() {
  const [text, setText] = useState("");
  const [findStr, setFindStr] = useState("");
  const [replaceStr, setReplaceStr] = useState("");
  
  // Options
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const [matchCount, setMatchCount] = useState(0);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Re-calculate matches when text, query, or option changes
  useEffect(() => {
    setError("");
    setMatchCount(0);
    setHighlightedHtml("");

    if (!text || !findStr) {
      return;
    }

    try {
      let pattern = findStr;
      if (!useRegex) {
        // Escape regex special chars
        pattern = findStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }

      if (wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }

      const flags = caseSensitive ? "g" : "gi";
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      const count = matches ? matches.length : 0;
      setMatchCount(count);

      // Generate highlighted HTML preview
      // Escape HTML characters in source first to prevent XSS
      const safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const highlightRegex = new RegExp(pattern, flags);
      const highlighted = safeText.replace(
        highlightRegex,
        (match) => `<mark class="bg-warning/40 text-primary-text font-semibold rounded px-0.5">${match}</mark>`
      );
      setHighlightedHtml(highlighted);
    } catch (err: any) {
      setError(err.message || "Invalid search pattern.");
    }
  }, [text, findStr, caseSensitive, useRegex, wholeWord]);

  const handleReplace = () => {
    setError("");
    if (!text) return;
    if (!findStr) {
      setError("Please specify a string to find first.");
      return;
    }

    try {
      let pattern = findStr;
      if (!useRegex) {
        pattern = findStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      if (wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }

      const flags = caseSensitive ? "g" : "gi";
      const regex = new RegExp(pattern, flags);
      const newText = text.replace(regex, replaceStr);
      setText(newText);
    } catch (err: any) {
      setError(err.message || "Failed to execute replacement.");
    }
  };

  const handleCopyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setText("");
    setFindStr("");
    setReplaceStr("");
    setError("");
  };

  const howToUse = [
    "Paste your source text in the primary Text Input box.",
    "Specify the target query character string you wish to Find.",
    "Input your replacement characters in the Replace text box.",
    "Configure case sensitivity, whole word, or regex toggle parameters.",
    "Observe real-time highlights in the preview frame and click Replace All."
  ];

  const benefits = [
    "Supports advanced Regular Expressions search matches.",
    "Features a live side-by-side highlighted match preview overlay.",
    "Allows multi-line replacements instantly.",
    "100% Client-Side parsing keeps confidential text secure in your browser."
  ];

  const faqs = [
    {
      question: "What is whole word matching?",
      answer: "Whole word matching restricts results to full characters bounded by spaces or punctuation. For example, finding 'cat' will not match 'catalog' or 'category'."
    },
    {
      question: "How do regular expressions work in searches?",
      answer: "Regular expressions (Regex) let you match variable patterns. For example, search query `\\d+` matches any sequence of numbers, and `\\s+` matches consecutive white spaces."
    }
  ];

  const relatedTools = [
    { name: "Character Counter", url: "/character-counter", description: "Count letters and lines inside a paragraph." },
    { name: "Text Diff Checker", url: "/text-diff", description: "Compare two texts and highlight changes." }
  ];

  return (
    <ToolLayout
      title="Text Find & Replace"
      description="Find and replace text sequences with advanced options. Supports case-sensitivity toggles, match whole words, regular expressions, and live highlight previews."
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
            Search Settings
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Find input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Find Text</label>
              <div className="relative">
                <input
                  type="text"
                  value={findStr}
                  onChange={(e) => setFindStr(e.target.value)}
                  placeholder="Query to search..."
                  className="w-full py-2 pl-9 pr-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-secondary-text" />
              </div>
            </div>

            {/* Replace input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Replace With</label>
              <div className="relative">
                <input
                  type="text"
                  value={replaceStr}
                  onChange={(e) => setReplaceStr(e.target.value)}
                  placeholder="New replacement text..."
                  className="w-full py-2 pl-9 pr-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
                <Replace className="absolute left-3 top-2.5 h-4 w-4 text-secondary-text" />
              </div>
            </div>

            {/* Switches */}
            <div className="flex flex-wrap gap-2.5 items-end py-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="accent-accent h-3.5 w-3.5"
                />
                Case-Sensitive
              </label>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={wholeWord}
                  onChange={(e) => setWholeWord(e.target.checked)}
                  className="accent-accent h-3.5 w-3.5"
                />
                Whole Word
              </label>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRegex}
                  onChange={(e) => setUseRegex(e.target.checked)}
                  className="accent-accent h-3.5 w-3.5"
                />
                Use Regular Exp (Regex)
              </label>
            </div>

          </div>
        </div>

        {/* Text Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Text Input area */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-accent" /> Source Text
              </label>
              {text && (
                <button
                  onClick={handleCopyToClipboard}
                  className="py-1 px-2.5 rounded border border-border-color bg-background hover:bg-hover-bg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              )}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your main text block here..."
              rows={15}
              className="w-full rounded-xl border border-border-color bg-background p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
            />
          </div>

          {/* Matches Highlight Live Preview */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider">Matches Highlight Preview</label>
              {findStr && (
                <span className="text-xs font-mono font-bold text-accent">
                  Found: {matchCount} matches
                </span>
              )}
            </div>
            
            <div className="w-full h-90 border border-border-color rounded-xl overflow-y-auto bg-secondary-bg/20 p-4 text-sm font-mono text-primary-text whitespace-pre-wrap leading-relaxed">
              {highlightedHtml ? (
                <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
              ) : (
                <div className="text-secondary-text italic text-center py-20">
                  {findStr ? "No matches found." : "Matches will highlight here in real-time as you search."}
                </div>
              )}
            </div>
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
            onClick={handleReplace}
            className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer"
          >
            Replace All Occurrences
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
