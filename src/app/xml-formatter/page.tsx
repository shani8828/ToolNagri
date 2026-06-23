"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Code2, Copy, Check, AlertTriangle } from "lucide-react";

export default function XmlFormatter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // XML Formatting Algorithm
  const formatXML = (xmlStr: string) => {
    // Strip tabs and newlines, clean outer spaces
    let xml = xmlStr.replace(/>\s*</g, "><").trim();
    
    // Add newlines before/after tags
    let formatted = "";
    let pad = 0;
    
    // Basic tokenizer that splits by tag boundaries
    const reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, "$1\r\n$2$3");
    
    const lines = xml.split("\r\n");
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      let indent = 0;
      if (line.match(/.+<\/\w[^>]*>$/)) {
        // Self-closing tags or tags containing data in a single line: <tag>value</tag>
        indent = 0;
      } else if (line.match(/^<\/\w/)) {
        // Closing tag: </tag>
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
        // Opening tag: <tag>
        indent = 1;
      } else {
        indent = 0;
      }
      
      formatted += "  ".repeat(pad) + line + "\n";
      pad += indent;
    }
    return formatted.trim();
  };

  const validateXML = (xmlStr: string) => {
    if (typeof window !== "undefined" && window.DOMParser) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlStr, "application/xml");
      const parserError = doc.querySelector("parsererror");
      if (parserError) {
        return parserError.textContent || "XML parsing syntax error.";
      }
    }
    return null;
  };

  const handleFormat = () => {
    setErrorMsg(null);
    setOutputText("");

    if (!inputText.trim()) {
      setErrorMsg("Input XML is empty. Please enter code to format.");
      return;
    }

    const parseError = validateXML(inputText);
    if (parseError) {
      setErrorMsg(`XML Syntax Validation: ${parseError}`);
      return;
    }

    try {
      setOutputText(formatXML(inputText));
    } catch (err: any) {
      setErrorMsg(`Formatter Error: ${err.message}`);
    }
  };

  const handleMinify = () => {
    setErrorMsg(null);
    setOutputText("");

    if (!inputText.trim()) {
      setErrorMsg("Input XML is empty. Please enter code to minify.");
      return;
    }

    const parseError = validateXML(inputText);
    if (parseError) {
      setErrorMsg(`XML Syntax Validation: ${parseError}`);
      return;
    }

    // Minify by stripping spaces between tags
    const minified = inputText.replace(/>\s*</g, "><").trim();
    setOutputText(minified);
  };

  const howToUse = [
    "Paste your raw XML code structure into the input text area on the left.",
    "Click 'Format XML' to validate schema syntax and indent tags dynamically.",
    "Alternatively, click 'Minify XML' to strip unnecessary whitespace and return a compressed string.",
    "Copy the formatted XML payload instantly using the copy icon."
  ];

  const benefits = [
    "Validates XML syntax correctness locally inside the browser DOM parser.",
    "Prettifies nested tags and structures with standard 2-space layout formatting.",
    "Completely client-side execution ensuring data privacy.",
    "Quickly copy or minify code for data exchanges and configurations."
  ];

  const faqs = [
    {
      question: "Does it validate XML tags nesting?",
      answer: "Yes. The tool parses the payload using the browser's DOMParser and will alert you if any matching tag boundaries or syntax constraints are violated.",
    },
    {
      question: "Is it safe to paste credentials or configuration files?",
      answer: "Absolutely. The converter processes all XML validation and formatting strictly in your local browser sandbox. No variables are sent to our servers."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, parse, and validate JSON payloads." },
    { name: "SQL Formatter & Minifier", url: "/sql-formatter", description: "Standardize database SQL scripts." }
  ];

  return (
    <ToolLayout
      title="XML Formatter & Prettifier"
      description="Format, indent, and validate raw XML elements, or compress them into minified markup."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-text">
              Input XML
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder='<user id="1"><name>Anubhav Kumar</name><email>info.ayodhyaserenity@gmail.com</email></user>'
              rows={12}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-primary-text">
                Prettified Output
              </label>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy XML
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder="Your prettified XML output will appear here..."
              rows={12}
              className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-sm text-primary-text font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={handleFormat}
            className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            Format XML
          </button>
          <button
            onClick={handleMinify}
            className="px-6 py-2.5 border border-border-color hover:bg-hover-bg text-secondary-text hover:text-primary-text rounded-lg text-sm font-semibold cursor-pointer transition-colors"
          >
            Minify XML
          </button>
        </div>

      </div>
    </ToolLayout>
  );
}
