"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Eye, RefreshCw, Globe, MapPin, Shield, Clock, HardDrive } from "lucide-react";

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
}

export default function WhatIsMyIp() {
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIpDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Primary API: ipapi.co (provides full geolocation JSON client-side)
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) {
        throw new Error("Primary API failed");
      }
      const data = await res.json();
      if (data && data.ip) {
        setIpData(data);
      } else {
        throw new Error("Invalid IP payload format");
      }
    } catch (err) {
      // Fallback API: ipify (provides raw IP) + optional secondary details
      try {
        const resIp = await fetch("https://api.ipify.org?format=json");
        if (!resIp.ok) throw new Error("Fallback IP API failed");
        const ipObj = await resIp.json();
        
        // Try getting location from ipinfo or just show the IP
        setIpData({
          ip: ipObj.ip,
          org: "Unknown ISP (Adblocker active)",
          country_name: "Detected",
          region: "Detected",
          city: "Detected"
        });
      } catch (fallbackErr) {
        setError("Failed to fetch IP address. Please check your internet connection or turn off your adblocker.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpDetails();
  }, []);

  const howToUse = [
    "Open the tool page; your public IP address and connection details load automatically.",
    "Click the Refresh Connection Details button to trigger a new client-side network request.",
    "Examine network data like ISP, country codes, regional location coordinates, and local timezone."
  ];

  const benefits = [
    "Loads IPv4 or IPv6 parameters instantly depending on your network settings.",
    "Provides full location mapping details including city, region, and coordinates.",
    "Lists network provider information (ISP / Organization name) and Autonomous System Number (ASN).",
    "Uses HTTPS requests for complete data transfer security."
  ];

  const faqs = [
    {
      question: "Is my IP address saved or logged?",
      answer: "No. ToolNagri does not host any backend database logs for IP calls. The IP retrieval requests are performed directly from your browser to public endpoints (ipapi.co / ipify.org) and are only displayed in your local browser window.",
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
      description="Instantly view your public IP address (IPv4/IPv6), ISP network details, geographical coordinates, and timezone parameters."
      category="Utility Tools"
      categoryUrl="/#utility"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Main IP display */}
        <div className="bg-secondary-bg/25 border border-border-color rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full pointer-events-none -z-10" />
          
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Eye className="h-6 w-6" />
          </div>
          
          <div className="space-y-1">
            <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Your Public IP Address</span>
            {loading ? (
              <div className="h-10 w-48 bg-secondary-bg/60 rounded-lg animate-pulse mx-auto" />
            ) : (
              <h2 className="text-2xl md:text-4xl font-extrabold text-primary-text font-mono break-all selection:bg-accent/20">
                {ipData ? ipData.ip : "---.---.---.---"}
              </h2>
            )}
          </div>

          <button
            onClick={fetchIpDetails}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Detecting..." : "Refresh Details"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-center gap-2 font-medium">
            <Shield className="h-4 w-4 shrink-0 text-red-500" />
            {error}
          </div>
        )}

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          
          {/* ISP / Org Card */}
          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider">
              <Shield className="h-4.5 w-4.5 text-accent shrink-0" />
              Internet Service Provider
            </div>
            {loading ? (
              <div className="space-y-1">
                <div className="h-4 w-32 bg-secondary-bg/60 rounded-lg animate-pulse" />
                <div className="h-3.5 w-24 bg-secondary-bg/60 rounded-lg animate-pulse" />
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-base font-bold text-primary-text">{ipData?.org || "Not Found"}</p>
                {ipData?.asn && <p className="text-xs text-secondary-text">ASN: {ipData.asn}</p>}
              </div>
            )}
          </div>

          {/* Location details */}
          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider">
              <MapPin className="h-4.5 w-4.5 text-accent shrink-0" />
              Geographical Location
            </div>
            {loading ? (
              <div className="space-y-1">
                <div className="h-4 w-36 bg-secondary-bg/60 rounded-lg animate-pulse" />
                <div className="h-3.5 w-20 bg-secondary-bg/60 rounded-lg animate-pulse" />
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-base font-bold text-primary-text">
                  {ipData?.city && ipData?.region ? `${ipData.city}, ${ipData.region}` : "Not Found"}
                </p>
                <p className="text-xs text-secondary-text">
                  {ipData?.country_name || "Not Found"} ({ipData?.country_code || "--"})
                </p>
              </div>
            )}
          </div>

          {/* Coordinates & timezone */}
          <div className="p-5 rounded-xl border border-border-color bg-card-bg hover:shadow-premium transition-shadow duration-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-text uppercase tracking-wider">
              <Clock className="h-4.5 w-4.5 text-accent shrink-0" />
              Timezone & Coordinates
            </div>
            {loading ? (
              <div className="space-y-1">
                <div className="h-4 w-36 bg-secondary-bg/60 rounded-lg animate-pulse" />
                <div className="h-3.5 w-24 bg-secondary-bg/60 rounded-lg animate-pulse" />
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-base font-bold text-primary-text">{ipData?.timezone || "Not Found"}</p>
                {ipData?.latitude && ipData?.longitude && (
                  <p className="text-xs text-secondary-text font-mono">
                    Lat: {ipData.latitude}, Long: {ipData.longitude}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
