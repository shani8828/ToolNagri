"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, BarChart3, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

const STOPWORDS = new Set([
  "the", "and", "a", "of", "to", "in", "is", "that", "it", "for", "on", "with", "as", 
  "at", "by", "an", "be", "this", "are", "from", "or", "was", "but", "not", "he", 
  "she", "they", "we", "you", "their", "his", "her", "its", "it's", "has", "have", 
  "had", "do", "does", "did", "can", "will", "would", "should", "could", "about", 
  "about", "been", "were", "there", "their", "then", "more", "some", "than", "other"
]);

interface DensityResult {
  keyword: string;
  count: number;
  density: number;
}

export default function KeywordDensityAnalyzer() {
  const [text, setText] = useState("");
  const [minWordLength, setMinWordLength] = useState(3);
  const [ignoreStopwords, setIgnoreStopwords] = useState(true);
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);

  // Analysis state
  const [totalWords, setTotalWords] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [uniqueWords, setUniqueWords] = useState(0);
  
  const [oneWordResults, setOneWordResults] = useState<DensityResult[]>([]);
  const [twoWordResults, setTwoWordResults] = useState<DensityResult[]>([]);
  const [threeWordResults, setThreeWordResults] = useState<DensityResult[]>([]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!text.trim()) {
      setTotalWords(0);
      setTotalChars(0);
      setUniqueWords(0);
      setOneWordResults([]);
      setTwoWordResults([]);
      setThreeWordResults([]);
      return;
    }

    setTotalChars(text.length);

    // Clean text: lowercase and split by non-alphabetic characters
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s']/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 0);

    setTotalWords(words.length);

    // 1-Word analysis
    const oneWordCounts: Record<string, number> = {};
    words.forEach((w) => {
      if (ignoreStopwords && STOPWORDS.has(w)) return;
      if (w.length < minWordLength) return;
      oneWordCounts[w] = (oneWordCounts[w] || 0) + 1;
    });

    setUniqueWords(Object.keys(oneWordCounts).length);

    const oneWordArr: DensityResult[] = Object.entries(oneWordCounts)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: parseFloat(((count / words.length) * 100).toFixed(2))
      }))
      .sort((a, b) => b.count - a.count);

    setOneWordResults(oneWordArr);

    // 2-Word analysis (Bigrams)
    const twoWordCounts: Record<string, number> = {};
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      if (ignoreStopwords && (STOPWORDS.has(w1) || STOPWORDS.has(w2))) continue;
      if (w1.length < minWordLength || w2.length < minWordLength) continue;

      const phrase = `${w1} ${w2}`;
      twoWordCounts[phrase] = (twoWordCounts[phrase] || 0) + 1;
    }

    const twoWordArr: DensityResult[] = Object.entries(twoWordCounts)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: parseFloat(((count / (words.length - 1 || 1)) * 100).toFixed(2))
      }))
      .sort((a, b) => b.count - a.count);

    setTwoWordResults(twoWordArr);

    // 3-Word analysis (Trigrams)
    const threeWordCounts: Record<string, number> = {};
    for (let i = 0; i < words.length - 2; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      const w3 = words[i + 2];
      if (ignoreStopwords && (STOPWORDS.has(w1) || STOPWORDS.has(w2) || STOPWORDS.has(w3))) continue;
      if (w1.length < minWordLength || w2.length < minWordLength || w3.length < minWordLength) continue;

      const phrase = `${w1} ${w2} ${w3}`;
      threeWordCounts[phrase] = (threeWordCounts[phrase] || 0) + 1;
    }

    const threeWordArr: DensityResult[] = Object.entries(threeWordCounts)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: parseFloat(((count / (words.length - 2 || 1)) * 100).toFixed(2))
      }))
      .sort((a, b) => b.count - a.count);

    setThreeWordResults(threeWordArr);

  }, [text, minWordLength, ignoreStopwords]);

  const handleCopyToClipboard = () => {
    const list = activeTab === 1 ? oneWordResults : activeTab === 2 ? twoWordResults : threeWordResults;
    if (list.length === 0) return;

    const exportText = list
      .slice(0, 50)
      .map((item, idx) => `${idx + 1}. "${item.keyword}" - Count: ${item.count} (${item.density}%)`)
      .join("\n");

    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setText("");
    setMinWordLength(3);
    setIgnoreStopwords(true);
  };

  const activeList = activeTab === 1 ? oneWordResults : activeTab === 2 ? twoWordResults : threeWordResults;

  const howToUse = [
    "Paste your copy or blog draft inside the main Input Text area.",
    "Adjust minimum word length threshold configurations (e.g. 3 letters).",
    "Toggle ignore common English stop-words (and, the, an) to clear noise.",
    "Toggle between 1-word, 2-word, or 3-word tabs to review keywords.",
    "Identify phrases that exceed 3.5% density thresholds to avoid stuffing flags."
  ];

  const benefits = [
    "Identifies keyword stuffing occurrences automatically.",
    "Supports Bigram (2-word) and Trigram (3-word) phrase compilation.",
    "Filters out grammatical noise (stop-words) for precise scanning.",
    "100% Client-Side parsing ensures confidential drafts remain local."
  ];

  const faqs = [
    {
      question: "What is keyword stuffing?",
      answer: "Keyword stuffing is the practice of loading a webpage with keywords in an attempt to manipulate search engine rankings. Modern search engines penalize this behavior. Keep core keywords below 3.5% density."
    },
    {
      question: "What is an N-gram phrase?",
      answer: "An N-gram is a contiguous sequence of N words. A 1-gram is a single word, a 2-gram (Bigram) is a two-word phrase (e.g. 'search engine'), and a 3-gram (Trigram) is a three-word phrase (e.g. 'keyword density checker')."
    }
  ];

  const relatedTools = [
    { name: "Character Counter", url: "/character-counter", description: "Count words, spaces, and lines inside text." },
    { name: "Meta Tag Generator", url: "/meta-tag-generator", description: "Build and preview HTML search metadata tags." }
  ];

  return (
    <ToolLayout
      title="Keyword Density Checker"
      description="Scan content to analyze keyword occurrence counts and ratios. Displays top 1-word, 2-word, and 3-word phrases to optimize copy and prevent search engine stuffing."
      category="SEO & Marketing Tools"
      categoryUrl="/#seo"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Configurations panel */}
        <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
          <span className="text-xs font-bold text-primary-text uppercase tracking-wider block border-b border-border-color/60 pb-1.5">
            Analyzer Parameters
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Min word length */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Min Word Sizing (Letters)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={minWordLength}
                onChange={(e) => setMinWordLength(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
              />
            </div>

            {/* Switches */}
            <div className="flex items-center gap-2 pt-5 sm:pt-6">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ignoreStopwords}
                  onChange={(e) => setIgnoreStopwords(e.target.checked)}
                  className="accent-accent h-4 w-4"
                />
                Ignore English Stop-words (e.g. "and", "the")
              </label>
            </div>

          </div>
        </div>

        {/* Text Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-accent" /> Article / Copy Draft
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste copy draft here to analyze keyword densities..."
              rows={14}
              className="w-full rounded-xl border border-border-color bg-background p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
            />
          </div>

          {/* Results Analysis */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between">
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-baseline border-b border-border-color pb-1.5">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="h-4.5 w-4.5 text-accent" /> Keyword Ratios Table
                </span>
                {activeList.length > 0 && (
                  <button
                    onClick={handleCopyToClipboard}
                    className="py-1 px-2 text-[10px] font-semibold border border-border-color bg-background hover:bg-hover-bg text-secondary-text hover:text-primary-text cursor-pointer rounded-md flex items-center gap-1"
                  >
                    {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    Copy Table
                  </button>
                )}
              </div>

              {/* N-Gram Selector */}
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background text-[10px] font-bold">
                {([1, 2, 3] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 px-3 rounded-md cursor-pointer capitalize transition-all ${
                      activeTab === tab ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    {tab}-Word Phrases
                  </button>
                ))}
              </div>

              {/* Data Table */}
              <div className="max-h-55 overflow-y-auto border border-border-color/60 rounded-xl">
                {activeList.length === 0 ? (
                  <div className="py-14 text-center text-xs text-secondary-text italic">
                    Paste text on the left to review keyword densities.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-secondary-bg/40 border-b border-border-color">
                        <th className="p-2.5 font-bold text-secondary-text uppercase tracking-wider">Rank</th>
                        <th className="p-2.5 font-bold text-secondary-text uppercase tracking-wider">Phrase</th>
                        <th className="p-2.5 font-bold text-secondary-text uppercase tracking-wider text-center">Count</th>
                        <th className="p-2.5 font-bold text-secondary-text uppercase tracking-wider text-right">Density</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color/40 font-semibold text-primary-text">
                      {activeList.slice(0, 40).map((item, idx) => {
                        const isStuffed = item.density > 3.5;
                        return (
                          <tr key={idx} className={`hover:bg-hover-bg/30 ${isStuffed ? "bg-warning/5" : ""}`}>
                            <td className="p-2.5 font-mono text-secondary-text">{idx + 1}</td>
                            <td className="p-2.5 font-mono break-all">{item.keyword}</td>
                            <td className="p-2.5 font-mono text-center">{item.count}</td>
                            <td className="p-2.5 font-mono text-right flex items-center justify-end gap-1">
                              <span>{item.density}%</span>
                              {isStuffed && (
                                <span title="Density high (keyword stuffing risk)">
                                  <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Text Metrics Dashboard */}
        {totalWords > 0 && (
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4.5 w-4.5 text-success" /> Text Metrics
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-secondary-bg/20 p-2.5 rounded-xl border border-border-color/40">
                <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Total Words</div>
                <div className="text-base font-mono font-bold text-primary-text mt-0.5">{totalWords}</div>
              </div>
              <div className="bg-secondary-bg/20 p-2.5 rounded-xl border border-border-color/40">
                <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Total Characters</div>
                <div className="text-base font-mono font-bold text-primary-text mt-0.5">{totalChars}</div>
              </div>
              <div className="bg-secondary-bg/20 p-2.5 rounded-xl border border-border-color/40">
                <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Unique Keywords</div>
                <div className="text-base font-mono font-bold text-accent mt-0.5">{uniqueWords}</div>
              </div>
              <div className="bg-secondary-bg/20 p-2.5 rounded-xl border border-border-color/40">
                <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Stopwords Ignored</div>
                <div className="text-base font-mono font-bold text-success mt-0.5">
                  {ignoreStopwords ? "Enabled" : "Disabled"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start over trigger */}
        {text && (
          <div className="flex">
            <button
              onClick={handleReset}
              className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Start Over
            </button>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
