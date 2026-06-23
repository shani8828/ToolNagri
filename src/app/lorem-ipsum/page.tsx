"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Type, Copy, Check, RefreshCw } from "lucide-react";

// Standard Cicero Lorem Ipsum Paragraphs
const CLASSICAL_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi.",
  "Fusce mauris. Vestibulum luctus nibh at lectus. Sed bibendum, nulla a faucibus semper, leo velit ultricies tellus, ac venenatis arcu wisi vel nisl. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  "Morbi auctor lorem non justo. Nam lacus libero, pretium at, lobortis vitae, ultricies et, tellus. Donec aliquet, tortor ut gravida iaculis, lacus ac varius, tristique libero metus accumsan sem. Fusce eleifend laoreet dui. Mauris tempor ligula sed lacus. Duis cursus eleifend ac, tristique at, velit. Curabitur convallis, lorem ut iaculis iaculis, ipsum erat viverra ante, nec aliquet leo elit sed ante.",
  "Nullam sit amet magna in magna gravida vehicula. Etiam ut pede. Vestibulum erat. Aliquam erat volutpat. Integer malesuada. Aliquam id lorem. Morbi ut dui. Cras placerat. In hac habitasse platea dictumst. Aenean id magna id sem tincidunt tristique. Curabitur vulputate. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin ac nisl."
];

// Hipster Paragraphs
const HIPSTER_PARAGRAPHS = [
  "Park pick-up single-origin cold-brew craft beer organic brunch. Asymmetrical master cleanse retro keytar fingerstache messenger bag locavore typewriter dreamcatcher. Semi-micro blogging raw denim direct trade chillwave marfa meditation listicle flexitarian bespoke keytar craft beer aesthetic gastropub copper mug deep v master cleanse green juice semiotics.",
  "Pour-over tofu lumbersexual authentic adaptogen post-ironic food truck vinyl master cleanse slow-carb prism raw denim cold-pressed cloud bread wolf messenger bag. Keytar echo park kickstarter microdosing. Helvetica gastropub letterpress farm-to-table chillwave roof party direct trade meditation fingerstache photo booth.",
  "Marfa small batch flannel dreamcatcher ramps green juice trust fund deep v messenger bag keytar direct trade cold-pressed gastropub cloud bread meditation keytar flannel master cleanse. Roof party adaptogen letterpress locavore. Bespoke authentic letterpress aesthetic dreamcatcher chillwave sustainable tofu direct trade."
];

// Tech Jargon Paragraphs
const TECH_PARAGRAPHS = [
  "Leverage vertical pipelines to optimize predictive deliverables. Disrupting legacy silos with native cloud containerization, agile sprint cadences, and machine learning microservice meshes. Monetizing key-value bandwidth dynamically to scale container nodes across geo-replicated data centers.",
  "Synergize key performance indicators (KPIs) through high-velocity analytics dashboards. Iterating backend scalability loops with standard load-balancers, serverless edge function execution, and automated deployment pipelines. Seamless database scaling matches web socket traffic metrics.",
  "Empower digital transformation workflows via artificial intelligence APIs and predictive model arrays. Deploying container nodes, orchestrating pipeline states, and configuring load balancers to scale microservices securely. Zero round-trip latency ensures real-time query rendering."
];

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [style, setStyle] = useState<"classical" | "hipster" | "tech">("classical");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = () => {
    let pool = CLASSICAL_PARAGRAPHS;
    if (style === "hipster") pool = HIPSTER_PARAGRAPHS;
    else if (style === "tech") pool = TECH_PARAGRAPHS;

    const result = [];
    for (let i = 0; i < count; i++) {
      const idx = i % pool.length;
      let text = pool[idx];
      
      // Handle the "Start with Lorem Ipsum..." check
      if (i === 0 && style === "classical" && startWithLorem) {
        if (!text.startsWith("Lorem ipsum")) {
          text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + text;
        }
      }
      result.push(text);
    }

    setOutputText(result.join("\n\n"));
  };

  const howToUse = [
    "Select your preferred copy style: Classical Latin, Hipster jargon, or Tech business filler.",
    "Use the counter to set the exact number of paragraphs you need (up to 15).",
    "Toggle whether to start the first paragraph with the traditional 'Lorem ipsum dolor...' prefix.",
    "Click 'Generate Placeholder' and copy the resulting dummy text to your clipboard."
  ];

  const benefits = [
    "Generates structured copy variations covering classical Latin, hipster jargon, and tech silos.",
    "Allows custom paragraph limits to fit layout requirements.",
    "Completely client-side logic ensures fast and private generation.",
    "One-click copy function for prompt workflow pasting."
  ];

  const faqs = [
    {
      question: "Where did the Lorem Ipsum text originate?",
      answer: "Lorem Ipsum is derived from sections of Cicero's 45 BC philosophical treatise 'De Finibus Bonorum et Malorum' (On the Ends of Good and Evil), adapted to serve as placeholder text for typography layouts since the 1500s.",
    },
    {
      question: "What is the difference between Hipster and Tech styles?",
      answer: "Hipster style uses vocabulary from modern lifestyle trends and coffee shop culture, while Tech style generates corporate business jargon and programming buzzwords, perfect for mockups in specialized domains."
    }
  ];

  const relatedTools = [
    { name: "Word Counter", url: "/word-counter", description: "Analyze characters, paragraphs, and reading times." },
    { name: "Character Counter", url: "/character-counter", description: "Calculate letter limits and density analysis." }
  ];

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate mock placeholder copy with custom sentence, paragraph, and layout parameters client-side."
      category="Text Tools"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        
        {/* Controls Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-secondary-bg/25 p-5 rounded-xl border border-border-color">
          
          {/* Style select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider">Filler Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="w-full rounded-lg border border-border-color bg-background px-3 py-2 text-sm text-primary-text focus:border-accent focus:outline-none"
            >
              <option value="classical">Classical Latin</option>
              <option value="hipster">Hipster Trend</option>
              <option value="tech">Tech & Corporate</option>
            </select>
          </div>

          {/* Paragraph count */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider">Paragraph Count</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-accent cursor-pointer h-1.5 bg-border-color rounded-lg appearance-none"
              />
              <span className="font-mono text-sm font-bold text-primary-text shrink-0">{count} Paragraphs</span>
            </div>
          </div>

          {/* Option: Start with Lorem */}
          <div className="flex items-center pt-5 sm:pt-4">
            {style === "classical" ? (
              <label className="flex items-center gap-2 text-sm text-secondary-text font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded border-border-color text-accent focus:ring-accent"
                />
                Start with &quot;Lorem ipsum...&quot;
              </label>
            ) : (
              <span className="text-xs text-secondary-text/60 italic">Options apply only to Latin style.</span>
            )}
          </div>

        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <RefreshCw className="h-4 w-4" /> Generate Placeholder
          </button>
        </div>

        {/* Output Text Area */}
        {outputText && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <Type className="h-4 w-4 text-accent" /> Generated Mockup Copy
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border-color hover:bg-hover-bg rounded text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy Text
              </button>
            </div>
            
            <div className="w-full rounded-lg border border-border-color bg-white px-4 py-4 text-sm text-primary-text leading-relaxed whitespace-pre-wrap select-text max-h-[350px] overflow-y-auto font-sans">
              {outputText}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
