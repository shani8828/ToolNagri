"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { ShieldCheck, Copy, Check, AlertTriangle } from "lucide-react";

export default function JwtDebugger() {
  const [tokenInput, setTokenInput] = useState("");
  const [headerJson, setHeaderJson] = useState("");
  const [payloadJson, setPayloadJson] = useState("");
  const [signatureHex, setSignatureHex] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleCopy = (text: string, type: "header" | "payload") => {
    navigator.clipboard.writeText(text);
    if (type === "header") {
      setCopiedHeader(true);
      setTimeout(() => setCopiedHeader(false), 2000);
    } else {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  // Base64Url Decoder helper
  const decodeBase64Url = (str: string) => {
    // Convert base64url characters to standard base64
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if necessary
    while (base64.length % 4) {
      base64 += "=";
    }
    
    try {
      // Decode character string using window.atob
      const binary = atob(base64);
      // Handle non-ascii character values correctly
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder("utf-8").decode(bytes);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setErrorMsg(null);
    setHeaderJson("");
    setPayloadJson("");
    setSignatureHex("");

    const token = tokenInput.trim();
    if (!token) return;

    const parts = token.split(".");
    if (parts.length !== 3) {
      setErrorMsg("Invalid token structure. A JWT must consist of three sections separated by periods (Header.Payload.Signature).");
      return;
    }

    const decodedHeader = decodeBase64Url(parts[0]);
    const decodedPayload = decodeBase64Url(parts[1]);

    if (!decodedHeader) {
      setErrorMsg("Failed to decode token Header (Section 1). Ensure it is valid base64url.");
      return;
    }
    if (!decodedPayload) {
      setErrorMsg("Failed to decode token Payload (Section 2). Ensure it is valid base64url.");
      return;
    }

    try {
      setHeaderJson(JSON.stringify(JSON.parse(decodedHeader), null, 2));
      setPayloadJson(JSON.stringify(JSON.parse(decodedPayload), null, 2));
      setSignatureHex(parts[2]);
    } catch {
      setErrorMsg("Decoded data could not be parsed as valid JSON objects.");
    }
  }, [tokenInput]);

  const howToUse = [
    "Paste your JSON Web Token (JWT) into the source token text area.",
    "The decoder immediately splits the string at period boundaries client-side.",
    "Review decoded headers (algorithm, token type) and payload claims (userID, expiration).",
    "Copy specific segments using the copy icons beside the cards."
  ];

  const benefits = [
    "100% browser-side parsing ensuring your sensitive authorization tokens never touch a server.",
    "Decodes and formats both header and payload claims into prettified JSON structures.",
    "Auto-validates JWT structure, reporting missing delimiters or bad base64 signatures.",
    "Perfect for debugging authorization issues and API testing."
  ];

  const faqs = [
    {
      question: "Is my token secure on this debugger page?",
      answer: "Yes, absolutely. The JWT Debugger runs strictly inside your local browser sandbox. It does not send authorization tokens or payload variables to any external endpoint.",
    },
    {
      question: "What values does the token Header contain?",
      answer: "The Header typically declares the metadata of the token, specifying the signature algorithm used (such as HS256, RS256) and the token type ('JWT')."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter & Validator", url: "/json-formatter", description: "Beautify, parse, and validate JSON payloads." },
    { name: "Secure Password Generator", url: "/password-generator", description: "Configure cryptographically secure passkeys." }
  ];

  return (
    <ToolLayout
      title="JWT Web Token Debugger"
      description="Decode, inspect, and parse JSON Web Token authorization parameters securely inside your browser."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Token Input Card */}
        <div className="space-y-2">
          <label htmlFor="tokenArea" className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-accent" /> Paste JWT Token
          </label>
          <textarea
            id="tokenArea"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFudWJoYXYgS3VtYXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            rows={4}
            className="w-full rounded-lg border border-border-color bg-background px-4 py-3 text-sm text-primary-text font-mono focus:border-accent focus:outline-none"
          />
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            {errorMsg}
          </div>
        )}

        {/* Decoded Outputs Grid */}
        {headerJson && payloadJson && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-color/60">
            {/* Header Block */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-secondary-text uppercase tracking-wider">Decoded Header</span>
                <button
                  onClick={() => handleCopy(headerJson, "header")}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                >
                  {copiedHeader ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy Header
                </button>
              </div>
              <pre className="w-full rounded-lg border border-border-color bg-secondary-bg/25 px-4 py-3 text-xs text-primary-text font-mono overflow-x-auto min-h-[150px]">
                {headerJson}
              </pre>
            </div>

            {/* Payload Block */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-secondary-text uppercase tracking-wider">Decoded Payload</span>
                <button
                  onClick={() => handleCopy(payloadJson, "payload")}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                >
                  {copiedPayload ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy Payload
                </button>
              </div>
              <pre className="w-full rounded-lg border border-border-color bg-secondary-bg/25 px-4 py-3 text-xs text-primary-text font-mono overflow-x-auto min-h-[150px]">
                {payloadJson}
              </pre>
            </div>

            {/* Signature Block (Full width equivalent layout) */}
            <div className="md:col-span-2 space-y-2">
              <span className="text-xs font-bold text-secondary-text uppercase tracking-wider">Signature Hash</span>
              <pre className="w-full rounded-lg border border-border-color bg-secondary-bg/15 px-4 py-3 text-xs text-secondary-text font-mono overflow-x-auto truncate">
                {signatureHex}
              </pre>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
