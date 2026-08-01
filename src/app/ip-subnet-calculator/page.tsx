"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { AlertCircle, HelpCircle, Network, Copy, Check, Shield } from "lucide-react";

export default function IpSubnetCalculator() {
  const [ipAddress, setIpAddress] = useState("192.168.1.1");
  const [cidr, setCidr] = useState<number>(24);

  // Output states
  const [netmask, setNetmask] = useState("");
  const [networkAddress, setNetworkAddress] = useState("");
  const [broadcastAddress, setBroadcastAddress] = useState("");
  const [usableStart, setUsableStart] = useState("");
  const [usableEnd, setUsableEnd] = useState("");
  const [usableHosts, setUsableHosts] = useState<number>(0);
  const [wildcardMask, setWildcardMask] = useState("");

  const [ipBinary, setIpBinary] = useState("");
  const [maskBinary, setMaskBinary] = useState("");
  const [networkBinary, setNetworkBinary] = useState("");

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Helper convertors
  const intToIp = (num: number) => {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join(".");
  };

  const intToBinary = (num: number) => {
    const bin = (num >>> 0).toString(2).padStart(32, "0");
    return `${bin.slice(0, 8)}.${bin.slice(8, 16)}.${bin.slice(16, 24)}.${bin.slice(24, 32)}`;
  };

  useEffect(() => {
    setError("");

    const ipParts = ipAddress.split(".").map((part) => part.trim());
    if (ipParts.length !== 4) {
      setError("IP address must contain 4 octets separated by dots.");
      return;
    }

    const octets = ipParts.map((part) => {
      const val = parseInt(part, 10);
      if (isNaN(val) || val < 0 || val > 255) return -1;
      return val;
    });

    if (octets.includes(-1)) {
      setError("Each octet of the IP address must be an integer between 0 and 255.");
      return;
    }

    try {
      // 1. Pack IP octets into 32-bit unsigned int
      const ipInt = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;

      // 2. Generate subnet mask integer based on CIDR
      const maskInt = (cidr === 0 ? 0 : (~0 << (32 - cidr))) >>> 0;
      const wildcardInt = (~maskInt) >>> 0;

      // 3. Compute network and broadcast integers
      const networkInt = (ipInt & maskInt) >>> 0;
      const broadcastInt = (networkInt | wildcardInt) >>> 0;

      // 4. Compute Usable IP Range boundaries
      let startInt = 0;
      let endInt = 0;
      let hostCapacity = 0;

      if (cidr === 32) {
        startInt = networkInt;
        endInt = networkInt;
        hostCapacity = 1;
      } else if (cidr === 31) {
        startInt = networkInt;
        endInt = broadcastInt;
        hostCapacity = 2;
      } else {
        startInt = (networkInt + 1) >>> 0;
        endInt = (broadcastInt - 1) >>> 0;
        hostCapacity = Math.max(0, Math.pow(2, 32 - cidr) - 2);
      }

      setNetmask(intToIp(maskInt));
      setWildcardMask(intToIp(wildcardInt));
      setNetworkAddress(intToIp(networkInt));
      setBroadcastAddress(intToIp(broadcastInt));
      setUsableStart(intToIp(startInt));
      setUsableEnd(intToIp(endInt));
      setUsableHosts(hostCapacity);

      setIpBinary(intToBinary(ipInt));
      setMaskBinary(intToBinary(maskInt));
      setNetworkBinary(intToBinary(networkInt));

    } catch (e) {
      setError("Failed to calculate subnet parameters.");
    }
  }, [ipAddress, cidr]);

  const handleCopyToClipboard = () => {
    if (error) return;
    const txt = `IP Address: ${ipAddress}/${cidr}
Subnet Mask: ${netmask}
Wildcard Mask: ${wildcardMask}
Network Address: ${networkAddress}
Broadcast Address: ${broadcastAddress}
Usable IP Range: ${usableStart} - ${usableEnd}
Total Usable Hosts: ${usableHosts.toLocaleString()}`;

    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const howToUse = [
    "Input your host IP Address (e.g. 192.168.1.100).",
    "Select your network prefix size in the CIDR Suffix dropdown selector.",
    "Examine network boundaries (subnet mask, broadcast, host capacities).",
    "Review bitwise binary octet formats to study network boundaries.",
    "Click Copy Parameters to save calculations."
  ];

  const benefits = [
    "Accurately calculates IP bounds instantly using client-side bitwise shifts.",
    "Includes subnets, wildcard masks, and Usable IP start/end scopes.",
    "Highlights binary representation streams (ideal for CCNA/network studies).",
    "100% Client-Side calculation ensures offline safety."
  ];

  const faqs = [
    {
      question: "What is CIDR notation?",
      answer: "Classless Inter-Domain Routing (CIDR) notation describes subnet masks. For example, `/24` represents a subnet mask where the first 24 bits are set to 1 (decimal `255.255.255.0`), allowing up to 254 usable host addresses."
    },
    {
      question: "Why do subnets lose two host addresses?",
      answer: "In typical subnets (CIDR /30 and below), the first address is reserved as the Network ID (identifies the network), and the last address is reserved as the Broadcast ID (sends packets to all hosts). Host capacity is therefore `2^(32-N) - 2`."
    }
  ];

  const relatedTools = [
    { name: "DNS Lookup Checker", url: "/dns-lookup", description: "Query DNS A, MX, and TXT domain records." },
    { name: "What Is My IP", url: "/what-is-my-ip", description: "Check public IP addresses and ISP networks." }
  ];

  return (
    <ToolLayout
      title="IP Subnet CIDR Calculator"
      description="Parse CIDR subnet suffixes and IP addresses. Calculate subnet masks, network IDs, usable host ranges, broadcast addresses, wildcard masks, and binary representations."
      category="Network & Security"
      categoryUrl="/#network"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Inputs row */}
        <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
          <span className="text-xs font-bold text-primary-text uppercase tracking-wider block border-b border-border-color/60 pb-1.5">
            Network Address Settings
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* IP Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">IP Address</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="e.g. 192.168.1.1"
                className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
              />
            </div>

            {/* CIDR prefix */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">CIDR Subnet Prefix</label>
              <select
                value={cidr}
                onChange={(e) => setCidr(parseInt(e.target.value))}
                className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 32 }, (_, i) => 32 - i).map((prefix) => (
                  <option key={prefix} value={prefix}>
                    /{prefix} ({intToIp((prefix === 0 ? 0 : (~0 << (32 - prefix))) >>> 0)})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Calculations Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Decimal parameters list */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Network className="h-4.5 w-4.5 text-accent animate-pulse" /> Subnet Boundaries
            </span>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-secondary-text">CIDR Address Block</span>
                <span className="font-mono font-bold text-primary-text">{ipAddress}/{cidr}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border-color/40 pt-2">
                <span className="text-secondary-text">Subnet Mask</span>
                <span className="font-mono font-bold text-primary-text">{netmask}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border-color/40 pt-2">
                <span className="text-secondary-text">Wildcard Mask</span>
                <span className="font-mono font-bold text-primary-text">{wildcardMask}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border-color/40 pt-2">
                <span className="text-secondary-text">Network Address (Subnet ID)</span>
                <span className="font-mono font-bold text-primary-text">{networkAddress}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border-color/40 pt-2">
                <span className="text-secondary-text">Broadcast Address</span>
                <span className="font-mono font-bold text-primary-text">{broadcastAddress}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border-color/40 pt-2 text-sm">
                <span className="font-semibold text-primary-text">Usable Host Scope</span>
                <span className="font-mono font-bold text-accent">
                  {usableStart} - {usableEnd}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border-color/40 pt-2">
                <span className="text-secondary-text">Usable Host Capacity</span>
                <span className="font-mono font-bold text-success">
                  {usableHosts.toLocaleString()} hosts
                </span>
              </div>
            </div>

            {!error && (
              <button
                onClick={handleCopyToClipboard}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-accent hover:bg-accent/90 text-white cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Parameters"}
              </button>
            )}
          </div>

          {/* Binary Visual Board */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Shield className="h-4.5 w-4.5 text-success" /> Binary Octet Visualizer
            </span>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider block">Host IP Binary</span>
                <div className="bg-secondary-bg/25 p-2 rounded-lg border border-border-color/40 text-primary-text overflow-x-auto whitespace-nowrap">
                  {ipBinary}
                </div>
              </div>

              <div className="space-y-1 border-t border-border-color/40 pt-3">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider block">Netmask Binary</span>
                <div className="bg-secondary-bg/25 p-2 rounded-lg border border-border-color/40 text-primary-text overflow-x-auto whitespace-nowrap">
                  {maskBinary}
                </div>
              </div>

              <div className="space-y-1 border-t border-border-color/40 pt-3">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider block">Network ID Binary</span>
                <div className="bg-secondary-bg/25 p-2 rounded-lg border border-border-color/40 text-primary-text overflow-x-auto whitespace-nowrap">
                  {networkBinary}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
            <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
            <span>{error}</span>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
