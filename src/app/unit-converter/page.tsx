"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { ArrowLeftRight, RefreshCw, Scale } from "lucide-react";

type Category = "Length" | "Weight" | "Temperature" | "Area" | "Speed";

interface Unit {
  value: string;
  label: string;
  baseRatio?: number; // relative to a base unit in that category
}

const UNITS: Record<Category, Unit[]> = {
  Length: [
    { value: "m", label: "Meter (m)", baseRatio: 1 },
    { value: "km", label: "Kilometer (km)", baseRatio: 1000 },
    { value: "cm", label: "Centimeter (cm)", baseRatio: 0.01 },
    { value: "mm", label: "Millimeter (mm)", baseRatio: 0.001 },
    { value: "mi", label: "Mile (mi)", baseRatio: 1609.34 },
    { value: "yd", label: "Yard (yd)", baseRatio: 0.9144 },
    { value: "ft", label: "Foot (ft)", baseRatio: 0.3048 },
    { value: "in", label: "Inch (in)", baseRatio: 0.0254 },
  ],
  Weight: [
    { value: "kg", label: "Kilogram (kg)", baseRatio: 1 },
    { value: "g", label: "Gram (g)", baseRatio: 0.001 },
    { value: "mg", label: "Milligram (mg)", baseRatio: 0.000001 },
    { value: "lb", label: "Pound (lb)", baseRatio: 0.45359237 },
    { value: "oz", label: "Ounce (oz)", baseRatio: 0.02834952 },
  ],
  Temperature: [
    { value: "c", label: "Celsius (°C)" },
    { value: "f", label: "Fahrenheit (°F)" },
    { value: "k", label: "Kelvin (K)" },
  ],
  Area: [
    { value: "m2", label: "Square Meter (m²)", baseRatio: 1 },
    { value: "km2", label: "Square Kilometer (km²)", baseRatio: 1000000 },
    { value: "mi2", label: "Square Mile (mi²)", baseRatio: 2589988.11 },
    { value: "ac", label: "Acre (ac)", baseRatio: 4046.8564 },
    { value: "ha", label: "Hectare (ha)", baseRatio: 10000 },
  ],
  Speed: [
    { value: "ms", label: "Meters/Second (m/s)", baseRatio: 1 },
    { value: "kmh", label: "Kilometers/Hour (km/h)", baseRatio: 1 / 3.6 },
    { value: "mph", label: "Miles/Hour (mph)", baseRatio: 0.44704 },
    { value: "kt", label: "Knot (kt)", baseRatio: 0.514444 },
  ],
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("Length");
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [result, setResult] = useState<number>(0);
  const [allConversions, setAllConversions] = useState<{ label: string; value: string }[]>([]);

  // Update default units when category changes
  useEffect(() => {
    const list = UNITS[category];
    setFromUnit(list[0].value);
    setToUnit(list[1]?.value || list[0].value);
    setInputValue(1);
  }, [category]);

  // Perform calculation
  useEffect(() => {
    const fromVal = inputValue;
    if (isNaN(fromVal)) {
      setResult(0);
      setAllConversions([]);
      return;
    }

    const currentUnits = UNITS[category];
    const fromUnitObj = currentUnits.find((u) => u.value === fromUnit);
    const toUnitObj = currentUnits.find((u) => u.value === toUnit);

    if (!fromUnitObj || !toUnitObj) return;

    let computedResult = 0;

    // Special handling for Temperature
    if (category === "Temperature") {
      if (fromUnit === toUnit) {
        computedResult = fromVal;
      } else if (fromUnit === "c") {
        computedResult = toUnit === "f" ? (fromVal * 9) / 5 + 32 : fromVal + 273.15;
      } else if (fromUnit === "f") {
        computedResult = toUnit === "c" ? ((fromVal - 32) * 5) / 9 : ((fromVal - 32) * 5) / 9 + 273.15;
      } else if (fromUnit === "k") {
        computedResult = toUnit === "c" ? fromVal - 273.15 : ((fromVal - 273.15) * 9) / 5 + 32;
      }
      setResult(Number(computedResult.toFixed(4)));

      // General conversions list for temperature
      const convs = currentUnits
        .filter((u) => u.value !== fromUnit)
        .map((u) => {
          let val = 0;
          if (fromUnit === "c") {
            val = u.value === "f" ? (fromVal * 9) / 5 + 32 : fromVal + 273.15;
          } else if (fromUnit === "f") {
            val = u.value === "c" ? ((fromVal - 32) * 5) / 9 : ((fromVal - 32) * 5) / 9 + 273.15;
          } else if (fromUnit === "k") {
            val = u.value === "c" ? fromVal - 273.15 : ((fromVal - 273.15) * 9) / 5 + 32;
          }
          return { label: u.label, value: val.toFixed(4) };
        });
      setAllConversions(convs);

    } else {
      // Metric conversion ratio check
      if (fromUnitObj.baseRatio && toUnitObj.baseRatio) {
        const baseValue = fromVal * fromUnitObj.baseRatio;
        computedResult = baseValue / toUnitObj.baseRatio;
        setResult(Number(computedResult.toPrecision(6)));

        // General conversion compilation
        const convs = currentUnits
          .filter((u) => u.value !== fromUnit)
          .map((u) => {
            const val = (fromVal * fromUnitObj.baseRatio!) / u.baseRatio!;
            return {
              label: u.label,
              value: Number(val.toPrecision(6)).toString(),
            };
          });
        setAllConversions(convs);
      }
    }
  }, [category, inputValue, fromUnit, toUnit]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleReset = () => {
    setInputValue(1);
    const list = UNITS[category];
    setFromUnit(list[0].value);
    setToUnit(list[1]?.value || list[0].value);
  };

  const howToUse = [
    "Select the Measurement Category (Length, Weight, Temperature, Area, or Speed) from the tab bar.",
    "Type the numerical value you wish to convert in the Source input field.",
    "Choose your base unit (From) and target unit (To) from the drop-down selectors.",
    "Observe the converted outcome instantly in the target box.",
    "Inspect the side grid to view what your input equals across all other metrics in the category."
  ];

  const benefits = [
    "Comprehensive metrics support for imperial and metric conversions.",
    "Live real-time updates as you type or change units.",
    "Client-side conversion calculations ensure speed and data protection.",
    "Side-grid shows multiple conversions at once."
  ];

  const faqs = [
    {
      question: "How accurate are these conversions?",
      answer: "All conversion ratios are mapped according to standard scientific coefficients and displayed up to 6 significant digits."
    },
    {
      question: "Does the temperature converter support Kelvin?",
      answer: "Yes, you can convert seamlessly between Celsius, Fahrenheit, and Kelvin temperature scales."
    },
    {
      question: "Why are my inputs resetting when categories change?",
      answer: "Since unit baselines (like meters vs kilograms) differ structurally, inputs reset to default metrics to ensure a valid starting calculation."
    }
  ];

  const relatedTools = [
    {
      name: "Loan EMI Calculator",
      url: "/emi-calculator",
      description: "Calculate monthly loan EMIs, interest payable, and total costs."
    },
    {
      name: "Time zone Converter",
      url: "/timezone-converter",
      description: "Compare and translate dates and times across major global timezones."
    },
    {
      name: "Age Calculator",
      url: "/age-calculator",
      description: "Determine exact age in years, months, weeks, days, and minutes."
    }
  ];

  return (
    <ToolLayout
      title="Multi-Unit Converter"
      description="Convert measurement standards across Length, Weight, Temperature, Area, and Speed. Enter values, swap categories, and review parallel conversions client-side."
      category="Utility Tools"
      categoryUrl="/#utility"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-border-color pb-4 justify-center md:justify-start">
          {(Object.keys(UNITS) as Category[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                category === cat
                  ? "bg-accent text-white shadow-sm"
                  : "border border-border-color bg-background text-secondary-text hover:bg-hover-bg hover:text-primary-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Input Interface Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Fields */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* From Unit */}
              <div className="space-y-2">
                <label htmlFor="fromVal" className="block text-sm font-semibold text-primary-text">
                  Source Value
                </label>
                <input
                  type="number"
                  id="fromVal"
                  value={inputValue}
                  onChange={(e) => setInputValue(Number(e.target.value))}
                  placeholder="Enter number..."
                  className="block w-full rounded-lg border border-border-color px-4 py-2.5 text-sm text-primary-text placeholder-secondary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="block w-full rounded-lg border border-border-color px-3 py-2 bg-background text-xs font-medium text-primary-text focus:border-accent focus:outline-none"
                >
                  {UNITS[category].map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Unit */}
              <div className="space-y-2">
                <label htmlFor="toVal" className="block text-sm font-semibold text-primary-text">
                  Target Conversion
                </label>
                <input
                  type="text"
                  id="toVal"
                  readOnly
                  value={result}
                  className="block w-full rounded-lg border border-border-color bg-secondary-bg/20 px-4 py-2.5 text-sm text-primary-text font-bold focus:outline-none"
                />
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="block w-full rounded-lg border border-border-color px-3 py-2 bg-background text-xs font-medium text-primary-text focus:border-accent focus:outline-none"
                >
                  {UNITS[category].map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Form actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSwap}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-color hover:bg-hover-bg py-2.5 text-xs font-semibold text-primary-text transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="h-4 w-4" /> Swap Direction
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 border border-border-color hover:bg-hover-bg rounded-lg text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                title="Reset input"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Equivalents Sidebar */}
          <div className="lg:col-span-5 border border-border-color rounded-2xl p-5 bg-secondary-bg/50 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5" /> Equivalent Units
            </span>
            
            {allConversions.length === 0 ? (
              <p className="text-xs text-secondary-text">Type a value to review equivalent conversions.</p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {allConversions.map((conv) => (
                  <div key={conv.label} className="flex justify-between items-center text-xs py-1.5 border-b border-border-color/40 last:border-b-0">
                    <span className="text-secondary-text">{conv.label}</span>
                    <span className="font-semibold text-primary-text text-right break-all ml-4">
                      {conv.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
