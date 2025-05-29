import BrandPricing from "./components/brand-pricing/brand-pricing";
import CreatorPricing from "./components/creator-pricing/creator-pricing";
import PricingOptions from "./components/pricing-options/pricing-options.component";
import usePricingHook from "./use-pricing.hook";

export default function PricingPage() {
  const { isCreatorMode, animateTable } = usePricingHook();

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <header className="bg-gradient-to-br from-primary to-primary text-white text-left md:text-center">
        <div className="max-w-8xl mx-auto py-4 md:py-8 px-4 sm:px-6 lg:px-8 text-sm md:text-lg xl:text-xl text-white">
          {isCreatorMode ? (
            <div className="flex flex-col gap-3">
              <p>
                Unlike most platforms that take 15–30% or inflate your rate, CleerCut charges
                creators only the standard 3.2% payment processing fee.
              </p>
              <p className="text-sm md:text-lg">
                No subscription fees. No hidden cuts. No surprise margins. <br />
                Just transparent payouts and protection built for creators.
              </p>
            </div>
          ) : (
            "Unlike most platforms requiring long-term contracts and steep monthly fees, CleerCut offers simple, flexible pricing for everyone from small businesses to large corporations"
          )}
        </div>
      </header>

      <div className="flex flex-col gap-6 p-3 md:p-12">
        {!isCreatorMode && <PricingOptions />}

        <div
          className={`container transition-all duration-500 transform ${animateTable ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <h2 className="text-sm md:text-lg xl:text-xl font-bold text-center py-6 text-indigo-900">
            How CleerCut Compares to Other Platforms
          </h2>
          {isCreatorMode ? <CreatorPricing /> : <BrandPricing />}
        </div>
      </div>
    </div>
  );
}
