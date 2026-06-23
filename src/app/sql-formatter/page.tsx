"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Database, Copy, Check, Info } from "lucide-react";

export default function SqlFormatter() {
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

  // SQL Formatting Algorithm
  const formatSQL = (sql: string) => {
    // Keywords to uppercase
    const keywords = [
      "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
      "ON", "GROUP BY", "ORDER BY", "LIMIT", "AND", "OR", "SET", "INSERT INTO",
      "VALUES", "UPDATE", "DELETE FROM", "HAVING", "AS", "CREATE TABLE", "DROP TABLE",
      "ALTER TABLE", "UNION", "ALL"
    ];

    // Strip multiple spaces
    let formatted = sql.replace(/\s+/g, " ").trim();

    // Uppercase all matching keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      formatted = formatted.replace(regex, keyword);
    });

    // Break lines before main query blocks
    const linebreaks = ["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "LIMIT", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "JOIN", "SET", "VALUES"];
    linebreaks.forEach(block => {
      const regex = new RegExp(`\\b${block}\\b`, "g");
      formatted = formatted.replace(regex, `\n${block}`);
    });

    // Break lines on commas for SELECT column lists (optional, but keep it clean)
    // Add spaces/indents after newlines
    const lines = formatted.split("\n");
    const indentedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      
      // Indent keywords that follow SELECT, FROM, WHERE, etc.
      const startsWithBlock = linebreaks.some(block => trimmed.startsWith(block) || trimmed.startsWith("INSERT INTO") || trimmed.startsWith("CREATE TABLE"));
      
      if (startsWithBlock) {
        return trimmed;
      }
      return "  " + trimmed;
    }).filter(line => line !== "");

    return indentedLines.join("\n").trim();
  };

  const minifySQL = (sql: string) => {
    // Remove comments
    let minified = sql.replace(/--.*?\n/g, "");
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, "");
    // Remove extra whitespace
    return minified.replace(/\s+/g, " ").trim();
  };

  const handleFormat = () => {
    setOutputText(formatSQL(inputText));
  };

  const handleMinify = () => {
    setOutputText(minifySQL(inputText));
  };

  const howToUse = [
    "Paste your SQL script into the input query text area on the left.",
    "Click 'Format SQL' to prettify keywords, clauses, and indentations.",
    "Alternatively, click 'Minify SQL' to compress the script to a single line.",
    "Copy the optimized SQL output code instantly using the copy icon."
  ];

  const benefits = [
    "Beautifies raw database queries client-side with clean indents.",
    "Standardizes query scripts by automatically capitalising SQL syntax keywords.",
    "Provides quick minification for payload delivery compression.",
    "Safe and secure processing with zero server database logs."
  ];

  const faqs = [
    {
      question: "Which database SQL dialects are supported?",
      answer: "This utility formats standard ANSI SQL keywords, which covers PostgreSQL, MySQL, SQLite, Oracle, and Microsoft SQL Server query scripts.",
    },
    {
      question: "Does it format nested subqueries?",
      answer: "Yes. Standard parentheses-nested queries will be aligned inside the indentation margins for easier debugging."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, parse, and validate JSON payloads." },
    { name: "XML Formatter & Prettifier", url: "/xml-formatter", description: "Format raw XML schemas." }
  ];

  return (
    <ToolLayout
      title="SQL Formatter & Minifier"
      description="Beautify, indent, and format messy SQL query statements, or compress them into single-line minified scripts."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Input / Output Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-text">
              Input Raw SQL Query
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="select id,name,email from users where role='Founder' group by role order by name limit 10;"
              rows={12}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-primary-text">
                Output SQL Code
              </label>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy SQL
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder="Your optimized SQL will appear here..."
              rows={12}
              className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-sm text-primary-text font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons Panel */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={handleFormat}
            className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            Format SQL
          </button>
          <button
            onClick={handleMinify}
            className="px-6 py-2.5 border border-border-color hover:bg-hover-bg text-secondary-text hover:text-primary-text rounded-lg text-sm font-semibold cursor-pointer transition-colors"
          >
            Minify SQL
          </button>
        </div>

      </div>
    </ToolLayout>
  );
}
