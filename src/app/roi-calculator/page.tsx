"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Coins, RefreshCw, Eye, ArrowUpRight, ArrowDownRight, Percent } from "lucide-react";
import confetti from "canvas-confetti";

export default function RoiCalculator() {
  const [cost, setCost] = useState<number>(5000);
  const [returnValue, setReturnValue] = useState<number>(7500);
  const [years, setYears] = useState<number>(2);
  const [months, setMonths] = useState<number>(0);

  const [gain, setGain] = useState<number>(0);
  const [roi, setRoi] = useState<number>(0);
  const [cagr, setCagr] = useState<number | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  const calculateRoi = () => {
    if (cost <= 0) return;
    const computedGain = returnValue - cost;
    const computedRoi = (computedGain / cost) * 100;
    setGain(computedGain);
    setRoi(computedRoi);

    // Calculate duration in years
    const totalYears = years + months / 12;
    if (totalYears > 0 && returnValue > 0) {
      // CAGR Formula: (End Value / Start Value) ^ (1 / Years) - 1
      const computedCagr = (Math.pow(returnValue / cost, 1 / totalYears) - 1) * 100;
      setCagr(computedCagr);
    } else {
      setCagr(null);
    }
  };

  useEffect(() => {
    calculateRoi();
  }, [cost, returnValue, years, months]);

  const handleCalculateClick = () => {
    calculateRoi();
    if (gain > 0) {
      confetti({
        particleCount: 15,
        spread: 20,
        origin: { y: 0.8 },
        colors: ["#10b981", "#3b82f6"],
      });
    }
  };

  const handleReset = () => {
    setCost(5000);
    setReturnValue(7500);
    setYears(2);
    setMonths(0);
  };

  // SVG parameters
  const chartWidth = 360;
  const chartHeight = 160;
  const totalBarWidth = 300;

  const howToUse = [
    "Enter the Initial Investment Cost (starting funds).",
    "Enter the Final Value (returned amount or current valuation).",
    "Specify the investment length (years and months) to compute CAGR.",
    "Examine metrics of total gain/loss and simple ROI percentage.",
    "Inspect the interactive SVG bar showing cost-to-profit breakdown ratios."
  ];

  const benefits = [
    "Computes both simple return ratios and annualized CAGR values.",
    "Renders dynamic cost vs profit ratio bars.",
    "Handles both positive growth returns and loss scenarios.",
    "100% Client-Side calculation operates securely offline."
  ];

  const faqs = [
    {
      question: "What is the difference between simple ROI and CAGR?",
      answer: "Simple ROI calculates the total return from start to finish, ignoring the timeline. CAGR (Compound Annual Growth Rate) annualizes the rate of return, representing the steady rate of growth needed annually to hit the final amount."
    },
    {
      question: "What is a good ROI?",
      answer: "Historically, standard stock market indices (like the S&P 500) average a CAGR of around 7-10% (inflation-adjusted). Real estate typically averages around 3-6%."
    }
  ];

  const relatedTools = [
    { name: "SIP & Mutual Fund Calculator", url: "/sip-calculator", description: "Calculate mutual fund SIP growth." },
    { name: "Compound Interest Calculator", url: "/compound-interest-calculator", description: "Simulate future growth with custom rates." }
  ];

  // SVG math ratios for drawing proportions
  const costRatio = cost + returnValue > 0 ? cost / (cost + returnValue) : 0.5;
  const profitRatio = cost + returnValue > 0 ? Math.max(0, returnValue - cost) / (cost + returnValue) : 0;

  return (
    <ToolLayout
      title="ROI Calculator"
      description="Calculate your Return on Investment (ROI) and annualized returns (CAGR). Compare cost vs returns with visual SVG metrics blocks."
      category="Calculators"
      categoryUrl="/#calculators"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Workspace columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Settings Column */}
          <div className="lg:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-4 text-xs">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-accent" /> ROI Parameters
            </span>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Amount Invested (Cost)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Amount Returned (Final Value)</label>
                <input
                  type="number"
                  value={returnValue}
                  onChange={(e) => setReturnValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Duration (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Duration (Months)</label>
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleCalculateClick}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Simulate Returns
              </button>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-success" /> Return Projections
              </span>

              <div className="space-y-3.5">
                <div>
                  <p className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Total Profit/Loss</p>
                  <p className={`text-2xl font-black flex items-center gap-1.5 ${gain >= 0 ? "text-success" : "text-warning"}`}>
                    {gain >= 0 ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownRight className="h-6 w-6" />}
                    {formatCurrency(gain)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-border-color/60 pt-3">
                  <div>
                    <p className="text-[9px] text-secondary-text font-bold uppercase tracking-wider">Simple ROI</p>
                    <p className="text-sm font-bold text-primary-text">{roi.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-secondary-text font-bold uppercase tracking-wider">Annualized CAGR</p>
                    <p className="text-sm font-bold text-accent">
                      {cagr !== null ? `${cagr.toFixed(2)}%` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-color/60">
              <button
                onClick={handleReset}
                className="w-full py-2 border border-border-color hover:bg-hover-bg rounded-lg text-[10px] font-bold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Start Over
              </button>
            </div>
          </div>

        </div>

        {/* SVG Proportion Bar chart */}
        <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
          <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-accent animate-pulse" /> Cost vs Return Ratio
          </span>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="mx-auto block w-full max-w-90 select-none"
            >
              {/* Cost bar portion */}
              <rect
                x="30"
                y="50"
                width={totalBarWidth * costRatio}
                height="30"
                fill="#3b82f6"
                rx="4"
              />
              {/* Profit bar portion */}
              {returnValue > cost && (
                <rect
                  x={30 + totalBarWidth * costRatio + 4}
                  y="50"
                  width={totalBarWidth * (1 - costRatio) - 4}
                  height="30"
                  fill="#10b981"
                  rx="4"
                />
              )}

              {/* Labels */}
              <text
                x="30"
                y="40"
                fontSize="9"
                fontWeight="bold"
                fill="var(--secondary-text, #6b7280)"
              >
                Initial Cost ({formatCurrency(cost)})
              </text>
              <text
                x={30 + totalBarWidth}
                y="40"
                textAnchor="end"
                fontSize="9"
                fontWeight="bold"
                fill="var(--secondary-text, #6b7280)"
              >
                Final Value ({formatCurrency(returnValue)})
              </text>

              {/* Net gains indicator */}
              <text
                x="180"
                y="110"
                textAnchor="middle"
                fontSize="11"
                fontWeight="black"
                fill={gain >= 0 ? "#10b981" : "#ef4444"}
              >
                {gain >= 0
                  ? `Net Return of +${roi.toFixed(1)}%`
                  : `Net Loss of ${roi.toFixed(1)}%`}
              </text>
            </svg>
          </div>

          <div className="flex justify-center gap-6 text-[10px] font-bold text-secondary-text select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#3b82f6] rounded" /> Initial Investment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#10b981] rounded" /> Profit Gain
            </span>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
