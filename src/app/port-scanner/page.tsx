"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Shield, RefreshCw, Eye, ShieldAlert, Cpu, Network, Info, Server, Play, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface PortDetail {
  port: number;
  service: string;
  protocol: "TCP" | "UDP";
  description: string;
  vulnerability: string;
}

interface ScanResult {
  port: number;
  service: string;
  status: "open" | "closed" | "filtered";
  vulnerability: string;
}

const COMMON_PORTS: PortDetail[] = [
  { port: 21, service: "FTP", protocol: "TCP", description: "File Transfer Protocol. Used for transfer of files between clients and server.", vulnerability: "Cleartext credentials transmission. Vulnerable to anonymous access and directory traversal." },
  { port: 22, service: "SSH", protocol: "TCP", description: "Secure Shell. Used for secure remote command-line login and tunnel connections.", vulnerability: "Brute-force password guessing audits. Vulnerable if using outdated SSH versions (e.g., SSHv1)." },
  { port: 23, service: "Telnet", protocol: "TCP", description: "Terminal Network. Legacy cleartext command-line remote access terminal.", vulnerability: "Extremely insecure. All communication (including passwords) travels in unencrypted plain text." },
  { port: 25, service: "SMTP", protocol: "TCP", description: "Simple Mail Transfer Protocol. Used for email routing and transmission.", vulnerability: "Can be abused for email spoofing and open relay spamming campaigns." },
  { port: 53, service: "DNS", protocol: "UDP", description: "Domain Name System. Translates domain names to IP addresses.", vulnerability: "Vulnerable to DNS amplification DDoS attacks and DNS cache poisoning audits." },
  { port: 80, service: "HTTP", protocol: "TCP", description: "Hypertext Transfer Protocol. Standard unencrypted web traffic server.", vulnerability: "Cleartext communications. Sensitive credentials, cookies, and tokens are intercepted easily." },
  { port: 110, service: "POP3", protocol: "TCP", description: "Post Office Protocol v3. Legacy mail retrieval protocol.", vulnerability: "Plain text authentication. Credentials are intercepted via packet sniffing." },
  { port: 443, service: "HTTPS", protocol: "TCP", description: "Hypertext Transfer Protocol Secure. Encrypted TLS web traffic.", vulnerability: "Secure standard. Vulnerable only to SSL/TLS misconfigurations (e.g. Heartbleed, weak ciphers)." },
  { port: 3306, service: "MySQL", protocol: "TCP", description: "MySQL Database Server. Standard relational database engine.", vulnerability: "Brute-force access attempts. SQL injection exploitation leading to database compromises." },
  { port: 3389, service: "RDP", protocol: "TCP", description: "Remote Desktop Protocol. Microsoft Windows GUI remote administrator access.", vulnerability: "Highly targeted for brute-force attacks and remote code execution vulnerabilities (e.g., BlueKeep)." },
  { port: 8080, service: "HTTP-Proxy", protocol: "TCP", description: "Alternative HTTP server port. Often used for local testing or proxy services.", vulnerability: "Frequently misconfigured, exposing administrative control dashboards to the public web." }
];

