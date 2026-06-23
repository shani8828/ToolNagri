"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Code2, ArrowLeftRight, Copy, Check, Download, AlertTriangle } from "lucide-react";

export default function JsonYamlConverter() {
  const [mode, setMode] = useState<"json2yaml" | "yaml2json">("json2yaml");
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
    const ext = mode === "json2yaml" ? "yaml" : "json";
    const mime = mode === "json2yaml" ? "text/yaml" : "application/json";
    const blob = new Blob([outputText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-config.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simple recursive JSON to YAML stringifier
  const jsonToYaml = (obj: any, depth = 0): string => {
    const indent = "  ".repeat(depth);
    if (obj === null) return "null";
    if (typeof obj !== "object") {
      if (typeof obj === "string") {
        return obj.includes(" ") || obj.includes(":") ? `"${obj.replace(/"/g, '\\"')}"` : obj;
      }
      return String(obj);
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      return obj.map(item => `\n${indent}- ${jsonToYaml(item, depth + 1).trim()}`).join("");
    }

    const keys = Object.keys(obj);
    if (keys.length === 0) return "{}";
    
    return keys.map(key => {
      const val = obj[key];
      const formattedVal = jsonToYaml(val, depth + 1);
      const separator = typeof val === "object" && val !== null ? "" : " ";
      return `\n${indent}${key}:${separator}${formattedVal.trim()}`;
    }).join("").trim();
  };

  // Simple YAML to JSON parser
  const yamlToJson = (yaml: string): any => {
    const lines = yaml.split(/\r?\n/);
    const result: any = {};
    const stack: { indent: number; ref: any; key?: string; isArray?: boolean }[] = [{ indent: -1, ref: result }];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      // Count leading spaces to determine depth
      const indent = line.search(/\S/);
      
      // Parse Key and Value
      const colonIdx = trimmed.indexOf(":");
      let key = colonIdx > -1 ? trimmed.substring(0, colonIdx).trim() : trimmed;
      let valStr = colonIdx > -1 ? trimmed.substring(colonIdx + 1).trim() : "";

      // Check if it is an array item
      const isArrayItem = key.startsWith("-");
      if (isArrayItem) {
        key = key.substring(1).trim();
      }

      // Parse primitive values
      let val: any = valStr;
      if (valStr === "true") val = true;
      else if (valStr === "false") val = false;
      else if (valStr === "null") val = null;
      else if (!isNaN(Number(valStr)) && valStr !== "") val = Number(valStr);
      else if (valStr.startsWith('"') && valStr.endsWith('"')) {
        val = valStr.substring(1, valStr.length - 1);
      }

      // Keep stack correct relative to indentation
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1];

      if (isArrayItem) {
        if (!parent.isArray) {
          // If parent is currently an object, convert it to an array or establish array
          if (parent.key) {
            const grandParent = stack[stack.length - 2];
            grandParent.ref[parent.key] = [];
            parent.ref = grandParent.ref[parent.key];
            parent.isArray = true;
          }
        }
        
        if (key && colonIdx > -1) {
          // It's an object inside the array
          const newObj: any = { [key]: val };
          parent.ref.push(newObj);
          stack.push({ indent: indent + 2, ref: newObj, key });
        } else {
          // Simple item inside the array
          parent.ref.push(val || key);
        }
      } else {
        if (colonIdx > -1 && valStr === "") {
          // Nested object
          parent.ref[key] = {};
          stack.push({ indent, ref: parent.ref[key], key });
        } else if (colonIdx > -1) {
          parent.ref[key] = val;
        }
      }
    }
    return result;
  };

  const handleConvert = () => {
    setErrorMsg(null);
    setOutputText("");

    if (!inputText.trim()) {
      setErrorMsg("Input is empty. Please enter configuration data.");
      return;
    }

    try {
      if (mode === "json2yaml") {
        const parsed = JSON.parse(inputText);
        setOutputText(jsonToYaml(parsed));
      } else {
        const parsed = yamlToJson(inputText);
        setOutputText(JSON.stringify(parsed, null, 2));
      }
    } catch (err: any) {
      setErrorMsg(mode === "json2yaml" ? `Invalid JSON structure: ${err.message}` : `YAML syntax error: ${err.message}`);
    }
  };

  const swapModes = () => {
    setMode(mode === "json2yaml" ? "yaml2json" : "json2yaml");
    setInputText("");
    setOutputText("");
    setErrorMsg(null);
  };

  const howToUse = [
    "Choose your conversion path: JSON to YAML or YAML to JSON.",
    "Paste your configuration content into the input field on the left.",
    "Click the conversion button to trigger the client-side parsing script.",
    "Copy the formatted configuration output or download it as a settings file."
  ];

  const benefits = [
    "Bi-directional translation for configuration management payloads.",
    "Checks syntax correctness inline without uploading sensitive settings.",
    "Converts arrays, nested values, and boolean switches cleanly.",
    "Includes copying shortcuts and local file downloads."
  ];

  const faqs = [
    {
      question: "Is YAML comments formatting preserved?",
      answer: "When converting YAML to JSON, comments (prefixed with #) are ignored since JSON doesn't support comment declarations natively.",
    },
    {
      question: "Can I copy the output directly to my Kubernetes config?",
      answer: "Yes. The generated YAML follows standard block mapping formats and is immediately ready to be pasted into config files."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, parse, and validate JSON payloads." },
    { name: "XML Formatter & Prettifier", url: "/xml-formatter", description: "Format raw XML files." }
  ];

  return (
    <ToolLayout
      title="JSON to YAML / YAML to JSON Converter"
      description="Translate configuration structures between JSON and YAML syntax formats instantly client-side."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Toggle Mode */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-secondary-bg/30 p-4 rounded-xl border border-border-color">
          <div className="text-sm font-semibold text-primary-text flex items-center gap-2">
            <Code2 className="h-5 w-5 text-accent" />
            Mode: <span className="text-accent uppercase font-bold">{mode === "json2yaml" ? "JSON to YAML" : "YAML to JSON"}</span>
          </div>
          <button
            onClick={swapModes}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4" /> Swap Direction
          </button>
        </div>

        {/* Input/Output columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-text">
              {mode === "json2yaml" ? "Input JSON Config" : "Input YAML Config"}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "json2yaml"
                  ? '{\n  "appName": "ToolNagri",\n  "port": 3000,\n  "features": ["Shortener", "Calculators"]\n}'
                  : 'appName: ToolNagri\nport: 3000\nfeatures:\n  - Shortener\n  - Calculators'
              }
              rows={12}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-primary-text">
                {mode === "json2yaml" ? "Output YAML" : "Output JSON"}
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
              placeholder="Your converted config will appear here..."
              rows={12}
              className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-sm text-primary-text font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Error Notification */}
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
            Run Translation
          </button>
        </div>

      </div>
    </ToolLayout>
  );
}
