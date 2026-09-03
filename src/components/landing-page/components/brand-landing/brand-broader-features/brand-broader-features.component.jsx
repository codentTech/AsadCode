"use client";

import {
  BRAND_LANDING_FEATURE_CARDS,
  BRAND_LANDING_FEE_ROWS,
} from "@/common/constants/brand-landing.constant";

function FeeComparisonTable() {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-left text-[11px] sm:text-xs">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-2.5 py-2 font-semibold">Cost on $5,000 spend</th>
            <th className="px-2.5 py-2 font-semibold">Typical platform</th>
            <th className="px-2.5 py-2 font-semibold text-primary">CleerCut Starter</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-100 text-gray-500">
            <td className="px-2.5 py-1.5" colSpan={3}>
              10% commission + Stripe fees passed on · $99/mo, up to $5,000 campaign spend
            </td>
          </tr>
          {BRAND_LANDING_FEE_ROWS.map((row) => (
            <tr
              key={row.label}
              className={`border-t border-gray-100 ${row.emphasize ? "bg-indigo-50 font-bold text-gray-900" : "text-gray-700"}`}
            >
              <td className="px-2.5 py-2">{row.label}</td>
              <td className="px-2.5 py-2 tabular-nums">{row.typical}</td>
              <td className="px-2.5 py-2 tabular-nums text-primary">{row.cleercut}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-2.5 py-2 text-[10px] sm:text-xs text-gray-500 bg-white border-t border-gray-100">
        You keep $546 on the same campaign spend
      </p>
    </div>
  );
}

export default function BrandBroaderFeatures() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 mb-8 md:mb-10">
          <h2 className="text-xl md:text-4xl font-bold text-primary md:max-w-md shrink-0">
            Take a look at the broader range of features we offer
          </h2>
          <div className="md:border-l md:border-gray-200 md:pl-8">
            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              Run your campaigns end to end. From inbound creator applications and zero payment
              processing fees to Shopify gifting and sales attribution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {BRAND_LANDING_FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-white p-3 sm:p-4 border-b border-gray-100">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-auto max-h-56 object-contain rounded-lg"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.copy}</p>
                {card.showFeeTable ? <FeeComparisonTable /> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
