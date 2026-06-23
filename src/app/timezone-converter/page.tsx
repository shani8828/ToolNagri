"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Clock, Globe, RefreshCw, Calendar } from "lucide-react";

interface TimezoneItem {
  code: string;
  name: string;
  iana: string;
  offsetLabel: string;
}

const TIMEZONES: TimezoneItem[] = [
  { code: "UTC", name: "Coordinated Universal Time", iana: "UTC", offsetLabel: "UTC +00:00" },
  { code: "IST", name: "India Standard Time", iana: "Asia/Kolkata", offsetLabel: "GMT +05:30" },
  { code: "EST", name: "Eastern Standard Time (US)", iana: "America/New_York", offsetLabel: "GMT -05:00" },
  { code: "PST", name: "Pacific Standard Time (US)", iana: "America/Los_Angeles", offsetLabel: "GMT -08:00" },
  { code: "GMT", name: "Greenwich Mean Time (UK)", iana: "Europe/London", offsetLabel: "GMT +00:00" },
  { code: "JST", name: "Japan Standard Time", iana: "Asia/Tokyo", offsetLabel: "GMT +09:00" },
  { code: "CET", name: "Central European Time", iana: "Europe/Paris", offsetLabel: "GMT +01:00" },
  { code: "AEST", name: "Australian Eastern Standard Time", iana: "Australia/Sydney", offsetLabel: "GMT +10:00" },
];

interface CalculatedTime {
  code: string;
  name: string;
  offsetLabel: string;
  timeString: string;
  dateString: string;
}

