"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import {
  Eye,
  RefreshCw,
  Globe,
  MapPin,
  Shield,
  Clock,
  HardDrive,
  Copy,
  Check,
  Laptop,
  Smartphone,
  Network,
  Wifi,
  Cpu,
  Languages,
  Coins,
  Activity,
  Database,
} from "lucide-react";

interface IPData {
  ip: string;
  version?: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  org?: string;
  asn?: string;
  network?: string;
  country_capital?: string;
  country_calling_code?: string;
  currency?: string;
  currency_name?: string;
  languages?: string;
  country_population?: number;
  country_area?: number;
}

interface DeviceDetails {
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  deviceType: string;
  userAgent: string;
  screenResolution: string;
  devicePixelRatio: string;
  viewportSize: string;
  colorDepth: string;
  cpuCores: string;
  deviceMemory: string;
  touchSupport: string;
  webglSupport: string;
  onlineStatus: string;
}

interface ConnectionDetails {
  type: string;
  effectiveType: string;
  downlink: string;
  rtt: string;
  saveData: string;
}

export default function WhatIsMyIp() {
  const [ipv4, setIpv4] = useState<string | null>(null);
  const [ipv6, setIpv6] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);
  const [protocol, setProtocol] = useState<string>("HTTP/1.1");
  const [localTime, setLocalTime] = useState<string>("");

  // Retrieve client-side metrics and window/navigator metadata
  const detectClientMetrics = () => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent;
    const browser = { name: "Unknown Browser", version: "Unknown" };
    const os = { name: "Unknown OS", version: "Unknown" };
    let deviceType = "Desktop";

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
      deviceType = /mobile/i.test(ua) ? "Mobile" : "Tablet";
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      os.name = "iOS";
      const match = ua.match(/OS ([\d_]+) like Mac OS X/);
      if (match) os.version = match[1].replace(/_/g, ".");
      deviceType = /ipad/i.test(ua) ? "Tablet" : "Mobile";
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

    // 3. WebGL GPU vendor details
    let webglSupport = "Unsupported";
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (gl) {
        webglSupport = "Supported";
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer) {
            webglSupport = renderer.replace(/Angle \([^\)]+\)/i, "").trim();
          }
        }
      }
    } catch (e) {}

    // 4. Memory & CPU Info
    const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : "Unavailable";
    const deviceMemory = (navigator as any).deviceMemory ? `~${(navigator as any).deviceMemory} GB` : "Unavailable";

    // 5. Connection APIs
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const connType = conn?.type || "Unknown";
    const effectiveType = conn?.effectiveType || "Unknown";
    const downlink = conn?.downlink ? `${conn.downlink} Mbps` : "Unknown";
    const rtt = conn?.rtt ? `${conn.rtt} ms` : "Unknown";
    const saveData = conn?.saveData ? "Enabled" : "Disabled";

    // 6. Sizing details
    const screenResolution = `${window.screen.width} x ${window.screen.height}`;
    const viewportSize = `${window.innerWidth} x ${window.innerHeight}`;
    const devicePixelRatio = `${window.devicePixelRatio.toFixed(1)}x`;
    const colorDepth = `${window.screen.colorDepth}-bit`;
    const touchSupport = navigator.maxTouchPoints > 0 ? "Supported" : "No Touch";
    const onlineStatus = navigator.onLine ? "Online" : "Offline";

    setDeviceDetails({
      browserName: browser.name,
      browserVersion: browser.version,
      osName: os.name,
      osVersion: os.version,
      deviceType,
      userAgent: ua,
      screenResolution,
      devicePixelRatio,
      viewportSize,
      colorDepth,
      cpuCores,
      deviceMemory,
      touchSupport,
      webglSupport,
      onlineStatus,
    });

    setConnectionDetails({
      type: connType,
      effectiveType,
      downlink,
      rtt,
      saveData,
    });
  };

  const fetchIpDetails = async () => {
    setLoading(true);
    setError(null);
    setIpv4(null);
    setIpv6(null);
    setGeoData(null);

    // Parallel fetch: IPv4 endpoint
    const ipv4Promise = fetch("https://api4.ipify.org?format=json")
      .then((r) => r.json())
      .then((data) => data.ip)
      .catch((err) => {
        console.warn("IPv4 fetch failed:", err);
        return null;
      });

    // Parallel fetch: IPv6 endpoint
    const ipv6Promise = fetch("https://api6.ipify.org?format=json")
      .then((r) => r.json())
      .then((data) => data.ip)
      .catch((err) => {
        console.warn("IPv6 routing failed/unsupported on this connection:", err);
        return null;
      });

    // Parallel fetch: Full client geolocation data
    const geoPromise = fetch("https://ipapi.co/json/")
      .then(async (r) => {
        if (!r.ok) throw new Error("Geolocation provider failure");
        return r.json();
      })
      .catch(async (err) => {
        console.warn("ipapi.co failed, attempting fallback:", err);
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          const ipObj = await res.json();
          return {
            ip: ipObj.ip,
            org: "Unknown ISP (Adblocker active)",
            country_name: "Detected",
            region: "Detected",
            city: "Detected",
          } as IPData;
        } catch (fallbackErr) {
          throw new Error("Failed to retrieve public IP address. Check connection or disable adblocker.");
        }
      });

    try {
      const [v4Result, v6Result, geoResult] = await Promise.all([
        ipv4Promise,
        ipv6Promise,
        geoPromise,
      ]);

      setIpv4(v4Result);
      setIpv6(v6Result);
      setGeoData(geoResult);

      // Backfill IP values if individual queries failed but Geolocation API loaded
      if (!v4Result && geoResult?.ip && !geoResult.ip.includes(":")) {
        setIpv4(geoResult.ip);
      }
      if (!v6Result && geoResult?.ip && geoResult.ip.includes(":")) {
        setIpv6(geoResult.ip);
      }
    } catch (err: any) {
      setError(err.message || "Failed to query connection parameters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpDetails();
    detectClientMetrics();

    // Resize listener to track live changes to viewport width/height
    const handleResize = () => {
      setDeviceDetails((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          viewportSize: `${window.innerWidth} x ${window.innerHeight}`,
        };
      });
    };

    window.addEventListener("resize", handleResize);

    // Track nextHopProtocol
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries && navEntries[0]) {
        const proto = (navEntries[0] as PerformanceNavigationTiming).nextHopProtocol;
        if (proto) {
          setProtocol(proto.toUpperCase());
        }
      }
    } catch (e) {}

    // Clock update timer
    setLocalTime(new Date().toLocaleTimeString());
    const clockTimer = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(clockTimer);
    };
  }, []);

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatProtocol = (proto: string) => {
    const p = proto.toLowerCase();
    if (p === "h2") return "HTTP/2";
    if (p === "h3") return "HTTP/3";
    if (p === "http/1.1") return "HTTP/1.1";
    return proto;
  };

  const howToUse = [
    "Open the page to instantly run a complete, client-side diagnostics query of your connection and device.",
    "Inspect your IPv4 and IPv6 addresses, network ISP routing details, and live coordinates mapping.",
    "Check your live device details, including viewport dimensions, color depth, browser/engine version, and connection latency.",
    "Click the 'Refresh Diagnostics' button at any time to re-run the real-time speed and address testing."
  ];

  const benefits = [
    "Detects both IPv4 and IPv6 addresses side-by-side with real-time connectivity status badges.",
    "Displays full, granular ISP and Autonomous System (ASN) network registrations.",
    "Features an interactive OpenStreetMap integration displaying your approximate coordinates instantly.",
    "Exposes rich client telemetry, including browser, OS, viewport tracking, CPU cores, RAM, and WebGL specs.",
    "Retrieves connection speed metrics, effective connection type (4G/3G/etc.), and RTT latency in real time."
  ];

  const faqs = [
    {
      question: "Is my IP address saved or logged?",
      answer: "No. ToolNagri does not host any backend database logs for IP calls. The IP retrieval requests are performed directly from your browser to public endpoints (ipapi.co / ipify.org) and are only displayed in your local browser window.",
    },
    {
      question: "How does the tool detect both IPv4 and IPv6?",
      answer: "The tool queries distinct endpoints: an IPv4-only server and an IPv6-only server in parallel. If your network does not route IPv6 packets, the IPv6 probe fails silently and registers as unsupported. This helps verify if your router, device, and ISP have successfully enabled native IPv6 support.",
    },
    {
      question: "Are my system specs (like CPU and RAM) private?",
      answer: "Yes, all device-side properties like screen size, CPU cores, graphics cards, and estimated memory are read directly from local browser APIs. This information is processed entirely inside your browser and is never sent to any server.",
    },
    {
      question: "Why does the tool show a different location?",
      answer: "IP geolocation matches details registered by your ISP. If you are using a VPN, proxy connection, or if your ISP routes web requests through an adjacent region, the coordinates and city will reflect that proxy hub instead of your physical room."
    }
  ];

  const relatedTools = [
    { name: "Browser User Agent Parser", url: "/user-agent", description: "Parse browser client user agent details." },
    { name: "DNS Lookup Resolver", url: "/dns-lookup", description: "Resolve records using Cloudflare DoH." }
  ];

  return (
    <ToolLayout
      title="What is my IP Address"
      description="Instantly view your public IPv4 and IPv6 addresses, internet provider routing, real-time connection speed, geographical location, and comprehensive device hardware analytics."
      category="Utility Tools"
      categoryUrl="/#utility"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Main IP display - Dual-IP Headers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* IPv4 Display Card */}
          <div className="bg-secondary-bg/25 border border-border-color rounded-2xl p-5 md:p-6 flex flex-col items-center justify-between text-center relative overflow-hidden group hover:shadow-premium transition-shadow duration-200">
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full pointer-events-none" />
            <div className="space-y-2 w-full">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">IPv4 Address</span>
                {loading ? (
                  <span className="h-4 w-12 bg-secondary-bg/60 animate-pulse rounded" />
                ) : ipv4 ? (
                  <span className="text-[9px] bg-success/10 text-success font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Connected</span>
                ) : (
                  <span className="text-[9px] bg-secondary-bg text-secondary-text font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">Not Detected</span>
                )}
              </div>
              
              {loading ? (
                <div className="h-8 w-4/5 bg-secondary-bg/60 rounded-lg animate-pulse mx-auto my-2" />
              ) : (
                <h3 className="text-xl md:text-2xl font-extrabold text-primary-text font-mono break-all py-1 min-h-9">
                  {ipv4 || "---.---.---.---"}
                </h3>
              )}
            </div>

            {ipv4 && (
              <button
                onClick={() => copyToClipboard(ipv4, "ipv4")}
                className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 border border-border-color hover:bg-hover-bg rounded-lg text-[11px] font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors"
              >
                {copiedField === "ipv4" ? (
                  <>
                    <Check className="h-3 w-3 text-success" />
                    Copied IPv4!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy IPv4 Address
                  </>
                )}
              </button>
            )}
          </div>

          {/* IPv6 Display Card */}
          <div className="bg-secondary-bg/25 border border-border-color rounded-2xl p-5 md:p-6 flex flex-col items-center justify-between text-center relative overflow-hidden group hover:shadow-premium transition-shadow duration-200">
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full pointer-events-none" />
            <div className="space-y-2 w-full">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">IPv6 Address</span>
                {loading ? (
                  <span className="h-4 w-12 bg-secondary-bg/60 animate-pulse rounded" />
                ) : ipv6 ? (
                  <span className="text-[9px] bg-success/10 text-success font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Connected</span>
                ) : (
                  <span className="text-[9px] bg-warning/10 text-warning font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">No Routing</span>
                )}
              </div>
              
              {loading ? (
                <div className="h-8 w-4/5 bg-secondary-bg/60 rounded-lg animate-pulse mx-auto my-2" />
              ) : (
                <h3 className="text-xl md:text-2xl font-extrabold text-primary-text font-mono break-all py-1 min-h-9">
                  {ipv6 || "Not Detected / Unsupported"}
                </h3>
              )}
            </div>

            {ipv6 && (
              <button
                onClick={() => copyToClipboard(ipv6, "ipv6")}
                className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 border border-border-color hover:bg-hover-bg rounded-lg text-[11px] font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors"
              >
                {copiedField === "ipv6" ? (
                  <>
                    <Check className="h-3 w-3 text-success" />
                    Copied IPv6!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy IPv6 Address
                  </>
                )}
              </button>
            )}
          </div>

        </div>

        {/* Global Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              fetchIpDetails();
              detectClientMetrics();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Re-detecting Diagnostics..." : "Refresh Connection Details"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-center gap-2 font-medium">
            <Shield className="h-4 w-4 shrink-0 text-red-500" />
            {error}
          </div>
        )}

        {/* Detailed Grid Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          
          {/* Card 1: Network & ISP details */}
          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider border-b border-border-color pb-2">
              <Network className="h-4.5 w-4.5 text-accent shrink-0" />
              ISP & Network Routing
            </div>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Service Provider (ISP)</span>
                <span className="font-semibold text-primary-text text-right wrap-break-word max-w-[60%]">
                  {loading ? "..." : geoData?.org || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Autonomous System</span>
                <span className="font-semibold text-primary-text text-right font-mono">
                  {loading ? "..." : geoData?.asn || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Network Range (CIDR)</span>
                <span className="font-semibold text-primary-text text-right font-mono">
                  {loading ? "..." : geoData?.network || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">IP Routing Version</span>
                <span className="font-semibold text-primary-text text-right">
                  {loading ? "..." : geoData?.version || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">HTTP Protocol</span>
                <span className="font-semibold text-primary-text text-right font-mono">
                  {formatProtocol(protocol)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Connection details */}
          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider border-b border-border-color pb-2">
              <Wifi className="h-4.5 w-4.5 text-accent shrink-0" />
              Connection Specs
            </div>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Connection Interface</span>
                <span className="font-semibold text-primary-text capitalize">
                  {connectionDetails?.type || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Effective Network Type</span>
                <span className="font-semibold text-primary-text font-mono uppercase">
                  {connectionDetails?.effectiveType || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Est. Downlink Speed</span>
                <span className="font-semibold text-primary-text font-mono">
                  {connectionDetails?.downlink || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Network Latency (RTT)</span>
                <span className="font-semibold text-primary-text font-mono">
                  {connectionDetails?.rtt || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Browser Offline Status</span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                  deviceDetails?.onlineStatus === "Online" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                }`}>
                  {deviceDetails?.onlineStatus || "Online"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Device & System specs */}
          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider border-b border-border-color pb-2">
              <Cpu className="h-4.5 w-4.5 text-accent shrink-0" />
              Device Hardware & OS
            </div>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Operating System</span>
                <span className="font-semibold text-primary-text text-right max-w-[60%] wrap-break-word">
                  {deviceDetails?.osName}{deviceDetails && deviceDetails.osVersion !== "Unknown" ? ` ${deviceDetails.osVersion}` : ""}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Web Browser</span>
                <span className="font-semibold text-primary-text text-right max-w-[60%] wrap-break-word">
                  {deviceDetails?.browserName}{deviceDetails && deviceDetails.browserVersion !== "Unknown" ? ` ${deviceDetails.browserVersion.split(".")[0]}` : ""}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Screen Resolution</span>
                <span className="font-semibold text-primary-text text-right font-mono">
                  {deviceDetails?.screenResolution} ({deviceDetails?.devicePixelRatio})
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Live Viewport Size</span>
                <span className="font-semibold text-accent font-mono">
                  {deviceDetails?.viewportSize || "Detecting..."}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">CPU / System Memory</span>
                <span className="font-semibold text-primary-text text-right">
                  {deviceDetails?.cpuCores} | {deviceDetails?.deviceMemory}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Geography Info */}
          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider border-b border-border-color pb-2">
              <Globe className="h-4.5 w-4.5 text-accent shrink-0" />
              Geographical Registry
            </div>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Location (City, Region)</span>
                <span className="font-semibold text-primary-text text-right wrap-break-word max-w-[60%]">
                  {loading ? "..." : geoData?.city && geoData?.region ? `${geoData.city}, ${geoData.region}` : "Not Found"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Country</span>
                <span className="font-semibold text-primary-text text-right wrap-break-word max-w-[60%]">
                  {loading ? "..." : geoData?.country_name || "Unknown"} ({loading ? "--" : geoData?.country_code || "N/A"})
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">ZIP / Postal Code</span>
                <span className="font-semibold text-primary-text font-mono">
                  {loading ? "..." : geoData?.postal || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Country Capital / Call Code</span>
                <span className="font-semibold text-primary-text">
                  {loading ? "..." : geoData?.country_capital || "N/A"} ({loading ? "..." : geoData?.country_calling_code || "N/A"})
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">National Currency</span>
                <span className="font-semibold text-primary-text text-right">
                  {loading ? "..." : geoData?.currency_name || "N/A"} ({loading ? "..." : geoData?.currency || ""})
                </span>
              </div>
            </div>
          </div>

          {/* Card 5: Live Interactive Map (Spans remaining columns on larger screens) */}
          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-3 md:col-span-2">
            <div className="flex justify-between items-center border-b border-border-color pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider">
                <MapPin className="h-4.5 w-4.5 text-accent shrink-0" />
                Live Geolocation Tracking
              </div>
              {geoData?.latitude && geoData?.longitude && (
                <span className="text-[10px] text-secondary-text font-mono font-bold bg-secondary-bg px-2 py-0.5 rounded">
                  GPS: {geoData.latitude.toFixed(4)}, {geoData.longitude.toFixed(4)}
                </span>
              )}
            </div>

            {loading ? (
              <div className="w-full h-57.5 bg-secondary-bg/40 animate-pulse rounded-xl flex items-center justify-center text-xs text-secondary-text">
                Loading GPS Coordinates Map...
              </div>
            ) : geoData?.latitude && geoData?.longitude ? (
              <div className="w-full h-57.5 rounded-xl overflow-hidden border border-border-color shadow-xs relative">
                <iframe
                  title="Approximate IP Geolocation Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${geoData.longitude - 0.015}%2C${geoData.latitude - 0.015}%2C${geoData.longitude + 0.015}%2C${geoData.latitude + 0.015}&layer=mapnik&marker=${geoData.latitude}%2C${geoData.longitude}`}
                  className="filter contrast-95 opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            ) : (
              <div className="w-full h-57.5 rounded-xl bg-secondary-bg/30 border border-border-color border-dashed flex flex-col items-center justify-center text-secondary-text text-sm">
                <MapPin className="h-8 w-8 text-secondary-text/30 mb-2 animate-bounce" />
                Coordinates not available for mapping.
              </div>
            )}
          </div>

        </div>

        {/* Extra Card: System Locale details, Graphics Card, and Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider border-b border-border-color pb-2">
              <Languages className="h-4.5 w-4.5 text-accent shrink-0" />
              Locale & Environment details
            </div>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Primary User Language</span>
                <span className="font-semibold text-primary-text">
                  {typeof navigator !== "undefined" ? navigator.language : "en-US"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Preferred Languages</span>
                <span className="font-semibold text-primary-text text-right max-w-[65%] truncate" title={typeof navigator !== "undefined" ? navigator.languages.join(", ") : ""}>
                  {typeof navigator !== "undefined" ? navigator.languages.join(", ") : "en-US"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Timezone ID</span>
                <span className="font-semibold text-primary-text font-mono">
                  {loading ? "..." : geoData?.timezone || "Detecting..."}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Live System Clock</span>
                <span className="font-semibold text-accent font-mono flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {localTime || "00:00:00"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Privacy Controls</span>
                <span className="font-semibold text-primary-text font-mono text-xs">
                  Cookies: {typeof navigator !== "undefined" && navigator.cookieEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider border-b border-border-color pb-2">
              <Activity className="h-4.5 w-4.5 text-accent shrink-0" />
              Advanced Graphics & Privacy
            </div>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">GPU WebGL Capabilities</span>
                <span className="font-semibold text-primary-text text-right max-w-[70%] truncate" title={deviceDetails?.webglSupport}>
                  {deviceDetails?.webglSupport}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Color Sizing Depth</span>
                <span className="font-semibold text-primary-text font-mono">
                  {deviceDetails?.colorDepth}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Touch Screen Support</span>
                <span className="font-semibold text-primary-text">
                  {deviceDetails?.touchSupport}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Do Not Track Setting</span>
                <span className="font-semibold text-primary-text font-mono text-xs">
                  {typeof navigator !== "undefined" && (navigator.doNotTrack === "1" || navigator.doNotTrack === "yes") ? "Active" : "Not Active"}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-secondary-text text-xs">Save Data Mode</span>
                <span className="font-semibold text-primary-text">
                  {connectionDetails?.saveData}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* User Agent full width display */}
        <div className="p-5 rounded-xl border border-border-color bg-card-bg shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider">
              <HardDrive className="h-4.5 w-4.5 text-accent shrink-0" />
              Browser User Agent String
            </div>
            {deviceDetails?.userAgent && (
              <button
                onClick={() => copyToClipboard(deviceDetails?.userAgent || "", "userAgent")}
                className="flex items-center gap-1 text-xs border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text px-2.5 py-1 transition-colors cursor-pointer font-semibold"
              >
                {copiedField === "userAgent" ? (
                  <>
                    <Check className="h-3 w-3 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy UA
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-xs text-secondary-text font-mono break-all bg-secondary-bg/50 p-3 rounded-lg border border-border-color">
            {deviceDetails?.userAgent || "Detecting user agent..."}
          </p>
        </div>

      </div>
    </ToolLayout>
  );
}

