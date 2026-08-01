"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Coins, Table, Calendar, RefreshCw, BarChart3, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";

interface AnnualBreakdown {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<number>(10000);
  const [contribution, setContribution] = useState<number>(200);
  const [contributionFreq, setContributionFreq] = useState<"monthly" | "annually">("monthly");
  const [interestRate, setInterestRate] = useState<number>(8);
  const [years, setYears] = useState<number>(10);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // Compounding periods per year

  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<AnnualBreakdown[]>([]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  const calculateGrowth = () => {
    let currentBalance = principal;
    let accumulatedContributions = principal;
    let accumulatedInterest = 0;
    const tempBreakdown: AnnualBreakdown[] = [];

    const ratePerPeriod = (interestRate / 100) / compoundFreq;
    const monthlyContribution = contributionFreq === "monthly" ? contribution : 0;
    const annualContribution = contributionFreq === "annually" ? contribution : 0;

    for (let year = 1; year <= years; year++) {
      // Run compounding month-by-month (or period-by-period)
      for (let month = 1; month <= 12; month++) {
        // Add monthly contribution if compounding monthly or just apply regular intervals
        if (contributionFreq === "monthly") {
          currentBalance += monthlyContribution;
          accumulatedContributions += monthlyContribution;
        }

        // Apply compounding if we match the compound frequency interval
        // E.g. compoundFreq = 12 means compound every month
        // compoundFreq = 4 means compound every 3 months
        const periodsPerMonth = compoundFreq / 12;
        const interestEarned = currentBalance * ratePerPeriod * periodsPerMonth;
        currentBalance += interestEarned;
        accumulatedInterest += interestEarned;
      }

      // Add annual contribution at the end of the year
      if (contributionFreq === "annually") {
        currentBalance += annualContribution;
        accumulatedContributions += annualContribution;
      }

      tempBreakdown.push({
        year,
        contributions: Math.round(accumulatedContributions),
        interest: Math.round(currentBalance - accumulatedContributions),
        balance: Math.round(currentBalance)
      });
    }

    setTotalBalance(currentBalance);
    setTotalContributions(accumulatedContributions);
    setTotalInterest(currentBalance - accumulatedContributions);
    setBreakdown(tempBreakdown);
  };

  useEffect(() => {
    calculateGrowth();
  }, [principal, contribution, contributionFreq, interestRate, years, compoundFreq]);

  const handleCalculateClick = () => {
    calculateGrowth();
    confetti({
      particleCount: 15,
      spread: 20,
      origin: { y: 0.8 },
      colors: ["#2563eb", "#10b981"],
    });
  };

  const handleReset = () => {
    setPrincipal(10000);
    setContribution(200);
    setContributionFreq("monthly");
    setInterestRate(8);
    setYears(10);
    setCompoundFreq(12);
  };

  // SVG Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 220;
  const padding = 35;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  // Max value in breakdown for scaling
  const maxVal = breakdown.length > 0 ? Math.max(...breakdown.map((d) => d.balance)) : 1;

  const howToUse = [
    "Enter your starting Principal balance (Initial Investment).",
    "Add periodic contributions (monthly or annual deposit limits).",
    "Input your expected Annual Interest Rate (%) and overall duration scope.",
    "Select a compounding interval (Daily, Monthly, Quarterly, or Annually).",
    "Examine the interactive stacked bar graph and year-by-year table."
  ];

  const benefits = [
    "Simulates growth with regular monthly or annual deposit additions.",
    "Adjust compounding frequencies from daily to annual blocks.",
    "Renders dynamic SVG charts scaling to your custom growth levels.",
    "100% Client-Side calculation operates securely offline."
  ];

  const faqs = [
    {
      question: "How does compounding frequency affect my returns?",
      answer: "The more frequently interest is compounded (e.g. daily vs. annually), the faster your balance grows because you earn interest on top of previously earned interest sooner."
    },
    {
      question: "What is the rule of 72?",
      answer: "It is a simple shortcut to estimate how long it takes to double your money. Divide 72 by your annual interest rate (e.g., at 8%, it takes roughly 72/8 = 9 years to double)."
    }
  ];

  const relatedTools = [
    { name: "SIP & Mutual Fund Calculator", url: "/sip-calculator", description: "Calculate mutual fund SIP growth." },
    { name: "ROI Calculator", url: "/roi-calculator", description: "Compute returns and CAGR values." }
  ];

  return (
    <ToolLayout
      title="Compound Interest Calculator"
      description="Simulate investment growth over time. Adjust compounding intervals, principal amounts, annual/monthly deposits, and view SVG growth charts."
      category="Calculators"
      categoryUrl="/#calculators"
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
              <Coins className="h-4 w-4 text-accent" /> Investment Parameters
            </span>

            {/* Inputs grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Initial Principal ($)</label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-secondary-text font-semibold">Regular Contribution ($)</label>
                  <input
                    type="number"
                    value={contribution}
                    onChange={(e) => setContribution(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-secondary-text font-semibold">Frequency</label>
                  <select
                    value={contributionFreq}
                    onChange={(e) => setContributionFreq(e.target.value as any)}
                    className="w-full py-2 px-2 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="monthly">Month</option>
                    <option value="annually">Year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Compounding Frequency</label>
                <select
                  value={compoundFreq}
                  onChange={(e) => setCompoundFreq(parseInt(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none cursor-pointer"
                >
                  <option value={365}>Daily</option>
                  <option value={12}>Monthly</option>
                  <option value={4}>Quarterly</option>
                  <option value={2}>Semi-Annually</option>
                  <option value={1}>Annually</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-secondary-text">
                  <span>Investment Period (Years)</span>
                  <span className="font-bold text-accent">{years} years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
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
                <TrendingUp className="h-4 w-4 text-success" /> Projections Summary
              </span>

              <div className="space-y-3.5">
                <div>
                  <p className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Future Balance</p>
                  <p className="text-2xl font-black text-accent">{formatCurrency(totalBalance)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-border-color/60 pt-3">
                  <div>
                    <p className="text-[9px] text-secondary-text font-bold uppercase tracking-wider">Total Invested</p>
                    <p className="text-sm font-bold text-primary-text">{formatCurrency(totalContributions)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-secondary-text font-bold uppercase tracking-wider">Total Interest</p>
                    <p className="text-sm font-bold text-success">{formatCurrency(totalInterest)}</p>
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

        {/* SVG stacked growth chart */}
        {breakdown.length > 0 && (
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-accent" /> Growth Over Time (Principal vs Interest)
            </span>

            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="mx-auto block w-full max-w-125 select-none"
              >
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = padding + graphHeight * (1 - ratio);
                  return (
                    <g key={idx}>
                      <line
                        x1={padding}
                        y1={y}
                        x2={chartWidth - padding}
                        y2={y}
                        stroke="var(--border-color, #e5e7eb)"
                        strokeWidth="0.5"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padding - 5}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="8"
                        fontWeight="bold"
                        fill="var(--secondary-text, #6b7280)"
                      >
                        {formatCurrency(maxVal * ratio)}
                      </text>
                    </g>
                  );
                })}

