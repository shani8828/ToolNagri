"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Search, RefreshCw, Eye, ShieldAlert, Cpu, Network, Info } from "lucide-react";
import confetti from "canvas-confetti";

interface MacDetails {
  cleaned: string;
  formatted: string;
  oui: string;
  vendor: string;
  isMulticast: boolean;
  isLocal: boolean;
}

// offline OUI prefix list
const OUI_VENDORS: Record<string, string> = {
  "00000C": "Cisco Systems, Inc.",
  "0001E8": "Dell Inc.",
  "0002B3": "Intel Corporation",
  "000393": "Apple Inc.",
  "000502": "Apple Inc.",
  "0005B1": "Cisco Systems, Inc.",
  "00095B": "Netgear Inc.",
  "000D3A": "Microsoft Corporation",
  "000E7F": "Hewlett Packard Enterprise",
  "00107A": "Intel Corporation",
  "001122": "Cisco Systems, Inc.",
  "001422": "Dell Inc.",
  "00163E": "Xensource, Inc. (Xen VMs)",
  "0017F2": "Apple Inc.",
  "001A11": "Google LLC",
  "001A80": "Cisco Systems, Inc.",
  "001AE9": "Intel Corporation",
  "001C1A": "Intel Corporation",
  "002170": "Dell Inc.",
  "002241": "Intel Corporation",
  "0024A0": "Apple Inc.",
  "002590": "Super Micro Computer, Inc.",
  "0026BB": "Apple Inc.",
  "005056": "VMware, Inc.",
  "00E04C": "Realtek Semiconductor Corp.",
  "04D4C4": "Intel Corporation",
  "080027": "Oracle Corporation (VirtualBox)",
  "10D07A": "Intel Corporation",
  "147DDA": "Apple Inc.",
  "18AF61": "Apple Inc.",
  "24A074": "Apple Inc.",
  "28CFE9": "Apple Inc.",
  "34159E": "Samsung Electronics Co., Ltd.",
  "3C5AB4": "Google LLC",
  "3CD92B": "Hewlett Packard Enterprise",
  "40A3CC": "Apple Inc.",
  "482C6A": "Apple Inc.",
  "4CD1A1": "Huawei Technologies Co., Ltd.",
  "5076AF": "Apple Inc.",
  "54EE75": "Apple Inc.",
  "5CE91E": "Intel Corporation",
  "600308": "Apple Inc.",
  "640980": "Apple Inc.",
  "6C4008": "Apple Inc.",
  "705A0F": "Apple Inc.",
  "708BCD": "Apple Inc.",
  "74AC5F": "Apple Inc.",
  "7831C1": "Apple Inc.",
  "7CD1C3": "Apple Inc.",
  "804A14": "Apple Inc.",
  "8478AC": "Apple Inc.",
  "88E9FE": "Apple Inc.",
  "90B686": "Apple Inc.",
  "9801A7": "Apple Inc.",
  "A0999B": "Apple Inc.",
  "AC7F3E": "Apple Inc.",
  "B418D1": "Apple Inc.",
  "B827EB": "Raspberry Pi Foundation",
  "C03E0F": "Apple Inc.",
  "C42C03": "Apple Inc.",
  "CC20E8": "Apple Inc.",
  "D83062": "Apple Inc.",
  "D8C467": "Apple Inc.",
  "DCA632": "Apple Inc.",
  "E0B9E5": "Apple Inc.",
  "E450EB": "Apple Inc.",
  "E4E4AB": "Apple Inc.",
  "EC3586": "Apple Inc.",
  "F01898": "Apple Inc.",
  "F0DBF6": "Apple Inc.",
  "F437B7": "Apple Inc.",
  "F82793": "Apple Inc."
};

