"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Gift, Calendar } from "lucide-react";

export default function FestivalBanner() {
  return (
    <div className="relative w-full">
      {/* Glow shadow behind the card */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-blue-500 to-teal-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-10" />

      <div className="festival-shimmer-bg group relative overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-r from-[#eef2ff] via-[#ecfeff] to-[#eff6ff] p-6 sm:p-8 md:p-10 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(79,70,229,0.12)]">
        {/* Decorative corner circles */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-200/30 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-teal-200/30 blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10">

          {/* Left / Top side: Copy and buttons */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm border border-indigo-200/40">
              <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              Festival Special
            </span>

            <h2 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Krishna Janmashtami <span className="bg-linear-to-r from-indigo-600 via-blue-500 to-amber-500 bg-clip-text text-transparent">2026</span>
            </h2>

            <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-slate-600 max-w-xl">
              Celebrate the divine birth of Lord Krishna!
              We are preparing personalised greeting generators, digital wishing cards, and midnight muhurat countdowns.
              Check out our early launch page below.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Link
                href="/janmashtami-2026"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-500 px-5 py-3 text-[13.5px] font-bold text-white shadow-md hover:from-indigo-500 hover:to-blue-400 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Janmashtami Wishes
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex items-center gap-4 text-[12px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4.5 w-4.5 text-indigo-500" />
                  Sep 4, 2026
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1">
                  <Gift className="h-4.5 w-4.5 text-amber-500" />
                  Digital Wishes
                </span>
              </div>
            </div>
          </div>

          {/* Right / Bottom side: Peacock Feather Vector SVG */}
          <div className="md:col-span-5 flex justify-center items-center pointer-events-none">
            <div className="relative w-full max-w-50 sm:max-w-60 aspect-square flex items-center justify-center">
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

                {/* Definitions for Gradients */}
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

              {/* Extra little decorative stars */}
              <div className="absolute top-4 right-4 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="h-4 w-4 fill-current" />
              </div>
              <div className="absolute bottom-6 left-2 text-indigo-500 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                <Sparkles className="h-4.5 w-4.5 fill-current" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