                {/* Draw Year Bars */}
                {breakdown.map((d, idx) => {
                  // Bar Width
                  const barWidth = Math.max(4, Math.floor(graphWidth / breakdown.length) - 6);
                  const x = padding + (idx * (graphWidth / breakdown.length)) + (graphWidth / breakdown.length - barWidth) / 2;

                  // Heights
                  const totalHeight = (d.balance / maxVal) * graphHeight;
                  const contribHeight = (d.contributions / maxVal) * graphHeight;
                  const interestHeight = totalHeight - contribHeight;

                  return (
                    <g key={d.year} className="group">
                      {/* Contributions bar (bottom) */}
                      <rect
                        x={x}
                        y={padding + graphHeight - contribHeight}
                        width={barWidth}
                        height={contribHeight}
                        fill="#2563eb"
                        rx="1"
                      />
                      {/* Interest bar (top) */}
                      <rect
                        x={x}
                        y={padding + graphHeight - totalHeight}
                        width={barWidth}
                        height={interestHeight}
                        fill="#10b981"
                        rx="1"
                      />
                      
                      {/* X Axis Label */}
                      {(idx === 0 || idx === breakdown.length - 1 || (idx + 1) % 5 === 0) && (
                        <text
                          x={x + barWidth / 2}
                          y={chartHeight - padding + 14}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fill="var(--secondary-text, #6b7280)"
                        >
                          Yr {d.year}
                        </text>
                      )}

                      {/* Tooltip detail (visible on hover) */}
                      <title>{`Year ${d.year}\nTotal: ${formatCurrency(d.balance)}\nInvested: ${formatCurrency(d.contributions)}\nInterest: ${formatCurrency(d.interest)}`}</title>
                    </g>
                  );
                })}

                {/* X-Axis bottom boundary line */}
                <line
                  x1={padding}
                  y1={chartHeight - padding}
                  x2={chartWidth - padding}
                  y2={chartHeight - padding}
                  stroke="var(--border-color, #e5e7eb)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            
            {/* Chart Legend */}
            <div className="flex justify-center gap-6 text-[10px] font-bold text-secondary-text select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#2563eb] rounded" /> Principal Invested
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#10b981] rounded" /> Interest Accumulated
              </span>
            </div>

          </div>
        )}

        {/* Breakdown Table */}
        {breakdown.length > 0 && (
          <div className="border border-border-color rounded-2xl overflow-hidden bg-card-bg">
            <div className="bg-secondary-bg/25 px-4 py-3 border-b border-border-color flex justify-between items-center">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
                <Table className="h-4 w-4 text-accent" /> Annual Growth Breakdown
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left divide-y divide-border-color">
                <thead className="bg-secondary-bg/10 text-secondary-text uppercase font-bold text-[9px] tracking-wider select-none">
                  <tr>
                    <th className="py-2.5 px-4">Year</th>
                    <th className="py-2.5 px-4">Total Contributions</th>
                    <th className="py-2.5 px-4">Total Interest</th>
                    <th className="py-2.5 px-4">End Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/60 font-medium text-primary-text">
                  {breakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-hover-bg/30 transition-colors">
                      <td className="py-2 px-4 font-bold flex items-center gap-1"><Calendar className="h-3 w-3 text-secondary-text" /> Year {row.year}</td>
                      <td className="py-2 px-4">{formatCurrency(row.contributions)}</td>
                      <td className="py-2 px-4 text-success">{formatCurrency(row.interest)}</td>
                      <td className="py-2 px-4 font-bold text-accent">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
