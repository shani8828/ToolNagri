"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { DollarSign, Landmark, Percent, Calendar, RefreshCw } from "lucide-react";

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000); // Default 10 Lakhs or 1 Million
  const [interestRate, setInterestRate] = useState(8.5); // Default 8.5%
  const [tenure, setTenure] = useState(20); // Default 20 Years
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  // Output states
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [interestRatio, setInterestRatio] = useState(0); // For visual bar

  useEffect(() => {
    const principal = loanAmount;
    const annualRate = interestRate;
    
    // Total months
    const totalMonths = tenureType === "years" ? tenure * 12 : tenure;
    
    if (principal <= 0 || annualRate <= 0 || totalMonths <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment( principal );
      setInterestRatio(0);
      return;
    }

    // Monthly interest rate
    const r = annualRate / 12 / 100;
    
    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emiVal = (principal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
    
    const paymentTotal = emiVal * totalMonths;
    const interestTotal = paymentTotal - principal;

    setEmi(Math.round(emiVal));
    setTotalInterest(Math.round(interestTotal));
    setTotalPayment(Math.round(paymentTotal));

    const ratio = (interestTotal / paymentTotal) * 100;
    setInterestRatio(ratio);

  }, [loanAmount, interestRate, tenure, tenureType]);

  const handleReset = () => {
    setLoanAmount(1000000);
    setInterestRate(8.5);
    setTenure(20);
    setTenureType("years");
  };

  const howToUse = [
    "Enter or slide the Loan Amount (Principal) you wish to borrow.",
    "Adjust the Interest Rate percentage (annual interest charge).",
    "Enter the Tenure (loan duration) and choose between Years or Months.",
    "Review your calculated Monthly EMI, Total Interest, and Cumulative Cost instantly.",
    "Observe the visual ratio bar to audit what percentage of payments cover interest vs principal."
  ];

  const benefits = [
    "Accurately estimates monthly budgeting commitments before borrowing.",
    "Real-time slider support provides fluid calculations.",
    "Shows principal vs interest ratio visualizers to audit actual borrowing markup.",
    "100% Client-Side calculations run private configurations locally."
  ];

  const faqs = [
    {
      question: "What is an EMI?",
      answer: "EMI stands for Equated Monthly Installment. It is the fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs consist of both principal repayment and interest charges."
    },
    {
      question: "How does loan tenure affect my total interest?",
      answer: "Shorter tenures lead to higher monthly EMIs but significantly lower overall interest charges. Longer tenures lower monthly payments but accumulate much higher total interest costs over the life of the loan."
    },
    {
      question: "Can I use this for home, car, or personal loans?",
      answer: "Yes. Amortization formulas are standardized across banking institutes, meaning this tool is valid for home mortgages, auto loans, student loans, and personal lending."
    }
  ];

  const relatedTools = [
    {
      name: "Age Calculator",
      url: "/age-calculator",
      description: "Determine exact age in years, months, weeks, days, and minutes."
    },
    {
      name: "Free URL Shortener",
      url: "/url-shortener",
      description: "Shorten links, generate QR codes, and view analytics parameters."
    },
    {
      name: "UTM Campaign URL Builder",
      url: "/utm-builder",
      description: "Quickly build UTM marketing campaign tags to append to your landing page URLs."
    }
  ];

  return (
    <ToolLayout
      title="Loan EMI Calculator"
      description="Calculate monthly equated installments (EMI) for home, car, or personal loans. Customise principal amounts, rates, and duration to review payment amortization ratios."
      category="Calculators"
      categoryUrl="/#calculators"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders and Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-primary-text">
              <label htmlFor="amount">Loan Amount (Principal)</label>
              <div className="flex items-center border border-border-color rounded-lg bg-background px-2.5 py-1">
                <span className="text-secondary-text text-xs mr-1">$</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-24 text-right bg-transparent text-sm focus:outline-none font-bold"
                />
              </div>
            </div>
            <input
              type="range"
              min={10000}
              max={10000000}
              step={10000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xxs text-secondary-text font-semibold uppercase">
              <span>$10,000</span>
              <span>$50L / $5M</span>
              <span>$10,000,000</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-primary-text">
              <label htmlFor="rate">Interest Rate (% P.A.)</label>
              <div className="flex items-center border border-border-color rounded-lg bg-background px-2 py-1">
                <input
                  type="number"
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-16 text-right bg-transparent text-sm focus:outline-none font-bold"
                />
                <span className="text-secondary-text text-xs ml-1">%</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xxs text-secondary-text font-semibold uppercase">
              <span>1%</span>
              <span>12.5%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-primary-text">
              <label htmlFor="tenure">Loan Tenure</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-16 border border-border-color rounded-lg px-2.5 py-1 text-right text-sm font-bold focus:outline-none focus:border-accent"
                />
                <select
                  value={tenureType}
                  onChange={(e) => {
                    setTenureType(e.target.value as "years" | "months");
                    setTenure(e.target.value === "years" ? 20 : 240);
                  }}
                  className="border border-border-color rounded-lg bg-background px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-accent"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={tenureType === "years" ? 40 : 480}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xxs text-secondary-text font-semibold uppercase">
              <span>1 {tenureType}</span>
              <span>{tenureType === "years" ? "20 Yrs" : "240 Mos"}</span>
              <span>{tenureType === "years" ? "40 Yrs" : "480 Mos"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-color hover:bg-hover-bg py-2.5 text-xs font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset Calculator
          </button>
        </div>

        {/* Repayment Breakdown Panel */}
        <div className="lg:col-span-5 border border-border-color rounded-2xl p-6 bg-secondary-bg/50 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1">
              <Landmark className="h-3.5 w-3.5" /> Amortization Summary
            </span>

            {/* Calculated EMI Display */}
            <div className="bg-white rounded-xl border border-border-color p-5 text-center space-y-1 shadow-sm">
              <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
                Monthly Loan EMI
              </span>
              <p className="text-3xl font-heading font-extrabold text-accent">
                ${emi.toLocaleString()}
              </p>
            </div>

            {/* Breakdown numbers */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-text flex items-center gap-1">
                  <DollarSign className="h-4 w-4" /> Principal Amount
                </span>
                <span className="font-semibold text-primary-text">${loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-text flex items-center gap-1">
                  <Percent className="h-4 w-4 text-warning" /> Total Interest
                </span>
                <span className="font-semibold text-primary-text">${totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-border-color/60 pt-3">
                <span className="text-primary-text font-bold flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-success" /> Total Payments
                </span>
                <span className="font-extrabold text-primary-text">${totalPayment.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Visual Percentage Breakdown Bar */}
          {totalPayment > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-xxs font-semibold uppercase text-secondary-text">
                <span>Principal ({Math.round(100 - interestRatio)}%)</span>
                <span>Interest ({Math.round(interestRatio)}%)</span>
              </div>
              <div className="h-3 w-full bg-warning rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${100 - interestRatio}%` }}
                />
                <div
                  className="h-full bg-warning transition-all duration-300"
                  style={{ width: `${interestRatio}%` }}
                />
              </div>
              <p className="text-xxs text-secondary-text leading-relaxed text-center">
                A larger blue segment indicates a higher share of payments covering the actual borrowing principal.
              </p>
            </div>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
