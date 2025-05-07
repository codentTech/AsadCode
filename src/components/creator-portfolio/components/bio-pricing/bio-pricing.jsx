import React from "react";
import { DollarSign } from "lucide-react";

function BioPricing() {
  const creator = {
    bio: "Fashion and lifestyle creator specializing in sustainable fashion tips, minimal aesthetics, and travel diaries. I love creating authentic content that inspires and connects.",
    pricing: [
      { type: "UGC Video", price: "$200" },
      { type: "Sponsored Instagram", price: "$350" },
      { type: "Sponsored TikTok", price: "$225" },
    ],
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="md:flex justify-between gap-8">
        {/* Bio */}
        <div className="md:w-3/5 mb-6 md:mb-0">
          <h3 className="mb-3 border-b pb-1">About the Creator</h3>
          <p className="text-gray-600 leading-relaxed">{creator.bio}</p>
        </div>

        {/* Pricing */}
        <div className="md:w-2/5 md:border-l border-gray-200 md:pl-8">
          <h3 className="mb-3 border-b pb-1">Starting Rates</h3>
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
        </div>
      </div>
    </section>
  );
}

export default BioPricing;
