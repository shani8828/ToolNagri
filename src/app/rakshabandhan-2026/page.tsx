"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, Calendar, Gift, Clock, Heart, Award, ArrowRight, 
  ChevronRight, Share2, Copy, Check, RefreshCw, Eye, User, ArrowLeft 
} from "lucide-react";
import confetti from "canvas-confetti";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

interface LocalCard {
  id: string;
  sender: string;
  receiver: string;
  lang: string;
  views?: number;
}

interface WishDetails {
  sender: string;
  receiver: string;
  lang: string;
  views: number;
}

export default function RakshaBandhanPage() {
  const [cardId, setCardId] = useState<string | null>(null);
  const [wish, setWish] = useState<WishDetails | null>(null);
  const [loadingCard, setLoadingCard] = useState(false);
  const [errorCard, setErrorCard] = useState<string | null>(null);

  // Form State
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [lang, setLang] = useState("hi");
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [justGeneratedId, setJustGeneratedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Dashboard State
  const [myCards, setMyCards] = useState<LocalCard[]>([]);
  const [refreshingDashboard, setRefreshingDashboard] = useState(false);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  // 1. Detect URL ID client-side to render Wishing Card
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setCardId(id);
      fetchCardDetails(id);
    } else {
      setCardId(null);
      setWish(null);
    }
  }, []);

  // 2. Fetch Card Details (and increment views)
  const fetchCardDetails = async (id: string) => {
    setLoadingCard(true);
    setErrorCard(null);
    try {
      const res = await fetch(`/api/rakhi?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setWish(data.wish);
        // Trigger celebratory confetti on view load
        setTimeout(() => {
          triggerFestivalConfetti();
        }, 300);
      } else {
        setErrorCard(data.error || "Could not load wishing card");
      }
    } catch (err) {
      setErrorCard("Failed to connect to the server");
    } finally {
      setLoadingCard(false);
    }
  };

  // 3. Retrieve dashboard links from localStorage
  useEffect(() => {
    if (!cardId) {
      loadDashboard();
    }
  }, [cardId]);

  const loadDashboard = async () => {
    try {
      const stored = localStorage.getItem("toolnagri_rakhi_cards");
      if (stored) {
        const cards: LocalCard[] = JSON.parse(stored);
        setMyCards(cards);
        
        // Hydrate view counts for all dashboard cards asynchronously
        setRefreshingDashboard(true);
        const updatedCards = await Promise.all(
          cards.map(async (card) => {
            try {
              const res = await fetch(`/api/rakhi?id=${card.id}&track=true`);
              const data = await res.json();
              if (data.success) {
                return { ...card, views: data.wish.views };
              }
            } catch (e) {
              console.error("Failed to fetch views for card", card.id);
            }
            return card;
          })
        );
        setMyCards(updatedCards);
        localStorage.setItem("toolnagri_rakhi_cards", JSON.stringify(updatedCards));
      }
    } catch (e) {
      console.error("Failed to load dashboard:", e);
    } finally {
      setRefreshingDashboard(false);
    }
  };

  // 4. Live Countdown to August 28, 2026
  useEffect(() => {
    const targetDate = new Date("2026-08-28T00:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerFestivalConfetti = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#f59e0b", "#ef4444", "#ec4899", "#d97706"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#f59e0b", "#ef4444", "#ec4899", "#d97706"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 5. Create Wish Link
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim()) return;

    setGenerating(true);
    setGeneratedLink(null);
    setJustGeneratedId(null);

    try {
      const res = await fetch("/api/rakhi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, receiver, lang }),
      });
      const data = await res.json();
      if (data.success) {
        const link = `${window.location.origin}${window.location.pathname}?id=${data.id}`;
        setGeneratedLink(link);
        setJustGeneratedId(data.id);
        triggerFestivalConfetti();

        // Save to dashboard
        const stored = localStorage.getItem("toolnagri_rakhi_cards");
        const cards: LocalCard[] = stored ? JSON.parse(stored) : [];
        const newCard: LocalCard = {
          id: data.id,
          sender: sender.trim(),
          receiver: receiver.trim() || "Everyone",
          lang,
          views: 0,
        };
        cards.unshift(newCard);
        localStorage.setItem("toolnagri_rakhi_cards", JSON.stringify(cards));
        setMyCards(cards);
      } else {
        alert(data.error || "Generation failed. Please try again.");
      }
    } catch (err) {
      alert("Failed to connect. Please check your network.");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sibling Poetry Lists
  const poetryList = {
    en: [
      "A bond of love, a bond of care,",
      "A relationship so rich and rare.",
      "Through laughs and fights, we grew together,",
      "This sibling bond will last forever.",
    ],
    hi: [
      "रेशम के धागों का है यह मजबूत बंधन,",
      "स्नेह और सुरक्षा का है यह पावन अभिनंदन।",
      "दुआ है मेरी खुश रहे सदा भाई और बहन,",
      "मुबारक हो आपको रक्षाबंधन का यह पावन पर्व।"
    ]
  };

  // Render Wishing Card Mode
  if (cardId) {
    return (
      <div className="min-h-screen pb-20 bg-linear-to-b from-[#fff7ed] via-[#fffbeb] to-background">
        <div className="mx-auto max-w-2xl px-4 py-12 text-center space-y-8">
          
          {/* Back button */}
          <div className="flex justify-start">
            <Link
              href="/rakshabandhan-2026"
              onClick={() => {
                setCardId(null);
                setWish(null);
                window.history.pushState({}, "", "/rakshabandhan-2026");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-1.5 shadow-sm transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Create Your Wishing Card
            </Link>
          </div>

          {loadingCard && (
            <div className="rounded-3xl border border-rose-100 bg-card-bg shadow-premium p-12 space-y-6 animate-pulse">
              <div className="h-10 w-40 bg-rose-100 rounded-full mx-auto" />
              <div className="h-40 w-40 bg-amber-100 rounded-full mx-auto" />
              <div className="h-8 w-60 bg-rose-100 rounded-lg mx-auto" />
              <div className="h-20 w-80 bg-slate-100 rounded-lg mx-auto" />
            </div>
          )}

          {errorCard && (
            <div className="rounded-3xl border border-rose-200 bg-red-50 p-10 space-y-4">
              <h2 className="font-heading text-xl font-bold text-red-700">Wishing Card Unavailable</h2>
              <p className="text-sm text-red-650">{errorCard}</p>
              <Link
                href="/rakshabandhan-2026"
                onClick={() => {
                  setCardId(null);
                  setWish(null);
                  window.history.pushState({}, "", "/rakshabandhan-2026");
                }}
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-2.5 text-[13px] font-bold text-white hover:bg-rose-700 shadow-sm transition-colors"
              >
                Go Create New Link
              </Link>
            </div>
          )}

          {wish && (
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-linear-to-r from-orange-400 via-rose-400 to-amber-400 rounded-3xl blur-xl opacity-15 pointer-events-none" />

              <div className="festival-shimmer-bg relative rounded-3xl border border-rose-100 bg-linear-to-br from-[#ffffff] to-[#fffcf9] p-8 sm:p-12 shadow-premium space-y-8">
                
                {/* Header Greeting */}
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-100">
                    <Sparkles className="h-3.5 w-3.5 fill-rose-600/20" />
                    Special Greeting
                  </span>
                  
                  {wish.lang === "hi" ? (
                    <h1 className="font-heading text-2xl sm:text-3xl font-black text-rose-600 leading-snug">
                      रक्षाबंधन की हार्दिक शुभकामनाएं
                    </h1>
                  ) : (
                    <h1 className="font-heading text-2xl sm:text-3xl font-black text-rose-600 leading-snug">
                      Happy Raksha Bandhan
                    </h1>
                  )}
                </div>

                {/* Animated Center Rakhi */}
                <div className="flex justify-center">
                  <div className="relative w-44 sm:w-52 aspect-square flex items-center justify-center">
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full drop-shadow-[0_10px_20px_rgba(244,63,94,0.25)] animate-pulse"
                      style={{ animationDuration: '4s' }}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Threads */}
                      <path d="M10 100 H190" stroke="url(#threadGradient)" strokeWidth="6" strokeLinecap="round" />
                      <circle cx="50" cy="100" r="4.5" fill="#f59e0b" />
                      <circle cx="62" cy="100" r="3.5" fill="#ef4444" />
                      <circle cx="150" cy="100" r="4.5" fill="#f59e0b" />
                      <circle cx="138" cy="100" r="3.5" fill="#ef4444" />
                      
                      {/* Rakhi center structure */}
                      <circle cx="100" cy="100" r="42" fill="url(#outerGlow)" opacity="0.3" />
                      <g className="animate-spin" style={{ animationDuration: '40s' }}>
                        {Array.from({ length: 16 }).map((_, i) => {
                          const angle = (i * 360) / 16;
                          return (
                            <path
                              key={i}
                              d="M100 100 L100 56"
                              stroke="#f59e0b"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              transform={`rotate(${angle} 100 100)`}
                            />
                          );
                        })}
                      </g>
                      <circle cx="100" cy="100" r="36" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
                      
                      <g className="animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
                        {Array.from({ length: 8 }).map((_, i) => {
                          const angle = (i * 360) / 8;
                          return (
                            <path
                              key={i}
                              d="M100 100 C88 75, 112 75, 100 100"
                              fill="#ef4444"
                              stroke="#b91c1c"
                              strokeWidth="1"
                              transform={`rotate(${angle} 100 100)`}
                            />
                          );
                        })}
                      </g>
                      <circle cx="100" cy="100" r="20" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" />
                      <path
                        d="M100 88 L103 97 L112 100 L103 103 L100 112 L97 103 L88 100 L97 97 Z"
                        fill="#d91b5c"
                      />
                      <circle cx="100" cy="100" r="5" fill="white" />
                      <circle cx="98.5" cy="98.5" r="1.5" fill="#fef2f2" opacity="0.8" />
                      <defs>
                        <linearGradient id="threadGradient" x1="10" y1="100" x2="190" y2="100" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                          <stop offset="25%" stopColor="#ef4444" />
                          <stop offset="50%" stopColor="#f59e0b" />
                          <stop offset="75%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                        <radialGradient id="outerGlow" cx="100" cy="100" r="42" gradientUnits="userSpaceOnUse">
                          <stop offset="40%" stopColor="#f59e0b" stopOpacity="1" />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Wishing Message Details */}
                <div className="space-y-4">
                  <div className="inline-block bg-rose-50/50 border border-rose-100 rounded-2xl px-6 py-4">
                    {wish.lang === "hi" ? (
                      <p className="text-lg sm:text-xl text-slate-800 leading-relaxed">
                        <strong className="text-rose-600 font-extrabold">{wish.sender}</strong>,{" "}
                        <span className="font-medium">अपने प्यारे</span>{" "}
                        <strong className="text-orange-600 font-extrabold">{wish.receiver}</strong>{" "}
                        को रक्षाबंधन की ढेर सारी बधाई और स्नेह भेज रहे हैं! ❤️🌸
                      </p>
                    ) : (
                      <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-light">
                        <strong className="text-rose-600 font-extrabold">{wish.sender}</strong> is wishing{" "}
                        <strong className="text-orange-600 font-extrabold">{wish.receiver}</strong> a warm and sweet{" "}
                        <span className="font-semibold text-rose-500">Happy Raksha Bandhan!</span> ❤️🌸
                      </p>
                    )}
                  </div>

                  {/* Poetry Block */}
                  <div className="py-2 italic text-slate-600 font-medium text-sm sm:text-base space-y-1 relative">
                    <span className="absolute -top-3 left-6 text-4xl text-rose-250 font-serif opacity-30">“</span>
                    {(wish.lang === "hi" ? poetryList.hi : poetryList.en).map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                    <span className="absolute -bottom-6 right-6 text-4xl text-rose-250 font-serif opacity-30">”</span>
                  </div>
                </div>

                {/* Tracking Badge in Page */}
                <div className="pt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Eye className="h-4 w-4 text-slate-400" />
                  This wish card has been opened <span className="text-rose-600 font-bold">{wish.views}</span> times.
                </div>

                {/* Card CTA & Sharing Options */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${wish.sender} ${wish.lang === 'hi' ? 'ने भेजा है आपके लिए रक्षाबंधन का ख़ास संदेश' : 'sent a special Raksha Bandhan wishing card for you'}! 🌸✨\n\nपढ़ें यहाँ: ${window.location.origin}/rakshabandhan-2026?id=${cardId}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25d366] px-5 py-3 text-[13.5px] font-bold text-white shadow-md hover:bg-[#20ba59] hover:shadow-lg transition-all"
                  >
                    <Share2 className="h-4.5 w-4.5" />
                    Share on WhatsApp
                  </Link>

                  <button
                    onClick={() => copyToClipboard(window.location.href)}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-card-bg px-5 py-3 text-[13.5px] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4.5 w-4.5 text-green-500" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4.5 w-4.5 text-slate-500" />
                        Copy Wish Link
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Sibling card generator promotion */}
          <div className="pt-4">
            <Link
              href="/rakshabandhan-2026"
              onClick={() => {
                setCardId(null);
                setWish(null);
                window.history.pushState({}, "", "/rakshabandhan-2026");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-bold underline"
            >
              Create your own customized wishing card and share stats!
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Creation Form and Dashboard Mode
  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* ────────────────────────── Header Banner/Hero ────────────────────────── */}
      <div className="relative overflow-hidden bg-linear-to-br from-rose-900 via-orange-850 to-amber-900 text-white py-16 md:py-24 border-b border-rose-805">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-amber-200 via-rose-300 to-transparent pointer-events-none" />
        
        {/* Glowing floating lights */}
        <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-rose-500/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-rose-200 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-amber-200">Raksha Bandhan 2026</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            Wishing Card Hub
          </span>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Raksha Bandhan <span className="bg-linear-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">2026</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-rose-100/90 leading-relaxed font-light">
            Create customized wishing cards in Hindi or English, share them instantly on WhatsApp, and track how many times your relatives opened the link!
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Countdown */}
        <section className="bg-card-bg border border-border-color rounded-3xl p-6 sm:p-8 shadow-premium text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-2 text-rose-600">
              <Clock className="h-5 w-5 animate-pulse" />
              <h2 className="font-heading text-sm sm:text-base font-bold uppercase tracking-wider">
                Festive Countdown
              </h2>
            </div>
            
            {timeLeft.isPast ? (
              <div className="space-y-3">
                <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-rose-600 animate-bounce">
                  Happy Raksha Bandhan 2026! 🎉
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto pt-2">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center bg-secondary-bg/60 border border-border-color/60 rounded-2xl py-3 sm:py-4"
                  >
                    <span className="font-heading text-xl sm:text-3xl font-black text-primary-text tabular-nums">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="mt-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-secondary-text">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ────────────────────────── Generator & Generated Result ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Generator Form Section */}
          <section className="lg:col-span-7 bg-card-bg border border-border-color rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
            <div className="space-y-1.5">
              <h2 className="font-heading text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <Gift className="h-5 w-5 text-rose-500" />
                Generate Wishing Link
              </h2>
              <p className="text-xs text-secondary-text">
                Fill in the details to create your customized festival greeting thread.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="sender" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Your Name (Sender) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      id="sender"
                      required
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="e.g. Rahul"
                      maxLength={50}
                      className="block w-full rounded-xl border border-border-color pl-10 pr-4 py-2.5 text-sm text-primary-text placeholder-secondary-text/60 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="receiver" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Sibling Name (Receiver)
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      id="receiver"
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                      placeholder="e.g. Priya (defaults to 'Everyone')"
                      maxLength={50}
                      className="block w-full rounded-xl border border-border-color pl-10 pr-4 py-2.5 text-sm text-primary-text placeholder-secondary-text/60 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Language Switch */}
              <div className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Wishing Language
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLang("hi")}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                      lang === "hi"
                        ? "bg-rose-50 border-rose-500 text-rose-600 shadow-sm"
                        : "border-border-color hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    हिन्दी (Hindi Greeting)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                      lang === "en"
                        ? "bg-rose-50 border-rose-500 text-rose-600 shadow-sm"
                        : "border-border-color hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    English Greeting
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-orange-500 py-3 text-sm font-bold text-white shadow-md hover:from-rose-550 hover:to-orange-450 transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating Card...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Wishing Link & Reveal Stats
                  </>
                )}
              </button>
            </form>

            {/* Generated Results Area */}
            {generatedLink && (
              <div className="pt-5 border-t border-slate-100 space-y-4 animate-fade-in">
                <div className="bg-[#fffbeb] border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    🎉 Card Created successfully!
                  </span>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Your Shareable Wishing Link:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedLink}
                        className="block flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(generatedLink)}
                        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-slate-500" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <Link
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `${sender} ${lang === 'hi' ? 'ने भेजा है आपके लिए रक्षाबंधन का ख़ास संदेश' : 'sent a special Raksha Bandhan wishing card for you'}! 🌸✨\n\nपढ़ें यहाँ: ${generatedLink}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25d366] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#20ba59] transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      Send on WhatsApp
                    </Link>

                    <Link
                      href={`/rakshabandhan-2026?id=${justGeneratedId}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="h-4 w-4 text-slate-500" />
                      Preview Wishing Card
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Creators Live Tracking Dashboard */}
          <section className="lg:col-span-5 bg-card-bg border border-border-color rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 flex flex-col min-h-95">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="font-heading text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <Award className="h-5 w-5 text-rose-500 animate-pulse" />
                  Live Visitor Stats
                </h2>
                <p className="text-[11px] text-secondary-text">
                  Cards generated on this device.
                </p>
              </div>

              <button
                onClick={loadDashboard}
                disabled={refreshingDashboard}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border-color bg-secondary-bg/50 text-slate-600 hover:bg-secondary-bg transition-colors disabled:opacity-50 cursor-pointer"
                title="Refresh stats"
              >
                <RefreshCw className={`h-4 w-4 ${refreshingDashboard ? "animate-spin" : ""}`} />
              </button>
            </div>

            {myCards.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <Eye className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-700">No wishing cards tracked yet</h3>
                  <p className="text-[11px] text-secondary-text max-w-50 mx-auto">
                    Fill the form to generate your first greeting and track views live.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-87.5 scrollbar-thin pr-1 space-y-3">
                {myCards.map((card) => {
                  const cardLink = `${window.location.origin}${window.location.pathname}?id=${card.id}`;
                  return (
                    <div
                      key={card.id}
                      className="border border-border-color/80 bg-secondary-bg/30 hover:bg-secondary-bg/60 rounded-2xl p-4 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-xs font-bold text-slate-800">
                            {card.sender} ➔ {card.receiver}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 shrink-0">
                            {card.lang}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {card.views !== undefined ? (
                              <>
                                <strong className="text-rose-600 font-extrabold">{card.views}</strong> views
                              </>
                            ) : (
                              "loading..."
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyToClipboard(cardLink)}
                          className="p-2 border border-border-color bg-card-bg hover:bg-secondary-bg rounded-lg text-slate-600 transition-colors shadow-sm cursor-pointer"
                          title="Copy Link"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <Link
                          href={`/rakshabandhan-2026?id=${card.id}`}
                          className="p-2 border border-border-color bg-card-bg hover:bg-secondary-bg rounded-lg text-slate-600 transition-colors shadow-sm"
                          title="Open Card"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ────────────────────────── Feature Suggestion Form ────────────────────────── */}
        <section className="bg-linear-to-r from-secondary-bg/60 to-rose-50/20 border border-border-color rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-heading text-lg font-bold text-primary-text">
              Have a special feature request for Rakshabandhan?
            </h3>
            <p className="text-[13px] text-secondary-text max-w-xl">
              We build tools directly requested by our community. Let us know if you want a custom gift budget calculator, sibling memory builder, or anything else!
            </p>
          </div>
          
          <Link
            href="/contact?ref=rakshabandhan"
            className="shrink-0 rounded-xl border border-border-color bg-card-bg px-5 py-3 text-[13.5px] font-bold text-primary-text transition-colors hover:bg-secondary-bg shadow-sm"
          >
            Submit Suggestion
          </Link>
        </section>
      </div>
    </div>
  );
}
