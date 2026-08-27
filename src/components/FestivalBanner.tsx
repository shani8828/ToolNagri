"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Gift, Calendar } from "lucide-react";

export default function FestivalBanner() {
  return (
    <div className="relative w-full">
      {/* Glow shadow behind the card */}
      <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-rose-500 to-amber-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-10" />

      <div className="festival-shimmer-bg group relative overflow-hidden rounded-3xl border border-rose-100 bg-linear-to-r from-[#fef2f2] via-[#fffbeb] to-[#fff7ed] p-6 sm:p-8 md:p-10 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(244,63,94,0.12)]">
        {/* Decorative corner circles */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-200/30 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10">
          
          {/* Left / Top side: Copy and buttons */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-600 shadow-sm border border-rose-200/40">
              <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              Festival Special
            </span>

            <h2 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Raksha Bandhan <span className="bg-linear-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">2026</span>
            </h2>

            <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-slate-600 max-w-xl">
              Celebrate the beautiful bond of love, protection, and sibling togetherness! 
              We are preparing special greeting generators, customized digital Rakhis, and subh mahurat calculators.
              Check out our early launch page below.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Link
                href="/rakshabandhan-2026"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-orange-500 px-5 py-3 text-[13.5px] font-bold text-white shadow-md hover:from-rose-550 hover:to-orange-450 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Celebrate Sibling Bond
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <div className="flex items-center gap-4 text-[12px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4.5 w-4.5 text-rose-500" />
                  Aug 28, 2026
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-350" />
                <span className="flex items-center gap-1">
                  <Gift className="h-4.5 w-4.5 text-orange-500" />
                  Digital Wishes
                </span>
              </div>
            </div>
          </div>

          {/* Right / Bottom side: Beautiful Rakhi Vector SVG */}
          <div className="md:col-span-5 flex justify-center items-center pointer-events-none">
            <div className="relative w-full max-w-50 sm:max-w-60 aspect-square flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-[0_10px_20px_rgba(244,63,94,0.25)] animate-pulse"
                style={{ animationDuration: '4s' }}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Horizontal Threads (Rakhi Dhaaga) */}
                <path
                  d="M10 100 H190"
                  stroke="url(#threadGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M10 100 L30 92 M10 100 L30 108 M170 92 L190 100 M170 108 L190 100"
                  stroke="url(#threadGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.75"
                />

                {/* Outer beads on threads */}
                <circle cx="50" cy="100" r="4.5" fill="#f59e0b" />
                <circle cx="62" cy="100" r="3.5" fill="#ef4444" />
                <circle cx="72" cy="100" r="2.5" fill="#f59e0b" />
                
                <circle cx="150" cy="100" r="4.5" fill="#f59e0b" />
                <circle cx="138" cy="100" r="3.5" fill="#ef4444" />
                <circle cx="128" cy="100" r="2.5" fill="#f59e0b" />

                {/* Center Rakhi Structure */}
                
                {/* Outer Glowing Ring */}
                <circle cx="100" cy="100" r="42" fill="url(#outerGlow)" opacity="0.3" />
                
                {/* Golden sun rays / thread fringe */}
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

                {/* Golden Circle Base */}
                <circle cx="100" cy="100" r="36" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />

                {/* Red Floral Petals */}
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

                {/* Small Gold Inner Ring */}
                <circle cx="100" cy="100" r="20" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" />
                
                {/* Center Star / Flower detail */}
                <path
                  d="M100 88 L103 97 L112 100 L103 103 L100 112 L97 103 L88 100 L97 97 Z"
                  fill="#d91b5c"
                />

                {/* Pearl Bead in the center */}
                <circle cx="100" cy="100" r="5" fill="white" />
                <circle cx="98.5" cy="98.5" r="1.5" fill="#fef2f2" opacity="0.8" />

                {/* Definitions for Gradients */}
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
              
              {/* Extra little decorative stars */}
              <div className="absolute top-4 right-4 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="h-4 w-4 fill-current" />
              </div>
              <div className="absolute bottom-6 left-2 text-rose-500 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                <Sparkles className="h-4.5 w-4.5 fill-current" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
