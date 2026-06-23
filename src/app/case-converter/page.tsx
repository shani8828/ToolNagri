"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Type, Copy, Check, Trash2, Info } from "lucide-react";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    charsWithSpaces: 0,
    charsWithoutSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [text]);

  const calculateStats = () => {
    const trimmed = text.trim();
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, "").length;
    
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    
    // Simple sentence regex
    const sentences = trimmed === "" ? 0 : trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Paragraph count based on newlines
    const paragraphs = trimmed === "" ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

    setStats({ charsWithSpaces, charsWithoutSpaces, words, sentences, paragraphs });
  };

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setText("");
  };

  // Conversions
  const toUppercase = () => {
    setText(text.toUpperCase());
  };

  const toLowercase = () => {
    setText(text.toLowerCase());
  };

  const toTitleCase = () => {
    const converted = text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
    setText(converted);
  };

  const toSentenceCase = () => {
    // Split by sentence delimiters but retain them
    const converted = text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, separator, letter) => {
      return separator + letter.toUpperCase();
    });
    setText(converted);
  };

  const toCamelCase = () => {
    const cleaned = text.replace(/[^a-zA-Z0-9\s-_]+/g, "");
    const words = cleaned.toLowerCase().split(/[\s-_]+/);
    if (words.length === 0) return;
    const camel = words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.substring(1)).join("");
    setText(camel);
  };

  const toPascalCase = () => {
    const cleaned = text.replace(/[^a-zA-Z0-9\s-_]+/g, "");
    const words = cleaned.toLowerCase().split(/[\s-_]+/);
    const pascal = words.map(w => w.charAt(0).toUpperCase() + w.substring(1)).join("");
    setText(pascal);
  };

  const toSnakeCase = () => {
    const cleaned = text.replace(/[^a-zA-Z0-9\s-_]+/g, "");
    const snake = cleaned.toLowerCase().split(/[\s-_]+/).join("_");
    setText(snake);
  };

  const toKebabCase = () => {
    const cleaned = text.replace(/[^a-zA-Z0-9\s-_]+/g, "");
    const kebab = cleaned.toLowerCase().split(/[\s-_]+/).join("-");
    setText(kebab);
  };

  const toConstantCase = () => {
    const cleaned = text.replace(/[^a-zA-Z0-9\s-_]+/g, "");
    const constant = cleaned.toUpperCase().split(/[\s-_]+/).join("_");
    setText(constant);
  };

  const toAlternatingCase = () => {
    const converted = text.split("").map((c, i) => {
      return i % 2 === 0 ? c.toLowerCase() : c.toUpperCase();
    }).join("");
    setText(converted);
  };

  const howToUse = [
    "Type or paste your content in the main input text area.",
    "Click on any of the formatting buttons (like UPPERCASE, Title Case, camelCase) to apply that case style.",
    "Inspect word count, line splits, and character parameters in the live statistics panel.",
    "Copy your newly formatted text layout with a single click."
  ];

  const benefits = [
    "Allows switching text structures instantly without manual re-typing.",
    "Provides essential developer cases like camelCase, snake_case, and UPPER_SNAKE_CASE.",
    "Calculates accurate paragraph, word, and character boundaries dynamically.",
    "Secures data locally on your computer with offline JS conversions."
  ];

  const faqs = [
    {
      question: "Will punctuation be preserved during case changes?",
      answer: "Yes, standard formats like sentence case, title case, uppercase, and lowercase preserve all periods, commas, and question marks. CamelCase, snake_case, and kebab-case will strip punctuation to form valid variable identifiers.",
    },
    {
      question: "How does the Sentence Case calculation work?",
      answer: "Sentence Case automatically capitalizes the first letter of the text block and any word immediately following a period (.), exclamation mark (!), or question mark (?) followed by spaces."
    }
  ];

  const relatedTools = [
    { name: "Word Counter", url: "/word-counter", description: "Analyse full reading statistics." },
    { name: "Character Counter", url: "/character-counter", description: "Count precise letters and density." }
  ];

  return (
    <ToolLayout
      title="Multi-Case Text Converter"
      description="Instantly convert your text blocks into uppercase, lowercase, Title Case, camelCase, snake_case, and kebab-case styles."
      category="Text Tools"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Actions Toolbar */}
        <div className="flex justify-between items-center bg-secondary-bg/30 p-4 rounded-xl border border-border-color">
          <span className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
            <Type className="h-4.5 w-4.5 text-accent" /> Editor Actions
          </span>
          
          <div className="flex gap-2">
            {text && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />} Copy Text
              </button>
            )}
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to convert its case..."
            rows={10}
            className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none"
          />
        </div>

        {/* Case Formatting Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
            Format Options
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            <button
              onClick={toUppercase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              UPPERCASE
            </button>
            <button
              onClick={toLowercase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              lowercase
            </button>
            <button
              onClick={toTitleCase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              Title Case
            </button>
            <button
              onClick={toSentenceCase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              Sentence Case
            </button>
            <button
              onClick={toCamelCase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              camelCase
            </button>
            <button
              onClick={toPascalCase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              PascalCase
            </button>
            <button
              onClick={toSnakeCase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              snake_case
            </button>
            <button
              onClick={toKebabCase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              kebab-case
            </button>
            <button
              onClick={toConstantCase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              CONSTANT_CASE
            </button>
            <button
              onClick={toAlternatingCase}
              className="px-3 py-2 bg-secondary-bg/30 border border-border-color hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-primary-text cursor-pointer transition-colors"
            >
              aLtErNaTiNg
            </button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="pt-4 border-t border-border-color space-y-3">
          <h4 className="text-sm font-bold text-primary-text flex items-center gap-1.5">
            <Info className="h-4.5 w-4.5 text-accent" /> Text Statistics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-3 rounded-xl border border-border-color bg-secondary-bg/25 text-center">
              <div className="text-lg font-bold text-primary-text">{stats.charsWithSpaces}</div>
              <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Chars (with spaces)</div>
            </div>
            <div className="p-3 rounded-xl border border-border-color bg-secondary-bg/25 text-center">
              <div className="text-lg font-bold text-primary-text">{stats.charsWithoutSpaces}</div>
              <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Chars (no spaces)</div>
            </div>
            <div className="p-3 rounded-xl border border-border-color bg-secondary-bg/25 text-center">
              <div className="text-lg font-bold text-primary-text">{stats.words}</div>
              <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Words</div>
            </div>
            <div className="p-3 rounded-xl border border-border-color bg-secondary-bg/25 text-center">
              <div className="text-lg font-bold text-primary-text">{stats.sentences}</div>
              <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Sentences</div>
            </div>
            <div className="p-3 rounded-xl border border-border-color bg-secondary-bg/25 text-center">
              <div className="text-lg font-bold text-primary-text">{stats.paragraphs}</div>
              <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Paragraphs</div>
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
