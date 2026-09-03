"use client";

import { Check } from "lucide-react";
import { BRAND_LANDING_WHY_POINTS } from "@/common/constants/brand-landing.constant";

export default function BrandWhyItMatters() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-24 text-white"
      style={{
        background: "linear-gradient(155deg, #2F28B8 0%, #3A32C9 32%, #4F46E0 62%, #6A63EA 100%)",
      }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="whyPyr" x1="50%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#D7D3FF" stopOpacity="0.42" />
            <stop offset="40%" stopColor="#B4AEFF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#8F88F2" stopOpacity="0.16" />
          </linearGradient>
        </defs>

        <g fill="none" stroke="#FFFFFF" strokeLinecap="round">
          <path d="M -180 720 A 780 780 0 0 1 620 70" strokeWidth="1.35" strokeOpacity="0.45" />
          <path d="M -140 760 A 860 860 0 0 1 700 90" strokeWidth="1.25" strokeOpacity="0.36" />
          <path d="M -100 800 A 940 940 0 0 1 780 110" strokeWidth="1.2" strokeOpacity="0.28" />
          <path d="M -60 840 A 1020 1020 0 0 1 860 130" strokeWidth="1.15" strokeOpacity="0.22" />
          <path d="M -220 560 A 640 640 0 0 1 480 40" strokeWidth="1.2" strokeOpacity="0.3" />
          <path d="M -200 480 A 560 560 0 0 1 400 20" strokeWidth="1.1" strokeOpacity="0.22" />
        </g>

        <polygon points="1040,230 1550,760 -120,760" fill="url(#whyPyr)" />
        <polygon
          points="1040,230 1550,760 -120,760"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.18"
          strokeWidth="1.25"
        />
        <polygon points="1040,230 1480,720 40,720" fill="#FFFFFF" fillOpacity="0.07" />
      </svg>

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-6xl">
        <div className="mx-auto max-w-5xl text-center mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-[2.35rem] font-bold leading-[1.15] tracking-tight text-white">
            <span className="block">Influencer Marketing is dominating advertising for ROI.</span>
            <span className="block mt-1.5">Are you equipped to keep up?</span>
          </h2>
          <p className="mt-5 md:mt-6 text-sm md:text-[15px] text-white leading-relaxed max-w-2xl mx-auto">
            The creator economy is evolving <span className="font-bold">4x faster</span> than
            traditional marketing channels. Using scraped data, juggling multiple tools that were
            never designed to integrate, and hiring based off instinct is wasting your marketing
            budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {BRAND_LANDING_WHY_POINTS.map((point) => (
            <div key={point.title} className="text-center flex flex-col items-center">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4F46E5] shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
                <Check className="h-5 w-5" strokeWidth={3} />
              </span>
              <h3 className="text-sm md:text-[15px] font-bold mb-2 leading-snug min-h-[2.75rem] flex items-end justify-center px-1 text-white">
                {point.title}
              </h3>
              <p className="text-xs md:text-sm text-white/95 leading-relaxed">{point.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
