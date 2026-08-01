"use client";

import { useState, useEffect, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, Play, Square, RefreshCw, Volume2, ArrowLeftRight, FileText, AlertCircle } from "lucide-react";

const MORSE_MAP: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
  i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
  q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
  y: "-.--", z: "--..", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
  " ": " ", ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-", "@": ".--.-."
};

const REVERSE_MORSE: Record<string, string> = Object.entries(MORSE_MAP).reduce(
  (acc, [k, v]) => ({ ...acc, [v]: k }),
  {}
);

export default function MorseCodeTranslator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [format, setFormat] = useState<"morse" | "binary">("morse");

  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const activeOscillatorsRef = useRef<any[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Run translation live
  useEffect(() => {
    setError("");
    setOutputText("");
    if (!inputText) return;

    try {
      if (mode === "encode") {
        if (format === "morse") {
          const morse = inputText
            .toLowerCase()
            .split("")
            .map((char) => MORSE_MAP[char] || "")
            .filter((m) => m.length > 0)
            .join(" ");
          setOutputText(morse);
        } else {
          // Binary encode
          const binary = Array.from(new TextEncoder().encode(inputText))
            .map((byte) => byte.toString(2).padStart(8, "0"))
            .join(" ");
          setOutputText(binary);
        }
      } else {
        // Decode mode
        if (format === "morse") {
          const text = inputText
            .trim()
            .split(/\s{2,}/) // double spaces represent word boundaries
            .map((word) =>
              word
                .split(" ")
                .map((code) => REVERSE_MORSE[code] || "?")
                .join("")
            )
            .join(" ");
          setOutputText(text);
        } else {
          // Binary decode
          const text = inputText
            .trim()
            .split(/\s+/)
            .map((bin) => {
              const byte = parseInt(bin, 2);
              if (isNaN(byte)) return "?";
              return String.fromCharCode(byte);
            })
            .join("");
          setOutputText(text);
        }
      }
    } catch (err: any) {
      setError("Failed to translate. Verify that your input format matches selected settings.");
    }
  }, [inputText, mode, format]);

  // Audio Playback for Morse Code
  const stopAudio = () => {
    activeOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    activeOscillatorsRef.current = [];
    setPlaying(false);
  };

  const handlePlayMorse = () => {
    if (playing) {
      stopAudio();
      return;
    }

    const morseCodeStr = mode === "encode" ? outputText : inputText;
    if (!morseCodeStr || format !== "morse") return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioCtx = audioCtxRef.current;
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      setPlaying(true);
      let time = audioCtx.currentTime;

      const dotDuration = 0.08; // 80ms
      const dashDuration = 0.24; // 240ms
      const symbolSpace = 0.08; 
      const letterSpace = 0.24;
      const wordSpace = 0.56;

      const chars = morseCodeStr.split("");

      chars.forEach((char, index) => {
        if (char === "." || char === "-") {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(650, time); // 650Hz pitch beep

          const dur = char === "." ? dotDuration : dashDuration;

          gainNode.gain.setValueAtTime(0.15, time);
          gainNode.gain.setValueAtTime(0.15, time + dur - 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, time + dur);

          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          osc.start(time);
          osc.stop(time + dur);
          
          activeOscillatorsRef.current.push(osc);

          time += dur + symbolSpace;
        } else if (char === " ") {
          time += letterSpace;
        } else if (char === "/") {
          time += wordSpace;
        }
      });

      // Reset state once audio finishes queue playback
      const totalDurationMs = (time - audioCtx.currentTime) * 1000;
      setTimeout(() => {
        setPlaying(false);
      }, totalDurationMs);

    } catch (e) {
      console.error(e);
      setError("Web Audio Context not supported on this browser.");
      setPlaying(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    stopAudio();
    setInputText("");
    setOutputText("");
    setError("");
  };

  const howToUse = [
    "Select your target Conversion Mode (Text to Code or Code to Text).",
    "Choose your translation Format (Morse Code or Binary).",
    "Paste or type content in the Input Box. Translations calculate in real-time.",
    "For Morse, click the Play Audio button to trigger Web Audio beeps.",
    "Click Copy Output to save your compiled translation."
  ];

  const benefits = [
    "Translates plain text to Morse (dot/dash) or Binary (0/1) formats.",
    "Plays Morse code audio beeps using native browser Web Audio oscillators.",
    "Handles complex characters, symbols, and spaces dynamically.",
    "100% Client-Side translations ensure text fragments remain private."
  ];

  const faqs = [
    {
      question: "What is Morse code character spacing?",
      answer: "Standard morse code spaces symbols (. or -) by 1 unit, letters by 3 units, and words by 7 units. This tool schedules AudioContext beeps matching standard POSIX timelines."
    },
    {
      question: "How does the binary translation map characters?",
      answer: "It maps characters to their standard UTF-8 binary representation. Each character is encoded as an 8-bit byte sequence (composed of 0s and 1s)."
    }
  ];

  const relatedTools = [
    { name: "Base64 Encoder", url: "/base64", description: "Encode text strings to Base64 formats." },
    { name: "Character Counter", url: "/character-counter", description: "Count letters and lines inside a paragraph." }
  ];

  return (
    <ToolLayout
      title="Morse Code & Binary Translator"
      description="Translate text to Morse code or Binary strings and back. Plays audio beeps for Morse code symbols using browser-native Web Audio oscillator streams."
      category="Text Utilities"
      categoryUrl="/#text"
      howToUse={howToUse}
      benefits={benefits}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">

        {/* Configurations bar */}
        <div className="bg-secondary-bg/15 p-4 rounded-xl border border-border-color space-y-4">
          <span className="text-xs font-bold text-primary-text uppercase tracking-wider block border-b border-border-color/60 pb-1.5">
            Translator Settings
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Mode Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Conversion Mode</label>
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                <button
                  onClick={() => { setMode("encode"); handleReset(); }}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    mode === "encode" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  Text to Code
                </button>
                <button
                  onClick={() => { setMode("decode"); handleReset(); }}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    mode === "decode" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  Code to Text
                </button>
              </div>
            </div>

            {/* Format Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider block">Format Code Type</label>
              <div className="flex rounded-lg border border-border-color p-0.5 bg-background">
                <button
                  onClick={() => { setFormat("morse"); handleReset(); }}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    format === "morse" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  Morse Code
                </button>
                <button
                  onClick={() => { setFormat("binary"); handleReset(); }}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    format === "binary" ? "bg-accent text-white" : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  Binary
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-accent" /> Source Input
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter standard text to encode..."
                  : format === "morse"
                  ? "Enter Morse code (dots and dashes separated by space, e.g. ... --- ...)"
                  : "Enter Binary bytes (separated by space, e.g. 01010011 01001111 01010011)"
              }
              rows={12}
              className="w-full rounded-xl border border-border-color bg-background p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
            />
          </div>

          {/* Output text */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-secondary-text uppercase tracking-wider flex items-center gap-1.5">
                <ArrowLeftRight className="h-4.5 w-4.5 text-success" /> Translation Output
              </label>
              {outputText && (
                <button
                  onClick={handleCopyToClipboard}
                  className="py-1 px-2.5 rounded border border-border-color bg-background hover:bg-hover-bg text-xs font-semibold text-secondary-text hover:text-primary-text cursor-pointer transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Output"}
                </button>
              )}
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="Translation will display here..."
              rows={12}
              className="w-full rounded-xl border border-border-color bg-secondary-bg/10 p-4 text-sm font-mono text-primary-text focus:outline-none leading-relaxed resize-y"
            />
          </div>

        </div>

        {/* Audio control (For morse code only) */}
        {format === "morse" && (inputText || outputText) && !error && (
          <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <Volume2 className="h-5 w-5 text-accent animate-pulse" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-primary-text uppercase tracking-wider block">Audible Morse Player</span>
                <span className="text-[11px] text-secondary-text font-medium">Plays live signal frequencies locally in-browser</span>
              </div>
            </div>

            <button
              onClick={handlePlayMorse}
              className="py-2.5 px-6 rounded-lg text-xs font-bold bg-accent hover:bg-accent/90 text-white cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {playing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? "Stop Playback" : "Play Morse Beeps"}
            </button>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3.5 text-sm text-warning border border-warning/20">
            <AlertCircle className="h-4 w-4 shrink-0 font-medium" />
            <span>{error}</span>
          </div>
        )}

        {/* Start over trigger */}
        {(inputText || outputText) && (
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="w-full py-3 border border-border-color hover:bg-hover-bg rounded-lg text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
            >
              Start Over / Clear
            </button>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
