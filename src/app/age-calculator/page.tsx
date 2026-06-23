"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Calendar, Clock, RotateCcw } from "lucide-react";

interface AgeResults {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [results, setResults] = useState<AgeResults | null>(null);

  // Safe client-side date initialization
  useEffect(() => {
    const today = new Date();
    setTargetDate(today.toISOString().split("T")[0]);
  }, []);

  const calculateAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;

    const birthDate = new Date(dob);
    const currentDate = new Date(targetDate);

    if (birthDate > currentDate) {
      alert("Date of birth cannot be after the target date!");
      return;
    }

    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    let currentDay = currentDate.getDate();

    let ageYears = currentYear - birthYear;
    let ageMonths = currentMonth - birthMonth;
    let ageDays = currentDay - birthDay;

    if (ageDays < 0) {
      // Get days in previous month
      const prevMonth = new Date(currentYear, currentMonth, 0);
      ageDays += prevMonth.getDate();
      ageMonths--;
    }

    if (ageMonths < 0) {
      ageMonths += 12;
      ageYears--;
    }

    // Totals calculations
    const diffTime = currentDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalMonths = ageYears * 12 + ageMonths;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    setResults({
      years: ageYears,
      months: ageMonths,
      days: ageDays,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
    });
  };

  const handleReset = () => {
    setDob("");
    setTargetDate(new Date().toISOString().split("T")[0]);
    setResults(null);
  };

  const howToUse = [
    "Select your Date of Birth using the calendar input field.",
    "Optionally, change the target date (defaults to today's date).",
    "Click the Calculate Age button.",
    "View your precise age in years, months, days, weeks, hours, and minutes instantly."
  ];

  const benefits = [
    "Highly precise breakdown of your age down to the minute.",
    "Calculates target date age (useful for checking eligibility for exams or jobs).",
    "Completely client-side calculations ensuring absolute privacy for your personal dates.",
    "Sleek and premium card layouts with easy-to-read cards.",
    "Responsive design that works flawlessly on mobile devices."
  ];

  const faqs = [
    {
      question: "Is my birth date data saved or sent to any server?",
      answer: "No, all calculations are performed locally in your browser. We do not store, process, or transmit your birth date to any external servers."
    },
    {
      question: "How does the leap year affect the age calculation?",
      answer: "The tool accurately accounts for leap years by counting the precise calendar days in the respective months when analyzing age boundaries."
    },
    {
      question: "Can I calculate the age of a historical event?",
      answer: "Yes, you can input any historical date as the Date of Birth to calculate exactly how much time has passed between then and today (or any target date)."
    }
  ];

  const relatedTools = [
    {
      name: "Free URL Shortener",
      url: "/url-shortener",
      description: "Shorten links, generate QR codes, and view analytics parameters."
    },
    {
      name: "QR Code Generator",
      url: "/qr-generator",
      description: "Create fully styled QR codes with customized sizing and colors."
    },
    {
      name: "Password Generator",
      url: "/password-generator",
      description: "Configure secure passwords with custom specifications client-side."
    }
  ];

  return (
    <ToolLayout
      title="Age Calculator"
      description="Determine your exact age in years, months, weeks, days, hours, and minutes. Set custom target dates to calculate eligibility timelines or milestone checkouts."
      category="Calculators"
      categoryUrl="/#calculators"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-8">
        <form onSubmit={calculateAge} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="dob" className="block text-sm font-semibold text-primary-text">
              Date of Birth
            </label>
            <div className="relative rounded-lg shadow-sm">
              <input
                type="date"
                id="dob"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="block w-full rounded-lg border border-border-color px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="targetDate" className="block text-sm font-semibold text-primary-text">
              Age at the Date of
            </label>
            <div className="relative rounded-lg shadow-sm">
              <input
                type="date"
                id="targetDate"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="block w-full rounded-lg border border-border-color px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer"
            >
              Calculate Age
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </form>

        {results && (
          <div className="space-y-6 pt-6 border-t border-border-color">
            <h3 className="font-heading text-lg font-bold text-primary-text flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Calculation Results
            </h3>

            {/* Primary Age Card */}
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 text-center space-y-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Your Age is
              </span>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-primary-text">
                {results.years} Years, {results.months} Months, and {results.days} Days
              </div>
            </div>

            {/* Detailed breakdowns */}
            <h4 className="font-heading font-semibold text-primary-text flex items-center gap-2 text-sm pt-2">
              <Clock className="h-4 w-4 text-accent" /> Time Breakdown Totals
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
                <div className="text-xl font-bold text-primary-text">{results.totalMonths}</div>
                <div className="text-xs text-secondary-text mt-1">Total Months</div>
              </div>
              <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
                <div className="text-xl font-bold text-primary-text">{results.totalWeeks}</div>
                <div className="text-xs text-secondary-text mt-1">Total Weeks</div>
              </div>
              <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
                <div className="text-xl font-bold text-primary-text">{results.totalDays.toLocaleString()}</div>
                <div className="text-xs text-secondary-text mt-1">Total Days</div>
              </div>
              <div className="border border-border-color rounded-xl p-4 text-center bg-secondary-bg">
                <div className="text-xl font-bold text-primary-text">{results.totalHours.toLocaleString()}</div>
                <div className="text-xs text-secondary-text mt-1">Total Hours</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
