import React from "react";
import { DollarSign, RefreshCw } from "lucide-react";
import useBioPricing from "./use-bio-pricing.hook";

const BioPricing = ({ refreshKey, creatorId = null }) => {
  const { creator, isLoading, handleManualRefresh } = useBioPricing(creatorId, refreshKey);

  if (isLoading) {
    return (
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!creator) {
    return (
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="text-center text-gray-500">
          <p>Creator profile not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary">Bio & Pricing</h2>
        <button
          onClick={handleManualRefresh}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="md:flex justify-between gap-8">
        {/* Bio */}
        <div className="md:w-3/5 mb-6 md:mb-0">
          <p className="mb-3 border-b pb-1 font-semibold">About the Creator</p>
          <p className="text-gray-600 leading-relaxed">{creator.bio}</p>
        </div>

        {/* Pricing */}
        <div className="md:w-2/5 md:border-l border-gray-200 md:pl-8">
          <p className="mb-3 border-b pb-1 font-bold">Starting Rates</p>
          {creator.pricing.length > 0 ? (
            <div className="space-y-4">
              {creator.pricing.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-1 bg-gray-50 rounded-lg hover:bg-indigo-50 transition"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <span className="font-semibold">{item.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-gray-600 leading-relaxed"> Available upon request</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BioPricing;
