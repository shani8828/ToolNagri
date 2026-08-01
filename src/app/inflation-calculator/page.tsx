"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Scale, Table, TrendingDown, Info, ArrowRight } from "lucide-react";

export default function InflationCalculator() {
  const [initialAmount, setInitialAmount] = useState<number>(10000);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [startYear, setStartYear] = useState<number>(2026);
  const [endYear, setEndYear] = useState<number>(2036);

  const [futureValue, setFutureValue] = useState<number>(0);
  const [buyingPower, setBuyingPower] = useState<number>(0);
  const [pctChange, setPctChange] = useState<number>(0);
  
  const [yearlyData, setYearlyData] = useState<{ year: number; adjusted: number; power: number; cumulative: number }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    if (endYear < startYear) {
      setError("End year must be greater than or equal to start year.");
      setFutureValue(0);
      setBuyingPower(0);
      setPctChange(0);
      setYearlyData([]);
      return;
    }

    const n = endYear - startYear;
    const rate = inflationRate / 100;
    
    // Future Value (equivalent value needed) = Initial * (1 + rate)^n
    const fv = initialAmount * Math.pow(1 + rate, n);
    // Real Buying Power (depreciated value) = Initial / (1 + rate)^n
    const bp = initialAmount / Math.pow(1 + rate, n);
    // Cumulative Inflation % = ((fv - Initial) / Initial) * 100
    const pct = ((fv - initialAmount) / initialAmount) * 100;

    setFutureValue(Math.round(fv));
    setBuyingPower(Math.round(bp));
    setPctChange(Math.round(pct));

    // Generate yearly data
    const data = [];
    for (let y = 0; y <= n; y++) {
      const yrFv = initialAmount * Math.pow(1 + rate, y);
      const yrBp = initialAmount / Math.pow(1 + rate, y);
      const yrCum = ((yrFv - initialAmount) / initialAmount) * 100;

      data.push({
        year: startYear + y,
        adjusted: Math.round(yrFv),
        power: Math.round(yrBp),
        cumulative: Math.round(yrCum)
      });
    }
    setYearlyData(data);
  }, [initialAmount, inflationRate, startYear, endYear]);

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

  const maxAdjusted = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].adjusted : 1;

  const getSvgCoordinates = () => {
    if (yearlyData.length === 0) return { adjustedPath: "", powerPath: "", adjustedArea: "", powerArea: "" };

    const adjustedPoints = yearlyData.map((d, index) => {
      const x = paddingLeft + (index / (yearlyData.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - (d.adjusted / maxAdjusted) * graphHeight;
      return { x, y };
    });

    const powerPoints = yearlyData.map((d, index) => {
      const x = paddingLeft + (index / (yearlyData.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - (d.power / maxAdjusted) * graphHeight;
      return { x, y };
    });

    const adjustedPath = adjustedPoints.reduce((acc, p, idx) => {
      return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }, "");

    const powerPath = powerPoints.reduce((acc, p, idx) => {
      return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }, "");

    const adjustedArea = adjustedPath + ` L ${adjustedPoints[adjustedPoints.length - 1].x} ${paddingTop + graphHeight} L ${adjustedPoints[0].x} ${paddingTop + graphHeight} Z`;
    const powerArea = powerPath + ` L ${powerPoints[powerPoints.length - 1].x} ${paddingTop + graphHeight} L ${powerPoints[0].x} ${paddingTop + graphHeight} Z`;

    return { adjustedPath, powerPath, adjustedArea, powerArea };
  };

  const { adjustedPath, powerPath, adjustedArea, powerArea } = getSvgCoordinates();

  const howToUse = [
    "Enter the Initial Cash Amount to analyze buying power changes.",
    "Input your Start Year and End Year timeline parameters.",
    "Adjust the Average Annual Inflation Rate (%) (default is 6%).",
    "Examine metrics detailing equivalent value required and buying power decay.",
    "Inspect the SVG Decay Chart showing purchasing power depreciation over time."
  ];

  const benefits = [
    "Computes purchasing power depreciation over historical and future terms.",
    "Includes customized SVG charts rendering growth vs decay paths.",
    "Outputs detailed yearly compound rate tables completely client-side.",
    "Runs 100% locally with zero metrics storage or tracking."
  ];

  const faqs = [
    {
      question: "What is purchasing power?",
      answer: "Purchasing power is the value of a currency expressed in terms of the amount of goods or services that one unit of money can buy. Inflation systematically decreases purchasing power over time."
    },
    {
      question: "How is compound inflation calculated?",
      answer: "Inflation compounds annually. If the inflation rate is 6%, then $100 grows in cost to $106 after year 1, and $112.36 after year 2 ($106 * 1.06), which is faster than simple linear addition."
    }
  ];

  const relatedTools = [
    { name: "EMI Calculator", url: "/emi-calculator", description: "Calculate monthly home loan installments." },
    { name: "SIP Calculator", url: "/sip-calculator", description: "Simulate systematic investments." }
  ];

  return (
    <ToolLayout
      title="Inflation Calculator"
      description="Calculate historical currency values and loss of purchasing power over time. Predict future asset values and compounding inflation averages client-side."
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
            
            {/* Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Initial Cash Value</label>
                <div className="text-sm font-mono font-bold text-accent">{formatCurrency(initialAmount)}</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1000"
                  max="1000000"
                  step="5000"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(parseInt(e.target.value))}
                  className="flex-1 accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 px-2 py-1 text-xs border border-border-color rounded bg-background text-primary-text font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Inflation Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Average Annual Inflation Rate (%)</label>
                <div className="text-sm font-mono font-bold text-accent">{inflationRate}%</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="25"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className="flex-1 accent-accent h-1.5 bg-border-color rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-24 px-2 py-1 text-xs border border-border-color rounded bg-background text-primary-text font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Start and End Years */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Start Year</label>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(parseInt(e.target.value) || new Date().getFullYear())}
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">End Year</label>
                <input
                  type="number"
                  value={endYear}
                  onChange={(e) => setEndYear(parseInt(e.target.value) || new Date().getFullYear() + 10)}
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Results Display */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Scale className="h-4.5 w-4.5 text-accent" /> Purchasing Power Results
            </span>

            {error ? (
              <div className="text-xs text-warning leading-relaxed p-4 text-center">
                {error}
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-secondary-text">Equivalent Cash Required</span>
                  <span className="font-mono font-bold text-primary-text">{formatCurrency(futureValue)}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-secondary-text">Real Buying Power</span>
                  <span className="font-mono font-bold text-warning">{formatCurrency(buyingPower)}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-border-color text-sm">
                  <span className="font-semibold text-primary-text">Cumulative Inflation</span>
                  <span className="font-mono font-bold text-accent text-base">+{pctChange}%</span>
                </div>
              </div>
            )}

            <div className="bg-warning/5 p-3 rounded-lg border border-warning/15 text-[10px] text-warning leading-relaxed flex gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Due to compound rates, <strong>{formatCurrency(initialAmount)}</strong> in {startYear} has the buying power of only <strong>{formatCurrency(buyingPower)}</strong> in {endYear}.</span>
            </div>
          </div>
        </div>

        {/* Chart and Table Breakdown */}
        {!error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Custom SVG Decay Chart */}
            <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <TrendingDown className="h-4.5 w-4.5 text-warning" /> Buying Power Decay Chart
              </span>

              <div className="w-full overflow-x-auto flex justify-center py-2">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-125 h-auto select-none overflow-visible">
                  {/* Grid Lines */}
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

                  {/* Shaded Areas */}
                  {adjustedArea && (
                    <path d={adjustedArea} fill="rgba(37, 99, 235, 0.05)" />
                  )}
                  {powerArea && (
                    <path d={powerArea} fill="rgba(245, 158, 11, 0.05)" />
                  )}

                  {/* Curves */}
                  {adjustedPath && (
                    <path d={adjustedPath} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
                  )}
                  {powerPath && (
                    <path d={powerPath} fill="none" stroke="var(--warning)" strokeWidth="2.5" strokeLinecap="round" />
                  )}

                  {/* X Axis */}
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
                            {d.year}
                          </text>
                        );
                      })}
                    </>
                  )}

                  {/* Y Axis labels */}
                  <text x={paddingLeft - 10} y={paddingTop + 4} textAnchor="end" fill="var(--secondary-text)" className="text-[9px] font-mono font-bold">
                    {formatCurrency(maxAdjusted)}
                  </text>
                  <text x={paddingLeft - 10} y={paddingTop + graphHeight} textAnchor="end" fill="var(--secondary-text)" className="text-[9px] font-mono font-bold">
                    ₹0
                  </text>
                </svg>
              </div>

              <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-wider text-secondary-text pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 bg-warning rounded-full" /> Buying Power (Decaying)
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 bg-accent rounded-full" /> Equivalent Needed (Growing)
                </div>
              </div>
            </div>

            {/* Yearly Table breakdown */}
            <div className="border border-border-color rounded-2xl p-5 bg-card-bg space-y-3">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Table className="h-4.5 w-4.5 text-accent" /> Yearly Inflation Table
              </span>

              <div className="max-h-55 overflow-y-auto border border-border-color/60 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-secondary-bg/40 border-b border-border-color">
                      <th className="p-2 font-bold text-secondary-text uppercase tracking-wider">Year</th>
                      <th className="p-2 font-bold text-secondary-text uppercase tracking-wider">Buying Power</th>
                      <th className="p-2 font-bold text-secondary-text uppercase tracking-wider">Equiv. Needed</th>
                      <th className="p-2 font-bold text-secondary-text uppercase tracking-wider">Cum. Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color/60 font-mono font-semibold">
                    {yearlyData.map((d) => (
                      <tr key={d.year} className="hover:bg-hover-bg/30">
                        <td className="p-2 font-bold">{d.year}</td>
                        <td className="p-2 text-warning">{formatCurrency(d.power)}</td>
                        <td className="p-2 text-primary-text">{formatCurrency(d.adjusted)}</td>
                        <td className="p-2 text-accent font-bold">+{d.cumulative}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </ToolLayout>
  );
}
