"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Percent, ArrowRight, RefreshCw, Copy, Check } from "lucide-react";

export default function PercentCalculator() {
  // Calculator 1: What is X% of Y
  const [val1X, setVal1X] = useState("");
  const [val1Y, setVal1Y] = useState("");
  const [result1, setResult1] = useState<number | null>(null);

  // Calculator 2: X is what % of Y
  const [val2X, setVal2X] = useState("");
  const [val2Y, setVal2Y] = useState("");
  const [result2, setResult2] = useState<number | null>(null);

  // Calculator 3: % Change from X to Y
  const [val3X, setVal3X] = useState("");
  const [val3Y, setVal3Y] = useState("");
  const [result3, setResult3] = useState<{ value: number; type: "increase" | "decrease" | "none" } | null>(null);

  // Calculator 4: Add/Sub X% from Y
  const [val4X, setVal4X] = useState("");
  const [val4Y, setVal4Y] = useState("");
  const [calc4Op, setCalc4Op] = useState<"add" | "sub">("add");
  const [result4, setResult4] = useState<number | null>(null);

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Handlers
  const calculate1 = () => {
    const x = parseFloat(val1X);
    const y = parseFloat(val1Y);
    if (!isNaN(x) && !isNaN(y)) {
      setResult1(Number(((x / 100) * y).toFixed(4)));
    } else {
      setResult1(null);
    }
  };

  const calculate2 = () => {
    const x = parseFloat(val2X);
    const y = parseFloat(val2Y);
    if (!isNaN(x) && !isNaN(y) && y !== 0) {
      setResult2(Number(((x / y) * 100).toFixed(4)));
    } else {
      setResult2(null);
    }
  };

  const calculate3 = () => {
    const x = parseFloat(val3X);
    const y = parseFloat(val3Y);
    if (!isNaN(x) && !isNaN(y) && x !== 0) {
      const change = ((y - x) / x) * 100;
      setResult3({
        value: Number(Math.abs(change).toFixed(4)),
        type: change > 0 ? "increase" : change < 0 ? "decrease" : "none",
      });
    } else {
      setResult3(null);
    }
  };

  const calculate4 = () => {
    const x = parseFloat(val4X);
    const y = parseFloat(val4Y);
    if (!isNaN(x) && !isNaN(y)) {
      const percentValue = (x / 100) * y;
      const finalVal = calc4Op === "add" ? y + percentValue : y - percentValue;
      setResult4(Number(finalVal.toFixed(4)));
    } else {
      setResult4(null);
    }
  };

  const resetAll = () => {
    setVal1X("");
    setVal1Y("");
    setResult1(null);

    setVal2X("");
    setVal2Y("");
    setResult2(null);

    setVal3X("");
    setVal3Y("");
    setResult3(null);

    setVal4X("");
    setVal4Y("");
    setCalc4Op("add");
    setResult4(null);
  };

  const howToUse = [
    "Choose one of the four percentage calculations based on your numerical requirement.",
    "Input your starting numbers or percentage rates into the corresponding inputs.",
    "Click the calculate button next to the specific formula block.",
    "Copy the computed final percentage or numerical result to your clipboard instantly.",
  ];

  const benefits = [
    "Instant local calculation with high-precision decimal formatting.",
    "Four-in-one flexibility covering standard percentage queries, margins, and rates of change.",
    "Completely client-side math processing ensuring your numbers are private.",
    "One-click copying for fast reports, math logging, and financial ledger builds.",
  ];

  const faqs = [
    {
      question: "How is percentage increase or decrease calculated?",
      answer: "Percentage change is calculated by taking the difference between the final value and initial value, dividing it by the initial value, and then multiplying the result by 100.",
    },
    {
      question: "Does this page save my financial records?",
      answer: "No. The Percentage Calculator processes all computations entirely in your browser sandbox. No input variables are ever sent to our servers.",
    },
  ];

  const relatedTools = [
    { name: "Loan EMI Calculator", url: "/emi-calculator", description: "Calculate monthly installments, interest rates, and loan terms." },
    { name: "Age Calculator", url: "/age-calculator", description: "Determine age differences and date metrics." },
  ];

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Quickly calculate math percentages, rates of change, numerical proportions, and margins."
      category="Calculators"
      categoryUrl="/#calculators"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-8">
        {/* Reset Row */}
        <div className="flex justify-end">
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-4 py-2 border border-border-color hover:bg-hover-bg rounded-lg text-sm text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" /> Reset All Formulas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formula 1 */}
          <div className="p-5 rounded-xl border border-border-color bg-secondary-bg/25 space-y-4">
            <h3 className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-accent" /> Find percentage of value
            </h3>
            <p className="text-xs text-secondary-text">What is X% of Y?</p>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="X"
                value={val1X}
                onChange={(e) => setVal1X(e.target.value)}
                className="w-20 rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
              />
              <span className="text-xs font-semibold text-secondary-text">% of</span>
              <input
                type="number"
                placeholder="Y"
                value={val1Y}
                onChange={(e) => setVal1Y(e.target.value)}
                className="w-28 rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
              />
              <button
                onClick={calculate1}
                className="px-3.5 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Calculate
              </button>
            </div>
            {result1 !== null && (
              <div className="p-3 bg-white border border-border-color rounded-lg flex items-center justify-between">
                <span className="text-sm text-secondary-text">
                  Result: <strong className="text-primary-text text-base">{result1}</strong>
                </span>
                <button
                  onClick={() => handleCopy(result1.toString(), "r1")}
                  className="p-1.5 hover:bg-hover-bg text-secondary-text rounded transition-colors"
                  title="Copy Result"
                >
                  {copiedText === "r1" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Formula 2 */}
          <div className="p-5 rounded-xl border border-border-color bg-secondary-bg/25 space-y-4">
            <h3 className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-accent" /> Find proportion percentage
            </h3>
            <p className="text-xs text-secondary-text">X is what percentage of Y?</p>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="X"
                value={val2X}
                onChange={(e) => setVal2X(e.target.value)}
                className="w-24 rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
              />
              <span className="text-xs font-semibold text-secondary-text">is what % of</span>
              <input
                type="number"
                placeholder="Y"
                value={val2Y}
                onChange={(e) => setVal2Y(e.target.value)}
                className="w-24 rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
              />
              <button
                onClick={calculate2}
                className="px-3.5 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Calculate
              </button>
            </div>
            {result2 !== null && (
              <div className="p-3 bg-white border border-border-color rounded-lg flex items-center justify-between">
                <span className="text-sm text-secondary-text">
                  Result: <strong className="text-primary-text text-base">{result2}%</strong>
                </span>
                <button
                  onClick={() => handleCopy(`${result2}%`, "r2")}
                  className="p-1.5 hover:bg-hover-bg text-secondary-text rounded transition-colors"
                  title="Copy Result"
                >
                  {copiedText === "r2" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Formula 3 */}
          <div className="p-5 rounded-xl border border-border-color bg-secondary-bg/25 space-y-4">
            <h3 className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-accent" /> Find percentage change
            </h3>
            <p className="text-xs text-secondary-text">Percentage increase/decrease from X to Y?</p>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Initial X"
                value={val3X}
                onChange={(e) => setVal3X(e.target.value)}
                className="w-24 rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
              />
              <span className="text-xs font-semibold text-secondary-text">to</span>
              <input
                type="number"
                placeholder="Final Y"
                value={val3Y}
                onChange={(e) => setVal3Y(e.target.value)}
                className="w-24 rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
              />
              <button
                onClick={calculate3}
                className="px-3.5 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Calculate
              </button>
            </div>
            {result3 !== null && (
              <div className="p-3 bg-white border border-border-color rounded-lg flex items-center justify-between">
                <span className="text-sm text-secondary-text">
                  Result:{" "}
                  <strong className={`text-base ${result3.type === "increase" ? "text-success" : result3.type === "decrease" ? "text-warning" : "text-primary-text"}`}>
                    {result3.value}% {result3.type === "increase" ? "Increase" : result3.type === "decrease" ? "Decrease" : "No Change"}
                  </strong>
                </span>
                <button
                  onClick={() => handleCopy(`${result3.value}% ${result3.type}`, "r3")}
                  className="p-1.5 hover:bg-hover-bg text-secondary-text rounded transition-colors"
                  title="Copy Result"
                >
                  {copiedText === "r3" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Formula 4 */}
          <div className="p-5 rounded-xl border border-border-color bg-secondary-bg/25 space-y-4">
            <h3 className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-accent" /> Add or subtract percentage
            </h3>
            <p className="text-xs text-secondary-text">Add or subtract X% from Y?</p>
            <div className="flex gap-2 items-center">
              <select
                value={calc4Op}
                onChange={(e) => setCalc4Op(e.target.value as "add" | "sub")}
                className="rounded-lg border border-border-color bg-background px-2.5 py-2 text-xs text-primary-text focus:border-accent focus:outline-none"
              >
                <option value="add">Add (+)</option>
                <option value="sub">Subtract (-)</option>
              </select>
              <input
                type="number"
                placeholder="X%"
                value={val4X}
                onChange={(e) => setVal4X(e.target.value)}
                className="w-16 rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
              />
              <span className="text-xs font-semibold text-secondary-text">of/to</span>
              <input
                type="number"
                placeholder="Base Y"
                value={val4Y}
                onChange={(e) => setVal4Y(e.target.value)}
                className="w-24 rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
              />
              <button
                onClick={calculate4}
                className="px-3.5 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Calculate
              </button>
            </div>
            {result4 !== null && (
              <div className="p-3 bg-white border border-border-color rounded-lg flex items-center justify-between">
                <span className="text-sm text-secondary-text">
                  Result: <strong className="text-primary-text text-base">{result4}</strong>
                </span>
                <button
                  onClick={() => handleCopy(result4.toString(), "r4")}
                  className="p-1.5 hover:bg-hover-bg text-secondary-text rounded transition-colors"
                  title="Copy Result"
                >
                  {copiedText === "r4" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
