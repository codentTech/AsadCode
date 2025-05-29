import CustomButton from "@/common/components/custom-button/custom-button.component";
import { useState } from "react";

const payAsYouGoFeatures = [
  { title: "9.9% service fee on monthly spend up to $5,000" },
  { title: "7.9% service fee on spend between $5,001–$10,000" },
  { title: "5.9% service fee on spend over $10,000" },
  { title: "3 free gifted or affiliate collaborations per month" },
];

const unlimitedPlanFeatures = [
  { title: "Run unlimited gifting and affiliate campaigns" },
  { title: "No platform service fees on gifting or affiliate campaigns" },
  { title: "Sponsored/UGC campaigns available at standard pay-as-you-go rates" },
];

const flatRatePlans = [
  {
    name: "Growth Plan – $525/month",
    features: [
      "$0 commission on monthly spend of up to $10,000",
      "Best for brands running consistent campaigns",
      "Unlimited gifted and affiliate campaigns",
    ],
  },
  {
    name: "Enterprise Plan – $699/month",
    features: [
      "$0 commission on monthly spend of up to $20,000",
      "Ideal for high-volume teams seeking predictable costs",
      "Unlimited gifted and affiliate campaigns",
    ],
  },
];

export default function PricingOptions() {
  const [hoverCard, setHoverCard] = useState();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">
            <span className="relative inline-block">
              <span className="relative z-10">Pricing Options</span>
            </span>
          </h1>
          <p className="text-xs md:text-sm sm:text-lg xl:text-xl text-primary max-w-2xl mx-auto">
            Choose the plan that works best for your business needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 gap-8">
          {/* Pay-As-You-Go Card */}
          <div
            className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ${
              hoverCard === "pay" ? "transform scale-105 shadow-2xl" : ""
            }`}
            onMouseEnter={() => setHoverCard("pay")}
            onMouseLeave={() => setHoverCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-700 opacity-10" />
            <div className="bg-white p-5 h-full relative z-10 flex flex-col">
              <h2 className="text-lg xl:text-xl font-bold text-primary mb-4">Pay-As-You-Go</h2>

              <div className="text-xs md:text-sm space-y-3 mb-4 flex-grow">
                {payAsYouGoFeatures.map((item, i) => (
                  <div key={i} className="relative flex items-start">
                    <span className="absolute left-0 top-1.5 h-2 w-2 bg-indigo-500 rounded-full"></span>

                    <p className="pl-4 text-gray-600">{item.title}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-[16px] font-bold text-gray-600 mb-2">
                Unlimited Gifting & Affiliate Plan – $69.99/month
              </h3>

              <div className="text-xs md:text-sm space-y-3 mb-8">
                {unlimitedPlanFeatures.map((item, i) => (
                  <div key={i} className="relative flex items-start">
                    <span className="absolute left-0 top-1.5 h-2 w-2 bg-indigo-500 rounded-full"></span>

                    <p className="pl-4 text-gray-600">{item.title}</p>
                  </div>
                ))}
              </div>

              <div className="py-4 px-5 bg-indigo-50 rounded-lg text-xs md:text-sm">
                <p className="text-primary font-medium">
                  Best for brands focused on gifting or affiliate campaigns, or those looking for
                  flexibility without a fixed monthly budget.
                </p>
              </div>

              <div className="mt-8">
                <CustomButton text="Get Started" />
              </div>
            </div>
          </div>

          {/* Flat-Rate Card */}
          <div
            className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ${
              hoverCard === "flat" ? "transform scale-105 shadow-2xl" : ""
            }`}
            onMouseEnter={() => setHoverCard("flat")}
            onMouseLeave={() => setHoverCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 opacity-10" />
            <div className="bg-white p-5 h-full relative z-10 flex flex-col">
              <h2 className="text-lg xl:text-xl font-bold text-primary mb-4">Flat-Rate Plans</h2>

              <div className="text-xs md:text-sm space-y-4 mb-8 flex-grow">
                {flatRatePlans.map((plan, i) => (
                  <div key={i}>
                    <h3 className="text-[16px] font-bold text-gray-600 mb-2">{plan.name}</h3>
                    <div className="ml-2 space-y-1">
                      {plan.features.map((feature, j) => (
                        <div key={j} className="relative flex items-start">
                          <span className="absolute left-0 top-1.5 h-2 w-2 bg-indigo-500 rounded-full"></span>

                          <p className="pl-4 text-gray-600">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-4 px-5 bg-indigo-50 rounded-lg text-xs md:text-sm">
                <p className="text-primary font-medium">
                  3% service fee applies to spend exceeding plan limits.
                </p>
              </div>

              <div className="w-full mt-8">
                <CustomButton text="Choose Plan" />
              </div>
            </div>

            {/* Floating animations */}
            <div
              className={`absolute -top-20 -right-20 w-40 h-40 bg-purple-600 rounded-full opacity-10 transition-all duration-700 ${
                hoverCard === "flat" ? "scale-150" : "scale-100"
              }`}
            />
            <div
              className={`absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full opacity-10 transition-all duration-700 ${
                hoverCard === "flat" ? "scale-150" : "scale-100"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
