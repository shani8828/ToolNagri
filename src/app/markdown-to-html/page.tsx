"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileText, Copy, Check, Eye } from "lucide-react";

export default function MarkdownToHtml() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Basic regex markdown parser
  const parseMarkdown = (md: string) => {
    let html = md.trim();

    // Escape basic HTML entities to prevent scripts injection
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Block elements:
    // 1. Code blocks
    html = html.replace(/\r?\n```([\s\S]*?)```/g, (_, code) => {
      return `\n<pre><code>${code.trim()}</code></pre>\n`;
    });

    // 2. Headings (h1 to h4)
    html = html.replace(/^(?:#\s)(.*?)$/gm, "<h1>$1</h1>");
    html = html.replace(/^(?:##\s)(.*?)$/gm, "<h2>$1</h2>");
    html = html.replace(/^(?:###\s)(.*?)$/gm, "<h3>$1</h3>");
    html = html.replace(/^(?:####\s)(.*?)$/gm, "<h4>$1</h4>");

    // 3. Lists (un-ordered lists)
    // Gather consecutive bullet lines
    html = html.replace(/^(?:\*\s|-\s)(.*?)$/gm, "<li>$1</li>");
    // Wrap adjacent list items in <ul>
    html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, "\n<ul>\n$1</ul>\n");

    // Inline elements:
    // 4. Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // 5. Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // 6. Inline code
    html = html.replace(/`(.*?)`/g, "<code>$1</code>");

    // 7. Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline font-semibold">$1</a>');

    // 8. Paragraph blocks (splitting by empty line coordinates)
    const blocks = html.split(/\n\s*\n/);
    const parsedBlocks = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      // Skip wrapping if it is already a block element
      const isBlock = trimmed.startsWith("<h") || trimmed.startsWith("<pre") || trimmed.startsWith("<ul") || trimmed.startsWith("<li");
      if (isBlock) return trimmed;
      return `<p class="leading-relaxed mb-4">${trimmed.replace(/\n/g, "<br />")}</p>`;
    });

    return parsedBlocks.filter(b => b !== "").join("\n");
  };

  useEffect(() => {
    if (inputText.trim()) {
      setOutputText(parseMarkdown(inputText));
    } else {
      setOutputText("");
    }
  }, [inputText]);

  const howToUse = [
    "Type or paste your Markdown content into the input editor pane on the left.",
    "Observe real-time compilation converting Markdown tokens to structured HTML tags on the right.",
    "Inspect the HTML markup code, or view the live compiled page representation below.",
    "Click the copy button to capture the generated HTML code with one tap."
  ];

  const benefits = [
    "Converts core Markdown elements (headings, links, lists, code, bold/italic) instantly.",
    "Provides both raw HTML code output and formatted rich text live previews.",
    "Completely client-side conversion ensures input content is not logged anywhere.",
    "Produces clean, minimal, and standard-compliant HTML outputs."
  ];

  const faqs = [
    {
      question: "Are tables or custom HTML blocks parsed?",
      answer: "This is a lightweight regex-based parser. Custom layouts and HTML tag nesting are sanitized and returned as plain text to prevent script injection issues.",
    },
    {
      question: "Does it support inline images?",
      answer: "Yes, standard Markdown link mappings `[Link Text](URL)` are converted to standard `<a>` tags. Image tags are not directly parsed by default to prioritize clean text layout."
    }
  ];

  const relatedTools = [
    { name: "Word Counter", url: "/word-counter", description: "Analyze characters, paragraphs, and reading times." },
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, parse, and validate JSON payloads." }
  ];

  return (
    <ToolLayout
      title="Markdown to HTML Converter"
      description="Write or paste Markdown documentation and instantly translate it to standard HTML markup with live preview representation."
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
              placeholder="# Heading 1&#10;&#10;Type some **bold** or *italic* text here.&#10;&#10;- Bullet list item 1&#10;- Bullet list item 2&#10;&#10;Create a [link](https://toolnagri.vercel.app)."
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
              <Eye className="h-4.5 w-4.5 text-accent" /> Live Preview Rendering
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
