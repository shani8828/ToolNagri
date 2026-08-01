"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Calendar, Terminal, Info, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function CronGenerator() {
  const [cronExpression, setCronExpression] = useState("* * * * *");
  const [copied, setCopied] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Visual state selections
  const [minuteVal, setMinuteVal] = useState("*");
  const [hourVal, setHourVal] = useState("*");
  const [dayVal, setDayVal] = useState("*");
  const [monthVal, setMonthVal] = useState("*");
  const [weekdayVal, setWeekdayVal] = useState("*");

  const [activeTab, setActiveTab] = useState<"presets" | "builder" | "parser">("presets");

  // Sync builder selections to cron expression
  useEffect(() => {
    if (activeTab === "builder") {
      const expr = `${minuteVal} ${hourVal} ${dayVal} ${monthVal} ${weekdayVal}`;
      setCronExpression(expr);
    }
  }, [minuteVal, hourVal, dayVal, monthVal, weekdayVal, activeTab]);

  // Sync cron expression changes to translator and next executions calculator
  useEffect(() => {
    setError("");
    const parts = cronExpression.trim().split(/\s+/);
    
    if (parts.length !== 5) {
      setError("A standard Unix cron expression must consist of exactly 5 fields.");
      setExplanation("");
      setNextRuns([]);
      return;
    }

    try {
      // Validate bounds
      validateField(parts[0], 0, 59, "Minute");
      validateField(parts[1], 0, 23, "Hour");
      validateField(parts[2], 1, 31, "Day of Month");
      validateField(parts[3], 1, 12, "Month");
      validateField(parts[4], 0, 6, "Day of Week");

      // Translate
      setExplanation(translateCron(cronExpression));

      // Calculate next run times
      const runs = getNextExecutions(cronExpression, 5);
      setNextRuns(runs.map(date => date.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })));
    } catch (err: any) {
      setError(err.message || "Invalid cron expression syntax.");
      setExplanation("");
      setNextRuns([]);
    }
  }, [cronExpression]);

  // Presets mapping
  const presets = [
    { name: "Every Minute", expr: "* * * * *" },
    { name: "Every 5 Minutes", expr: "*/5 * * * *" },
    { name: "Every 15 Minutes", expr: "*/15 * * * *" },
    { name: "Every Hour (at minute 0)", expr: "0 * * * *" },
    { name: "Every 2 Hours", expr: "0 */2 * * *" },
    { name: "Daily at Midnight (00:00)", expr: "0 0 * * *" },
    { name: "Daily at 9:00 AM", expr: "0 9 * * *" },
    { name: "Weekly on Sundays at Midnight", expr: "0 0 * * 0" },
    { name: "Weekday Working Hours (Mon-Fri, 9am-5pm)", expr: "0 9-17 * * 1-5" },
    { name: "Monthly on the 1st at Midnight", expr: "0 0 1 * *" }
  ];

  const handleApplyPreset = (expr: string) => {
    setCronExpression(expr);
    const parts = expr.split(" ");
    setMinuteVal(parts[0]);
    setHourVal(parts[1]);
    setDayVal(parts[2]);
    setMonthVal(parts[3]);
    setWeekdayVal(parts[4]);

    confetti({
      particleCount: 25,
      spread: 20,
      origin: { y: 0.8 },
      colors: ["#2563eb", "#22c55e"],
    });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Validation helper
  const validateField = (field: string, min: number, max: number, name: string) => {
    if (field === "*") return;
    
    // Lists
    if (field.includes(",")) {
      field.split(",").forEach(f => validateField(f, min, max, name));
      return;
    }

    // Steps
    if (field.includes("/")) {
      const [range, stepStr] = field.split("/");
      const step = parseInt(stepStr);
      if (isNaN(step) || step < 1) throw new Error(`${name} step must be an integer >= 1`);
      validateField(range, min, max, name);
      return;
    }

    // Ranges
    if (field.includes("-")) {
      const [startStr, endStr] = field.split("-");
      const start = parseInt(startStr);
      const end = parseInt(endStr);
      if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
        throw new Error(`${name} range ${field} is invalid (must be between ${min} and ${max})`);
      }
      return;
    }

    const val = parseInt(field);
    if (isNaN(val) || val < min || val > max) {
      throw new Error(`${name} value ${field} is out of bounds (must be between ${min} and ${max})`);
    }
  };

  // Cron Matcher algorithms
  const matchesCronField = (value: number, pattern: string, min: number, max: number): boolean => {
    if (pattern === "*") return true;
    if (pattern.includes(",")) {
      return pattern.split(",").some(p => matchesCronField(value, p, min, max));
    }
    if (pattern.includes("/")) {
      const [range, stepStr] = pattern.split("/");
      const step = parseInt(stepStr);
      if (isNaN(step)) return false;
      
      if (range === "*") {
        return (value - min) % step === 0;
      }
      if (range.includes("-")) {
        const [startStr, endStr] = range.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (isNaN(start) || isNaN(end)) return false;
        return value >= start && value <= end && (value - start) % step === 0;
      }
      const val = parseInt(range);
      if (isNaN(val)) return false;
      return value >= val && (value - val) % step === 0;
    }
    if (pattern.includes("-")) {
      const [startStr, endStr] = pattern.split("-");
      const start = parseInt(startStr);
      const end = parseInt(endStr);
      if (isNaN(start) || isNaN(end)) return false;
      return value >= start && value <= end;
    }
    return parseInt(pattern) === value;
  };

  const matchesCron = (date: Date, expr: string): boolean => {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return false;
    
    const min = date.getMinutes();
    const hr = date.getHours();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    return (
      matchesCronField(min, parts[0], 0, 59) &&
      matchesCronField(hr, parts[1], 0, 23) &&
      matchesCronField(day, parts[2], 1, 31) &&
      matchesCronField(month, parts[3], 1, 12) &&
      matchesCronField(dayOfWeek, parts[4], 0, 6)
    );
  };

  const getNextExecutions = (expr: string, count: number = 5): Date[] => {
    const result: Date[] = [];
    let current = new Date();
    current.setSeconds(0);
    current.setMilliseconds(0);
    
    // Check starting from next minute
    current.setMinutes(current.getMinutes() + 1);

    // Stop searching after 2 years limit to prevent CPU locks
    const maxTime = Date.now() + 2 * 365 * 24 * 60 * 60 * 1000;

    while (result.length < count && current.getTime() < maxTime) {
      if (matchesCron(current, expr)) {
        result.push(new Date(current));
      }
      current.setMinutes(current.getMinutes() + 1);
    }
    return result;
  };

  // Plain-english translator
  const translateCron = (expr: string): string => {
    const parts = expr.trim().split(/\s+/);
    
    const minText = translateField(parts[0], "minute", "every minute", "at minute");
    const hrText = translateField(parts[1], "hour", "every hour", "at hour");
    const dayText = translateField(parts[2], "day of month", "every day", "on day");
    const monthText = translateMonthField(parts[3]);
    const weekdayText = translateWeekdayField(parts[4]);

    return `Executes ${minText}, ${hrText}, ${dayText}, ${monthText}, ${weekdayText}.`.replace(/\s+/g, " ");
  };

  const translateField = (field: string, unit: string, allText: string, singleText: string) => {
    if (field === "*") return allText;
    if (field.includes(",")) return `${singleText}s ${field.split(",").join(", ")}`;
    if (field.includes("/")) {
      const [range, step] = field.split("/");
      if (range === "*") return `every ${step} ${unit}s`;
      return `every ${step} ${unit}s starting from ${range}`;
    }
    if (field.includes("-")) {
      return `every ${unit} from ${field.split("-")[0]} through ${field.split("-")[1]}`;
    }
    return `${singleText} ${field}`;
  };

  const translateMonthField = (field: string) => {
    if (field === "*") return "every month";
    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (field.includes(",")) {
      return `in ${field.split(",").map(m => monthNames[parseInt(m)] || m).join(", ")}`;
    }
    if (field.includes("-")) {
      const [start, end] = field.split("-");
      return `from ${monthNames[parseInt(start)] || start} through ${monthNames[parseInt(end)] || end}`;
    }
    return `in ${monthNames[parseInt(field)] || field}`;
  };

  const translateWeekdayField = (field: string) => {
    if (field === "*") return "every day of the week";
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (field.includes(",")) {
      return `on ${field.split(",").map(d => dayNames[parseInt(d)] || d).join(", ")}`;
    }
    if (field.includes("-")) {
      const [start, end] = field.split("-");
      return `on ${dayNames[parseInt(start)] || start} through ${dayNames[parseInt(end)] || end}`;
    }
    return `on ${dayNames[parseInt(field)] || field}`;
  };

  const handleReset = () => {
    setCronExpression("* * * * *");
    setMinuteVal("*");
    setHourVal("*");
    setDayVal("*");
    setMonthVal("*");
    setWeekdayVal("*");
    setError("");
  };

  const howToUse = [
    "Navigate between the Presets, Visual Builder, and Custom Parser tabs.",
    "Under Presets, click any common timeline configuration to load it immediately.",
    "Use the Visual Builder to select specific minutes, hours, or weekdays using dropdown menus.",
    "Paste any custom standard cron expression in the Parser tab to validate it.",
    "Read the generated Plain English explanation and review the Next 5 Executions checklist."
  ];

  const benefits = [
    "Builds standard 5-field cron schedules visually without syntax mistakes.",
    "Provides automatic English translation text explanations.",
    "Decodes cron configurations and calculates live preview dates client-side.",
    "100% Client-Side execution ensures fast updates in real-time."
  ];

  const faqs = [
    {
      question: "What is the standard format of a cron expression?",
      answer: "A standard Unix cron expression consists of 5 space-separated values representing: `Minute (0-59)`, `Hour (0-23)`, `Day of Month (1-31)`, `Month (1-12)`, and `Day of Week (0-6, where Sunday is 0)`."
    },
    {
      question: "Why do some cron parsers have 6 fields instead of 5?",
      answer: "Some enterprise schedulers (like Spring or Quartz) support a 6th field at the beginning representing `Seconds`, or at the end representing `Year`. This tool focuses on the standard 5-field Unix standard."
    }
  ];

  const relatedTools = [
    { name: "Unix Timestamp Converter", url: "/epoch-converter", description: "Convert Unix timestamps to date-times." },
    { name: "UUID Generator", url: "/uuid-generator", description: "Generate random UUID v4 identifiers." }
  ];

  return (
    <ToolLayout
      title="Cron Expression Helper"
      description="Generate, validate, and parse Unix cron expressions. Build schedule parameters visually, read plain-English translations, and preview next execution dates in your browser."
      category="Developer Tools"
      categoryUrl="/#developer"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Tab Selector */}
        <div className="flex border-b border-border-color gap-1">
          {(["presets", "builder", "parser"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setError(""); }}
              className={`py-2 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer capitalize ${
                activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-secondary-text hover:text-primary-text"
              }`}
            >
              {tab === "presets" ? "Quick Presets" : tab === "builder" ? "Visual Builder" : "Expression Parser"}
            </button>
          ))}
        </div>

        {/* Tab Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Controls Panel */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Presets Tab */}
            {activeTab === "presets" && (
              <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3.5">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider block">
                  Select Common Presets
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleApplyPreset(preset.expr)}
                      className={`py-2 px-3 text-left rounded-lg border border-border-color bg-background hover:bg-hover-bg/30 text-xs text-secondary-text hover:text-primary-text transition-all cursor-pointer font-semibold flex justify-between items-center ${
                        cronExpression === preset.expr ? "border-accent bg-accent/5 ring-1 ring-accent" : ""
                      }`}
                    >
                      <span>{preset.name}</span>
                      <span className="font-mono text-[10px] text-accent font-bold">{preset.expr}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Builder Tab */}
            {activeTab === "builder" && (
              <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider block">
                  Configure Schedule Parameters
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Minute */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary-text uppercase tracking-wider">Minutes</label>
                    <select
                      value={minuteVal}
                      onChange={(e) => setMinuteVal(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="*">Every Minute (*)</option>
                      <option value="*/5">Every 5 Minutes (*/5)</option>
                      <option value="*/10">Every 10 Minutes (*/10)</option>
                      <option value="*/15">Every 15 Minutes (*/15)</option>
                      <option value="*/30">Every 30 Minutes (*/30)</option>
                      <option value="0">At Minute 0 (0)</option>
                      <option value="30">At Minute 30 (30)</option>
                    </select>
                  </div>

                  {/* Hour */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary-text uppercase tracking-wider">Hours</label>
                    <select
                      value={hourVal}
                      onChange={(e) => setHourVal(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="*">Every Hour (*)</option>
                      <option value="*/2">Every 2 Hours (*/2)</option>
                      <option value="*/4">Every 4 Hours (*/4)</option>
                      <option value="*/6">Every 6 Hours (*/6)</option>
                      <option value="*/12">Every 12 Hours (*/12)</option>
                      <option value="0">At Midnight (00:00)</option>
                      <option value="9-17">Working Hours (9am-5pm)</option>
                    </select>
                  </div>

                  {/* Day of Month */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary-text uppercase tracking-wider">Day of Month</label>
                    <select
                      value={dayVal}
                      onChange={(e) => setDayVal(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="*">Every Day (*)</option>
                      <option value="1">1st of the month (1)</option>
                      <option value="15">15th of the month (15)</option>
                      <option value="31">Last day (31)</option>
                    </select>
                  </div>

                  {/* Month */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary-text uppercase tracking-wider">Months</label>
                    <select
                      value={monthVal}
                      onChange={(e) => setMonthVal(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="*">Every Month (*)</option>
                      <option value="1-6">First Half (Jan-Jun)</option>
                      <option value="7-12">Second Half (Jul-Dec)</option>
                      <option value="12">December only (12)</option>
                    </select>
                  </div>

                  {/* Weekday */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-secondary-text uppercase tracking-wider">Day of Week</label>
                    <select
                      value={weekdayVal}
                      onChange={(e) => setWeekdayVal(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="*">Every Day (*)</option>
                      <option value="1-5">Weekdays only (Mon-Fri)</option>
                      <option value="0,6">Weekends only (Sat-Sun)</option>
                      <option value="0">Sunday only (0)</option>
                    </select>
                  </div>

                </div>
              </div>
            )}

            {/* Expression Parser Tab */}
            {activeTab === "parser" && (
              <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider block">
                  Paste Custom Cron Expression
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    placeholder="e.g. */10 9-17 * * 1-5"
                    className="w-full py-3 px-4 border border-border-color rounded-lg bg-background text-sm font-mono font-bold text-primary-text focus:outline-none text-center"
                  />
                  <p className="text-[10px] text-secondary-text text-center font-mono">
                    Format: min hour day month weekday
                  </p>
                </div>
              </div>
            )}

            {/* Output Display Block */}
            <div className="bg-secondary-bg/20 p-5 rounded-2xl border border-border-color flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-5 w-5 text-accent" />
                <div className="space-y-0.5">
                  <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider block">Compiled Expression</span>
                  <span className="text-xl font-mono font-bold text-primary-text tracking-wide">{cronExpression}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="py-2 px-4 rounded-lg text-xs font-semibold bg-accent hover:bg-accent/90 text-white cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Expression"}
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  title="Reset builder"
                >
                  <RefreshCw className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Error messaging */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
                <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
                <span>{error}</span>
              </div>
            )}

          </div>

          {/* Sidebar Translation & Run Times Preview */}
          <div className="space-y-4">
            
            {/* Translation block */}
            <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-accent" /> Human Explanation
              </span>
              
              {explanation ? (
                <p className="text-sm text-primary-text leading-relaxed font-semibold">
                  {explanation}
                </p>
              ) : (
                <p className="text-xs text-secondary-text italic animate-pulse">Waiting for valid configuration...</p>
              )}
            </div>

            {/* Next run times block */}
            <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-success" /> Next 5 Run Times
              </span>

              {nextRuns.length > 0 ? (
                <div className="space-y-2">
                  {nextRuns.map((time, i) => (
                    <div
                      key={i}
                      className="flex gap-2 items-center text-xs font-semibold text-secondary-text bg-secondary-bg/20 p-2 rounded border border-border-color/40"
                    >
                      <span className="font-mono text-[10px] text-accent font-bold">#{i + 1}</span>
                      <span className="font-mono">{time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-secondary-text italic">No upcoming executions scheduled.</p>
              )}
            </div>

          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
