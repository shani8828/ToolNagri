"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Settings, Copy, Check, Info, AlertTriangle } from "lucide-react";

interface MatchResult {
  text: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("(\\w+)@(\\w+)\\.(\\w+)");
  const [flags, setFlags] = useState({ g: true, i: true, m: false });
  const [testText, setTestText] = useState("Contact founder at info@ayodhyaserenity.com or developer at code@toolnagri.com.");
  
  const [isValid, setIsValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [explanation, setExplanation] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compile regex and search testText
  useEffect(() => {
    setIsValid(true);
    setErrorMsg(null);
    setMatches([]);
    setExplanation([]);

    if (!pattern) return;

    try {
      const activeFlags = `${flags.g ? "g" : ""}${flags.i ? "i" : ""}${flags.m ? "m" : ""}`;
      const regex = new RegExp(pattern, activeFlags);
      
      // 1. Gather matches
      let match;
      const results: MatchResult[] = [];
      
      if (flags.g) {
        while ((match = regex.exec(testText)) !== null) {
          // Prevent infinite loop if regex matches empty string
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      setMatches(results);

      // 2. Build plain English explanation of common tokens
      const expls: string[] = [];
      if (pattern.includes("\\d")) expls.push("\\d: Matches any digit (0-9).");
      if (pattern.includes("\\w")) expls.push("\\w: Matches any alphanumeric word character (letters, numbers, underscore).");
      if (pattern.includes("\\s")) expls.push("\\s: Matches any whitespace character (space, tab, newline).");
      if (pattern.includes("^")) expls.push("^: Asserts the start of the string or line.");
      if (pattern.includes("$")) expls.push("$: Asserts the end of the string or line.");
      if (pattern.includes("+")) expls.push("+: Quantifier matching 1 or more times (greedy).");
      if (pattern.includes("*")) expls.push("*: Quantifier matching 0 or more times (greedy).");
      if (pattern.includes("?")) expls.push("?: Matches 0 or 1 time (optional, or lazy quantifier depending on context).");
      if (pattern.includes(".")) expls.push(".: Matches any single character except newline.");
      if (pattern.includes("(")) expls.push("(...): Capturing group to extract and filter match segments.");
      if (pattern.includes("[")) expls.push("[...]: Character class matching any character inside the boundaries.");
      
      if (expls.length === 0) {
        expls.push("No special modifiers detected. Matches literal characters exact sequences.");
      }
      setExplanation(expls);

    } catch (err: any) {
      setIsValid(false);
      setErrorMsg(err.message);
    }
  }, [pattern, flags, testText]);

  const howToUse = [
    "Enter your regular expression pattern in the pattern input box (excluding outer slashes).",
    "Toggle matching flag parameters: Global (g), Case-Insensitive (i), or Multiline (m).",
    "Type or paste your test text strings in the primary text panel.",
    "Inspect matches highlighted in the output list, coordinate indexes, and look up plain English token explanations."
  ];

  const benefits = [
    "Test query patterns client-side safely without uploading data to servers.",
    "Real-time coordinate index locating for every search matches group.",
    "Plain English helper translations explaining what major regex keys accomplish.",
    "Highlights syntax errors in expression strings automatically."
  ];

  const faqs = [
    {
      question: "Why does it return multiple matches when Global is checked?",
      answer: "The Global (g) flag instructs the search engine to look for all possible occurrences in the target string. Without it, the search finishes after finding the first match.",
    },
    {
      question: "Can I copy the compiled regular expression?",
      answer: "Yes, you can copy the full expression formatted with slashes and flags directly using the copy buttons in the result headers."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, parse, and validate JSON payloads." },
    { name: "Word Counter", url: "/word-counter", description: "Analyze characters, paragraphs, and reading times." }
  ];

  // Helper to highlight matching text
  const renderHighlightedText = () => {
    if (matches.length === 0 || !pattern || !isValid) return testText;
    
    try {
      const activeFlags = `${flags.g ? "g" : ""}${flags.i ? "i" : ""}${flags.m ? "m" : ""}`;
      const regex = new RegExp(`(${pattern})`, activeFlags);
      const parts = testText.split(regex);
      
      return parts.map((part, index) => {
        const isMatch = regex.test(part);
        return isMatch ? (
          <span key={index} className="bg-accent/15 text-accent font-bold px-0.5 rounded border border-accent/20">
            {part}
          </span>
        ) : (
          part
        );
      });
    } catch {
      return testText;
    }
  };

  return (
    <ToolLayout
      title="Regular Expression Tester"
      description="Test regular expressions client-side with syntax highlighting, group extraction, and token explanations."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Pattern & Flags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-secondary-bg/25 p-5 rounded-xl border border-border-color">
          
          {/* Pattern input */}
          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor="patternInput" className="text-xs font-bold text-secondary-text uppercase tracking-wider">Regex Pattern</label>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-secondary-text font-bold">/</span>
              <input
                type="text"
                id="patternInput"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="(\w+)@(\w+)\.(\w+)"
                className="w-full rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
              />
              <span className="text-secondary-text font-bold">/</span>
              <span className="text-accent font-bold text-sm">
                {flags.g ? "g" : ""}{flags.i ? "i" : ""}{flags.m ? "m" : ""}
              </span>
            </div>
          </div>

          {/* Flags select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider">Flags</label>
            <div className="flex gap-4 pt-1.5">
              <label className="flex items-center gap-1.5 text-xs text-secondary-text font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.g}
                  onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
                  className="rounded border-border-color text-accent focus:ring-accent"
                />
                Global (g)
              </label>
              <label className="flex items-center gap-1.5 text-xs text-secondary-text font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.i}
                  onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
                  className="rounded border-border-color text-accent focus:ring-accent"
                />
                Case-Insensitive (i)
              </label>
              <label className="flex items-center gap-1.5 text-xs text-secondary-text font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.m}
                  onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
                  className="rounded border-border-color text-accent focus:ring-accent"
                />
                Multiline (m)
              </label>
            </div>
          </div>

        </div>

        {/* Input Test String */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="testText" className="text-sm font-semibold text-primary-text">Test Text String</label>
            <textarea
              id="testText"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Type matching queries here..."
              rows={8}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none"
            />
          </div>

          {/* Highlighted Result Display */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-text">Highlighted Match Results</label>
            <div className="w-full min-h-[178px] rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-sm text-primary-text leading-relaxed whitespace-pre-wrap select-text font-sans">
              {renderHighlightedText()}
            </div>
          </div>
        </div>

        {/* Syntax error banner */}
        {!isValid && errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            Regex Compile Error: {errorMsg}
          </div>
        )}

        {/* Output Matches & Explanations */}
        {isValid && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Matches list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-primary-text uppercase tracking-wider">
                  Matches List ({matches.length})
                </h4>
                {pattern && (
                  <button
                    onClick={() => handleCopy(`/${pattern}/${flags.g ? "g" : ""}${flags.i ? "i" : ""}${flags.m ? "m" : ""}`)}
                    className="flex items-center gap-1 px-2 py-0.5 text-[10px] border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy Regex
                  </button>
                )}
              </div>
              
              <div className="border border-border-color rounded-xl overflow-hidden max-h-[220px] overflow-y-auto bg-white shadow-xs">
                {matches.length === 0 ? (
                  <div className="p-6 text-center text-xs text-secondary-text">No matches found.</div>
                ) : (
                  <table className="min-w-full divide-y divide-border-color text-left text-xs">
                    <thead className="bg-secondary-bg font-semibold text-secondary-text">
                      <tr>
                        <th className="px-3 py-2 w-12">Match</th>
                        <th className="px-3 py-2 w-16">Index</th>
                        <th className="px-3 py-2">Capturing Groups</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      {matches.map((item, idx) => (
                        <tr key={idx} className="hover:bg-hover-bg/30">
                          <td className="px-3 py-2 font-semibold text-accent font-mono">{item.text}</td>
                          <td className="px-3 py-2 text-secondary-text font-mono">{item.index}</td>
                          <td className="px-3 py-2 text-secondary-text font-mono">
                            {item.groups.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {item.groups.map((g, gIdx) => (
                                  <span key={gIdx} className="bg-secondary-bg border border-border-color/80 px-1 py-0.2 rounded text-[10px] text-primary-text">
                                    ${gIdx + 1}: &quot;{g}&quot;
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="italic text-[10px]">None</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Explanation box */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1">
                <Info className="h-4 w-4 text-accent" /> Regex Tokens Explained
              </h4>
              <div className="border border-border-color rounded-xl p-4 bg-secondary-bg/15 text-xs text-secondary-text space-y-2 max-h-[220px] overflow-y-auto">
                {explanation.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start leading-relaxed">
                    <span className="text-accent font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </ToolLayout>
  );
}
