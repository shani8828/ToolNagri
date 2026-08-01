"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Coins, Table, TrendingUp, Info } from "lucide-react";

export default function SipCalculator() {
  const [monthlyInvest, setMonthlyInvest] = useState<number>(5000);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [years, setTenure] = useState<number>(10);

  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [estReturns, setEstReturns] = useState<number>(0);
  const [maturityVal, setMaturityVal] = useState<number>(0);
  
  const [yearlyData, setYearlyData] = useState<{ year: number; invested: number; returns: number; total: number }[]>([]);

  useEffect(() => {
    // Calculate maturity value for SIP
    // FV = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
    // where i = rate / 100 / 12, n = years * 12
    const p = monthlyInvest;
    const i = (returnRate / 100) / 12;
    const n = years * 12;

    let fv = 0;
    if (i > 0) {
      fv = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      fv = p * n;
    }

    const invested = p * n;
    const returns = fv - invested;

    setTotalInvested(Math.round(invested));
    setEstReturns(Math.round(returns));
    setMaturityVal(Math.round(fv));

    // Calculate yearly breakdown
    const breakdown = [];
    for (let y = 1; y <= years; y++) {
      const monthsCount = y * 12;
      const yrInvested = p * monthsCount;
      let yrFv = 0;
      if (i > 0) {
        yrFv = p * ((Math.pow(1 + i, monthsCount) - 1) / i) * (1 + i);
      } else {
        yrFv = p * monthsCount;
      }
      breakdown.push({
        year: y,
        invested: Math.round(yrInvested),
        returns: Math.round(Math.max(0, yrFv - yrInvested)),
        total: Math.round(yrFv)
      });
    }
    setYearlyData(breakdown);
  }, [monthlyInvest, returnRate, years]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Generate SVG area chart paths
  const chartWidth = 500;
  const chartHeight = 250;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  const maxTotal = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].total : 1;

  const getSvgCoordinates = () => {
    if (yearlyData.length === 0) return { investedPath: "", totalPath: "", investedPoints: [], totalPoints: [] };

    const investedPoints = yearlyData.map((d, index) => {
      const x = paddingLeft + (index / (yearlyData.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - (d.invested / maxTotal) * graphHeight;
      return { x, y };
    });

    const totalPoints = yearlyData.map((d, index) => {
      const x = paddingLeft + (index / (yearlyData.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - (d.total / maxTotal) * graphHeight;
      return { x, y };
    });

    // Build SVG paths
    const investedPath = investedPoints.reduce((acc, p, idx) => {
      return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }, "");

    const totalPath = totalPoints.reduce((acc, p, idx) => {
      return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }, "");

    // Build shaded Area paths
    const investedAreaPath = investedPath + ` L ${investedPoints[investedPoints.length - 1].x} ${paddingTop + graphHeight} L ${investedPoints[0].x} ${paddingTop + graphHeight} Z`;
    const totalAreaPath = totalPath + ` L ${totalPoints[totalPoints.length - 1].x} ${paddingTop + graphHeight} L ${totalPoints[0].x} ${paddingTop + graphHeight} Z`;

    return { investedPath, totalPath, investedAreaPath, totalAreaPath, investedPoints, totalPoints };
  };

  const { investedPath, totalPath, investedAreaPath, totalAreaPath } = getSvgCoordinates();

  const howToUse = [
    "Enter or slide the Monthly Investment Amount you plan to contribute regularly.",
    "Input the Expected Return Rate (%) per annum from your Mutual Fund profile.",
    "Choose your total investment duration (Tenure) in years.",
    "Examine the main KPIs: Invested Value, Wealth Gained, and Maturity Value.",
    "Verify growth paths in the custom SVG Compound Chart or review the yearly breakdown list."
  ];

  const benefits = [
    "Simulates exact financial systematic investment plans instantly.",
    "Includes a fully responsive custom SVG growth projection visual chart.",
    "Draws compound calculations locally with zero analytics tracking.",
    "Provides year-by-year breakdowns to analyze long-term returns."
  ];

  const faqs = [
    {
      question: "What is an SIP?",
      answer: "A Systematic Investment Plan (SIP) is an investment vehicle offered by mutual funds, allowing investors to invest small amounts periodically (monthly, quarterly) instead of a lump sum."
    },
    {
      question: "Are mutual fund returns guaranteed?",
      answer: "No. Mutual funds invest in equity and debt instruments subject to market risks. While historical long-term averages run between 12% to 15%, actual performance may vary."
    }
  ];

  const relatedTools = [
    { name: "EMI Calculator", url: "/emi-calculator", description: "Calculate monthly home or car loan installments." },
    { name: "Percentage Calculator", url: "/percent-calculator", description: "Solve discount rates and simple margins." }
  ];

  return (
    <ToolLayout
      title="SIP Calculator"
      description="Simulate Mutual Fund Systematic Investment Plans (SIP). Calculate compound future maturity values, estimated interest returns, and explore growth charts in your browser."
      category="Calculators & Converters"
      categoryUrl="/#calculators"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Inputs panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-6">
            
            {/* Monthly Invest */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Monthly Investment</label>
                <div className="text-sm font-mono font-bold text-accent">{formatCurrency(monthlyInvest)}</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlyInvest}
                  onChange={(e) => setMonthlyInvest(parseInt(e.target.value))}
                  className="flex-1 accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  value={monthlyInvest}
                  onChange={(e) => setMonthlyInvest(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 px-2 py-1 text-xs border border-border-color rounded bg-background text-primary-text font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Expected Returns */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Expected Return Rate (p.a. %)</label>
                <div className="text-sm font-mono font-bold text-accent">{returnRate}%</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={returnRate}
                  onChange={(e) => setReturnRate(parseFloat(e.target.value))}
                  className="flex-1 accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  step="0.1"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-24 px-2 py-1 text-xs border border-border-color rounded bg-background text-primary-text font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Time Period (Tenure)</label>
                <div className="text-sm font-mono font-bold text-accent">{years} Years</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={years}
                  onChange={(e) => setTenure(parseInt(e.target.value))}
                  className="flex-1 accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setTenure(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-2 py-1 text-xs border border-border-color rounded bg-background text-primary-text font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Results Display */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Coins className="h-4.5 w-4.5 text-accent" /> Projection Maturity
            </span>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary-text">Invested Value</span>
                <span className="font-mono font-bold text-primary-text">{formatCurrency(totalInvested)}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary-text">Wealth Gained</span>
                <span className="font-mono font-bold text-success">+{formatCurrency(estReturns)}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border-color text-sm">
                <span className="font-semibold text-primary-text">Maturity Wealth</span>
                <span className="font-mono font-bold text-accent text-base">{formatCurrency(maturityVal)}</span>
              </div>
            </div>

            <div className="bg-success/5 p-3 rounded-lg border border-success/15 text-[10px] text-success leading-relaxed flex gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>An investment of <strong>{formatCurrency(monthlyInvest)}</strong> monthly yields <strong>{formatCurrency(maturityVal)}</strong> in {years} years.</span>
            </div>
          </div>
        </div>

        {/* Chart and Table Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Custom SVG Growth Chart */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-accent" /> Compound Growth Chart
            </span>

            <div className="w-full overflow-x-auto flex justify-center py-2">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-125 h-auto select-none overflow-visible">
                {/* Background Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const yVal = paddingTop + ratio * graphHeight;
                  return (
                    <line
                      key={ratio}
                      x1={paddingLeft}
                      y1={yVal}
                      x2={chartWidth - paddingRight}
                      y2={yVal}
                      stroke="var(--border-color)"
                      strokeWidth="1"
                      strokeDasharray="4"
                      opacity="0.3"
                    />
                  );
                })}

                {/* Shaded Area Paths */}
                {totalAreaPath && (
                  <path d={totalAreaPath} fill="rgba(37, 99, 235, 0.08)" />
                )}
                {investedAreaPath && (
                  <path d={investedAreaPath} fill="rgba(34, 197, 94, 0.05)" />
                )}

                {/* Line Curves */}
                {totalPath && (
                  <path d={totalPath} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
                )}
                {investedPath && (
                  <path d={investedPath} fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" />
                )}

                {/* X Axis label coordinates */}
                {yearlyData.length > 0 && (
                  <>
                    <line x1={paddingLeft} y1={paddingTop + graphHeight} x2={chartWidth - paddingRight} y2={paddingTop + graphHeight} stroke="var(--border-color)" strokeWidth="1.5" />
                    {[0, Math.floor(yearlyData.length / 2), yearlyData.length - 1].map((idx) => {
                      const d = yearlyData[idx];
                      if (!d) return null;
                      const x = paddingLeft + (idx / (yearlyData.length - 1)) * graphWidth;
                      return (
                        <text
                          key={idx}
                          x={x}
                          y={chartHeight - 15}
                          textAnchor="middle"
                          fill="var(--secondary-text)"
                          className="text-[10px] font-semibold"
                        >
                          Yr {d.year}
                        </text>
                      );
                    })}
                  </>
                )}

                {/* Y Axis Values */}
                <text x={paddingLeft - 10} y={paddingTop + 4} textAnchor="end" fill="var(--secondary-text)" className="text-[9px] font-mono font-bold">
                  {formatCurrency(maxTotal)}
                </text>
                <text x={paddingLeft - 10} y={paddingTop + graphHeight} textAnchor="end" fill="var(--secondary-text)" className="text-[9px] font-mono font-bold">
                  ₹0
                </text>
              </svg>
            </div>

            <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-wider text-secondary-text pt-2">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 bg-success rounded-full" /> Invested Value
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 bg-accent rounded-full" /> Total Wealth
              </div>
            </div>
          </div>

          {/* Yearly Data Table */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Table className="h-4.5 w-4.5 text-success" /> Yearly Projections Table
            </span>

            <div className="max-h-55 overflow-y-auto border border-border-color/60 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-secondary-bg/40 border-b border-border-color">
                    <th className="p-2 font-bold text-secondary-text uppercase tracking-wider">Year</th>
                    <th className="p-2 font-bold text-secondary-text uppercase tracking-wider">Invested</th>
                    <th className="p-2 font-bold text-secondary-text uppercase tracking-wider">Est. Returns</th>
                    <th className="p-2 font-bold text-secondary-text uppercase tracking-wider">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/60 font-mono font-semibold">
                  {yearlyData.map((d) => (
                    <tr key={d.year} className="hover:bg-hover-bg/30">
                      <td className="p-2 font-bold">Yr {d.year}</td>
                      <td className="p-2 text-secondary-text">{formatCurrency(d.invested)}</td>
                      <td className="p-2 text-success">+{formatCurrency(d.returns)}</td>
                      <td className="p-2 text-accent font-bold">{formatCurrency(d.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