export default function PortScanner() {
  const [host, setHost] = useState("localhost");
  const [selectedPreset, setSelectedPreset] = useState<"all" | "web" | "admin" | "db">("all");
  
  const [scanning, setScanning] = useState(false);
  const [currentScanningPort, setCurrentScanningPort] = useState<number | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [openPortsCount, setOpenPortsCount] = useState(0);

  const getTargetPorts = () => {
    switch (selectedPreset) {
      case "web":
        return COMMON_PORTS.filter(p => [80, 443, 8080].includes(p.port));
      case "admin":
        return COMMON_PORTS.filter(p => [21, 22, 23, 3389].includes(p.port));
      case "db":
        return COMMON_PORTS.filter(p => [3306].includes(p.port));
      default:
        return COMMON_PORTS;
    }
  };

  const runSimulatedScan = async () => {
    if (scanning) return;
    setScanning(true);
    setResults([]);
    setOpenPortsCount(0);

    const targetPorts = getTargetPorts();
    const tempResults: ScanResult[] = [];
    let countOpen = 0;

    // Run sequential simulated scanning intervals to mimic real socket auditing
    for (let i = 0; i < targetPorts.length; i++) {
      const portMeta = targetPorts[i];
      setCurrentScanningPort(portMeta.port);
      
      // Delay representation (300ms per port check)
      await new Promise(resolve => setTimeout(resolve, 300));

      // Deterministic mock logic based on hostname hashing:
      // We simulate certain ports open for localhost, and others filtered or closed
      let status: "open" | "closed" | "filtered" = "closed";
      const hashVal = (host.length + portMeta.port) % 5;
      
      if (host === "localhost" || host === "127.0.0.1") {
        if ([80, 443, 22, 8080].includes(portMeta.port)) {
          status = "open";
          countOpen++;
        } else if (portMeta.port === 3389) {
          status = "filtered";
        }
      } else {
        if (hashVal === 0 && [80, 443].includes(portMeta.port)) {
          status = "open";
          countOpen++;
        } else if (hashVal === 2) {
          status = "filtered";
        }
      }

      tempResults.push({
        port: portMeta.port,
        service: portMeta.service,
        status,
        vulnerability: portMeta.vulnerability
      });

      setResults([...tempResults]);
      setOpenPortsCount(countOpen);
    }

    setScanning(false);
    setCurrentScanningPort(null);

    if (countOpen > 0) {
      confetti({
        particleCount: 15,
        spread: 20,
        origin: { y: 0.8 },
        colors: ["#2563eb", "#10b981"],
      });
    }
  };

  useEffect(() => {
    runSimulatedScan();
  }, [selectedPreset]);

  const handleReset = () => {
    setHost("localhost");
    setSelectedPreset("all");
    setResults([]);
    setOpenPortsCount(0);
    setScanning(false);
  };

  const howToUse = [
    "Enter a target hostname IP address (e.g. localhost or 192.168.1.1).",
    "Select a preset scanner filter (Web Services, Databases, Admin services).",
    "Click the Start Scan button to trigger the sequential socket audit simulation.",
    "Inspect the scan report below detailing port service protocols and vulnerabilities."
  ];

  const benefits = [
    "Simulates standard network port scanning algorithms (TCP Syn/Connect).",
    "Pre-bakes security vulnerability profiles for common open port states.",
    "Provides offline audit information to help developers lock down host ports.",
    "100% Client-Side simulator execution keeps target host assets secure."
  ];

  const faqs = [
    {
      question: "Can a browser scan raw ports directly?",
      answer: "No. For security reasons, browser sandboxes strictly block direct raw socket connections (TCP/UDP) to arbitrary ports. This tool operates as an interactive simulator to audit port profiles."
    },
    {
      question: "What does 'Filtered' status mean?",
      answer: "A filtered status indicates that a firewall, router, or security group rules are blocking access to the port, preventing the scanner from determining if the port is open or closed."
    }
  ];

  const relatedTools = [
    { name: "IP Subnet Calculator", url: "/ip-subnet-calculator", description: "Decode CIDR notations and subnets." },
    { name: "MAC Address Lookup", url: "/mac-address-lookup", description: "Identify hardware vendor prefixes." }
  ];

  return (
    <ToolLayout
      title="Port Scanner & Check Utility"
      description="Learn about common network ports, service protocols, security vulnerabilities, and run interactive mock port scans securely client-side."
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
              <Server className="h-4 w-4 text-accent" /> Scan Configurations
            </span>

            {/* Inputs grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Target Host IP / Domain</label>
                <input
                  type="text"
                  value={host}
                  disabled={scanning}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="e.g. localhost or 192.168.1.5"
                  className="w-full py-2.5 px-3 rounded-lg border border-border-color bg-background text-primary-text font-mono font-bold focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Port Presets Filter</label>
                <select
                  value={selectedPreset}
                  disabled={scanning}
                  onChange={(e) => setSelectedPreset(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="all">All Common Ports (11 ports)</option>
                  <option value="web">Web Services (80, 443, 8080)</option>
                  <option value="admin">Remote Admin & SSH (21, 22, 23, 3389)</option>
                  <option value="db">Databases (3306)</option>
                </select>
              </div>

            </div>

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={runSimulatedScan}
                disabled={scanning}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/40 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
              >
                {scanning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                {scanning ? "Scanning Host..." : "Start Port Scan"}
              </button>
              <button
                onClick={handleReset}
                disabled={scanning}
                className="px-6 py-2.5 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors disabled:opacity-50"
              >
                Reset Page
              </button>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-success" /> Security Summary
              </span>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Open Ports Found</p>
                  <p className={`text-2xl font-black ${openPortsCount > 0 ? "text-warning" : "text-success"}`}>
                    {openPortsCount} Open Services
                  </p>
                </div>

                {scanning && (
                  <div className="flex items-center gap-2 text-xs font-bold text-accent">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Auditing Port {currentScanningPort}...</span>
                  </div>
                )}
                
                {openPortsCount > 0 && !scanning && (
                  <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-[10px] leading-relaxed text-warning border border-warning/20 font-semibold">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>Warning: Exposed administrative services detected. Ensure firewall rules restrict access to verified IPs.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border-color/60 flex items-center gap-1.5 text-[9px] font-bold text-secondary-text select-none">
              <Info className="h-3.5 w-3.5 text-accent shrink-0" />
              <span>Scanning operates as an offline simulation.</span>
            </div>
          </div>

        </div>

        {/* Live scanning reports */}
        {results.length > 0 && (
          <div className="border border-border-color rounded-2xl overflow-hidden bg-card-bg">
            <div className="bg-secondary-bg/25 px-4 py-3 border-b border-border-color flex justify-between items-center">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
                <Network className="h-4 w-4 text-accent" /> Scan Audit Report: {host}
              </span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left divide-y divide-border-color">
                <thead className="bg-secondary-bg/10 text-secondary-text uppercase font-bold text-[9px] tracking-wider select-none">
                  <tr>
                    <th className="py-2.5 px-4">Port</th>
                    <th className="py-2.5 px-4">Service</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Security Vulnerability Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/60 font-medium text-primary-text">
                  {results.map((row) => (
                    <tr key={row.port} className="hover:bg-hover-bg/30 transition-colors">
                      <td className="py-3 px-4 font-bold font-mono">Port {row.port}</td>
                      <td className="py-3 px-4">{row.service}</td>
                      <td className="py-3 px-4 font-bold">
                        {row.status === "open" && (
                          <span className="inline-flex items-center gap-1 text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Open</span>
                        )}
                        {row.status === "closed" && (
                          <span className="inline-flex items-center gap-1 text-secondary-text"><XCircle className="h-3.5 w-3.5" /> Closed</span>
                        )}
                        {row.status === "filtered" && (
                          <span className="inline-flex items-center gap-1 text-warning"><ShieldAlert className="h-3.5 w-3.5" /> Filtered</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-secondary-text text-[11px] leading-relaxed max-w-xs sm:max-w-md">
                        {row.status === "open" ? (
                          <span className="text-warning font-semibold">{row.vulnerability}</span>
                        ) : (
                          "No immediate vulnerabilities exposed while closed."
                        )}
                      </td>
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
