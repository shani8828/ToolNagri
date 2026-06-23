"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Link2, Copy, Check, Settings, RefreshCw } from "lucide-react";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at",
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could",
  "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for",
  "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes",
  "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im",
  "ive", "if", "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my",
  "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
  "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt",
  "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then",
  "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through",
  "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "werent",
  "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys",
  "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself",
  "yourselves"
]);

export default function SlugGenerator() {
  const [inputText, setInputText] = useState("");
  const [slug, setSlug] = useState("");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(true);
  const [stripSpecialChars, setStripSpecialChars] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateSlug();
  }, [inputText, separator, lowercase, removeStopWords, stripSpecialChars]);

  const generateSlug = () => {
    if (!inputText.trim()) {
      setSlug("");
      return;
    }

    let text = inputText;

    // Convert case
    if (lowercase) {
      text = text.toLowerCase();
    }

    // Replace accents/diacritics
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Split into words
    let words = text.split(/[\s\-_\/]+/);

    // Remove stop words
    if (removeStopWords) {
      words = words.filter(word => !STOP_WORDS.has(word.toLowerCase()));
    }

    // Join with separator and clean up
    let result = words.join(separator);

    if (stripSpecialChars) {
      // Keep only alphanumeric and separator
      const regex = new RegExp(`[^a-zA-Z0-9${separator}]+`, "g");
      result = result.replace(regex, "");
    }

    // Clean up multiple separators and leading/trailing separators
    const escapeSeparator = separator === "-" ? "\\-" : "_";
    const doubleSepRegex = new RegExp(`${escapeSeparator}{2,}`, "g");
    const leadingTrailingRegex = new RegExp(`^${escapeSeparator}+|${escapeSeparator}+$`, "g");
    
    result = result.replace(doubleSepRegex, separator).replace(leadingTrailingRegex, "");

    setSlug(result);
  };

  const handleCopy = () => {
    if (slug) {
      navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const howToUse = [
    "Enter or paste the blog title or heading text you want to convert into the input text area.",
    "Adjust the generation options like custom separator character, lowercase enforcement, or stop-word removal.",
    "The SEO-friendly URL slug is automatically generated in real-time.",
    "Click the copy button to save the slug directly to your clipboard."
  ];

  const benefits = [
    "Increases SEO relevance by stripping redundant conjunctions and articles automatically.",
    "Cleanses special symbols, non-ASCII letters, and excessive whitespaces instantly.",
    "Offers hyphen or underscore separator controls to fit your routing preferences.",
    "Processes everything client-side so your drafted titles remain completely private."
  ];

  const faqs = [
    {
      question: "What are URL stop words?",
      answer: "Stop words are common words (like 'the', 'is', 'at', 'which', and 'on') that search engines usually ignore. Stripping them keeps your URL slugs concise and focused on high-value keywords.",
    },
    {
      question: "Can I generate slug paths with custom characters?",
      answer: "Yes, you can choose between standard hyphens (-) and underscores (_) as separators to match your server configuration."
    }
  ];

  const relatedTools = [
    { name: "UTM Campaign URL Builder", url: "/utm-builder", description: "Create tracking links for campaigns." },
    { name: "Free URL Shortener", url: "/url-shortener", description: "Shorten and track redirect links." }
  ];

  return (
    <ToolLayout
      title="URL Slug Generator"
      description="Convert headings, titles, or strings into clean, SEO-friendly URL slug paths instantly."
      category="SEO Tools"
      categoryUrl="/#seo"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Input Panel */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary-text">
            Enter Title / Header String
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 10 Best Developer Utility Tools in 2026 for Quick Conversions!"
            rows={4}
            className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none"
          />
        </div>

        {/* Options Row */}
        <div className="bg-secondary-bg/30 p-4 rounded-xl border border-border-color space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-text border-b border-border-color pb-2">
            <Settings className="h-4 w-4 text-accent" />
            Generator Options
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Separator Toggle */}
            <div className="space-y-1">
              <span className="text-xs text-secondary-text font-semibold">Separator</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSeparator("-")}
                  className={`flex-1 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                    separator === "-" ? "bg-accent border-accent text-white" : "border-border-color text-secondary-text hover:bg-hover-bg"
                  }`}
                >
                  Hyphen (-)
                </button>
                <button
                  type="button"
                  onClick={() => setSeparator("_")}
                  className={`flex-1 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                    separator === "_" ? "bg-accent border-accent text-white" : "border-border-color text-secondary-text hover:bg-hover-bg"
                  }`}
                >
                  Underscore (_)
                </button>
              </div>
            </div>

            {/* Lowercase Toggle */}
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="opt-lowercase"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <label htmlFor="opt-lowercase" className="text-xs font-semibold text-primary-text cursor-pointer select-none">
                Force Lowercase
              </label>
            </div>

            {/* Stopwords Toggle */}
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="opt-stopwords"
                checked={removeStopWords}
                onChange={(e) => setRemoveStopWords(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <label htmlFor="opt-stopwords" className="text-xs font-semibold text-primary-text cursor-pointer select-none">
                Remove Stop Words
              </label>
            </div>

            {/* Strip Special Chars */}
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="opt-special"
                checked={stripSpecialChars}
                onChange={(e) => setStripSpecialChars(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <label htmlFor="opt-special" className="text-xs font-semibold text-primary-text cursor-pointer select-none">
                Strip Special Symbols
              </label>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-primary-text">
              Generated SEO Slug
            </label>
            {slug && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 text-xs border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer font-semibold"
              >
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy
              </button>
            )}
          </div>
          <div className="relative rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 min-h-[48px] flex items-center font-mono text-sm text-primary-text break-all select-all">
            {slug || <span className="text-secondary-text/60 italic font-sans">SEO slug will generate automatically...</span>}
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
