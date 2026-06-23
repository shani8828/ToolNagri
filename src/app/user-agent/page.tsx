"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Laptop, Chrome, Copy, Check, Info, Settings, Monitor } from "lucide-react";

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  engine: { name: string; version: string };
  device: string;
}

export default function UserAgentParser() {
  const [uaInput, setUaInput] = useState("");
  const [parsed, setParsed] = useState<ParsedUA | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent;
      setUaInput(userAgent);
      parseUserAgent(userAgent);
    }
  }, []);

  const parseUserAgent = (ua: string) => {
    if (!ua.trim()) {
      setParsed(null);
      return;
    }

    const browser = { name: "Unknown Browser", version: "Unknown" };
    const os = { name: "Unknown OS", version: "Unknown" };
    const engine = { name: "Unknown Engine", version: "Unknown" };
    let device = "Desktop";

    // 1. Detect OS
    if (/windows|win32/i.test(ua)) {
      os.name = "Windows";
      const match = ua.match(/Windows NT ([\d\.]+)/);
      if (match) {
        const verMap: Record<string, string> = {
          "10.0": "10 / 11",
          "6.3": "8.1",
          "6.2": "8",
          "6.1": "7",
          "6.0": "Vista",
          "5.1": "XP",
        };
        os.version = verMap[match[1]] || match[1];
      }
    } else if (/macintosh|mac os x/i.test(ua) && !/like mac os x/i.test(ua)) {
      os.name = "macOS";
      const match = ua.match(/Mac OS X ([\d_]+)/);
      if (match) os.version = match[1].replace(/_/g, ".");
    } else if (/android/i.test(ua)) {
      os.name = "Android";
      const match = ua.match(/Android ([\d\.]+)/);
      if (match) os.version = match[1];
      device = /mobile/i.test(ua) ? "Mobile" : "Tablet";
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      os.name = "iOS";
      const match = ua.match(/OS ([\d_]+) like Mac OS X/);
      if (match) os.version = match[1].replace(/_/g, ".");
      device = /ipad/i.test(ua) ? "Tablet" : "Mobile";
    } else if (/linux/i.test(ua)) {
      os.name = "Linux";
    }

    // 2. Detect Browser
    if (/edg/i.test(ua)) {
      browser.name = "Microsoft Edge";
      const match = ua.match(/Edg\/([\d\.]+)/);
      if (match) browser.version = match[1];
    } else if (/opr|opera/i.test(ua)) {
      browser.name = "Opera";
      const match = ua.match(/(?:OPR|Opera)\/([\d\.]+)/);
      if (match) browser.version = match[1];
    } else if (/chrome|crios/i.test(ua)) {
      browser.name = "Google Chrome";
      const match = ua.match(/(?:Chrome|CrMo|CriOS)\/([\d\.]+)/);
      if (match) browser.version = match[1];
    } else if (/firefox|fxios/i.test(ua)) {
      browser.name = "Mozilla Firefox";
      const match = ua.match(/(?:Firefox|FxiOS)\/([\d\.]+)/);
      if (match) browser.version = match[1];
    } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
      browser.name = "Apple Safari";
      const match = ua.match(/Version\/([\d\.]+)/);
      if (match) browser.version = match[1];
    } else if (/trident|msie/i.test(ua)) {
      browser.name = "Internet Explorer";
      const match = ua.match(/(?:MSIE |rv:)([\d\.]+)/);
      if (match) browser.version = match[1];
    }

    // 3. Detect Engine
    if (/applewebkit/i.test(ua)) {
      engine.name = "WebKit";
      const match = ua.match(/AppleWebKit\/([\d\.]+)/);
      if (match) engine.version = match[1];
    } else if (/gecko/i.test(ua) && !/webkit/i.test(ua)) {
      engine.name = "Gecko";
      const match = ua.match(/rv:([\d\.]+)/);
      if (match) engine.version = match[1];
    } else if (/trident/i.test(ua)) {
      engine.name = "Trident";
      const match = ua.match(/Trident\/([\d\.]+)/);
      if (match) engine.version = match[1];
    }

    setParsed({ browser, os, engine, device });
  };

  const handleParse = () => {
    parseUserAgent(uaInput);
  };

  const handleDetectSelf = () => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent;
      setUaInput(userAgent);
      parseUserAgent(userAgent);
    }
  };

  const handleCopyUA = () => {
    if (uaInput) {
      navigator.clipboard.writeText(uaInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const howToUse = [
    "Your current browser's user agent is loaded and parsed automatically upon page entry.",
    "To analyze a different user agent (e.g., from a client's analytics logs), paste the string in the input field.",
    "Click the Parse User Agent button to update the parsed statistics layout.",
    "Examine browser versions, operating systems, layouts, and engine details below."
  ];

  const benefits = [
    "Identifies exact operating systems, browser versions, and screen render engines instantly.",
    "Decodes complex User Agent details with no network lag or data sharing.",
    "Ideal for debugging browser compatibility bugs or device responsiveness tests.",
    "Works client-side for immediate user telemetry assessments."
  ];

  const faqs = [
    {
      question: "What is a User Agent string?",
      answer: "A User Agent string is a line of text that web browsers send to servers with every HTTP request. It tells the server what browser, operating system, and engine version you are using, allowing the server to format pages for your device.",
    },
    {
      question: "Why do browsers send long User Agent strings?",
      answer: "For historical reasons, most browsers include tokens of other engines (like Mozilla/5.0, AppleWebKit, or Safari) to remain compatible with legacy web servers that filtered browsers by checking these keywords."
    }
  ];

  const relatedTools = [
    { name: "Browser User Agent Parser", url: "/user-agent", description: "Parse your client user agent metrics." },
    { name: "HTML Entity Encoder & Decoder", url: "/html-entities", description: "Sanitize markup strings." }
  ];

  return (
    <ToolLayout
      title="Browser User Agent Parser"
      description="Inspect, decode, and parse web browser User Agent strings to identify Operating Systems, engines, and browsers."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* User Agent Input Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-primary-text flex items-center gap-1">
              <Laptop className="h-4 w-4 text-accent" /> User Agent String
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleDetectSelf}
                className="text-xs font-semibold text-accent hover:text-accent/80 border border-accent/20 px-2.5 py-1 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
              >
                Use My User Agent
              </button>
              {uaInput && (
                <button
                  onClick={handleCopyUA}
                  className="flex items-center gap-1 text-xs border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text px-2.5 py-1 transition-colors cursor-pointer font-semibold"
                >
                  {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy UA
                </button>
              )}
            </div>
          </div>
          <textarea
            value={uaInput}
            onChange={(e) => setUaInput(e.target.value)}
            placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            rows={4}
            className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleParse}
            className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors"
          >
            Parse User Agent
          </button>
        </div>

        {/* Parsed Results Grid */}
        {parsed && (
          <div className="space-y-4 pt-4 border-t border-border-color">
            <h3 className="text-base font-bold text-primary-text flex items-center gap-1.5">
              <Info className="h-4.5 w-4.5 text-accent" /> Parsed Agent Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Browser Card */}
              <div className="p-4 rounded-xl border border-border-color bg-secondary-bg/25 space-y-1">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Browser</span>
                <p className="text-base font-bold text-primary-text truncate">{parsed.browser.name}</p>
                <p className="text-xs text-secondary-text font-medium truncate">Version: {parsed.browser.version}</p>
              </div>

              {/* OS Card */}
              <div className="p-4 rounded-xl border border-border-color bg-secondary-bg/25 space-y-1">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">OS Name</span>
                <p className="text-base font-bold text-primary-text truncate">{parsed.os.name}</p>
                <p className="text-xs text-secondary-text font-medium truncate">Version: {parsed.os.version}</p>
              </div>

              {/* Engine Card */}
              <div className="p-4 rounded-xl border border-border-color bg-secondary-bg/25 space-y-1">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Engine</span>
                <p className="text-base font-bold text-primary-text truncate">{parsed.engine.name}</p>
                <p className="text-xs text-secondary-text font-medium truncate">Version: {parsed.engine.version}</p>
              </div>

              {/* Device Card */}
              <div className="p-4 rounded-xl border border-border-color bg-secondary-bg/25 space-y-1">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Device Type</span>
                <p className="text-base font-bold text-primary-text truncate flex items-center gap-1.5">
                  <Monitor className="h-4.5 w-4.5 text-accent shrink-0" />
                  {parsed.device}
                </p>
                <p className="text-xs text-secondary-text font-medium truncate">Form Factor</p>
              </div>

            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
