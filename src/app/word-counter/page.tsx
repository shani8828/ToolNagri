"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileText, Copy, Trash2, Check, BarChart3, Clock } from "lucide-react";

interface DensityItem {
  word: string;
  count: number;
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Statistics states
  const [stats, setStats] = useState({
    words: 0,
    charsWithSpace: 0,
    charsNoSpace: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0, // in minutes
    speakingTime: 0, // in minutes
  });
  
  const [densityList, setDensityList] = useState<DensityItem[]>([]);

  useEffect(() => {
    const rawText = text;
    if (!rawText.trim()) {
      setStats({
        words: 0,
        charsWithSpace: 0,
        charsNoSpace: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
      });
      setDensityList([]);
      return;
    }

    // 1. Characters count
    const charsWithSpace = rawText.length;
    const charsNoSpace = rawText.replace(/\s/g, "").length;

    // 2. Words count (filter empty results from split)
    const wordsArray = rawText.trim().split(/\s+/).filter(Boolean);
    const words = wordsArray.length;

    // 3. Sentences count (split on standard terminators . ? !)
    const sentences = rawText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    // 4. Paragraphs count (split on line breaks)
    const paragraphs = rawText.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // 5. Reading & Speaking Time (Standard speeds: 200 WPM reading, 130 WPM speaking)
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    setStats({
      words,
      charsWithSpace,
      charsNoSpace,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    });

    // 6. Word density calculation
    // Filter down to alphanumeric words, lowercase them, and exclude standard short filler words if needed
    // But displaying raw frequencies of keywords is standard.
    const wordCounts: Record<string, number> = {};
    wordsArray.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      if (clean.length > 2) {
        wordCounts[clean] = (wordCounts[clean] || 0) + 1;
      }
    });

    const sortedDensity = Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 keywords

    setDensityList(sortedDensity);

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
    "Type or paste your content string into the text editor canvas.",
    "Observe real-time counts updating below as you format characters.",
    "Review keyword frequencies to audit density distributions for SEO.",
    "Click the Copy or Clear buttons to handle text transfers instantly."
  ];

  const benefits = [
    "Perfect for authors, bloggers, students, and SEO marketers auditing copy lengths.",
    "Tracks reading and speaking durations for speeches or podcasts.",
    "Identifies keyword stuffing with the built-in Density checker.",
    "Completely client-side: Text content is never uploaded to any databases."
  ];

  const faqs = [
    {
      question: "How is reading time calculated?",
      answer: "Estimated reading speed is based on an industry-standard average of 200 words per minute (WPM) for adult readers."
    },
    {
      question: "What is Word Density?",
      answer: "Word Density tells you how often specific keywords appear relative to your total word counts. Checking this ensures you don't over-use keywords (stuffing), which search engines flag negatively."
    },
    {
      question: "Is there a character limit in the editor?",
      answer: "No, the editor processes text streams directly. Large volumes of up to 100,000 words run instantly without browser lag."
    }
  ];

  const relatedTools = [
    {
      name: "Character Counter",
      url: "/character-counter",
      description: "Count characters, density indexes, lines, and spaces in real-time."
    },
    {
      name: "JSON Formatter",
      url: "/json-formatter",
      description: "Format, minify, and validate JSON snippets with syntax highlighting."
    },
    {
      name: "Base64 Encoder/Decoder",
      url: "/base64",
      description: "Convert raw strings or files to Base64 schema encoding and decode back."
    }
  ];

  return (
    <ToolLayout
      title="Word Counter"
      description="Check word count, characters, sentences, paragraphs, reading speed, and keyword density. Clean text helper built for writing articles, meta tags, and essays."
      category="Text Tools"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
            <div className="text-2xl font-bold text-accent">{stats.words}</div>
            <div className="text-xxs text-secondary-text mt-1 uppercase font-semibold">Words</div>
          </div>
          <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
            <div className="text-2xl font-bold text-primary-text">{stats.charsWithSpace}</div>
            <div className="text-xxs text-secondary-text mt-1 uppercase font-semibold">Chars (All)</div>
          </div>
          <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
            <div className="text-2xl font-bold text-primary-text">{stats.charsNoSpace}</div>
            <div className="text-xxs text-secondary-text mt-1 uppercase font-semibold">Chars (No space)</div>
          </div>
          <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
            <div className="text-2xl font-bold text-primary-text">{stats.sentences}</div>
            <div className="text-xxs text-secondary-text mt-1 uppercase font-semibold">Sentences</div>
          </div>
          <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
            <div className="text-2xl font-bold text-primary-text">{stats.paragraphs}</div>
            <div className="text-xxs text-secondary-text mt-1 uppercase font-semibold">Paragraphs</div>
          </div>
        </div>

        {/* Text Area Input */}
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your content here..."
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

        {/* Details splits: Reading timings & Keyword densities */}
        {text.trim() && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-color">
            {/* Reading speeds */}
            <div className="border border-border-color rounded-xl p-5 bg-secondary-bg/30 space-y-4">
              <h4 className="font-heading text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" /> Time Estimations
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-lg font-bold text-primary-text">~ {stats.readingTime} min</div>
                  <div className="text-[10px] text-secondary-text">Reading Time</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary-text">~ {stats.speakingTime} min</div>
                  <div className="text-[10px] text-secondary-text">Speaking Time</div>
                </div>
              </div>
            </div>

            {/* Keyword Density */}
            <div className="border border-border-color rounded-xl p-5 bg-secondary-bg/30 space-y-4">
              <h4 className="font-heading text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-accent" /> Keyword Densities
              </h4>
              
              {densityList.length === 0 ? (
                <p className="text-xs text-secondary-text">Type longer words to show frequency density.</p>
              ) : (
                <div className="space-y-2">
                  {densityList.map((item) => (
                    <div key={item.word} className="flex justify-between items-center text-xs">
                      <span className="font-mono bg-background border border-border-color/60 rounded px-1.5 py-0.5 text-primary-text">
                        {item.word}
                      </span>
                      <span className="font-semibold text-secondary-text">
                        {item.count} times ({Math.round((item.count / stats.words) * 100)}%)
                      </span>
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
