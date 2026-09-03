"use client";

import InstagramIcon from "@/common/icons/instagram";
import TikTokIcon from "@/common/icons/tiktok";
import YoutubeIcon from "@/common/icons/youtube";

const CARDS = [
  {
    name: "Stripe",
    copy: "Escrow-backed payments, released only when content is approved",
    mark: (
      <img
        src="/assets/images/landing/brands/stripe-logo.png"
        alt="Stripe"
        className="h-8 w-auto object-contain md:h-10"
      />
    ),
  },
  {
    name: "Shopify",
    copy: "Discount codes, gifting fulfilment, and commission tracking on real orders",
    mark: (
      <img
        src="/assets/images/landing/brands/shopify-logo.png"
        alt="Shopify"
        className="h-8 w-auto object-contain md:h-10"
      />
    ),
  },
  {
    name: "Official Platform Data",
    copy: "Pulled directly from creators' connected accounts, refreshed every 24 hours",
    mark: (
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
          <InstagramIcon width={28} height={28} />
        </span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
          <TikTokIcon width={28} height={28} />
        </span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
          <YoutubeIcon width={28} height={28} />
        </span>
      </div>
    ),
  },
];

export default function BrandIntegrations() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-4xl font-bold mb-3 text-primary">
            Connected to the tools you already use
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Payments, commerce, and creator data, wired in from day one
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {CARDS.map((card) => (
            <div
              key={card.name}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="mb-4 min-h-[2.5rem] flex items-center">{card.mark}</div>
              <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-2">{card.name}</h3>
              <p className="text-sm text-gray-600">{card.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
