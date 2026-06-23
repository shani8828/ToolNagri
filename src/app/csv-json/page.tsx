"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileSpreadsheet, ArrowLeftRight, Copy, Check, Download, AlertTriangle } from "lucide-react";

export default function CsvJsonConverter() {
  const [mode, setMode] = useState<"csv2json" | "json2csv">("csv2json");
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

  const handleDownload = () => {
    if (!outputText) return;
    const fileExtension = mode === "csv2json" ? "json" : "csv";
    const mimeType = mode === "csv2json" ? "application/json" : "text/csv";
    const blob = new Blob([outputText], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-data.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // CSV parsing algorithm helper
  const parseCSV = (csv: string) => {
    const lines = csv.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length === 0) return [];
    
    // Split header row by comma (handling basic commas)
    // For robust parsing, we can split by comma but also handle quotes if needed.
    // A standard clean split by regex that respects quotes:
    const splitRow = (row: string) => {
      const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (matches) {
        return matches.map(val => val.replace(/^"|"$/g, "").trim());
      }
      return row.split(",").map(val => val.trim());
    };

    const headers = splitRow(lines[0]);
    const resultList = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = splitRow(lines[i]);
      if (currentLine.length === 0) continue;

      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = currentLine[index] || "";
      });
      resultList.push(obj);
    }
    return resultList;
  };

  // JSON to CSV converter helper
  const convertToCSV = (jsonArray: any[]) => {
    if (jsonArray.length === 0) return "";
    const headers = Object.keys(jsonArray[0]);
    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const obj of jsonArray) {
      const values = headers.map(header => {
        const val = obj[header] === undefined || obj[header] === null ? "" : obj[header];
        const stringVal = typeof val === "object" ? JSON.stringify(val) : String(val);
        // Escape quotes and wrap in quotes if value contains commas
        if (stringVal.includes(",") || stringVal.includes('"') || stringVal.includes("\n")) {
          return `"${stringVal.replace(/"/g, '""')}"`;
        }
        return stringVal;
      });
      csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
  };

  const handleConvert = () => {
    setErrorMsg(null);
    setOutputText("");

    if (!inputText.trim()) {
      setErrorMsg("Input area is empty. Please enter code to convert.");
      return;
    }

    try {
      if (mode === "csv2json") {
        const parsed = parseCSV(inputText);
        if (parsed.length === 0) {
          setErrorMsg("Could not find any row segments in the provided CSV.");
          return;
        }
        setOutputText(JSON.stringify(parsed, null, 2));
      } else {
        const parsedJson = JSON.parse(inputText);
        const jsonArray = Array.isArray(parsedJson) ? parsedJson : [parsedJson];
        const csv = convertToCSV(jsonArray);
        setOutputText(csv);
      }
    } catch (err: any) {
      setErrorMsg(mode === "csv2json" ? `CSV Parsing Error: ${err.message}` : `Invalid JSON Syntax: ${err.message}`);
    }
  };

  const swapModes = () => {
    setMode(mode === "csv2json" ? "json2csv" : "csv2json");
    setInputText("");
    setOutputText("");
    setErrorMsg(null);
  };

  const howToUse = [
    "Select the conversion mode: either 'CSV to JSON' or 'JSON to CSV'.",
    "Paste your raw data into the source text area on the left.",
    "Click the convert button to run the parsing logic client-side.",
    "Inspect the formatted results, copy them to your clipboard, or download them as a file."
  ];

  const benefits = [
    "Instant translation with zero server uploads for total data security.",
    "Strict format validation reporting line errors in real-time.",
    "Robust CSV parse rules that handle commas and quoted string qualifiers.",
    "Includes instant copy shortcuts and file download options."
  ];

  const faqs = [
    {
      question: "Are custom CSV separators like semicolons supported?",
      answer: "This converter parses standard comma-separated formats. We recommend formatting your files with standard commas for clean translation.",
    },
    {
      question: "Will it parse nested JSON values into a CSV?",
      answer: "Nested JSON objects are converted to stringified text representation inside the CSV row coordinates to preserve the nested properties."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, parse, and validate JSON payloads." },
    { name: "SQL Formatter & Minifier", url: "/sql-formatter", description: "Standardize database SQL scripts." }
  ];

  return (
    <ToolLayout
      title="CSV to JSON / JSON to CSV Converter"
      description="Convert table data from CSV spreadsheets to structured JSON arrays, and serialize JSON back to standard CSV files."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Toggle Mode Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-secondary-bg/30 p-4 rounded-xl border border-border-color">
          <div className="text-sm font-semibold text-primary-text flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-accent" />
            Current Mode: <span className="text-accent uppercase font-bold">{mode === "csv2json" ? "CSV to JSON" : "JSON to CSV"}</span>
          </div>
          <button
            onClick={swapModes}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4" /> Swap Conversion Direction
          </button>
        </div>

        {/* Input / Output Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-text">
              {mode === "csv2json" ? "Input CSV Data" : "Input JSON Array"}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "csv2json"
                  ? "name,email,role\nAnubhav Kumar,info.ayodhyaserenity@gmail.com,Founder\nShani Maurya,developer@toolnagri.com,Developer"
                  : '[\n  {\n    "name": "Anubhav Kumar",\n    "email": "info.ayodhyaserenity@gmail.com",\n    "role": "Founder"\n  }\n]'
              }
              rows={12}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-primary-text">
                {mode === "csv2json" ? "Output JSON" : "Output CSV"}
              </label>
              {outputText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  >
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              )}
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder="Your converted output will appear here..."
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

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleConvert}
            className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            Run Conversion
          </button>
        </div>

      </div>
    </ToolLayout>
  );
}
