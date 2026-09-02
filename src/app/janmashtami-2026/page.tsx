"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles, Gift, Clock, Heart, Award, ArrowRight,
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

function JanmashtamiContent() {
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

  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get("id") : null;

  // 1. Detect URL ID client-side to render Wishing Card
  useEffect(() => {
    if (id) {
      setCardId(id);
      fetchCardDetails(id);
    } else {
      setCardId(null);
      setWish(null);
    }
  }, [id]);

  // 2. Fetch Card Details (and increment views)
  const fetchCardDetails = async (id: string) => {
    setLoadingCard(true);
    setErrorCard(null);
    try {
      const res = await fetch(`/api/janmashtami?id=${id}`);
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
      const stored = localStorage.getItem("toolnagri_janmashtami_cards");
      if (stored) {
        const cards: LocalCard[] = JSON.parse(stored);
        setMyCards(cards);

        // Hydrate view counts for all dashboard cards asynchronously
        setRefreshingDashboard(true);
        const updatedCards = await Promise.all(
          cards.map(async (card) => {
            try {
              const res = await fetch(`/api/janmashtami?id=${card.id}&track=true`);
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
        localStorage.setItem("toolnagri_janmashtami_cards", JSON.stringify(updatedCards));
      }
    } catch (e) {
      console.error("Failed to load dashboard:", e);
    } finally {
      setRefreshingDashboard(false);
    }
  };

  // 4. Live Countdown to September 4, 2026
  useEffect(() => {
    const targetDate = new Date("2026-09-04T00:00:00").getTime();

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
        colors: ["#4f46e5", "#2563eb", "#0d9488", "#f59e0b", "#facc15"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#4f46e5", "#2563eb", "#0d9488", "#f59e0b", "#facc15"],
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
      const res = await fetch("/api/janmashtami", {
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
        const stored = localStorage.getItem("toolnagri_janmashtami_cards");
        const cards: LocalCard[] = stored ? JSON.parse(stored) : [];
        const newCard: LocalCard = {
          id: data.id,
          sender: sender.trim(),
          receiver: receiver.trim() || "Everyone",
          lang,
          views: 0,
        };
        cards.unshift(newCard);
        localStorage.setItem("toolnagri_janmashtami_cards", JSON.stringify(cards));
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

  // Krishna Janmashtami Poetry Lists
  const poetryList = {
    en: [
      "On this holy midnight hour,",
      "Little Krishna shows his power.",
      "With flute and feather, blue and gold,",
      "May his blessings your life enfold.",
    ],
    hi: [
      "नंद के आनंद भयो, जय कन्हैया लाल की,",
      "मोर मुकुट बंशीधर की, जय गिरधर गोपाल की।",
      "आओ मिलकर झूमें गाएं, कान्हा का त्योहार है,",
      "जन्माष्टमी की शुभकामनाएं, राधे-कृष्ण का प्यार है।"
    ]
  };

  // Render Wishing Card Mode
  if (cardId) {
    return (
      <div className="min-h-screen pb-20 bg-linear-to-b from-[#eef2ff] via-[#eff6ff] to-background">
        <div className="mx-auto max-w-2xl px-4 py-12 text-center space-y-8">

          {/* Back button */}
          <div className="flex justify-start">
            <Link
              href="/janmashtami-2026"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 shadow-sm transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Create Your Wishing Card
            </Link>
          </div>

          {loadingCard && (
            <div className="rounded-3xl border border-indigo-100 bg-card-bg shadow-premium p-12 space-y-6 animate-pulse">
              <div className="h-10 w-40 bg-indigo-100 rounded-full mx-auto" />
              <div className="h-40 w-40 bg-amber-100 rounded-full mx-auto" />
              <div className="h-8 w-60 bg-indigo-100 rounded-lg mx-auto" />
              <div className="h-20 w-80 bg-slate-100 rounded-lg mx-auto" />
            </div>
          )}

          {errorCard && (
            <div className="rounded-3xl border border-indigo-200 bg-red-50 p-10 space-y-4">
              <h2 className="font-heading text-xl font-bold text-red-700">Wishing Card Unavailable</h2>
              <p className="text-sm text-red-600">{errorCard}</p>
              <Link
                href="/janmashtami-2026"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-[13px] font-bold text-white hover:bg-indigo-700 shadow-sm transition-colors"
              >
                Go Create New Link
              </Link>
            </div>
          )}

          {wish && (
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-linear-to-r from-indigo-400 via-blue-400 to-teal-400 rounded-3xl blur-xl opacity-15 pointer-events-none" />

              <div className="festival-shimmer-bg relative rounded-3xl border border-indigo-100 bg-linear-to-br from-[#ffffff] to-[#f9fbff] p-8 sm:p-12 shadow-premium space-y-8">

                {/* Header Greeting */}
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 border border-indigo-100">
                    <Sparkles className="h-3.5 w-3.5 fill-indigo-600/20" />
                    Special Greeting
                  </span>

                  {wish.lang === "hi" ? (
                    <h1 className="font-heading text-2xl sm:text-3xl font-black text-indigo-600 leading-snug">
                      कृष्ण जन्माष्टमी की हार्दिक शुभकामनाएं
                    </h1>
                  ) : (
                    <h1 className="font-heading text-2xl sm:text-3xl font-black text-indigo-600 leading-snug">
                      Happy Krishna Janmashtami
                    </h1>
                  )}
                </div>

                {/* Animated Peacock Feather */}
                <div className="flex justify-center">
                  <div className="relative w-44 sm:w-52 aspect-square flex items-center justify-center">
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full drop-shadow-[0_10px_20px_rgba(79,70,229,0.25)] animate-pulse"
                      style={{ animationDuration: '4s' }}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Soft radial glow behind the eye */}
                      <circle cx="100" cy="70" r="48" fill="url(#featherGlow)" opacity="0.3" />

                      {/* Barbs (fronds) fanning outward along the shaft */}
                      <g stroke="url(#barbGradient)" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
                        {Array.from({ length: 13 }).map((_, i) => {
                          const t = i / 12;
                          const y = 100 + t * 82;
                          const len = 12 + t * 26;
                          const dy = len * 0.42;
                          return (
                            <g key={i}>
                              <path d={`M100 ${y} L${100 - len} ${y - dy}`} />
                              <path d={`M100 ${y} L${100 + len} ${y - dy}`} />
                            </g>
                          );
                        })}
                      </g>

                      {/* Central shaft */}
                      <path
                        d="M100 188 C 98 142, 99 112, 100 92"
                        stroke="url(#shaftGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* The eye (ocellus) - concentric ovals */}
                      <ellipse cx="100" cy="70" rx="33" ry="41" fill="#0d9488" />
                      <ellipse cx="100" cy="70" rx="25" ry="32" fill="#ca8a04" />
                      <ellipse cx="100" cy="71" rx="18" ry="24" fill="#1d4ed8" />

                      {/* Inner heart / leaf in deep indigo */}
                      <path d="M100 90 C 86 74, 85 58, 100 56 C 115 58, 114 74, 100 90 Z" fill="#312e81" />

                      {/* Bright cyan crescent highlight */}
                      <path
                        d="M100 87 C 91 78, 91 66, 99 60"
                        stroke="#22d3ee"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle cx="100" cy="62" r="3" fill="#a5f3fc" />

                      <defs>
                        <linearGradient id="barbGradient" x1="100" y1="90" x2="100" y2="185" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#0d9488" />
                          <stop offset="55%" stopColor="#0891b2" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                        <linearGradient id="shaftGradient" x1="100" y1="92" x2="100" y2="188" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#ca8a04" />
                          <stop offset="100%" stopColor="#15803d" />
                        </linearGradient>
                        <radialGradient id="featherGlow" cx="100" cy="70" r="48" gradientUnits="userSpaceOnUse">
                          <stop offset="40%" stopColor="#4f46e5" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Wishing Message Details */}
                <div className="space-y-4">
                  <div className="inline-block bg-indigo-50/50 border border-indigo-100 rounded-2xl px-6 py-4">
                    {wish.lang === "hi" ? (
                      <p className="text-lg sm:text-xl text-slate-800 leading-relaxed">
                        <strong className="text-indigo-600 font-extrabold">{wish.sender}</strong>,{" "}
                        <span className="font-medium">अपने प्रिय</span>{" "}
                        <strong className="text-amber-600 font-extrabold">{wish.receiver}</strong>{" "}
                        को कृष्ण जन्माष्टमी की हार्दिक शुभकामनाएं भेज रहे हैं! 🦚🪈
                      </p>
                    ) : (
                      <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-light">
                        <strong className="text-indigo-600 font-extrabold">{wish.sender}</strong> is wishing{" "}
                        <strong className="text-amber-600 font-extrabold">{wish.receiver}</strong> a blessed and joyful{" "}
                        <span className="font-semibold text-indigo-500">Krishna Janmashtami!</span> 🦚🪈
                      </p>
                    )}
                  </div>

                  {/* Poetry Block */}
                  <div className="py-2 italic text-slate-600 font-medium text-sm sm:text-base space-y-1 relative">
                    <span className="absolute -top-3 left-6 text-4xl text-indigo-200 font-serif opacity-30">“</span>
                    {(wish.lang === "hi" ? poetryList.hi : poetryList.en).map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                    <span className="absolute -bottom-6 right-6 text-4xl text-indigo-200 font-serif opacity-30">”</span>
                  </div>
                </div>

                {/* Tracking Badge in Page */}
                <div className="pt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Eye className="h-4 w-4 text-slate-400" />
                  This wish card has been opened <span className="text-indigo-600 font-bold">{wish.views}</span> times.
                </div>

                {/* Card CTA & Sharing Options */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${wish.sender} ${wish.lang === 'hi' ? 'ने भेजा है आपके लिए कृष्ण जन्माष्टमी का ख़ास संदेश' : 'sent a special Krishna Janmashtami wishing card for you'}! 🦚🪈\n\n${wish.lang === 'hi' ? 'पढ़ें यहाँ' : 'Open here'}: ${window.location.origin}/janmashtami-2026?id=${cardId}`
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

          {/* Wishing card generator promotion */}
          <div className="pt-4">
            <Link
              href="/janmashtami-2026"
              onClick={() => {
                setCardId(null);
                setWish(null);
                window.history.pushState({}, "", "/janmashtami-2026");
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
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-950 via-blue-900 to-purple-900 text-white py-16 md:py-24 border-b border-indigo-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-amber-200 via-indigo-300 to-transparent pointer-events-none" />

        {/* Glowing floating lights */}
        <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-amber-200">Krishna Janmashtami 2026</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            Wishing Card Hub
          </span>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Krishna Janmashtami <span className="bg-linear-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">2026</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-indigo-100/90 leading-relaxed font-light">
            Create customized wishing cards in Hindi or English, share them instantly on WhatsApp, and track how many times your friends and family opened the link!
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 space-y-12">

        {/* Countdown */}
        <section className="bg-card-bg border border-border-color rounded-3xl p-6 sm:p-8 shadow-premium text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-2 text-indigo-600">
              <Clock className="h-5 w-5 animate-pulse" />
              <h2 className="font-heading text-sm sm:text-base font-bold uppercase tracking-wider">
                Festive Countdown
              </h2>
            </div>

            {timeLeft.isPast ? (
              <div className="space-y-3">
                <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-indigo-600 animate-bounce">
                  Happy Krishna Janmashtami 2026! 🎉
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
                <Gift className="h-5 w-5 text-indigo-500" />
                Generate Wishing Link
              </h2>
              <p className="text-xs text-secondary-text">
                Fill in the details to create your personalised Krishna Janmashtami greeting.
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
                      className="block w-full rounded-xl border border-border-color pl-10 pr-4 py-2.5 text-sm text-primary-text placeholder-secondary-text/60 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="receiver" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Recipient Name (Receiver)
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      id="receiver"
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                      placeholder="e.g. Meera (defaults to 'Everyone')"
                      maxLength={50}
                      className="block w-full rounded-xl border border-border-color pl-10 pr-4 py-2.5 text-sm text-primary-text placeholder-secondary-text/60 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                        ? "bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm"
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
                        ? "bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm"
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
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-500 py-3 text-sm font-bold text-white shadow-md hover:from-indigo-500 hover:to-blue-400 transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
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
                        `${sender} ${lang === 'hi' ? 'ने भेजा है आपके लिए कृष्ण जन्माष्टमी का ख़ास संदेश' : 'sent a special Krishna Janmashtami wishing card for you'}! 🦚🪈\n\n${lang === 'hi' ? 'पढ़ें यहाँ' : 'Open here'}: ${generatedLink}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25d366] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#20ba59] transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      Send on WhatsApp
                    </Link>

                    <Link
                      href={`/janmashtami-2026?id=${justGeneratedId}`}
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
                  <Award className="h-5 w-5 text-indigo-500 animate-pulse" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
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
                          <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 shrink-0">
                            {card.lang}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {card.views !== undefined ? (
                              <>
                                <strong className="text-indigo-600 font-extrabold">{card.views}</strong> views
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
                          href={`/janmashtami-2026?id=${card.id}`}
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
        <section className="bg-linear-to-r from-secondary-bg/60 to-indigo-50/30 border border-border-color rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-heading text-lg font-bold text-primary-text">
              Have a special feature request for Janmashtami?
            </h3>
            <p className="text-[13px] text-secondary-text max-w-xl">
              We build tools directly requested by our community. Let us know if you want a custom Dahi Handi countdown, a bhajan playlist, or anything else!
            </p>
          </div>

          <Link
            href="/contact?ref=janmashtami"
            className="shrink-0 rounded-xl border border-border-color bg-card-bg px-5 py-3 text-[13.5px] font-bold text-primary-text transition-colors hover:bg-secondary-bg shadow-sm"
          >
            Submit Suggestion
          </Link>
        </section>
      </div>
    </div>
  );
}

export default function JanmashtamiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-semibold text-secondary-text">Loading wishing card hub...</p>
        </div>
      </div>
    }>
      <JanmashtamiContent />
    </Suspense>
  );
}
