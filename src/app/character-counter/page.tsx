"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileText, Copy, Trash2, Check, BarChart2 } from "lucide-react";

interface LetterFrequency {
  char: string;
  count: number;
  percentage: number;
}

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Statistics states
  const [stats, setStats] = useState({
    total: 0,
    noSpaces: 0,
    spaces: 0,
    letters: 0,
    numbers: 0,
    symbols: 0,
    lines: 0,
  });

  const [frequencyList, setFrequencyList] = useState<LetterFrequency[]>([]);

  useEffect(() => {
    const rawText = text;
    if (!rawText) {
      setStats({
        total: 0,
        noSpaces: 0,
        spaces: 0,
        letters: 0,
        numbers: 0,
        symbols: 0,
        lines: 0,
      });
      setFrequencyList([]);
      return;
    }

    const total = rawText.length;
    const noSpaces = rawText.replace(/\s/g, "").length;
    const spaces = total - noSpaces;

    // Regex audits
    const letters = (rawText.match(/[a-zA-Z]/g) || []).length;
    const numbers = (rawText.match(/[0-9]/g) || []).length;
    const symbols = total - (letters + numbers + spaces);
    
    // Lines (split on newlines)
    const lines = rawText.split("\n").length;

    setStats({
      total,
      noSpaces,
      spaces,
      letters,
      numbers,
      symbols,
      lines,
    });

    // Character frequency (analyze letters/numbers, lowercase them)
    const charMap: Record<string, number> = {};
    const filteredText = rawText.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    for (const char of filteredText) {
      charMap[char] = (charMap[char] || 0) + 1;
    }

    const totalFiltered = filteredText.length;

    const frequencies = Object.entries(charMap)
      .map(([char, count]) => ({
        char: char.toUpperCase(),
        count,
        percentage: totalFiltered > 0 ? Math.round((count / totalFiltered) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Show top 6 characters

    setFrequencyList(frequencies);

  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = () => {
    setText("");
  };

  const howToUse = [
    "Enter or paste your text string into the input editor.",
    "Observe real-time counts updating dynamically below.",
    "Inspect specific character breakdowns (letters, symbols, and spaces).",
    "View the visual bar grid showing which letters or numbers are repeated most frequently.",
    "Click the Copy button to transfer text, or Clear to reset."
  ];

  const benefits = [
    "Ideal for social media creators verifying strict post boundaries (such as Twitter/X 280-char limits).",
    "Helps developers analyze line counts and code strings.",
    "Processes entirely client-side: Text content is never uploaded to any databases."
  ];

  const faqs = [
    {
      question: "Are emojis counted as characters?",
      answer: "Yes, standard emojis count as characters. However, because emojis are represented using multi-byte Unicode sequences, some newer emojis might register as 2 or more character units depending on the browser encoding."
    },
    {
      question: "Why count characters without spaces?",
      answer: "Many academic publications, publisher submission criteria, and resume systems require strict character thresholds excluding spaces to focus on literal content length."
    },
    {
      question: "Can I paste code snippets?",
      answer: "Yes, you can paste code, formatting tables, or text files. The line counter will correctly parse tab and new-line indices."
    }
  ];

  const relatedTools = [
    {
      name: "Word Counter",
      url: "/word-counter",
      description: "Count words, sentences, paragraphs, and check keyword frequencies in real-time."
    },
    {
      name: "JSON Formatter",
      url: "/json-formatter",
      description: "Format, minify, and validate JSON snippets with syntax highlighting."
    },
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully styled QR codes for text, emails, Wi-Fi networks, and contact details."
    }
  ];

  return (
    <ToolLayout
      title="Character Counter"
      description="Calculate total characters, letters, numbers, spaces, symbols, and lines in real-time. Review specific character density charts client-side."
      category="Text Tools"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Count statistics boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-accent/20 bg-accent/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent">{stats.total}</div>
            <div className="text-xxs text-secondary-text mt-1 uppercase font-semibold">Total Characters</div>
          </div>
          <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
            <div className="text-2xl font-bold text-primary-text">{stats.noSpaces}</div>
            <div className="text-xxs text-secondary-text mt-1 uppercase font-semibold">Without Spaces</div>
          </div>
          <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
            <div className="text-2xl font-bold text-primary-text">{stats.spaces}</div>
            <div className="text-xxs text-secondary-text mt-1 uppercase font-semibold">Spaces Only</div>
          </div>
          <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
            <div className="text-2xl font-bold text-primary-text">{stats.lines}</div>
            <div className="text-xxs text-secondary-text mt-1 uppercase font-semibold">Lines</div>
          </div>
        </div>

        {/* Text Area Input */}
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to count characters..."
            rows={10}
            className="block w-full rounded-xl border border-border-color bg-secondary-bg/30 p-4 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none font-sans"
          />

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg border border-border-color bg-background hover:bg-hover-bg px-3.5 py-1.5 text-primary-text cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg border border-border-color bg-background hover:bg-hover-bg px-3.5 py-1.5 text-secondary-text hover:text-warning cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Breakdown of elements & Top Character Frequency charts */}
        {text && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-color">
            
            {/* Detailed breakdowns */}
            <div className="border border-border-color rounded-xl p-5 bg-secondary-bg/30 space-y-4">
              <h4 className="font-heading text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-accent" /> Element Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-secondary-text">Letters (A-Z)</span>
                  <span className="font-bold text-primary-text">{stats.letters}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-secondary-text">Digits (0-9)</span>
                  <span className="font-bold text-primary-text">{stats.numbers}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-secondary-text">Special Symbols / Emojis</span>
                  <span className="font-bold text-primary-text">{stats.symbols}</span>
                </div>
              </div>
            </div>

            {/* Character density bars */}
            <div className="border border-border-color rounded-xl p-5 bg-secondary-bg/30 space-y-4">
              <h4 className="font-heading text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4 text-accent" /> Top Character Frequencies
              </h4>

              {frequencyList.length === 0 ? (
                <p className="text-xs text-secondary-text">Type words to analyze letter frequencies.</p>
              ) : (
                <div className="space-y-3.5">
                  {frequencyList.map((item) => (
                    <div key={item.char} className="space-y-1">
                      <div className="flex justify-between text-xxs font-semibold">
                        <span className="font-mono text-primary-text">{item.char}</span>
                        <span className="text-secondary-text">{item.count} times ({item.percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-border-color/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </ToolLayout>
  );
}
