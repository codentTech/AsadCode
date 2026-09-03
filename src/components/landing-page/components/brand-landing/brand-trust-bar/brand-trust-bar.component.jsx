"use client";

import { BRAND_LANDING_TRUST_LOGOS } from "@/common/constants/brand-landing.constant";

export default function BrandTrustBar() {
  const logos = [...BRAND_LANDING_TRUST_LOGOS, ...BRAND_LANDING_TRUST_LOGOS];

  return (
    <section className="border-y border-gray-100 bg-gray-50 py-6 md:py-8 overflow-hidden" aria-label="Trusted by brands">
      <div className="brand-trust-marquee group">
        <div className="brand-trust-track flex w-max items-center gap-10 md:gap-16 px-4">
          {logos.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="shrink-0 text-sm md:text-base font-semibold tracking-wide text-gray-400 uppercase whitespace-nowrap select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
