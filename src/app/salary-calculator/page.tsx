"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Coins, RefreshCw, Eye, Percent, Table, Landmark } from "lucide-react";
import confetti from "canvas-confetti";

interface PayPeriodBreakdown {
  label: string;
  gross: number;
  pretax: number;
  taxes: number;
  net: number;
}

export default function SalaryCalculator() {
  const [grossSalary, setGrossSalary] = useState<number>(75000);
  const [payFrequency, setPayFrequency] = useState<"monthly" | "biweekly" | "weekly">("monthly");
  
  const [retirementPercent, setRetirementPercent] = useState<number>(6); // 401k
  const [healthInsurance, setHealthInsurance] = useState<number>(150); // Monthly insurance
  
  const [stateTaxRate, setStateTaxRate] = useState<number>(4.5); // state tax %
  const [hasStandardDeduction, setHasStandardDeduction] = useState(true);

  // Calculated metrics
  const [federalTax, setFederalTax] = useState<number>(0);
  const [stateTax, setStateTax] = useState<number>(0);
  const [ficaTax, setFicaTax] = useState<number>(0);
  const [pretaxDeductions, setPretaxDeductions] = useState<number>(0);
  const [netTakeHome, setNetTakeHome] = useState<number>(0);
  
  const [periodBreakdown, setPeriodBreakdown] = useState<PayPeriodBreakdown[]>([]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  const calculateTaxes = () => {
    // 1. Calculate Pretax Deductions
    const annualRetirement = grossSalary * (retirementPercent / 100);
    const annualHealth = healthInsurance * 12;
    const totalPretax = annualRetirement + annualHealth;
    setPretaxDeductions(totalPretax);

    // Remaining taxable salary before deductions
    const adjustedGross = Math.max(0, grossSalary - totalPretax);

    // 2. Standard Deduction (US Single Filer 2024 value)
    const deduction = hasStandardDeduction ? 14600 : 0;
    const taxableIncome = Math.max(0, adjustedGross - deduction);

    // 3. Federal Income Tax Brackets (Simplified US Single Filer 2024)
    const brackets = [
      { limit: 11600, rate: 0.10 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ];

    let fedTax = 0;
    let previousLimit = 0;

    for (let i = 0; i < brackets.length; i++) {
      const { limit, rate } = brackets[i];
      if (taxableIncome > limit) {
        fedTax += (limit - previousLimit) * rate;
        previousLimit = limit;
      } else {
        fedTax += (taxableIncome - previousLimit) * rate;
        break;
      }
    }
    setFederalTax(Math.round(fedTax));

    // 4. State Tax Calculation
    const stateTaxValue = taxableIncome * (stateTaxRate / 100);
    setStateTax(Math.round(stateTaxValue));

    // 5. FICA Payroll Taxes (Social Security 6.2% up to $168,600 + Medicare 1.45% flat)
    const ssTaxable = Math.min(adjustedGross, 168600);
    const socialSecurity = ssTaxable * 0.062;
    const medicare = adjustedGross * 0.0145;
    const fica = socialSecurity + medicare;
    setFicaTax(Math.round(fica));

    // 6. Net Take Home
    const net = Math.max(0, grossSalary - totalPretax - fedTax - stateTaxValue - fica);
    setNetTakeHome(Math.round(net));

    // Calculate periods
    const frequencies = [
      { label: "Annual Pay", divisor: 1 },
      { label: "Monthly Pay Check", divisor: 12 },
      { label: "Bi-Weekly Pay Check", divisor: 26 },
      { label: "Weekly Pay Check", divisor: 52 }
    ];

    const breakdownList = frequencies.map((freq) => {
      return {
        label: freq.label,
        gross: Math.round(grossSalary / freq.divisor),
        pretax: Math.round(totalPretax / freq.divisor),
        taxes: Math.round((fedTax + stateTaxValue + fica) / freq.divisor),
        net: Math.round(net / freq.divisor)
      };
    });

    setPeriodBreakdown(breakdownList);
  };

  useEffect(() => {
    calculateTaxes();
  }, [grossSalary, payFrequency, retirementPercent, healthInsurance, stateTaxRate, hasStandardDeduction]);

  const handleCalculateClick = () => {
    calculateTaxes();
    confetti({
      particleCount: 15,
      spread: 20,
      origin: { y: 0.8 },
      colors: ["#10b981", "#3b82f6"],
    });
  };

  const handleReset = () => {
    setGrossSalary(75000);
    setPayFrequency("monthly");
    setRetirementPercent(6);
    setHealthInsurance(150);
    setStateTaxRate(4.5);
    setHasStandardDeduction(true);
  };

  // Pie chart parameters
  const totalDeductions = federalTax + stateTax + ficaTax + pretaxDeductions;
  const netPercent = grossSalary > 0 ? (netTakeHome / grossSalary) * 100 : 0;
  const fedPercent = grossSalary > 0 ? (federalTax / grossSalary) * 100 : 0;
  const statePercent = grossSalary > 0 ? (stateTax / grossSalary) * 100 : 0;
  const ficaPercent = grossSalary > 0 ? (ficaTax / grossSalary) * 100 : 0;
  const pretaxPercent = grossSalary > 0 ? (pretaxDeductions / grossSalary) * 100 : 0;

  // Concentric circle SVG values
  const size = 180;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Accumulated dash offsets
  const pretaxOffset = circumference * (1 - pretaxPercent / 100);
  const ficaOffset = circumference * (1 - ficaPercent / 100);
  const stateOffset = circumference * (1 - statePercent / 100);
  const fedOffset = circumference * (1 - fedPercent / 100);
  const netOffset = circumference * (1 - netPercent / 100);

  const howToUse = [
    "Enter your gross Annual Salary (before taxes or insurance deductions).",
    "Set payroll frequencies (Monthly, Bi-weekly, or Weekly schedules).",
    "Specify pre-tax contributions (401k percentage and health insurance costs).",
    "Select local State tax rates and check standard deduction rules.",
    "Inspect take-home pay check numbers and visual donut charts."
  ];

  const benefits = [
    "Calculates multi-bracket Federal and customizable State income taxes.",
    "Includes pre-tax retirement 401k and health care deductions.",
    "Computes social security and Medicare FICA payroll tax ratios.",
    "100% Client-Side calculation operates securely offline."
  ];

  const faqs = [
    {
      question: "What is FICA tax?",
      answer: "FICA stands for Federal Insurance Contributions Act. It consists of a 6.2% Social Security tax (capped up to a maximum wage limit) and a 1.45% Medicare tax, both deducted directly from payroll."
    },
    {
      question: "What are pre-tax deductions?",
      answer: "Pre-tax deductions (like 401k savings or medical insurance) are subtracted from your gross salary before income taxes are calculated, lowering your overall taxable income."
    }
  ];

  const relatedTools = [
    { name: "EMI Calculator", url: "/emi-calculator", description: "Calculate monthly loan interest repayments." },
    { name: "Inflation Calculator", url: "/inflation-calculator", description: "Compute historical currency values." }
  ];

  return (
    <ToolLayout
      title="Salary & Take-Home Calculator"
      description="Estimate net take-home pay check amounts. Calculate federal income tax tiers, FICA deductions, state taxes, and view SVG breakdown donut charts."
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
              <Landmark className="h-4 w-4 text-accent" /> Tax & Income Settings
            </span>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Gross Annual Salary ($)</label>
                <input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Preferred Pay Frequency</label>
                <select
                  value={payFrequency}
                  onChange={(e) => setPayFrequency(e.target.value as any)}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none cursor-pointer"
                >
                  <option value="monthly">Monthly (12 checks)</option>
                  <option value="biweekly">Bi-Weekly (26 checks)</option>
                  <option value="weekly">Weekly (52 checks)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">401k Contribution (%)</label>
                <input
                  type="number"
                  value={retirementPercent}
                  onChange={(e) => setRetirementPercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">Health Insurance Premium ($/Month)</label>
                <input
                  type="number"
                  value={healthInsurance}
                  onChange={(e) => setHealthInsurance(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary-text font-semibold">State Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={stateTaxRate}
                  onChange={(e) => setStateTaxRate(Math.max(0, Math.min(50, parseFloat(e.target.value) || 0)))}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-primary-text font-bold focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-1.5 font-semibold text-secondary-text hover:text-primary-text cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasStandardDeduction}
                    onChange={(e) => setHasStandardDeduction(e.target.checked)}
                    className="accent-accent h-3.5 w-3.5"
                  />
                  Apply Standard Deduction ($14,600)
                </label>
              </div>

            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleCalculateClick}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Compute Take-Home Pay
              </button>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-75">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-success" /> Salary Breakdown
              </span>

              <div className="space-y-3.5">
                <div>
                  <p className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Net Annual Take-Home</p>
                  <p className="text-2xl font-black text-success">{formatCurrency(netTakeHome)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-border-color/60 pt-3 text-[10px] font-bold text-secondary-text">
                  <div>
                    <p className="uppercase tracking-wider">Federal Income Tax</p>
                    <p className="text-xs font-semibold text-primary-text">{formatCurrency(federalTax)}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wider">State Tax</p>
                    <p className="text-xs font-semibold text-primary-text">{formatCurrency(stateTax)}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wider">FICA Payroll Taxes</p>
                    <p className="text-xs font-semibold text-primary-text">{formatCurrency(ficaTax)}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wider">Pre-tax Deductions</p>
                    <p className="text-xs font-semibold text-primary-text">{formatCurrency(pretaxDeductions)}</p>
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

        {/* SVG Donut Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border border-border-color rounded-2xl p-5 bg-card-bg">
          
          <div className="space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-accent animate-pulse" /> Income Allocation Ring
            </span>
            <div className="flex justify-center">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
                {/* Background Ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="var(--border-color, #e5e7eb)"
                  strokeWidth={strokeWidth}
                />
                
                {/* Pretax deductions Ring */}
                {pretaxPercent > 0 && (
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={pretaxOffset}
                    transform={`rotate(-90 ${center} ${center})`}
                    strokeLinecap="round"
                  />
                )}

                {/* FICA Ring */}
                {ficaPercent > 0 && (
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={ficaOffset}
                    transform={`rotate(${(-90 + pretaxPercent * 3.6)} ${center} ${center})`}
                    strokeLinecap="round"
                  />
                )}

                {/* State Tax Ring */}
                {statePercent > 0 && (
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="#ea580c"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={stateOffset}
                    transform={`rotate(${(-90 + (pretaxPercent + ficaPercent) * 3.6)} ${center} ${center})`}
                    strokeLinecap="round"
                  />
                )}

                {/* Federal Tax Ring */}
                {fedPercent > 0 && (
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={fedOffset}
                    transform={`rotate(${(-90 + (pretaxPercent + ficaPercent + statePercent) * 3.6)} ${center} ${center})`}
                    strokeLinecap="round"
                  />
                )}

                {/* Net Income Ring */}
                {netPercent > 0 && (
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={netOffset}
                    transform={`rotate(${(-90 + (pretaxPercent + ficaPercent + statePercent + fedPercent) * 3.6)} ${center} ${center})`}
                    strokeLinecap="round"
                  />
                )}

                {/* Center text */}
                <text
                  x={center}
                  y={center - 2}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="black"
                  fill="var(--primary-text, #111827)"
                >
                  Take-Home
                </text>
                <text
                  x={center}
                  y={center + 12}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#10b981"
                >
                  {netPercent.toFixed(1)}%
                </text>
              </svg>
            </div>
          </div>

          {/* Chart Legend list */}
          <div className="space-y-2 text-[10px] font-bold text-secondary-text">
            <div className="flex items-center justify-between pb-1.5 border-b border-border-color/60">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#10b981] rounded" /> Net Take-Home Pay</span>
              <span className="text-success">{netPercent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between pb-1.5 border-b border-border-color/60">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#ef4444] rounded" /> Federal Income Tax</span>
              <span className="text-primary-text">{fedPercent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between pb-1.5 border-b border-border-color/60">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#ea580c] rounded" /> State Income Tax</span>
              <span className="text-primary-text">{statePercent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between pb-1.5 border-b border-border-color/60">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#f59e0b] rounded" /> FICA Payroll Tax</span>
              <span className="text-primary-text">{ficaPercent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between pb-1.5 border-b border-border-color/60">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#3b82f6] rounded" /> Pre-Tax Deductions</span>
              <span className="text-primary-text">{pretaxPercent.toFixed(1)}%</span>
            </div>
          </div>

        </div>

        {/* Period Breakdown Table */}
        {periodBreakdown.length > 0 && (
          <div className="border border-border-color rounded-2xl overflow-hidden bg-card-bg">
            <div className="bg-secondary-bg/25 px-4 py-3 border-b border-border-color flex justify-between items-center">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
                <Table className="h-4 w-4 text-accent" /> Pay Check Frequency Estimations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left divide-y divide-border-color">
                <thead className="bg-secondary-bg/10 text-secondary-text uppercase font-bold text-[9px] tracking-wider select-none">
                  <tr>
                    <th className="py-2.5 px-4">Pay Period</th>
                    <th className="py-2.5 px-4">Gross Income</th>
                    <th className="py-2.5 px-4">Pre-tax Deduct.</th>
                    <th className="py-2.5 px-4">Taxes Withheld</th>
                    <th className="py-2.5 px-4">Net Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/60 font-medium text-primary-text">
                  {periodBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-hover-bg/30 transition-colors">
                      <td className="py-2 px-4 font-bold">{row.label}</td>
                      <td className="py-2 px-4">{formatCurrency(row.gross)}</td>
                      <td className="py-2 px-4">{formatCurrency(row.pretax)}</td>
                      <td className="py-2 px-4 text-warning">{formatCurrency(row.taxes)}</td>
                      <td className="py-2 px-4 font-bold text-success">{formatCurrency(row.net)}</td>
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
