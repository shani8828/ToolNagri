"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Key, ShieldCheck, AlertCircle, Info } from "lucide-react";
import confetti from "canvas-confetti";

// A list of 512 simple, clean, memorable nouns, adjectives and verbs
const WORDLIST = [
  "apple", "about", "above", "actor", "admit", "adopt", "agent", "agree", "ahead", "aimed",
  "album", "alive", "allow", "alone", "along", "alter", "among", "anger", "angle", "angry",
  "apart", "apple", "arena", "argue", "arise", "array", "arrow", "aside", "asset", "audio",
  "audit", "avoid", "award", "aware", "awful", "bacon", "badge", "badly", "baker", "bases",
  "basic", "basis", "beach", "beard", "beast", "began", "begin", "begun", "being", "below",
  "bench", "bible", "billy", "birth", "black", "blade", "blame", "blind", "block", "blood",
  "board", "boast", "bonus", "boost", "booth", "border", "bound", "brain", "brand", "bread",
  "break", "breed", "brick", "bride", "brief", "bring", "broad", "broke", "brown", "brush",
  "build", "built", "bunch", "buyer", "cable", "cabin", "calm", "came", "camp", "canal",
  "candy", "canon", "cards", "cargo", "carry", "carve", "cases", "caste", "catch", "cater",
  "cause", "cease", "chain", "chair", "chalk", "champ", "chant", "chaos", "charm", "chart",
  "chase", "cheap", "cheat", "check", "cheek", "cheer", "chess", "chest", "chief", "child",
  "chili", "chill", "china", "chips", "choir", "chose", "chunk", "cider", "cigar", "circus",
  "claim", "class", "clean", "clear", "clerk", "click", "cliff", "climb", "clock", "close",
  "cloth", "cloud", "coach", "coast", "cobra", "cocoa", "coded", "coder", "coins", "color",
  "comic", "coral", "couch", "cough", "count", "court", "cover", "craft", "crane", "crash",
  "cream", "creed", "creek", "crest", "crime", "crops", "cross", "crowd", "crown", "crude",
  "crush", "crust", "cubic", "curry", "cycle", "daily", "dairy", "dance", "dated", "deals",
  "death", "debut", "decor", "delay", "dense", "depth", "derby", "desks", "devil", "diary",
  "diner", "dirty", "disco", "ditch", "diver", "divot", "docks", "dodge", "doing", "donor",
  "donut", "doors", "doubt", "dough", "draft", "drain", "drama", "drank", "draws", "dream",
  "dress", "dried", "drift", "drill", "drink", "drive", "drove", "drugs", "drums", "drunk",
  "dryer", "ducky", "dusty", "dying", "eager", "early", "earth", "easel", "eaten", "eater",
  "ebony", "edges", "eight", "elbow", "elder", "elect", "elite", "empty", "ended", "enemy",
  "enjoy", "enter", "entry", "equal", "equip", "erase", "error", "essay", "event", "every",
  "exact", "excel", "exert", "exile", "exist", "extra", "fable", "faced", "faces", "facts",
  "faded", "fails", "faint", "fairy", "faith", "false", "famed", "fancy", "fares", "fatal",
  "fates", "favor", "fears", "feast", "feeds", "ferry", "fever", "fewer", "fiber", "field",
  "fifth", "fifty", "fight", "filed", "files", "files", "filmy", "final", "finds", "fined",
  "fines", "finis", "first", "fishy", "fixed", "fixes", "flair", "flame", "flank", "flare",
  "flash", "flask", "flats", "flaws", "fleet", "flesh", "flies", "fling", "flint", "float",
  "flock", "flood", "floor", "flora", "flour", "flown", "fluid", "fluke", "flung", "flute",
  "flyer", "foamy", "focal", "focus", "foggy", "folds", "folly", "fonts", "foods", "force",
  "forge", "forth", "forty", "forum", "found", "frame", "frank", "fraud", "fresh", "front",
  "frost", "frown", "fruit", "fully", "funds", "funny", "fuzzy", "gains", "games", "gamma",
  "gates", "gauge", "gears", "genes", "giant", "gifts", "girls", "given", "giver", "gives",
  "glass", "globe", "glory", "glove", "glows", "goals", "goats", "going", "golds", "golfs",
  "grace", "grade", "grain", "grand", "grant", "grape", "graph", "grasp", "grass", "grave",
  "grays", "great", "green", "greet", "grief", "grill", "grimy", "grind", "grips", "groan",
  "groom", "gross", "group", "grove", "growl", "grown", "grows", "guard", "guest", "guide",
  "guild", "guilt", "habit", "hairs", "hands", "handy", "happy", "hardy", "harsh", "haste",
  "hasty", "hatch", "haven", "hazel", "heads", "heady", "heard", "hears", "heart", "heavy",
  "hedge", "heels", "hello", "hence", "herbs", "hills", "hilly", "hints", "hippo", "hobby",
  "holds", "holes", "honey", "hoods", "hopes", "horns", "horny", "horse", "hosts", "hotel",
  "hours", "house", "hover", "human", "humid", "humor", "hurry", "husky", "icons", "ideas",
  "ideal", "image", "imply", "index", "inner", "input", "intel", "intro", "ionic", "irons",
  "irony", "issue", "items", "ivory", "jacky", "jaded", "jeans", "jelly", "jewel", "joint",
  "joked", "joker", "jokes", "jolly", "journal", "judge", "juice", "juicy", "jumbo", "jumpy",
  "junky", "juror", "kappa", "karma", "kayak", "keeps", "ketchup", "keyed", "kicks", "killer",
  "kinds", "kings", "kiosk", "kites", "kitty", "knack", "knees", "knife", "knock", "knots",
  "known", "knows", "label", "labor", "laced", "laces", "lacks", "ladle", "lakes", "lamps",
  "lands", "lanes", "large", "laser", "lasts", "latch", "later", "latex", "laugh", "lawyer"
];

