"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Calculator, Flame, Scale, Dumbbell, Apple } from "lucide-react";

type UnitSystem = "metric" | "imperial";
type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "extra";

export default function BmrTdeeCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<number>(25);

  // Metric inputs
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Imperial inputs
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);

  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  // Output stats
  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);

  // Activity multipliers
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  };

  useEffect(() => {
    // Determine height in cm and weight in kg
    let w = weightKg;
    let h = heightCm;

    if (unitSystem === "imperial") {
      w = weightLbs * 0.45359237;
      h = (heightFt * 12 + heightIn) * 2.54;
    }

    // Mifflin-St Jeor Formula
    let bmrVal = 0;
    if (gender === "male") {
      bmrVal = 10 * w + 6.25 * h - 5 * age + 5;
    } else {
      bmrVal = 10 * w + 6.25 * h - 5 * age - 161;
    }

    const tdeeVal = bmrVal * activityFactors[activity];

    setBmr(Math.round(bmrVal));
    setTdee(Math.round(tdeeVal));
  }, [unitSystem, gender, age, weightKg, heightCm, weightLbs, heightFt, heightIn, activity]);

  // Sync unit values on change
  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
    if (system === "metric") {
      setWeightKg(Math.round(weightLbs * 0.453592));
      const totalInches = heightFt * 12 + heightIn;
      setHeightCm(Math.round(totalInches * 2.54));
    } else {
      setWeightLbs(Math.round(weightKg / 0.453592));
      const totalInches = heightCm / 2.54;
      setHeightFt(Math.floor(totalInches / 12));
      setHeightIn(Math.round(totalInches % 12));
    }
  };

  const calculateMacros = (calories: number) => {
    // Balanced diet macros ratio: 30% Protein, 40% Carbs, 30% Fat
    // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
    const pGrams = Math.round((calories * 0.3) / 4);
    const cGrams = Math.round((calories * 0.4) / 4);
    const fGrams = Math.round((calories * 0.3) / 9);

    return { protein: pGrams, carbs: cGrams, fat: fGrams };
  };

  const dietGoals = [
    {
      name: "Weight Maintenance",
      calories: tdee,
      description: "Daily calories to maintain your current weight.",
      badge: "Maintenance",
      color: "border-accent bg-accent/5 text-accent"
    },
    {
      name: "Mild Weight Loss (-0.25 kg/week)",
      calories: Math.max(1200, tdee - 250),
      description: "Gentle caloric deficit to burn fat slowly while conserving muscle.",
      badge: "Fat Loss",
      color: "border-success bg-success/5 text-success"
    },
    {
      name: "Weight Loss (-0.5 kg/week)",
      calories: Math.max(1200, tdee - 500),
      description: "Standard deficit target for healthy fat loss rates.",
      badge: "Deficit",
      color: "border-success bg-success/5 text-success font-bold"
    },
    {
      name: "Mild Weight Gain (+0.25 kg/week)",
      calories: tdee + 250,
      description: "Light caloric surplus suitable for lean muscle building.",
      badge: "Lean Bulk",
      color: "border-warning bg-warning/5 text-warning"
    }
  ];

  const howToUse = [
    "Choose your measurement system (Metric or Imperial) and specify your Gender.",
    "Input your current Age, Weight, and Height using the numeric input selectors.",
    "Select your general weekly Activity Level (e.g. Sedentary or Moderately Active).",
    "Review your calculated Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).",
    "Browse the weight management cards showing target calories and daily macronutrients (g)."
  ];

  const benefits = [
    "Computes BMR using the Mifflin-St Jeor fitness formula.",
    "Calculates precise TDEE multipliers matching physical workloads.",
    "Provides custom macronutrient distribution targets (Protein, Carbs, Fat) for different fitness goals.",
    "100% client-side compilation ensures privacy of personal biometrics."
  ];

  const faqs = [
    {
      question: "What is BMR?",
      answer: "Basal Metabolic Rate (BMR) represents the total calories your body burns at rest to maintain basic metabolic life functions (breathing, circulation, cellular repair)."
    },
    {
      question: "What is TDEE?",
      answer: "Total Daily Energy Expenditure (TDEE) is the estimated total number of calories you burn daily, computed by adding your active workouts and base BMR metrics."
    }
  ];

  const relatedTools = [
    { name: "Age Calculator", url: "/age-calculator", description: "Calculate exact age metrics from date of birth." },
    { name: "Unit Converter", url: "/unit-converter", description: "Convert weight and height units instantly." }
  ];

  return (
    <ToolLayout
      title="Calorie & TDEE Calculator"
      description="Compute your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). Retrieve custom daily calorie targets and macronutrient distributions (protein, carbs, fats) for fat loss or muscle gains."
      category="Calculators & Converters"
      categoryUrl="/#calculators"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Configurations panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider block border-b border-border-color pb-1.5">
              Personal Biometrics
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Unit System */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Unit System</label>
                <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                  <button
                    onClick={() => handleUnitSystemChange("metric")}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      unitSystem === "metric" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    Metric (kg, cm)
                  </button>
                  <button
                    onClick={() => handleUnitSystemChange("imperial")}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      unitSystem === "imperial" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    Imperial (lbs, ft)
                  </button>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Gender</label>
                <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                  <button
                    onClick={() => setGender("male")}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      gender === "male" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setGender("female")}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      gender === "female" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Age (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Weekly Activity</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="sedentary">Sedentary (No Exercise)</option>
                  <option value="light">Lightly Active (1-3 days/wk)</option>
                  <option value="moderate">Moderately Active (3-5 days/wk)</option>
                  <option value="active">Very Active (6-7 days/wk)</option>
                  <option value="extra">Extra Active (Hard Workouts/Athlete)</option>
                </select>
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">
                  Weight {unitSystem === "metric" ? "(kg)" : "(lbs)"}
                </label>
                <input
                  type="number"
                  value={unitSystem === "metric" ? weightKg : weightLbs}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 0);
                    if (unitSystem === "metric") setWeightKg(val);
                    else setWeightLbs(val);
                  }}
                  className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                />
              </div>

              {/* Height */}
              {unitSystem === "metric" ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Height (ft & in)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Feet"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Inches"
                      value={heightIn}
                      onChange={(e) => setHeightIn(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full py-2 px-3 border border-border-color rounded-lg bg-background text-sm font-semibold text-primary-text focus:outline-none"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Results Panel */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Flame className="h-4.5 w-4.5 text-accent animate-pulse" /> Caloric Baselines
            </span>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-secondary-bg/30 p-3 rounded-xl border border-border-color/40">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider block">Basal Metabolic Rate (BMR)</span>
                  <span className="text-xs text-secondary-text">Energy burned entirely at rest</span>
                </div>
                <span className="font-mono font-bold text-lg text-primary-text">{bmr} <span className="text-[10px] text-secondary-text font-normal font-sans">kcal</span></span>
              </div>

              <div className="flex justify-between items-center bg-accent/5 p-3 rounded-xl border border-accent/25">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Total Daily Energy (TDEE)</span>
                  <span className="text-xs text-secondary-text">Calories burned with activity</span>
                </div>
                <span className="font-mono font-bold text-xl text-accent">{tdee} <span className="text-[10px] text-accent/80 font-normal font-sans">kcal</span></span>
              </div>
            </div>

            <div className="bg-secondary-bg/25 p-3 rounded-lg border border-border-color/60 text-[10px] text-secondary-text leading-relaxed flex gap-2">
              <Scale className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
              <span>Consuming exactly <strong>{tdee} kcal</strong> daily maintains weight. Consuming below <strong>{tdee} kcal</strong> stimulates weight loss.</span>
            </div>
          </div>
        </div>

        {/* Caloric Targets Grid */}
        <div className="space-y-3.5">
          <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5">
            <Apple className="h-4.5 w-4.5 text-accent" /> Weight Management & Macros Planner
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dietGoals.map((goal) => {
              const macros = calculateMacros(goal.calories);
              return (
                <div
                  key={goal.name}
                  className={`border rounded-2xl p-4 bg-card-bg flex flex-col justify-between space-y-3 border-border-color`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-primary-text uppercase tracking-wider">{goal.name}</h4>
                      <p className="text-[11px] text-secondary-text leading-relaxed">{goal.description}</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${goal.color}`}>
                      {goal.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2.5 border-t border-border-color/50">
                    <div className="bg-secondary-bg/20 p-1.5 rounded-lg border border-border-color/40">
                      <div className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Target Calories</div>
                      <div className="text-sm font-mono font-bold text-primary-text mt-0.5">{goal.calories} <span className="text-[9px] font-normal font-sans">kcal</span></div>
                    </div>
                    <div className="col-span-2 bg-secondary-bg/20 p-1.5 rounded-lg border border-border-color/40 grid grid-cols-3 gap-1">
                      <div>
                        <div className="text-[9px] text-success font-bold uppercase tracking-wider">Protein</div>
                        <div className="text-[11px] font-mono font-bold text-primary-text mt-0.5">{macros.protein}g</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-accent font-bold uppercase tracking-wider">Carbs</div>
                        <div className="text-[11px] font-mono font-bold text-primary-text mt-0.5">{macros.carbs}g</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-warning font-bold uppercase tracking-wider">Fats</div>
                        <div className="text-[11px] font-mono font-bold text-primary-text mt-0.5">{macros.fat}g</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
