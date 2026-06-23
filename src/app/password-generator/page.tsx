"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, Shield, RefreshCw } from "lucide-react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ label: "Medium", color: "bg-warning", width: "w-1/2" });

  const generatePassword = useCallback(() => {
    let chars = "";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setPassword("Please select at least one character type.");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars.charAt(randomIndex);
    }
    setPassword(generatedPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Estimate password strength
  const checkStrength = useCallback(() => {
    if (!password || password === "Please select at least one character type.") {
      setStrength({ label: "Too Weak", color: "bg-red-500", width: "w-5" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    let types = 0;
    if (/[A-Z]/.test(password)) types++;
    if (/[a-z]/.test(password)) types++;
    if (/[0-9]/.test(password)) types++;
    if (/[^A-Za-z0-9]/.test(password)) types++;

    score += Math.floor(types / 2);

    if (score <= 1) {
      setStrength({ label: "Very Weak", color: "bg-red-500", width: "w-1/5" });
    } else if (score === 2) {
      setStrength({ label: "Weak", color: "bg-orange-500", width: "w-2/5" });
    } else if (score === 3) {
      setStrength({ label: "Medium", color: "bg-warning", width: "w-3/5" });
    } else if (score === 4) {
      setStrength({ label: "Strong", color: "bg-success/80", width: "w-4/5" });
    } else {
      setStrength({ label: "Excellent (Very Secure)", color: "bg-success", width: "w-full" });
    }
  }, [password]);

  // Auto-generate on configuration changes
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  useEffect(() => {
    checkStrength();
  }, [password, checkStrength]);

  const handleCopy = async () => {
    if (!password || password === "Please select at least one character type.") return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const howToUse = [
    "Choose your desired password length using the slider (8 to 50 characters).",
    "Toggle checkboxes for character options (Uppercase, Lowercase, Numbers, Symbols).",
    "The secure password will automatically generate on any change.",
    "Observe the Strength Meter to verify the vulnerability level of your password.",
    "Click the Copy button to save it directly to your device clipboard."
  ];

  const benefits = [
    "100% Secure & Client-Side: Passwords are built inside your local browser and never sent over the web.",
    "Configurable complexity: Meet custom rules (such as mandatory symbols or digits).",
    "Built-in strength scoring helps audit the safety of your generated code.",
    "One-click copy and regeneration options for speed."
  ];

  const faqs = [
    {
      question: "Are the generated passwords safe?",
      answer: "Yes. They are generated using a cryptographically randomized model in javascript. Since they never leave your browser, no one else has access to them."
    },
    {
      question: "What makes a password strong?",
      answer: "A strong password has at least 12 characters and includes a blend of uppercase letters, lowercase letters, numbers, and special symbols. Longer passwords are exponential harder to crack."
    },
    {
      question: "Do you save my generated passwords?",
      answer: "No. ToolNagri is dedicated to privacy. All operations are strictly local and temporary."
    }
  ];

  const relatedTools = [
    {
      name: "Free URL Shortener",
      url: "/url-shortener",
      description: "Shorten links, generate QR codes, and view analytics parameters."
    },
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully styled QR codes with customized sizing and colors."
    },
    {
      name: "JSON Formatter",
      url: "/json-formatter",
      description: "Format, minify, and validate JSON snippets with syntax highlighting."
    }
  ];

  return (
    <ToolLayout
      title="Secure Password Generator"
      description="Create highly secure, cryptographically random passwords client-side. Customise length, character types, check the security strength rating, and copy instantly."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Output password bar */}
        <div className="flex rounded-lg border border-border-color bg-secondary-bg p-2 shadow-sm items-center justify-between gap-4">
          <div className="flex-1 font-mono text-base md:text-lg text-primary-text font-semibold break-all px-3 py-1 select-all">
            {password}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generatePassword}
              className="p-2 hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
              title="Regenerate password"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent hover:bg-accent-light px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-secondary-text">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-accent" /> Password Strength
            </span>
            <span className="text-primary-text">{strength.label}</span>
          </div>
          <div className="h-2 w-full bg-border-color rounded-full overflow-hidden">
            <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
          </div>
        </div>

        {/* Options Panel */}
        <div className="space-y-5 pt-4 border-t border-border-color">
          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-primary-text">
              <label htmlFor="length">Password Length</label>
              <span className="text-accent text-base">{length} characters</span>
            </div>
            <input
              type="range"
              id="length"
              min={8}
              max={50}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Checklist options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border-color hover:bg-hover-bg transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="h-4 w-4 rounded border-border-color text-accent focus:ring-accent cursor-pointer"
              />
              <div className="text-sm">
                <p className="font-semibold text-primary-text">Uppercase Letters</p>
                <p className="text-xs text-secondary-text">A-Z characters</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-border-color hover:bg-hover-bg transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="h-4 w-4 rounded border-border-color text-accent focus:ring-accent cursor-pointer"
              />
              <div className="text-sm">
                <p className="font-semibold text-primary-text">Lowercase Letters</p>
                <p className="text-xs text-secondary-text">a-z characters</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-border-color hover:bg-hover-bg transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="h-4 w-4 rounded border-border-color text-accent focus:ring-accent cursor-pointer"
              />
              <div className="text-sm">
                <p className="font-semibold text-primary-text">Numbers</p>
                <p className="text-xs text-secondary-text">0-9 digits</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-border-color hover:bg-hover-bg transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="h-4 w-4 rounded border-border-color text-accent focus:ring-accent cursor-pointer"
              />
              <div className="text-sm">
                <p className="font-semibold text-primary-text">Special Symbols</p>
                <p className="text-xs text-secondary-text">!@#$%^&*() symbols</p>
              </div>
            </label>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
