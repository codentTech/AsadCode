"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import {
  AGENCY_BENEFITS,
  AGENCY_CAMPAIGN_TYPES,
  AGENCY_CONTACT_MAIL,
  AGENCY_IMAGES,
  AGENCY_PROBLEMS,
  AGENCY_STEPS,
  AGENCY_TRUST_LOGOS,
  AGENCY_WHO_TAGS,
} from "@/common/constants/agency.constant";
import { Check, ChevronDown } from "lucide-react";
import useAgencyPage from "./use-agency.hook";

function GradientDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute -left-40 -top-44 h-[520px] w-[520px] rounded-full border border-white/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-24 h-[380px] w-[380px] rounded-full border border-white/12"
        aria-hidden
      />
    </>
  );
}

export default function AgencyPage() {
  const { openFaqIndex, handleFaqToggle, faqs } = useAgencyPage();
  const logos = [...AGENCY_TRUST_LOGOS, ...AGENCY_TRUST_LOGOS];

  return (
    <HeaderFooterLayout>
      <div className="bg-white text-[#15171F]">
        <section className="bg-gradient-to-b from-[#F6F7FC] to-white px-4 pb-14 pt-16 text-center sm:px-8 md:pb-16 md:pt-20">
          <div className="mx-auto max-w-[1160px]">
            <h1 className="mx-auto mb-5 max-w-[740px] text-3xl font-extrabold tracking-tight !text-[#4552DF] sm:text-4xl md:text-[44px] md:leading-[1.15]">
              We run the campaign.
              <br />
              You keep full oversight and control.
            </h1>
            <p className="mx-auto mb-8 max-w-[560px] text-base leading-relaxed text-[#5B6072] sm:text-lg">
              Full-service creator sourcing, vetting, and campaign management, handled by the team
              behind CleerCut, on the same platform brands use every day.
            </p>
            <div className="flex justify-center">
              <CustomButton
                text="Talk to our team"
                className="btn btn-primary !w-auto px-6"
                href={AGENCY_CONTACT_MAIL}
              />
            </div>
          </div>
        </section>

        <div className="overflow-hidden border-b border-[#E6E8F2] py-10">
          <div className="brand-trust-marquee">
            <div className="brand-trust-track flex w-max items-center gap-16">
              {logos.map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  className="whitespace-nowrap text-base font-bold uppercase tracking-wide text-[#9497A6]"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1160px]">
            <h2 className="mx-auto mb-10 max-w-[640px] text-center text-2xl font-extrabold tracking-tight !text-[#4552DF] sm:text-[30px] sm:leading-snug">
              Running influencer campaigns in-house takes more than most teams have time for
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {AGENCY_PROBLEMS.map((copy) => (
                <div
                  key={copy}
                  className="rounded-2xl border border-[#E6E8F2] bg-[#F6F7FC] p-6"
                >
                  <p className="m-0 text-[15px] leading-relaxed text-[#5B6072]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="mb-4 max-w-[460px] text-2xl font-extrabold tracking-tight !text-[#4552DF] sm:text-[28px] sm:leading-snug">
                Check on your campaign whenever you want
              </h2>
              <p className="m-0 max-w-[460px] text-[15.5px] leading-relaxed text-[#5B6072]">
                Most agencies update you by email, on their schedule. With CleerCut, you can log
                into your dashboard at any time and see exactly where things stand: every applicant,
                every contract, every piece of content moving through the campaign board.
              </p>
            </div>
            <div>
              <img
                src={AGENCY_IMAGES.board}
                alt="CleerCut campaign board"
                className="w-full rounded-2xl border border-[#E6E8F2] shadow-[0_6px_24px_rgba(30,34,80,0.08)]"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#F6F7FC] px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1160px]">
            <div className="mx-auto mb-10 max-w-[600px] text-center">
              <h2 className="mb-2.5 text-2xl font-extrabold tracking-tight !text-[#4552DF] sm:text-[28px]">
                Built around how you want to work with creators
              </h2>
              <p className="m-0 text-[15px] text-[#5B6072]">
                Every campaign is set up as one of four types, configured directly in the platform.
              </p>
            </div>
            <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AGENCY_CAMPAIGN_TYPES.map((type) => (
                <div
                  key={type.title}
                  className="rounded-2xl border border-[#E6E8F2] bg-white p-[18px]"
                >
                  <h4 className="mb-1.5 text-[14.5px] font-bold !text-[#4552DF]">{type.title}</h4>
                  <p className="m-0 text-[13px] leading-snug text-[#5B6072]">{type.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1160px]">
            <h2 className="mb-4 max-w-[640px] text-2xl font-extrabold tracking-tight !text-[#4552DF] sm:text-[28px] sm:leading-snug">
              Already have a roster of creators? We&apos;ll onboard them for you.
            </h2>
            <p className="m-0 max-w-[560px] text-[15.5px] leading-relaxed text-[#5B6072]">
              Send us a spreadsheet or document with your current creator roster, and our team
              handles outreach to get each one set up on CleerCut, including profiles, contracts,
              and payments, so you don&apos;t lose the relationships you&apos;ve already built.
            </p>
          </div>
        </section>

        <section
          className="relative overflow-hidden px-4 py-16 sm:px-8 md:py-20"
          style={{
            background: "linear-gradient(135deg, #2B348F 0%, #4552DF 55%, #7C82F0 100%)",
          }}
        >
          <GradientDecor />
          <div className="relative z-10 mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="order-2 lg:order-1">
              <img
                src={AGENCY_IMAGES.report}
                alt="CleerCut campaign performance report"
                className="w-full rounded-2xl shadow-[0_20px_50px_rgba(20,20,60,0.35)]"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="mb-6 text-2xl font-extrabold tracking-tight !text-white sm:text-[28px] sm:leading-snug">
                What happens after you talk to our team
              </h2>
              <div className="flex flex-col">
                {AGENCY_STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className={`flex gap-5 py-[18px] ${
                      index < AGENCY_STEPS.length - 1 ? "border-b border-white/20" : ""
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-[13px] font-extrabold text-white">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="mb-1 text-[15.5px] font-bold !text-white">{step.title}</h4>
                      <p className="m-0 text-sm text-[#D8DAF8]">{step.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="mb-4 max-w-[460px] text-2xl font-extrabold tracking-tight !text-[#4552DF] sm:text-[28px] sm:leading-snug">
                Every hiring decision backed by data refreshed daily
              </h2>
              <p className="m-0 max-w-[460px] text-[15.5px] leading-relaxed text-[#5B6072]">
                Creator profiles pull directly from their connected accounts and refresh every 24
                hours, so recommendations are never based on stale numbers. Before we recommend
                anyone, we look at nine key metrics per creator, including audience location, age
                range, and gender split.
              </p>
            </div>
            <div>
              <img
                src={AGENCY_IMAGES.metrics}
                alt="CleerCut creator profile metrics"
                className="w-full rounded-2xl border border-[#E6E8F2] shadow-[0_6px_24px_rgba(30,34,80,0.08)]"
              />
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden px-4 py-16 sm:px-8 md:py-20"
          style={{
            background: "linear-gradient(135deg, #2B348F 0%, #4552DF 55%, #7C82F0 100%)",
          }}
        >
          <GradientDecor />
          <div className="relative z-10 mx-auto max-w-[1160px]">
            <h2 className="mx-auto mb-10 max-w-[680px] text-center text-2xl font-extrabold tracking-tight !text-white sm:text-[30px]">
              What you get with a managed campaign
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {AGENCY_BENEFITS.map((item) => (
                <div key={item.title} className="text-center">
                  <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                    <Check className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
                  </span>
                  <h4 className="mb-2 text-[15.5px] font-bold !text-white">{item.title}</h4>
                  <p className="m-0 text-[13.5px] leading-snug text-[#D8DAF8]">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#E6E8F2] px-4 py-16 text-center sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1160px]">
            <h2 className="mb-8 text-2xl font-extrabold tracking-tight !text-[#4552DF] sm:text-[28px]">
              Who this is for
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {AGENCY_WHO_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#E6E8F2] bg-[#F6F7FC] px-5 py-2.5 text-sm font-semibold text-[#15171F]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1160px]">
            <h2 className="mx-auto mb-10 max-w-[600px] text-center text-2xl font-extrabold tracking-tight !text-[#4552DF] sm:text-[28px]">
              Frequently asked questions
            </h2>
            <div className="mx-auto max-w-[720px]">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={faq.question} className="border-b border-[#E6E8F2] py-[18px]">
                    <button
                      type="button"
                      onClick={() => handleFaqToggle(index)}
                      className="flex w-full items-center justify-between gap-4 text-left text-[15.5px] font-bold text-[#15171F]"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#4552DF] transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen ? (
                      <p className="mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#5B6072]">
                        {faq.answer}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="talk"
          className="relative overflow-hidden px-4 py-20 text-center sm:px-8 md:py-24"
          style={{
            background: "linear-gradient(135deg, #2B348F 0%, #4552DF 55%, #7C82F0 100%)",
          }}
        >
          <GradientDecor />
          <div className="relative z-10 mx-auto max-w-[560px]">
            <h2 className="mb-3.5 text-[28px] font-extrabold tracking-tight !text-white sm:text-[34px] sm:leading-snug">
              Need a campaign fully managed by our team?
            </h2>
            <p className="mb-8 text-base text-[#DEE0FA]">
              Tell us your budget, your niche, and your deliverables, and we&apos;ll take it from
              there.
            </p>
            <div className="flex justify-center">
              <CustomButton
                text="Talk to our team"
                className="btn !w-auto bg-white px-7 font-bold text-[#4552DF] hover:bg-indigo-50 border-0"
                href={AGENCY_CONTACT_MAIL}
              />
            </div>
          </div>
        </section>
      </div>
    </HeaderFooterLayout>
  );
}
