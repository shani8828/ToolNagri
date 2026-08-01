"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Trophy, Users, HelpCircle, History } from "lucide-react";
import confetti from "canvas-confetti";

export default function RandomNamePicker() {
  const [namesText, setNamesText] = useState("");
  const [winnerCount, setWinnerCount] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);

  const [spinning, setSpinning] = useState(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [animWinners, setAnimWinners] = useState<string[]>([]);
  const [history, setHistory] = useState<{ date: string; winnersList: string[] }[]>([]);
  
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handlePickWinners = () => {
    setError("");
    setWinners([]);
    setAnimWinners([]);

    const list = namesText
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (list.length === 0) {
      setError("Please enter a list of names/options first.");
      return;
    }

    if (!allowDuplicates && list.length < winnerCount) {
      setError(`Cannot draw ${winnerCount} unique winners from a list of ${list.length} names.`);
      return;
    }

    setSpinning(true);
    let currentDelay = 40;
    let ticks = 0;
    const maxTicks = 22;

    const tick = () => {
      // Show random selections during spin
      const temp: string[] = [];
      for (let w = 0; w < winnerCount; w++) {
        const randIndex = Math.floor(Math.random() * list.length);
        temp.push(list[randIndex]);
      }
      setAnimWinners(temp);

      ticks++;
      if (ticks < maxTicks) {
        currentDelay += Math.floor(ticks * 1.5); // Gradually slow down
        setTimeout(tick, currentDelay);
      } else {
        // Resolve final winners
        const finalWinners: string[] = [];
        const pool = [...list];

        for (let w = 0; w < winnerCount; w++) {
          const randIndex = Math.floor(Math.random() * pool.length);
          finalWinners.push(pool[randIndex]);
          if (!allowDuplicates) {
            pool.splice(randIndex, 1); // Remove to prevent duplicates
          }
        }

        setWinners(finalWinners);
        setAnimWinners([]);
        setSpinning(false);

        // Add to history
        setHistory((prev) => [
          { date: new Date().toLocaleTimeString(), winnersList: finalWinners },
          ...prev.slice(0, 9) // Limit history to last 10 draws
        ]);

        // Confetti!
        confetti({
          particleCount: 50,
          spread: 45,
          origin: { y: 0.7 },
          colors: ["#2563eb", "#22c55e", "#f59e0b"],
        });
      }
    };

    setTimeout(tick, currentDelay);
  };

  const handleCopyToClipboard = () => {
    if (winners.length === 0) return;
    navigator.clipboard.writeText(winners.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setNamesText("");
    setWinners([]);
    setAnimWinners([]);
    setError("");
  };

  const howToUse = [
    "Enter your list of choices (one option or name per row) in the inputs textarea.",
    "Choose how many winners you want to select from the pool.",
    "Toggle the allow duplicates switch based on your giveaway rules.",
    "Click the Draw Winners button to trigger the slot-machine animation.",
    "View selected winners, review the history list, or copy outputs."
  ];

  const benefits = [
    "Incorporates a custom slowing-down slot-machine selection animation.",
    "Supports multi-winner selection draws from custom lists.",
    "Maintains local draw history records for giveaway tracking.",
    "100% Client-Side selection ensures unbiased, random results."
  ];

  const faqs = [
    {
      question: "Are the picked names truly random?",
      answer: "Yes. The tool executes browser-native `Math.random()` pseudo-random selections client-side. The results are fully computed in your browser sandbox with zero server-side overrides."
    },
    {
      question: "What is the difference between drawing with or without duplicates?",
      answer: "Drawing without duplicates ensures a single name cannot win more than once in the same draw. Allowing duplicates lets names be drawn multiple times in the same winner set."
    }
  ];

  const relatedTools = [
    { name: "UUID Generator", url: "/uuid-generator", description: "Generate bulk random GUID identifiers." },
    { name: "Password Generator", url: "/password-generator", description: "Generate secure custom passwords." }
  ];

  return (
    <ToolLayout
      title="Random Name Picker"
      description="Select random winners from a list of names. Set winner counts, enable/disable duplicate wins, spin names via a slot-machine animation, and log local history."
      category="Text Utilities"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Inputs panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-accent" /> Participant List
            </span>

            {/* Names Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Names (one per line)</label>
              <textarea
                value={namesText}
                onChange={(e) => setNamesText(e.target.value)}
                placeholder="Name 1&#10;Name 2&#10;Name 3&#10;Name 4..."
                rows={10}
                className="w-full rounded-xl border border-border-color bg-background p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
              />
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Number of Winners</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={winnerCount}
                  onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-5 sm:pt-6">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allowDuplicates}
                    onChange={(e) => setAllowDuplicates(e.target.checked)}
                    className="accent-accent h-4 w-4"
                  />
                  Allow Duplicate Wins
                </label>
              </div>
            </div>
          </div>

          {/* Winner Board / Spinner */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-65">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Trophy className="h-4.5 w-4.5 text-accent animate-pulse" /> Draw Results
              </span>

              {spinning ? (
                // Slot machine rotating screen
                <div className="py-6 text-center space-y-3.5 bg-secondary-bg/20 rounded-xl border border-border-color/40">
                  <div className="text-sm font-mono font-bold text-accent animate-bounce">
                    {animWinners.length > 0 ? animWinners.join(", ") : "Cycling pool..."}
                  </div>
                  <p className="text-[10px] text-secondary-text uppercase tracking-wider font-semibold">Selecting winners...</p>
                </div>
              ) : winners.length > 0 ? (
                // Winners announced
                <div className="space-y-3.5 w-full">
                  <div className="text-center bg-success/5 p-4 rounded-xl border border-success/20 space-y-1 shadow-xs">
                    <span className="text-[9px] text-success font-bold uppercase tracking-wider">Congratulations!</span>
                    <div className="text-base font-bold text-primary-text wrap-break-word">
                      {winners.join(", ")}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCopyToClipboard}
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-success hover:bg-success/90 text-white cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Winners"}
                  </button>
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-secondary-text italic leading-relaxed">
                  Click draw button to select a random name.
                </div>
              )}
            </div>

            {/* Error messaging */}
            {error && (
              <div className="text-xs text-warning bg-warning/5 p-2 rounded border border-warning/15 flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex gap-3">
          <button
            onClick={handlePickWinners}
            disabled={spinning}
            className="flex-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-light shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {spinning ? "Selecting..." : "Draw Winners"}
          </button>
          <button
            onClick={handleReset}
            disabled={spinning}
            className="px-4 py-3 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer disabled:opacity-50"
            title="Clear"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Draw History Log */}
        {history.length > 0 && (
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <History className="h-4 w-4 text-accent" /> Recent Draws History
            </span>

            <div className="max-h-40 overflow-y-auto border border-border-color/60 rounded-xl text-xs divide-y divide-border-color/60 font-semibold text-secondary-text">
              {history.map((item, idx) => (
                <div key={idx} className="p-2.5 flex justify-between items-center hover:bg-hover-bg/30">
                  <div className="flex gap-2">
                    <span className="text-accent font-bold">Draw #{history.length - idx}</span>
                    <span className="text-primary-text font-bold">{item.winnersList.join(", ")}</span>
                  </div>
                  <span className="text-[10px] text-secondary-text font-mono font-normal">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
