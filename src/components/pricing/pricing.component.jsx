import { PieChart, Sparkles, TrendingUp } from "lucide-react";
import BrandPricing from "./components/brand-pricing/brand-pricing";
import CreatorPricing from "./components/creator-pricing/creator-pricing";
import PricingOptions from "./components/pricing-options/pricing-options.component";
import usePricingHook from "./use-pricing.hook";

export default function PricingPage() {
  const { isCreatorMode, animateTable } = usePricingHook();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Banner Section */}
        <div className="p-8 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-t-xl shadow-lg mb-1 transform transition-all duration-500">
          <div className="flex items-center space-x-4">
            <PieChart className="h-12 w-12 flex-shrink-0" />
            <div className="text-indigo-100">
              {isCreatorMode ? (
                <div>
                  <p>
                    Unlike most platforms that take 15–30% or inflate your rate,
                    CleerCut charges creators only the standard 2.9% payment
                    processing fee.
                  </p>
                  <p>
                    No subscription fees. No hidden cuts. No surprise margins.
                    Just transparent payouts and protection built for creators.
                  </p>
                </div>
              ) : (
                "Unlike most platforms requiring long-term contracts and steep monthly fees, CleerCut offers simple, flexible pricing for everyone from small businesses to large corporations"
              )}
            </div>
          </div>
        </div>
        {!isCreatorMode && <PricingOptions />}

        <div
          className={`transition-all duration-500 transform ${animateTable ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <h2 className="text-2xl font-bold text-center py-6 text-indigo-900">
            How CleerCut Compares to Other Platforms
          </h2>
          {isCreatorMode ? <CreatorPricing /> : <BrandPricing />}
        </div>
      </div>
    </div>
  );
}
