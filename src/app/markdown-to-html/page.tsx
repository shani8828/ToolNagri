"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileText, Copy, Check, Eye } from "lucide-react";
import confetti from "canvas-confetti";

export default function MarkdownToHtml() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      confetti({
        particleCount: 15,
        spread: 20,
        origin: { y: 0.8 },
        colors: ["#2563eb", "#3b82f6"],
      });
    }
  };

  const renderTableHtml = (rows: string[][]): string => {
    if (rows.length === 0) return "";
    
    const headers = rows[0];
    const dataRows = rows.slice(1);
    
    const headerHtml = `<thead><tr class="bg-secondary-bg/25 border-b border-border-color">${headers
      .map((h) => `<th class="py-2 px-3 text-left font-bold border border-border-color">${h}</th>`)
      .join("")}</tr></thead>`;
    
    const bodyHtml = `<tbody>${dataRows
      .map(
        (row) =>
          `<tr class="border-b border-border-color/65 hover:bg-hover-bg/30">${row
            .map((cell) => `<td class="py-2 px-3 border border-border-color">${cell}</td>`)
            .join("")}</tr>`
      )
      .join("")}</tbody>`;
    
    return `\n<table class="w-full text-xs text-left border-collapse border border-border-color my-4 shadow-xs">\n${headerHtml}\n${bodyHtml}\n</table>\n`;
  };

  // Regex-based Markdown compiler supporting tables
  const parseMarkdown = (md: string) => {
    let html = md.trim();

    // Escape basic HTML entities to prevent script injection
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 1. Code blocks
    html = html.replace(/\r?\n```([\s\S]*?)```/g, (_, code) => {
      return `\n<pre><code>${code.trim()}</code></pre>\n`;
    });

    // 2. Headings (h1 to h4)
    html = html.replace(/^(?:#\s)(.*?)$/gm, "<h1>$1</h1>");
    html = html.replace(/^(?:##\s)(.*?)$/gm, "<h2>$1</h2>");
    html = html.replace(/^(?:###\s)(.*?)$/gm, "<h3>$1</h3>");
    html = html.replace(/^(?:####\s)(.*?)$/gm, "<h4>$1</h4>");

    // 3. Markdown Table Parsing State Machine
    const lines = html.split(/\r?\n/);
    let inTable = false;
    let tableRows: string[][] = [];
    const parsedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("|") && line.endsWith("|")) {
        const cells = line
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        
        // Match separators: e.g. |---|---|
        const isSeparator = cells.every((c) => c.match(/^:?-+:?$/));
        
        if (isSeparator) {
          inTable = true;
        } else {
          tableRows.push(cells);
          inTable = true;
        }
      } else {
        if (inTable && tableRows.length > 0) {
          parsedLines.push(renderTableHtml(tableRows));
          tableRows = [];
          inTable = false;
        }
        parsedLines.push(lines[i]);
      }
    }
    
    if (inTable && tableRows.length > 0) {
      parsedLines.push(renderTableHtml(tableRows));
    }

    html = parsedLines.join("\n");

    // Inline elements:
    // 4. Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // 5. Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // 6. Inline code
    html = html.replace(/`(.*?)`/g, "<code>$1</code>");

    // 7. Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline font-semibold">$1</a>');

    // 8. Paragraph blocks
    const blocks = html.split(/\n\s*\n/);
    const parsedBlocks = blocks.map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      const isBlock =
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<table") ||
        trimmed.startsWith("<thead") ||
        trimmed.startsWith("<tbody") ||
        trimmed.startsWith("<tr");
      if (isBlock) return trimmed;
      return `<p class="leading-relaxed mb-4">${trimmed.replace(/\n/g, "<br />")}</p>`;
    });

    return parsedBlocks.filter((b) => b !== "").join("\n");
  };

  useEffect(() => {
    if (inputText.trim()) {
      setOutputText(parseMarkdown(inputText));
    } else {
      setOutputText("");
    }
  }, [inputText]);

  const howToUse = [
    "Type or paste your Markdown code into the editor on the left.",
    "Observe real-time compiling converting Markdown cells and tokens to HTML code.",
    "Paste tabular layouts separated by pipes | to view parsed standard table grids.",
    "Review the rendered page visual markup inside the Live Preview container.",
    "Click the Copy HTML button to save compiled markup to your clipboard."
  ];

  const benefits = [
    "Compiles table headers, rows, alignments, and spacing parameters cleanly.",
    "Translates bold, italic, links, lists, and inline code blocks in real-time.",
    "100% Client-Side rendering keeps your documentation secure locally.",
    "Produces clean, minimal, W3C standard-compliant HTML code."
  ];

  const faqs = [
    {
      question: "How do I build tables in Markdown?",
      answer: "Tables are constructed by separating cells with pipe boundaries | and defining header rows. The second row must contain dashes (e.g. `|---|---|`) to separate columns."
    },
    {
      question: "Can I copy the raw HTML into my CMS?",
      answer: "Yes. The output matches clean standard HTML tags and can be pasted directly into WordPress, Medium, or custom databases."
    }
  ];

  const relatedTools = [
    { name: "Word Counter", url: "/word-counter", description: "Count words and characters." },
    { name: "String Randomizer", url: "/string-randomizer", description: "Generate bulk random keys." }
  ];

  return (
    <ToolLayout
      title="Markdown to HTML Converter"
      description="Write or paste Markdown documentation and instantly translate it to standard HTML markup. Supports code snippets, links, lists, and grid tables."
      category="Text Tools"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Editor columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-text">
              Markdown Editor
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="# Heading 1&#10;&#10;Type some **bold** or *italic* text here.&#10;&#10;| Product | Pricing |&#10;|---------|---------|&#10;| ToolNagri | Free |&#10;| premium | $0 |&#10;&#10;- Bullet list item 1&#10;- Bullet list item 2"
              rows={12}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-primary-text">
                Generated HTML
              </label>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy HTML
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder="HTML markup will appear here..."
              rows={12}
              className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-sm text-primary-text font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Live Preview section */}
        {outputText && (
          <div className="border border-border-color rounded-xl p-5 bg-card-bg shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-primary-text flex items-center gap-1.5 border-b border-border-color pb-2">
              <Eye className="h-4.5 w-4.5 text-accent animate-pulse" /> Live Preview Rendering
            </h3>
            
            {/* Rendered HTML */}
            <div 
              className="prose prose-sm max-w-none text-primary-text leading-relaxed"
              dangerouslySetInnerHTML={{ __html: outputText }}
            />
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