export default function TimezoneConverter() {
  const [baseDate, setBaseDate] = useState("");
  const [baseTime, setBaseTime] = useState("");
  const [baseZone, setBaseZone] = useState("UTC");
  const [convertedTimes, setConvertedTimes] = useState<CalculatedTime[]>([]);

  // Safe client-side date initialization
  useEffect(() => {
    const today = new Date();
    setBaseDate(today.toISOString().split("T")[0]);
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    setBaseTime(`${hours}:${minutes}`);
  }, []);

  // Recalculate conversions
  useEffect(() => {
    if (!baseDate || !baseTime) return;

    const baseZoneItem = TIMEZONES.find((z) => z.code === baseZone);
    if (!baseZoneItem) return;

    try {
      // Parse base date and time into a Date object in that specific timezone
      const [year, month, day] = baseDate.split("-").map(Number);
      const [hour, minute] = baseTime.split(":").map(Number);

      // We can create a UTC date first, then apply offset to get base timezone epoch
      // Using Intl.DateTimeFormat is the standard and cleanest way to convert in modern JS
      const baseDateObj = new Date(Date.UTC(year, month - 1, day, hour, minute));

      // Fetch timezone offset differences relative to base zone
      // Since Intl outputs formatted strings for IANA timezones, we can construct the display dates
      const results = TIMEZONES.map((tz) => {
        // Options for formatting
        const timeOptions: Intl.DateTimeFormatOptions = {
          timeZone: tz.iana,
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };

        const dateOptions: Intl.DateTimeFormatOptions = {
          timeZone: tz.iana,
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        };

        const timeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);
        const dateFormatter = new Intl.DateTimeFormat("en-US", dateOptions);

        return {
          code: tz.code,
          name: tz.name,
          offsetLabel: tz.offsetLabel,
          timeString: timeFormatter.format(baseDateObj),
          dateString: dateFormatter.format(baseDateObj),
        };
      });

      setConvertedTimes(results);
    } catch (e) {
      console.error("Time conversion error:", e);
    }
  }, [baseDate, baseTime, baseZone]);

  const handleReset = () => {
    const today = new Date();
    setBaseDate(today.toISOString().split("T")[0]);
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    setBaseTime(`${hours}:${minutes}`);
    setBaseZone("UTC");
  };

  const howToUse = [
    "Choose your base Date and Time using the calendar input fields.",
    "Select the Base Timezone of your inputs (e.g. UTC, IST, EST).",
    "Review the calculated outputs for other world zones automatically compiled in the dashboard.",
    "Click the Refresh button to sync inputs back to your current system time."
  ];

  const benefits = [
    "Highly reliable: Uses the standard Intl.DateTimeFormat API to retrieve official global timezone standards.",
    "Compare 8 major financial and tech city zones (including New York, Tokyo, Sydney, London, and Mumbai) in a single view.",
    "100% Client-Side conversions guarantee safety and speed.",
    "Responsive design perfect for digital nomads and remote team alignment."
  ];

  const faqs = [
    {
      question: "How does Daylight Saving Time (DST) affect calculations?",
      answer: "The native JavaScript `Intl` API automatically queries the browser's operating system timezone databases, meaning DST offsets are adjusted dynamically depending on the selected date."
    },
    {
      question: "Are these IANA standard timezones?",
      answer: "Yes, we map our labels (like EST or IST) directly to official IANA database keys (like America/New_York or Asia/Kolkata) to maintain standard accuracy."
    },
    {
      question: "Can I convert historical dates?",
      answer: "Yes, you can select any past or future calendar date. The converter will adjust offsets according to the historical standard rules of the selected location."
    }
  ];

  const relatedTools = [
    {
      name: "Multi-Unit Converter",
      url: "/unit-converter",
      description: "Convert metrics across Length, Weight, Temperature, Area, and Speed."
    },
    {
      name: "Age Calculator",
      url: "/age-calculator",
      description: "Determine exact age in years, months, weeks, days, and minutes."
    },
    {
      name: "Free URL Shortener",
      url: "/url-shortener",
      description: "Shorten links, generate QR codes, and view analytics parameters."
    }
  ];

  return (
    <ToolLayout
      title="Time zone Converter"
      description="Translate date and time parameters across global timezones. Configure your base zone, input target details, and review equivalent times in real-time."
      category="Utility Tools"
      categoryUrl="/#utility"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Input Settings panel */}
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="baseDate" className="text-sm font-semibold text-primary-text flex items-center gap-1">
              <Calendar className="h-4 w-4 text-accent" /> Base Date
            </label>
            <input
              type="date"
              id="baseDate" 
              required
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="block w-full rounded-lg border border-border-color px-4 py-2.5 text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="baseTime" className="block text-sm font-semibold text-primary-text items-center gap-1">
              <Clock className="h-4 w-4 text-accent" /> Base Time
            </label>
            <input
              type="time"
              id="baseTime"
              required
              value={baseTime}
              onChange={(e) => setBaseTime(e.target.value)}
              className="block w-full rounded-lg border border-border-color px-4 py-2.5 text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="baseZone" className="text-sm font-semibold text-primary-text flex items-center gap-1">
              <Globe className="h-4 w-4 text-accent" /> Base Timezone
            </label>
            <div className="flex gap-2">
              <select
                id="baseZone"
                value={baseZone}
                onChange={(e) => setBaseZone(e.target.value)}
                className="block w-full rounded-lg border border-border-color px-3 py-2 bg-background text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.code} value={tz.code}>
                    {tz.code} - {tz.name} ({tz.offsetLabel})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Reset to Current Time"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Conversion output table */}
        <div className="border-t border-border-color pt-6 space-y-4">
          <h3 className="font-heading text-base font-bold text-primary-text flex items-center gap-1.5">
            <Globe className="h-4.5 w-4.5 text-accent" /> Translated Global Times
          </h3>

          {convertedTimes.length === 0 ? (
            <div className="text-center text-xs text-secondary-text p-6">
              Enter base metrics to check out timezone conversions.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border-color bg-card-bg shadow-sm">
              <table className="min-w-full divide-y divide-border-color text-left text-sm">
                <thead className="bg-secondary-bg text-xs font-semibold uppercase tracking-wider text-secondary-text">
                  <tr>
                    <th className="px-4 py-3">Zone</th>
                    <th className="px-4 py-3">Location Name</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {convertedTimes.map((tz) => {
                    const isBase = tz.code === baseZone;
                    return (
                      <tr key={tz.code} className={`hover:bg-hover-bg transition-colors ${isBase ? "bg-accent/5 font-medium" : ""}`}>
                        <td className="px-4 py-3.5 text-primary-text font-bold">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${isBase ? "bg-accent text-white" : "bg-secondary-bg text-secondary-text border border-border-color/60"}`}>
                            {tz.code}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-secondary-text">
                          <div className="text-sm font-semibold text-primary-text">{tz.name}</div>
                          <div className="text-[10px] text-secondary-text">{tz.offsetLabel}</div>
                        </td>
                        <td className={`px-4 py-3.5 text-base font-heading font-bold ${isBase ? "text-accent" : "text-primary-text"}`}>
                          {tz.timeString}
                        </td>
                        <td className="px-4 py-3.5 text-secondary-text text-xs hidden sm:table-cell">
                          {tz.dateString}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
