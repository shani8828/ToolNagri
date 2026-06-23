"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Globe, Search, RefreshCw, AlertTriangle, ArrowDown } from "lucide-react";

interface DNSRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT"];
const TYPE_MAP: Record<number, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  15: "MX",
  16: "TXT",
  28: "AAAA",
};

export default function DnsLookup() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveDns = async () => {
    setError(null);
    setRecords([]);

    const cleanDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    if (!cleanDomain) {
      setError("Domain name is empty. Please enter a valid host name (e.g. google.com).");
      return;
    }

    // Basic domain validation
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(cleanDomain)) {
      setError("Invalid domain format. Enter a valid host like example.com or api.example.org.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=${recordType}`,
        {
          headers: {
            accept: "application/dns-json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Cloudflare DoH service responded with an error.");
      }

      const data = await response.json();
      
      if (data.Status !== 0) {
        // Status 3 is NXDOMAIN
        if (data.Status === 3) {
          setError("Domain name does not exist (NXDOMAIN).");
        } else {
          setError(`DNS lookup failed with status code ${data.Status}.`);
        }
        return;
      }

      if (!data.Answer || data.Answer.length === 0) {
        setError(`No ${recordType} records found for this domain.`);
        return;
      }

      setRecords(data.Answer);
    } catch (err: any) {
      setError(err.message || "DNS query request timed out. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const howToUse = [
    "Enter a domain name (like google.com or github.com) in the search field.",
    "Select the DNS record type from the dropdown list (A, MX, TXT, etc.).",
    "Click the Resolve DNS button to fetch the records from Cloudflare DNS-over-HTTPS.",
    "Inspect the IP addresses, CNAME mappings, TTL intervals, and priority ratings in the results."
  ];

  const benefits = [
    "Uses Cloudflare's secure DNS-over-HTTPS (DoH) API for encrypted queries.",
    "Supports resolving key record types including A, AAAA, MX, CNAME, NS, and TXT.",
    "Runs entirely on the client, avoiding query caching and giving real-time propagation statuses.",
    "Formats record listings in a clean, readable layout."
  ];

  const faqs = [
    {
      question: "What is DNS-over-HTTPS (DoH)?",
      answer: "DoH is a security protocol that runs Domain Name System queries over encrypted HTTPS channels. It protects queries from surveillance, spoofing, and interception by third parties.",
    },
    {
      question: "What does TTL mean in DNS records?",
      answer: "TTL stands for Time-To-Live. It is a value in seconds indicating how long recursive DNS servers and web browsers should cache the query details before requesting them again."
    }
  ];

  const relatedTools = [
    { name: "What is my IP Address", url: "/what-is-my-ip", description: "Detect public connection IP addresses." },
    { name: "Free URL Shortener", url: "/url-shortener", description: "Create short redirection routes." }
  ];

  return (
    <ToolLayout
      title="DNS Lookup Resolver"
      description="Perform quick DNS lookups and resolve A, AAAA, MX, CNAME, TXT, and NS records client-side."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Form panel */}
        <div className="flex flex-col sm:flex-row gap-4 bg-secondary-bg/30 p-4 rounded-xl border border-border-color">
          
          {/* Domain input */}
          <div className="flex-1 space-y-1">
            <label className="text-xs font-semibold text-secondary-text">Domain Name</label>
            <div className="relative rounded-lg shadow-sm border border-border-color bg-background flex items-center px-3 gap-2">
              <Globe className="h-4.5 w-4.5 text-secondary-text shrink-0" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. google.com"
                className="w-full py-2 bg-transparent text-sm text-primary-text focus:outline-none placeholder-secondary-text font-medium"
                onKeyDown={(e) => { if (e.key === "Enter") resolveDns(); }}
              />
            </div>
          </div>

          {/* Record type selection */}
          <div className="w-full sm:w-36 space-y-1">
            <label className="text-xs font-semibold text-secondary-text">Record Type</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-sm text-primary-text font-semibold focus:outline-none focus:border-accent"
            >
              {RECORD_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Resolve Button */}
          <div className="flex items-end">
            <button
              onClick={resolveDns}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Resolving..." : "Resolve DNS"}
            </button>
          </div>

        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            {error}
          </div>
        )}

        {/* DNS results table */}
        {records.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border-color">
            <h4 className="text-sm font-bold text-primary-text flex items-center gap-1.5">
              <ArrowDown className="h-4 w-4 text-accent" /> DNS Records Found ({records.length})
            </h4>
            
            <div className="overflow-x-auto rounded-xl border border-border-color bg-card-bg shadow-sm">
              <table className="min-w-full divide-y divide-border-color text-left text-sm text-primary-text">
                <thead className="bg-secondary-bg/25 text-xs text-secondary-text font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Host Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">TTL (Sec)</th>
                    <th className="px-4 py-3">Data / Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {records.map((rec, i) => (
                    <tr key={i} className="hover:bg-hover-bg/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs break-all">{rec.name}</td>
                      <td className="px-4 py-3 font-semibold text-xs">{TYPE_MAP[rec.type] || rec.type}</td>
                      <td className="px-4 py-3 font-mono text-xs text-secondary-text">{rec.TTL}</td>
                      <td className="px-4 py-3 font-mono text-xs break-all text-accent font-bold">{rec.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
