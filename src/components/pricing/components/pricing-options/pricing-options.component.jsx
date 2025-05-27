import { useState } from "react";
import { Check, Sparkles, Zap, Award, TrendingUp } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { ArrowForward } from "@mui/icons-material";

export default function PricingOptions() {
  const [hoverPay, setHoverPay] = useState(false);
  const [hoverFlat, setHoverFlat] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">
            <span className="relative inline-block">
              <span className="relative z-10">Pricing Options</span>
            </span>
          </h1>
          <p className="text-sm sm:text-lg xl:text-xl text-primary max-w-2xl mx-auto">
            Choose the plan that works best for your business needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 gap-8">
          {/* Pay-As-You-Go Card */}
          <div
            className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ${
              hoverPay ? "transform scale-105 shadow-2xl" : ""
            }`}
            onMouseEnter={() => setHoverPay(true)}
            onMouseLeave={() => setHoverPay(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-700 opacity-10"></div>
            <div className="bg-white p-5 h-full relative z-10 flex flex-col">
              <div className="flex items-center mb-4">
                <h2 className="text-lg xl:text-xl font-bold text-primary">Pay-As-You-Go</h2>
              </div>

              <div className="text-sm space-y-3 mb-4 flex-grow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <span className="font-semibold">9.9% service fee</span> on monthly spend up to
                    $5,000
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <span className="font-semibold">7.9% service fee</span> on spend between
                    $5,001–$10,000
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <span className="font-semibold">5.9% service fee</span> on spend over $10,000
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <span className="font-semibold">3 free gifted</span> or affiliate collaborations
                    per month
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start mb-2">
                <h3 className="text-[16px] font-bold text-gray-600">
                  Unlimited Gifting & Affiliate Plan – $69.99/month
                </h3>
                <span className="text-xs text-primary">
                  *(Best for brands focused on gifting and affiliate campaigns)*
                </span>
              </div>
              <div className="text-sm space-y-3 mb-8 flex-grow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <span className="font-semibold">Run unlimited gifting </span> and affiliate
                    campaigns
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <span className="font-semibold">No platform service</span> fees on gifting or
                    affiliate campaigns
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <span className="font-semibold">Sponsored/UGC campaigns </span>available at
                    standard pay-as-you-go rates
                  </p>
                </div>
              </div>
              <div className="py-4 px-5 bg-indigo-50 rounded-xl">
                <p className="text-primary font-medium">
                  No monthly commitment. Ideal for flexible or smaller campaigns.
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
              hoverFlat ? "transform scale-105 shadow-2xl" : ""
            }`}
            onMouseEnter={() => setHoverFlat(true)}
            onMouseLeave={() => setHoverFlat(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 opacity-10"></div>
            <div className="bg-white p-5 h-full relative z-10 flex flex-col">
              <div className="flex items-center mb-4">
                <h2 className="text-lg xl:text-xl font-bold text-primary">Flat-Rate Plans</h2>
              </div>

              <div className="text-sm space-y-4 mb-8 flex-grow">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-[16px] font-bold text-gray-600">
                      Growth Plan – $525/month
                    </h3>
                  </div>

                  <div className="ml-2 space-y-1">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-semibold">$0 commission</span> on monthly spend of up
                        to $10,000
                      </p>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-semibold">Best for brands</span> running consistent
                        campaigns
                      </p>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-semibold">Unlimited gifted</span> and affiliate
                        campaigns
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-[16px] font-bold text-gray-600">
                      Enterprise Plan – $699/month
                    </h3>
                  </div>

                  <div className="ml-2 space-y-1">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <p className="ml-3 text-gray-600">
                        <span className="font-semibold">$0 commission</span> on monthly spend of up
                        to $20,000
                      </p>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <p className="ml-3 text-gray-600">
                        <span className="font-semibold"> Ideal for </span>high-volume teams seeking
                        predictable costs
                      </p>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-semibold">Unlimited gifted</span> and affiliate
                        campaigns
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-4 px-5 bg-indigo-50 rounded-xl">
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
              className={`absolute -top-20 -right-20 w-40 h-40 bg-purple-600 rounded-full opacity-10 transition-all duration-700 ${hoverFlat ? "scale-150" : "scale-100"}`}
            ></div>
            <div
              className={`absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full opacity-10 transition-all duration-700 ${hoverFlat ? "scale-150" : "scale-100"}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
