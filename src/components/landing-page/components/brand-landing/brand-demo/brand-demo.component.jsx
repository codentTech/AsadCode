"use client";

import { CheckCircle, Play } from "lucide-react";
import { BRAND_LANDING_DEMO_BULLETS } from "@/common/constants/brand-landing.constant";

export default function BrandDemo() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4 text-primary leading-tight">
              CleerCut has no credit usage or limits
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
              CleerCut is a complete all-in-one tool that is never capped by credits or usage. Most
              platforms are built around a public database of scraped creator profiles with email
              integrations and API pulls, which forces them to limit what you can do at each tier.
            </p>
            <ul className="space-y-3">
              {BRAND_LANDING_DEMO_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm md:text-base text-gray-700">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 border border-indigo-100 shadow-[0_8px_40px_rgba(129,140,248,0.25)] aspect-video flex items-center justify-center">
              <div className="text-center px-6">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-md">
                  <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
                </div>
                <p className="text-sm font-semibold text-indigo-900">Demo video coming soon</p>
                <p className="text-xs text-indigo-700 mt-1">Looped product walkthrough</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
