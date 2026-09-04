"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import useBrandOfferCta from "./use-brand-offer-cta.hook";

export default function BrandOfferCta() {
  const { handleSignUp, demoHref } = useBrandOfferCta();

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-700">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
          Scale Influencer Campaigns to increase your ROI
        </h2>
        <p className="text-sm md:text-base text-indigo-100 mb-2">Free to sign up & explore</p>
        <p className="text-sm md:text-base text-white mb-6">
          <span className="font-bold">Try 30 Days of Commission Free Payouts</span> → No Credit Card
          Required
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <CustomButton
            text="Sign Up for Free"
            className="btn bg-white text-primary hover:bg-indigo-50 border-0 flex-1 sm:flex-none sm:w-auto"
            onClick={handleSignUp}
          />
          <CustomButton
            text="Book a Demo"
            className="btn bg-white text-gray-900 hover:bg-gray-100 border-0 flex-1 sm:flex-none sm:w-auto"
            href={demoHref}
          />
        </div>
      </div>
    </section>
  );
}
