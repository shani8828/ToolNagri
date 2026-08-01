"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Lock, Unlock, Eye, EyeOff, RefreshCw, CheckCircle2, XCircle, Info, ShieldCheck, ShieldAlert } from "lucide-react";
import confetti from "canvas-confetti";

export default function PasswordStrengthTester() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Analysis state
  const [entropy, setEntropy] = useState(0);
  const [poolSize, setPoolSize] = useState(0);
  const [strength, setStrength] = useState<"Very Weak" | "Weak" | "Medium" | "Strong" | "Very Strong">("Very Weak");
  
  // Checklist
  const [checks, setChecks] = useState({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSymbol: false,
    isLong: false
  });

  const getStrengthMeta = () => {
    if (entropy < 28) return { label: "Very Weak", color: "text-red-500", progressColor: "#ef4444", bgClass: "bg-red-500/10 border-red-500/20" };
    if (entropy < 40) return { label: "Weak", color: "text-orange-500", progressColor: "#f97316", bgClass: "bg-orange-500/10 border-orange-500/20" };
    if (entropy < 60) return { label: "Medium", color: "text-yellow-500", progressColor: "#eab308", bgClass: "bg-yellow-500/10 border-yellow-500/20" };
    if (entropy < 80) return { label: "Strong", color: "text-emerald-500", progressColor: "#10b981", bgClass: "bg-emerald-500/10 border-emerald-500/20" };
    return { label: "Very Strong", color: "text-success", progressColor: "#10b981", bgClass: "bg-success/10 border-success/20" };
  };

  const calculateStrength = () => {
    if (!password) {
      setEntropy(0);
      setPoolSize(0);
      setStrength("Very Weak");
      setChecks({ hasLower: false, hasUpper: false, hasNumber: false, hasSymbol: false, isLong: false });
      return;
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const isLong = password.length >= 12;

    let r = 0;
    if (hasLower) r += 26;
    if (hasUpper) r += 26;
    if (hasNumber) r += 10;
    if (hasSymbol) r += 33; // Standard punctuation symbols

    setPoolSize(r);
    
    // Entropy = L * log2(R)
    const computedEntropy = password.length * Math.log2(r);
    setEntropy(computedEntropy);

    setChecks({
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol,
      isLong
    });
  };

  useEffect(() => {
    calculateStrength();
  }, [password]);

  // Format cracking times
  const formatTime = (seconds: number) => {
    if (seconds < 1) return "less than a second";
    if (seconds < 60) return `${Math.round(seconds)} second(s)`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.round(minutes)} minute(s)`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.round(hours)} hour(s)`;
    const days = hours / 24;
    if (days < 365) return `${Math.round(days)} day(s)`;
    const years = days / 365;
    if (years < 100) return `${Math.round(years)} year(s)`;
    const centuries = years / 100;
    if (centuries < 10000) return `${Math.round(centuries)} century(ies)`;
    return "trillions of centuries";
  };

  const getCrackTimes = () => {
    if (!password || poolSize === 0) return { online: "N/A", offline: "N/A" };
    // Total search space size
    const keyspace = Math.pow(poolSize, password.length);
    
    // Average attempts needed to break is half the keyspace
    const averageAttempts = keyspace / 2;

    // Speeds:
    // Online web portal throttle rate: 100 attempts / sec
    // Desktop GPU offline cracking speed: 10 billion / sec (10 * 10^9)
    const onlineSeconds = averageAttempts / 100;
    const offlineSeconds = averageAttempts / 1e10;

    return {
      online: formatTime(onlineSeconds),
      offline: formatTime(offlineSeconds)
    };
  };

  const crackTimes = getCrackTimes();
  const strengthMeta = getStrengthMeta();

  useEffect(() => {
    if (strengthMeta.label === "Very Strong" || strengthMeta.label === "Strong") {
      confetti({
        particleCount: 15,
        spread: 20,
        origin: { y: 0.8 },
        colors: ["#10b981", "#3b82f6"],
      });
    }
  }, [strengthMeta.label]);

  const handleReset = () => {
    setPassword("");
  };

  // SVG Gauge specifications
  const radius = 50;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  // Cap progress max at 120 bits of entropy
  const progressRatio = Math.min(1, entropy / 100);
  const strokeOffset = circumference - progressRatio * circumference;

  const howToUse = [
    "Type or paste your password into the input field securely.",
    "Toggle the eye icon to view or mask the characters.",
    "Review complexity marks (uppercase, numbers, length benchmarks).",
    "Inspect the mathematical entropy value and estimated cracking times."
  ];

  const benefits = [
    "Uses advanced entropy algorithms ($E = L \times \log_2(R)$) to compute brute-force limits.",
    "Calculates cracking times for both throttling web portals and high-speed GPU arrays.",
    "No network calls ensures your password is evaluated 100% locally.",
    "Suggests specific improvements in real-time."
  ];

  const faqs = [
    {
      question: "What is password entropy?",
      answer: "Password entropy measures how unpredictable a password is. It evaluates character pool variations and length to determine strength in bits. Higher entropy means a harder password to guess."
    },
    {
      question: "Why does length matter more than complex symbols?",
      answer: "Entropy calculations multiply length linearly. Adding just a few characters increases security exponentially compared to adding a single symbol to a short password."
    }
  ];

  const relatedTools = [
    { name: "Passphrase Generator", url: "/passphrase-generator", description: "Generate memorable word-based passwords." },
    { name: "Password Generator", url: "/password-generator", description: "Generate a secure standard random password." }
  ];

  return (
    <ToolLayout
      title="Secure Password Strength Tester"
      description="Analyze password strength using real-time entropy scoring. Estimate offline GPU brute-force crack timelines completely client-side."
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
              <Lock className="h-4 w-4 text-accent" /> Password Tester
            </span>

            <div className="space-y-2 relative">
              <label className="text-secondary-text font-semibold">Enter Password to Analyze</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. correct-horse-battery-staple"
                  className="w-full py-2.5 pl-3 pr-10 rounded-lg border border-border-color bg-background text-primary-text font-mono font-bold focus:outline-none"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-secondary-text hover:text-primary-text cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-border-color/60 font-semibold text-secondary-text">
              <label className="text-secondary-text font-bold uppercase tracking-wider block">Complexity Markers</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {checks.isLong ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-secondary-text/60" />}
                  <span>Minimum 12 Characters ({password.length} chars)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {checks.hasUpper ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-secondary-text/60" />}
                  <span>Contains Uppercase Letters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {checks.hasLower ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-secondary-text/60" />}
                  <span>Contains Lowercase Letters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {checks.hasNumber ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-secondary-text/60" />}
                  <span>Contains Numbers (0-9)</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2">
                  {checks.hasSymbol ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-secondary-text/60" />}
                  <span>Contains Special Symbols (!@#$%...)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-border-color hover:bg-hover-bg rounded-lg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors"
              >
                Clear Input
              </button>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" /> Strength Analysis
              </span>

              {password ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  
                  {/* Circular progress SVG */}
                  <div className="relative flex items-center justify-center select-none">
                    <svg width="120" height="120" className="transform -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="var(--border-color, #e5e7eb)"
                        strokeWidth={stroke}
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={strengthMeta.progressColor}
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-base font-black text-primary-text">{Math.round(entropy)}</span>
                      <span className="text-[8px] font-bold text-secondary-text uppercase tracking-wider">bits entropy</span>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-bold uppercase tracking-wider ${strengthMeta.color}`}>{strengthMeta.label}</p>
                    <p className="text-[10px] text-secondary-text font-medium mt-1">Pool character set: {poolSize} options</p>
                  </div>

                </div>
              ) : (
                <div className="py-14 text-center text-xs text-secondary-text italic leading-relaxed">
                  Enter a password to run calculations.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border-color/60 flex items-center gap-1.5 text-[9px] font-bold text-secondary-text select-none">
              <Info className="h-3.5 w-3.5 text-accent shrink-0" />
              <span>Evaluated client-side. No network logs are kept.</span>
            </div>
          </div>

        </div>

        {/* Time-to-crack Estimations */}
        {password && (
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider block items-center gap-1.5">
              <Unlock className="h-4 w-4 text-accent animate-pulse" /> Estimated Brute-Force Timeline
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-secondary-bg/25 border border-border-color rounded-xl space-y-2">
                <span className="text-[9px] font-bold text-secondary-text uppercase tracking-wider block">Standard Online Throttle</span>
                <p className="text-base font-black text-primary-text">{crackTimes.online}</p>
                <p className="text-[10px] text-secondary-text leading-relaxed font-medium">Estimated average duration under web port throttling constraints (approx. 100 requests per second).</p>
              </div>

              <div className="p-4 bg-secondary-bg/25 border border-border-color rounded-xl space-y-2">
                <span className="text-[9px] font-bold text-secondary-text uppercase tracking-wider block">High-End GPU Array (Offline)</span>
                <p className={`text-base font-black ${entropy >= 60 ? "text-success" : "text-warning"}`}>{crackTimes.offline}</p>
                <p className="text-[10px] text-secondary-text leading-relaxed font-medium">Estimated average cracking time using high-performance GPU hacking clusters (approx. 10 billion keys checked per second).</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
