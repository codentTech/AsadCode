"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import {
  BRAND_PRICING_AGENCY_POINTS,
  BRAND_PRICING_BILLING_OPTIONS,
  BRAND_PRICING_BLUE,
  BRAND_PRICING_COMPARE_ROWS,
  BRAND_PRICING_CONTACT_MAIL,
  BRAND_PRICING_ENTRY_CARDS,
} from "@/common/constants/brand-pricing.constant";
import { Check, ChevronDown } from "lucide-react";
import useBrandPricingPage from "./use-brand-pricing-page.hook";

function CheckIcon({ className = "text-[#4552DF]" }) {
  return <Check className={`h-4 w-4 shrink-0 mt-0.5 ${className}`} strokeWidth={2.5} />;
}

export default function BrandPricingPage() {
  const {
    billingCycle,
    handleBillingChange,
    openFaqIndex,
    handleFaqToggle,
    pricedTiers,
    faqs,
  } = useBrandPricingPage();

  return (
    <div className="bg-[#F7F8FA] text-[#16181D]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-12 md:pt-16 pb-16 md:pb-24">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight mb-2.5 text-[#16181D]">
            Pricing that scales with you
          </h1>
          <p className="text-sm md:text-base text-[#565B66] max-w-2xl mx-auto">
            From free gifted collabs to enterprise-grade campaigns — pick what fits, upgrade when
            you&apos;re ready.
          </p>
        </div>

        <div className="mx-auto mb-10 md:mb-12 flex max-w-[640px] items-start gap-3 rounded-[14px] border border-[#E4E6EB] bg-white px-5 py-5 sm:px-8 text-left">
          <span
            className="mt-2 h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: BRAND_PRICING_BLUE }}
          />
          <p className="text-[13.5px] leading-relaxed text-[#565B66] m-0">
            New to CleerCut?{" "}
            <strong className="font-semibold text-[#16181D]">
              Try 30 days of unlimited, commission-free campaigns
            </strong>{" "}
            across Paid, Affiliate, and gifted — no credit card required.
          </p>
        </div>

        <div className="mx-auto mb-10 grid max-w-[780px] grid-cols-1 gap-4 sm:grid-cols-2">
          {BRAND_PRICING_ENTRY_CARDS.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl border p-6 ${
                card.highlighted
                  ? "border-transparent text-white"
                  : "border-[#E4E6EB] bg-white"
              }`}
              style={
                card.highlighted
                  ? { backgroundColor: BRAND_PRICING_BLUE, borderColor: BRAND_PRICING_BLUE }
                  : undefined
              }
            >
              <h3
                className={`text-[17px] font-semibold mb-3 leading-snug ${
                  card.highlighted ? "!text-white" : "text-[#16181D]"
                }`}
              >
                {card.name}
              </h3>
              <p
                className={`text-[26px] font-semibold mb-5 ${
                  card.highlighted ? "text-white" : "text-[#16181D]"
                }`}
              >
                {card.price}
                <span
                  className={`text-[13px] font-medium ${
                    card.highlighted ? "text-[#C9CFF6]" : "text-[#8A8F99]"
                  }`}
                >
                  {card.unit}
                </span>
              </p>
              <ul
                className={`flex flex-col gap-3 border-t pt-4 ${
                  card.highlighted ? "border-white/25" : "border-[#E4E6EB]"
                }`}
              >
                {card.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2.5 text-[13.5px] leading-snug ${
                      card.highlighted ? "text-[#E4E7FB]" : "text-[#565B66]"
                    }`}
                  >
                    <CheckIcon className={card.highlighted ? "text-white" : "text-[#4552DF]"} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mb-9 text-center text-[15px] text-[#565B66]">
          <strong className="font-semibold text-[#16181D]">Ready to scale?</strong> Zero-commission
          plans built for growing brands.
        </p>

        <div className="mb-9 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-2.5 rounded-xl border border-[#E4E6EB] bg-white px-2 py-1.5">
            {BRAND_PRICING_BILLING_OPTIONS.map((option) => {
              const isActive = billingCycle === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleBillingChange(option.id)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-[3px] px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "border-[#4552DF] font-semibold text-[#4552DF]"
                      : "border-transparent text-[#565B66] hover:text-[#16181D]"
                  }`}
                >
                  {option.label}
                  {option.badge ? (
                    <span className="rounded-md bg-[#EEF0FD] px-2 py-0.5 text-[11px] font-semibold text-[#4552DF]">
                      {option.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pricedTiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col rounded-2xl border p-5 ${
                tier.highlighted ? "border-transparent text-white" : "border-[#E4E6EB] bg-white"
              }`}
              style={
                tier.highlighted
                  ? { backgroundColor: BRAND_PRICING_BLUE, borderColor: BRAND_PRICING_BLUE }
                  : undefined
              }
            >
              <h3
                className={`mb-2.5 text-[15px] font-semibold leading-snug ${
                  tier.highlighted ? "!text-white" : "text-[#16181D]"
                }`}
              >
                {tier.name}
              </h3>
              <p
                className={`m-0 text-2xl font-bold ${
                  tier.highlighted ? "text-white" : "text-[#16181D]"
                }`}
              >
                {tier.price}
                {!tier.custom ? (
                  <span
                    className={`text-xs font-medium ${
                      tier.highlighted ? "text-[#C9CFF6]" : "text-[#8A8F99]"
                    }`}
                  >
                    /mo
                  </span>
                ) : null}
              </p>
              <p
                className={`mb-4 mt-1 min-h-[14px] text-[11.5px] ${
                  tier.highlighted ? "text-[#C9CFF6]" : "text-[#8A8F99]"
                }`}
              >
                {tier.billed || "\u00A0"}
              </p>
              <ul
                className={`flex flex-1 flex-col border-t pt-4 ${
                  tier.highlighted ? "border-white/25" : "border-[#E4E6EB]"
                }`}
              >
                {tier.features.map((feature, index) => (
                  <li
                    key={feature.text}
                    className={`flex min-h-[34px] items-start gap-2 text-[12.5px] leading-snug ${
                      index === 0
                        ? `mb-2 border-b pb-4 text-sm ${
                            tier.highlighted
                              ? "border-white/30 text-white"
                              : "border-[#E4E6EB] text-[#16181D]"
                          }`
                        : tier.highlighted
                          ? "text-[#E4E7FB]"
                          : "text-[#565B66]"
                    }`}
                  >
                    <CheckIcon
                      className={tier.highlighted ? "text-white" : "text-[#4552DF]"}
                    />
                    <span className={feature.bold ? "font-semibold" : undefined}>{feature.text}</span>
                  </li>
                ))}
                {Array.from({ length: tier.spacers || 0 }).map((_, i) => (
                  <li key={`spacer-${tier.id}-${i}`} className="min-h-[34px]" aria-hidden />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-9 text-center text-[13px] text-[#8A8F99]">
          9.9% standard commission applies to campaign spend exceeding your plan&apos;s limit.
        </p>

        <section className="mt-16 md:mt-20">
          <div className="mx-auto mb-8 max-w-[680px] text-center md:mb-10">
            <h2 className="mb-4 text-xl font-bold tracking-tight !text-[#16181D] sm:text-2xl md:text-[26px] md:leading-snug">
              CleerCut plans are never restricted by credits or usage
            </h2>
            <p className="text-[15px] leading-relaxed text-[#565B66]">
              Simply upgrade your plan to match your monthly budget and unlock bigger savings.
            </p>
          </div>

          <div className="mx-auto max-w-[720px] rounded-2xl border border-[#E4E6EB] bg-white p-5 sm:p-9">
            <div className="rounded-xl border border-[#E4E6EB] bg-[#F7F8FA] p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[10px] border border-[#E4E6EB] bg-white p-3.5 sm:p-4">
                  <p className="mb-2.5 text-xs font-semibold text-[#8A8F99]">Top competitors</p>
                  {BRAND_PRICING_COMPARE_ROWS.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-3 py-1.5 text-[12.5px] text-[#565B66]"
                    >
                      <span className="min-w-0 flex-1">{row.label}</span>
                      <span className="shrink-0 font-semibold text-[#C0392B]">{row.competitor}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-[10px] border border-[#4552DF] bg-white p-3.5 sm:p-4">
                  <p className="mb-2.5 text-xs font-semibold text-[#4552DF]">CleerCut</p>
                  {BRAND_PRICING_COMPARE_ROWS.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-3 py-1.5 text-[12.5px] text-[#565B66]"
                    >
                      <span className="min-w-0 flex-1">{row.label}</span>
                      <span className="shrink-0 font-semibold text-[#1E8E5A]">{row.cleercut}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        className="relative mt-12 overflow-hidden px-4 py-16 text-center sm:py-[76px]"
        style={{
          background: "linear-gradient(135deg, #3A46C4 0%, #4552DF 45%, #6B76EC 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -left-40 -top-44 h-[520px] w-[520px] rounded-full border border-white/14"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-[60px] -top-[60px] h-80 w-80 rounded-full border border-white/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-[60px] -right-20 h-[460px] w-[460px] bg-white/[0.06]"
          style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[1180px]">
          <h2 className="mx-auto mb-5 max-w-[700px] text-[28px] font-bold leading-snug tracking-tight !text-white sm:text-[38px]">
            Need a campaign fully managed by our team?
          </h2>
          <p className="mx-auto mb-10 max-w-[620px] text-base leading-relaxed text-[#E4E7FB] sm:mb-12">
            Finding creators, negotiating, approving content, reporting, our agency service handles
            it all, start to finish.
          </p>

          <div className="mx-auto mb-10 grid max-w-[1040px] grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 sm:mb-12">
            {BRAND_PRICING_AGENCY_POINTS.map((point) => (
              <div key={point.title} className="text-center">
                <span className="mx-auto mb-4 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white">
                  <Check className="h-4 w-4 text-[#4552DF]" strokeWidth={2.5} />
                </span>
                <h4 className="mb-2.5 text-[15px] font-bold !text-white">{point.title}</h4>
                <p className="m-0 text-[13px] leading-snug text-[#E4E7FB]">{point.copy}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <CustomButton
              text="Talk to our team"
              className="btn !w-auto inline-flex bg-white text-[#4552DF] hover:bg-indigo-50 border-0 px-7 font-semibold"
              href={BRAND_PRICING_CONTACT_MAIL}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.4fr] lg:gap-14">
          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight !text-[#16181D] md:text-[28px] md:leading-snug">
              Pricing questions, answered
            </h2>
            <p className="m-0 text-[14.5px] leading-relaxed text-[#565B66]">
              Still have a question?
              <br />
              <a
                href={BRAND_PRICING_CONTACT_MAIL}
                className="font-semibold text-[#4552DF] hover:underline"
              >
                Contact us
              </a>
              , we&apos;ll be happy to help.
            </p>
          </div>

          <div>
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`border-b border-[#E4E6EB] ${index === 0 ? "border-t" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => handleFaqToggle(index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-semibold text-[#16181D]"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-[#4552DF]" : "text-[#8A8F99]"
                      }`}
                    />
                  </button>
                  {isOpen ? (
                    <p className="m-0 pb-5 pr-8 text-sm leading-relaxed text-[#565B66]">
                      {faq.answer}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
