"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import useBrandHero from "./use-brand-hero.hook";

export default function BrandHero() {
  const { handleSignUp, demoHref } = useBrandHero();

  return (
    <section className="relative pt-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-50/60 via-transparent to-indigo-50/40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-1/3 -left-24 w-80 h-80 bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-12 pb-12 md:pb-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:space-x-12 lg:space-x-20">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-3">
              Hire proven creators who <span className="text-primary">deliver results</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-3">
              Discover verified creators, generate contracts in seconds, protect your budget with
              escrow, and manage campaigns from outreach to deliverables in one streamlined
              workspace.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-bold">Try 30 Days Commission Free</span> → No Credit Card
              Required
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <CustomButton
                text="Sign Up for Free"
                className="btn-primary flex-1 sm:flex-none sm:w-auto"
                onClick={handleSignUp}
              />
              <CustomButton
                text="Book a Demo"
                className="btn-outline flex-1 sm:flex-none sm:w-auto"
                href={demoHref}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative group">
              <div
                className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-indigo-300/50 blur-3xl opacity-80"
                aria-hidden
              />
              <img
                src="/assets/images/landing/brands/hero.png"
                alt="CleerCut creator profile dashboard"
                className="relative z-10 w-full h-auto rounded-xl object-contain shadow-[0_8px_40px_rgba(129,140,248,0.35)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