export default function MacAddressLookup() {
  const [inputText, setInputText] = useState("00:1A:E9:3C:4D:5E");
  const [details, setDetails] = useState<MacDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLookup = () => {
    setErrorMsg("");
    setDetails(null);

    // Clean address (remove colons, dashes, periods, spaces)
    const cleaned = inputText.replace(/[:.\-\s]/g, "").toUpperCase();

    if (!cleaned) {
      setErrorMsg("Please enter a MAC address.");
      return;
    }

    if (cleaned.length !== 12) {
      setErrorMsg(`Invalid length (${cleaned.length} chars). A standard MAC address must have exactly 12 hexadecimal characters.`);
      return;
    }

    if (!/^[0-9A-F]{12}$/.test(cleaned)) {
      setErrorMsg("Invalid characters found. A MAC address must consist only of hex characters (0-9, A-F).");
      return;
    }

    // Format standard colon-delimited MAC
    const formatted = cleaned.match(/.{1,2}/g)?.join(":") || "";

    // Extract first 6 characters (OUI)
    const oui = cleaned.substring(0, 6);

    // Lookup vendor
    const vendor = OUI_VENDORS[oui] || "Unknown Vendor (Not in offline database)";

    // Determine type flags
    // Octet 1 = lower 4 bits in second hex character
    const secondChar = cleaned.charAt(1);
    const secondCharVal = parseInt(secondChar, 16);

    // Multicast flag: Bit 0 of octet 1 (LSB is odd)
    const isMulticast = secondCharVal % 2 === 1;

    // Locally Administered flag: Bit 1 of octet 1 (val & 2)
    const isLocal = (secondCharVal & 2) === 2;

    setDetails({
      cleaned,
      formatted,
      oui,
      vendor,
      isMulticast,
      isLocal
    });

    if (vendor !== "Unknown Vendor (Not in offline database)") {
      confetti({
        particleCount: 15,
        spread: 20,
        origin: { y: 0.8 },
        colors: ["#2563eb", "#10b981"],
      });
    }
  };

  useEffect(() => {
    handleLookup();
  }, [inputText]);

  const handleReset = () => {
    setInputText("00:1A:E9:3C:4D:5E");
  };

  const howToUse = [
    "Type or paste your MAC Address into the input textbox.",
    "The tool automatically strips spacing colons, periods, or dashes.",
    "Inspect OUI parameters, globally unique designations, and vendors.",
    "Compare transmission modes (unicast/multicast) in the results box."
  ];

  const benefits = [
    "Supports multiple input styles (00:1A:2B, 00-1A-2B, 001a.2b3c, etc.).",
    "Uses an offline vendor OUI database for instantaneous matches.",
    "Decodes hardware transmission mode and registration flags.",
    "100% Client-Side operation keeps network data private."
  ];

  const faqs = [
    {
      question: "What is an OUI?",
      answer: "OUI stands for Organizationally Unique Identifier. It is the first 24 bits (3 octets or 6 hex digits) of a MAC address assigned to hardware manufacturers by the IEEE."
    },
    {
      question: "What is the difference between global and local MACs?",
      answer: "Globally unique MACs are burned-in hardware addresses assigned by vendors. Locally administered MACs are software-configured overrides (such as randomized MACs used for phone security)."
    }
  ];

  const relatedTools = [
    { name: "IP Subnet Calculator", url: "/ip-subnet-calculator", description: "Decode CIDR notations and subnets." },
    { name: "DNS Lookup", url: "/dns-lookup", description: "Resolve DNS record details." }
  ];

  return (
    <ToolLayout
      title="MAC Address Lookup"
      description="Decode hardware MAC addresses to identify OUI manufacturer vendors, transmission modes, and registration flags offline."
      category="Network & Security"
      categoryUrl="/#network"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Inputs panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Settings Column */}
          <div className="lg:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-4 text-xs">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Network className="h-4 w-4 text-accent" /> MAC Lookup Parameters
            </span>

            <div className="space-y-2">
              <label className="text-secondary-text font-semibold">Enter MAC Address</label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. 00-1A-E9-3C-4D-5E or 001AE93C4D5E"
                className="w-full py-2.5 px-3 rounded-lg border border-border-color bg-background text-primary-text font-mono font-bold focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-xs text-warning border border-warning/20">
                <ShieldAlert className="h-4 w-4 shrink-0 font-medium" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleLookup}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Lookup Vendor
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors"
              >
                Reset Page
              </button>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-success" /> Decoding Results
              </span>

              {details ? (
                <div className="space-y-3.5">
                  <div>
                    <p className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Manufacturer Vendor</p>
                    <p className="text-lg font-black text-accent">{details.vendor}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-border-color/60 pt-3 text-[10px] font-bold text-secondary-text">
                    <div>
                      <p className="uppercase tracking-wider">Cleaned MAC</p>
                      <p className="text-xs font-semibold text-primary-text font-mono">{details.formatted}</p>
                    </div>
                    <div>
                      <p className="uppercase tracking-wider">OUI Prefix</p>
                      <p className="text-xs font-semibold text-primary-text font-mono">{details.oui}</p>
                    </div>
                    <div>
                      <p className="uppercase tracking-wider">Transmission Type</p>
                      <p className={`text-xs font-semibold ${details.isMulticast ? "text-warning" : "text-success"}`}>
                        {details.isMulticast ? "Multicast" : "Unicast"}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase tracking-wider">Administration</p>
                      <p className="text-xs font-semibold text-primary-text">
                        {details.isLocal ? "Locally Administered" : "Globally Unique (UAA)"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-14 text-center text-xs text-secondary-text italic leading-relaxed">
                  Enter a valid MAC address to view details.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border-color/60 flex items-center gap-1.5 text-[9px] font-bold text-secondary-text select-none">
              <Info className="h-3.5 w-3.5 text-accent shrink-0" />
              <span>Matching uses local database signatures.</span>
            </div>
          </div>

        </div>

        {/* Informative Grid */}
        <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
          <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-accent animate-pulse" /> Decoding MAC Octets Structure
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-secondary-text leading-relaxed">
            <div className="space-y-2 p-3 bg-secondary-bg/20 rounded-xl border border-border-color/60">
              <h4 className="font-bold text-primary-text">1. Vendor Prefix (OUI)</h4>
              <p>The first 3 octets (e.g. `00:1A:E9`) define the Organizationally Unique Identifier (OUI), revealing the hardware adapter manufacturer registered with the IEEE.</p>
            </div>
            
            <div className="space-y-2 p-3 bg-secondary-bg/20 rounded-xl border border-border-color/60">
              <h4 className="font-bold text-primary-text">2. Unicast vs Multicast</h4>
              <p>If the least significant bit of the first byte is set to `1` (such as address `01:...`), the packet is broadcast/multicast. If `0`, it targets a single device (unicast).</p>
            </div>

            <div className="space-y-2 p-3 bg-secondary-bg/20 rounded-xl border border-border-color/60">
              <h4 className="font-bold text-primary-text">3. Global vs Local MAC</h4>
              <p>If the second-least significant bit of the first byte is set to `1`, the address is configured locally (virtual MACs, randomized wifi address overlays). If `0`, it is a manufacturer-assigned ID.</p>
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