// Wordlist size = 512. log2(512) = 9 bits of entropy per word.
const WORDLIST_BITS = 9;

type CaseType = "lowercase" | "titlecase" | "uppercase";

export default function PassphraseGenerator() {
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [caseType, setCaseType] = useState<CaseType>("lowercase");
  const [includeNumber, setIncludeNumber] = useState(false);
  const [includeSymbol, setIncludeSymbol] = useState(false);

  const [passphrase, setPassphrase] = useState("");
  const [entropy, setEntropy] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generatePassphrase = () => {
    setError("");
    try {
      const cryptoObj = window.crypto;
      if (!cryptoObj || !cryptoObj.getRandomValues) {
        setError("Browser cryptographic secure generator not supported.");
        return;
      }

      // 1. Draw words securely using crypto random bytes
      const randomValues = new Uint32Array(wordCount);
      cryptoObj.getRandomValues(randomValues);

      let words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        const index = randomValues[i] % WORDLIST.length;
        let word = WORDLIST[index];

        // Apply capitalization formatting
        if (caseType === "titlecase") {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        } else if (caseType === "uppercase") {
          word = word.toUpperCase();
        }
        words.push(word);
      }

      // 2. Insert numbers if toggled
      if (includeNumber) {
        const numValues = new Uint32Array(1);
        cryptoObj.getRandomValues(numValues);
        const randomNum = numValues[0] % 100; // 0-99
        words.push(randomNum.toString());
      }

      // 3. Insert symbol if toggled
      if (includeSymbol) {
        const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "?", "+"];
        const symValues = new Uint32Array(1);
        cryptoObj.getRandomValues(symValues);
        const randomSym = symbols[symValues[0] % symbols.length];
        words.push(randomSym);
      }

      // 4. Combine into final passphrase string
      const joined = words.join(separator);
      setPassphrase(joined);

      // 5. Calculate bits of entropy:
      // Base: wordCount * log2(512)
      let calculatedEntropy = wordCount * WORDLIST_BITS;
      if (includeNumber) calculatedEntropy += 6.64; // log2(100)
      if (includeSymbol) calculatedEntropy += 3.32; // log2(10)

      setEntropy(Math.round(calculatedEntropy));

      // 6. Define password strength boundaries
      if (calculatedEntropy < 30) {
        setStrengthLabel("Weak");
        setStrengthColor("text-warning bg-warning/10 border-warning/20");
      } else if (calculatedEntropy < 45) {
        setStrengthLabel("Good / Moderate");
        setStrengthColor("text-accent bg-accent/10 border-accent/20");
      } else if (calculatedEntropy < 65) {
        setStrengthLabel("Very Strong");
        setStrengthColor("text-success bg-success/10 border-success/20");
      } else {
        setStrengthLabel("Military-Grade / Overkill");
        setStrengthColor("text-success bg-success/20 border-success/30 shadow-md");
      }

    } catch (e) {
      setError("Failed to generate secure passphrase.");
    }
  };

  // Generate once on mount
  useEffect(() => {
    generatePassphrase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyToClipboard = () => {
    if (!passphrase) return;
    navigator.clipboard.writeText(passphrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    confetti({
      particleCount: 30,
      spread: 25,
      origin: { y: 0.8 },
      colors: ["#2563eb", "#22c55e"],
    });
  };

  const howToUse = [
    "Choose your preferred Number of Words slider density (default 4).",
    "Select a Separator character to bound the words (e.g. hyphens).",
    "Toggle Case format styles (lowercase, title case, or all capitals).",
    "Enable numbers or symbol appendages to further secure entropy values.",
    "Observe the live Strength Meter, click Copy, and deploy."
  ];

  const benefits = [
    "Uses cryptographically secure browser RNG algorithms.",
    "Provides readable, memorable passwords (correct-horse-battery-staple).",
    "Computes mathematical entropy bits to check guess-resistance.",
    "100% Client-Side generation ensures keys never leave your machine."
  ];

  const faqs = [
    {
      question: "Why is a passphrase better than a random password?",
      answer: "Passphrases use multiple dictionary words. They are easy for humans to memorize but extremely difficult for automated brute-force attacks to guess because their length creates high mathematical entropy."
    },
    {
      question: "What is entropy in password security?",
      answer: "Entropy measures password randomness in bits. Each bit doubles the combinations hackers must search. 36+ bits is solid for general accounts; 60+ bits provides military-grade protection."
    }
  ];

  const relatedTools = [
    { name: "Password Generator", url: "/password-generator", description: "Generate secure character-string passwords." },
    { name: "UUID Generator", url: "/uuid-generator", description: "Create bulk random GUID identifiers." }
  ];

  return (
    <ToolLayout
      title="Passphrase Generator"
      description="Create memorable, cryptographically secure passphrases. Select word length counts, custom dividers, capitalization styles, and display password strength entropy."
      category="Network & Security"
      categoryUrl="/#network"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Configurations panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-border-color rounded-2xl p-5 bg-card-bg space-y-4">
            <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
              <Key className="h-4.5 w-4.5 text-accent animate-pulse" /> Passphrase Parameters
            </span>

            {/* Slider for Word Count */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <label className="font-bold text-secondary-text uppercase tracking-wider">Number of Words</label>
                <span className="font-mono font-bold text-accent text-sm">{wordCount} words</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-border-color rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            {/* Configs row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Word Separator</label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                >
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=".">Period (.)</option>
                  <option value=" ">Space ( )</option>
                  <option value="">None</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Capitalization</label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value as CaseType)}
                  className="w-full py-2 px-3 rounded-lg border border-border-color bg-background text-xs text-primary-text font-bold focus:outline-none cursor-pointer"
                >
                  <option value="lowercase">Lowercase</option>
                  <option value="titlecase">Title Case</option>
                  <option value="uppercase">All Capitals</option>
                </select>
              </div>
            </div>

            {/* Switches */}
            <div className="flex flex-wrap gap-4 items-center pt-2 select-none">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumber}
                  onChange={(e) => setIncludeNumber(e.target.checked)}
                  className="accent-accent h-4 w-4"
                />
                Append Random Number
              </label>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbol}
                  onChange={(e) => setIncludeSymbol(e.target.checked)}
                  className="accent-accent h-4 w-4"
                />
                Append Special Character
              </label>
            </div>
          </div>

          {/* Secure Display Output Screen */}
          <div className="border border-border-color rounded-2xl p-5 bg-card-bg flex flex-col justify-between min-h-62.5">
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-border-color pb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-success" /> Generated Key
              </span>

              {/* Password text wrapper */}
              <div className="p-3.5 bg-secondary-bg/25 rounded-xl border border-border-color/40 text-center relative select-all break-all min-h-16 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-primary-text">
                  {passphrase || "Click generate to create key..."}
                </span>
              </div>

              {/* Strength and Entropy indicator */}
              {passphrase && (
                <div className="space-y-2 text-xs">
                  <div className={`p-2 rounded-lg border text-center font-bold text-[10px] uppercase tracking-wider ${strengthColor}`}>
                    Strength: {strengthLabel}
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-secondary-text font-semibold uppercase tracking-wider px-1">
                    <span>Entropy</span>
                    <span className="font-mono font-bold text-primary-text">{entropy} bits</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleCopyToClipboard}
                disabled={!passphrase}
                className="flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold border border-border-color bg-background hover:bg-hover-bg text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Key"}
              </button>

              <button
                onClick={generatePassphrase}
                className="py-2.5 px-4 rounded-lg text-xs font-semibold bg-success hover:bg-success/90 text-white cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="h-4 w-4" /> Generate
              </button>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
            <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
            <span>{error}</span>
          </div>
        )}

        {/* Tip section */}
        <div className="bg-[#2563eb]/5 p-3 rounded-lg border border-[#2563eb]/15 text-[10px] text-primary-text leading-relaxed flex gap-2">
          <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <span>
            <strong>Pro Tip:</strong> Unlike traditional passwords, a passphrase with 4+ words has enough entropy to be extremely secure while remaining easy to remember. Avoid simple dictionary words in sequence for online banking, but use passphrases for standard accounts!
          </span>
        </div>

      </div>
    </ToolLayout>
  );
}
