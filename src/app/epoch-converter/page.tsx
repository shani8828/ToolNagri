"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, Play, Pause, RefreshCw, Clock, ArrowLeftRight, AlertCircle } from "lucide-react";

export default function EpochConverter() {
  // Live ticking clock
  const [liveEpoch, setLiveEpoch] = useState<number>(0);
  const [clockPaused, setClockPaused] = useState(false);
  const [clockCopied, setClockCopied] = useState(false);

  // Epoch to Date state
  const [inputEpoch, setInputEpoch] = useState("");
  const [decodedGmt, setDecodedGmt] = useState("");
  const [decodedLocal, setDecodedLocal] = useState("");
  const [decodedIso, setDecodedIso] = useState("");
  const [decodedRelative, setDecodedRelative] = useState("");
  const [detectedUnit, setDetectedUnit] = useState<"seconds" | "milliseconds" | null>(null);
  const [epochCopied, setEpochCopied] = useState(false);

  // Date to Epoch state
  const [inputDateTime, setInputDateTime] = useState("");
  const [convertedSeconds, setConvertedSeconds] = useState<number | null>(null);
  const [convertedMillis, setConvertedMillis] = useState<number | null>(null);
  const [secondsCopied, setSecondsCopied] = useState(false);
  const [millisCopied, setMillisCopied] = useState(false);

  const [errorEpoch, setErrorEpoch] = useState("");
  const [errorDate, setErrorDate] = useState("");

  // Running Live Epoch Clock
  useEffect(() => {
    setLiveEpoch(Math.floor(Date.now() / 1000));
    
    if (clockPaused) return;

    const timer = setInterval(() => {
      setLiveEpoch(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [clockPaused]);

  // Set default values inside useEffect to avoid SSR hydration mismatch
  useEffect(() => {
    setInputEpoch(Math.floor(Date.now() / 1000).toString());
    const now = new Date();
    // format as YYYY-MM-DDTHH:MM
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setInputDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, []);

  // Update conversions on inputs change
  useEffect(() => {
    if (!inputEpoch) return;
    handleConvertEpoch();
  }, [inputEpoch]);

  useEffect(() => {
    if (!inputDateTime) return;
    handleConvertDate();
  }, [inputDateTime]);

  const handleConvertEpoch = () => {
    setErrorEpoch("");
    const parsed = parseInt(inputEpoch.trim());

    if (isNaN(parsed)) {
      setErrorEpoch("Please enter a valid integer timestamp.");
      setDecodedGmt("");
      setDecodedLocal("");
      setDecodedIso("");
      setDecodedRelative("");
      setDetectedUnit(null);
      return;
    }

    try {
      // Simple logic: if timestamp is > 50000000000 (roughly Year 3550 in seconds),
      // it is likely milliseconds.
      const isMillis = parsed > 50000000000;
      setDetectedUnit(isMillis ? "milliseconds" : "seconds");

      const dateObj = new Date(isMillis ? parsed : parsed * 1000);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid Date");
      }

      setDecodedGmt(dateObj.toUTCString());
      setDecodedLocal(dateObj.toString());
      setDecodedIso(dateObj.toISOString());
      setDecodedRelative(getRelativeTime(dateObj.getTime()));
    } catch (e) {
      setErrorEpoch("Failed to parse. Date value is out of bounds.");
      setDecodedGmt("");
      setDecodedLocal("");
      setDecodedIso("");
      setDecodedRelative("");
      setDetectedUnit(null);
    }
  };

  const handleConvertDate = () => {
    setErrorDate("");
    try {
      const dateObj = new Date(inputDateTime);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid Date");
      }
      const millis = dateObj.getTime();
      setConvertedSeconds(Math.floor(millis / 1000));
      setConvertedMillis(millis);
    } catch (e) {
      setErrorDate("Please choose or enter a valid date-time.");
      setConvertedSeconds(null);
      setConvertedMillis(null);
    }
  };

  const getRelativeTime = (timeMs: number) => {
    const now = Date.now();
    const diff = timeMs - now;
    const absDiff = Math.abs(diff);

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const suffix = diff > 0 ? "from now" : "ago";

    if (seconds < 10) return "just now";
    if (seconds < 60) return `${seconds} seconds ${suffix}`;
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ${suffix}`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ${suffix}`;
    return `${days} day${days > 1 ? "s" : ""} ${suffix}`;
  };

  const handleCopyText = (text: string, setCopiedFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopiedFn(true);
    setTimeout(() => setCopiedFn(false), 2000);
  };

  const handleFillCurrentTime = () => {
    setInputEpoch(Math.floor(Date.now() / 1000).toString());
  };

  const howToUse = [
    "Observe the live ticking clock at the top to copy the current Unix epoch timestamp.",
    "Paste any integer epoch number into the Decenter field. The tool detects seconds vs milliseconds.",
    "Review translated output coordinates immediately: GMT Time, Local Time, ISO format, and relative times.",
    "Use the Date & Time picker to choose a calendar day, converting it to epoch seconds/milliseconds."
  ];

  const benefits = [
    "Supports auto-detection between seconds (10-digit) and milliseconds (13-digit) formats.",
    "Computes dynamic, relative time durations (e.g., '2 hours ago' or 'in 5 days').",
    "Ticking live clock can be paused or copied with one click.",
    "100% Client-Side parsing: calculations execute locally in milliseconds."
  ];

  const faqs = [
    {
      question: "What is Unix Epoch Time?",
      answer: "Unix epoch time (or POSIX time) measures time as the total number of seconds that have elapsed since midnight (00:00:00 UTC) on January 1, 1970, excluding leap seconds."
    },
    {
      question: "Why do timestamps have 10 or 13 digits?",
      answer: "10-digit timestamps measure time in seconds, which is the standard Unix format. 13-digit timestamps measure time in milliseconds, which is the default resolution returned by Javascript's Date API (`Date.now()`)."
    }
  ];

  const relatedTools = [
    { name: "UUID Generator", url: "/uuid-generator", description: "Generate bulk RFC 4122 identifiers." },
    { name: "JSON Formatter", url: "/json-formatter", description: "Format and validate JSON payloads." }
  ];

  return (
    <ToolLayout
      title="Epoch Converter"
      description="Convert Unix timestamps (seconds & milliseconds) to human-readable date-times and back. Features a real-time ticking epoch clock and relative time offsets."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Live Clock Panel */}
        <div className="bg-accent/5 p-4 rounded-xl border border-accent/25 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent animate-pulse" />
            <div className="text-sm font-semibold text-primary-text flex items-baseline gap-2">
              <span>Current Unix Epoch:</span>
              <span className="text-lg font-mono font-bold text-accent">{liveEpoch}</span>
              <span className="text-[10px] text-secondary-text font-normal font-mono">(seconds)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyText(liveEpoch.toString(), setClockCopied)}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-accent hover:bg-accent/90 text-white cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
            >
              {clockCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {clockCopied ? "Copied!" : "Copy Timestamp"}
            </button>
            
            <button
              onClick={() => setClockPaused(!clockPaused)}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold border border-border-color bg-background hover:bg-hover-bg text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1"
            >
              {clockPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {clockPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>

        {/* Conversions Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Epoch to Date */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <ArrowLeftRight className="h-4 w-4 text-accent" />
              Epoch to Date
            </span>

            {/* Input timestamp */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Unix Timestamp</label>
                <button
                  onClick={handleFillCurrentTime}
                  className="text-[10px] text-accent hover:underline font-semibold cursor-pointer"
                >
                  Use Current Time
                </button>
              </div>
              <input
                type="text"
                value={inputEpoch}
                onChange={(e) => setInputEpoch(e.target.value)}
                placeholder="Paste epoch integer (e.g. 1782937200)"
                className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-mono font-bold text-primary-text focus:outline-none"
              />
            </div>

            {/* Detected Unit Badge */}
            {detectedUnit && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary-bg border border-border-color/50 text-secondary-text">
                Detected resolution: <span className="text-accent font-semibold">{detectedUnit}</span>
              </span>
            )}

            {/* Error */}
            {errorEpoch && (
              <div className="text-xs text-warning flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errorEpoch}</span>
              </div>
            )}

            {/* Translated Output */}
            {decodedGmt && (
              <div className="space-y-3 pt-2 border-t border-border-color/60 text-xs">
                <div className="space-y-1">
                  <span className="text-secondary-text block">GMT / UTC Time</span>
                  <div className="flex justify-between items-center bg-secondary-bg/30 p-2 rounded border border-border-color/40">
                    <span className="font-mono font-bold text-primary-text select-all">{decodedGmt}</span>
                    <button
                      onClick={() => handleCopyText(decodedGmt, setEpochCopied)}
                      className="text-secondary-text hover:text-accent cursor-pointer"
                      title="Copy GMT"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-secondary-text block">Local Timezone</span>
                  <div className="bg-secondary-bg/30 p-2 rounded border border-border-color/40 font-mono font-bold text-primary-text select-all">
                    {decodedLocal}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-secondary-text block">ISO-8601 String</span>
                  <div className="bg-secondary-bg/30 p-2 rounded border border-border-color/40 font-mono font-bold text-primary-text select-all">
                    {decodedIso}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-secondary-text block">Relative Duration</span>
                  <div className="bg-success/5 p-2 rounded border border-success/20 font-bold text-success capitalize">
                    {decodedRelative}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date to Epoch */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <ArrowLeftRight className="h-4 w-4 text-success" />
              Date to Epoch
            </span>

            {/* Date-time picker */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Calendar Date & Time</label>
              <input
                type="datetime-local"
                value={inputDateTime}
                onChange={(e) => setInputDateTime(e.target.value)}
                className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none cursor-pointer"
              />
            </div>

            {/* Error */}
            {errorDate && (
              <div className="text-xs text-warning flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errorDate}</span>
              </div>
            )}

            {/* Epoch Output */}
            {convertedSeconds !== null && (
              <div className="space-y-3.5 pt-3 border-t border-border-color/60 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-secondary-text">
                    <span>Epoch (Seconds)</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider">standard unix</span>
                  </div>
                  <div className="flex justify-between items-center bg-secondary-bg/30 p-2 rounded border border-border-color/40">
                    <span className="font-mono font-bold text-primary-text text-sm select-all">{convertedSeconds}</span>
                    <button
                      onClick={() => handleCopyText(convertedSeconds.toString(), setSecondsCopied)}
                      className="text-secondary-text hover:text-accent cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      {secondsCopied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-secondary-text">
                    <span>Epoch (Milliseconds)</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider">javascript compatibility</span>
                  </div>
                  <div className="flex justify-between items-center bg-secondary-bg/30 p-2 rounded border border-border-color/40">
                    <span className="font-mono font-bold text-primary-text text-sm select-all">{convertedMillis}</span>
                    <button
                      onClick={() => handleCopyText(convertedMillis!.toString(), setMillisCopied)}
                      className="text-secondary-text hover:text-accent cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      {millisCopied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
