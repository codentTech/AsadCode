"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import useFeaturesPage from "./use-features-page.hook";

function FeatureMedia({ media }) {
  if (!media?.primary) return null;

  const hasSecondary = Boolean(media.secondary);
  const isStacked = media.secondary?.variant === "stacked";

  if (!hasSecondary) {
    return (
      <img
        src={media.primary.src}
        alt={media.primary.alt}
        className="w-full rounded-2xl border border-[#E6E8F2] shadow-[0_6px_24px_rgba(30,34,80,0.08)]"
      />
    );
  }

  if (isStacked) {
    return (
      <div className="mb-10 md:mb-16">
        <img
          src={media.primary.src}
          alt={media.primary.alt}
          className="mb-4 w-full rounded-2xl border border-[#E6E8F2] shadow-[0_6px_24px_rgba(30,34,80,0.08)]"
        />
        <img
          src={media.secondary.src}
          alt={media.secondary.alt}
          className="w-[40%] rounded-xl border-[5px] border-white shadow-[0_16px_40px_rgba(30,34,80,0.16)]"
        />
      </div>
    );
  }

  return (
    <div className="relative mb-16 md:mb-20">
      <img
        src={media.primary.src}
        alt={media.primary.alt}
        className="w-full rounded-2xl border border-[#E6E8F2] shadow-[0_6px_24px_rgba(30,34,80,0.08)]"
      />
      <img
        src={media.secondary.src}
        alt={media.secondary.alt}
        className="absolute -bottom-[28%] -left-[28%] w-[56%] rounded-xl border-[5px] border-white shadow-[0_16px_40px_rgba(30,34,80,0.16)]"
      />
    </div>
  );
}

export default function FeaturesPage() {
  const { sections } = useFeaturesPage();

  return (
    <HeaderFooterLayout>
      <div className="bg-white text-[#15171F]">
        <section className="bg-gradient-to-b from-[#F6F7FC] to-white px-4 pb-12 pt-16 text-center sm:px-8 md:pb-14 md:pt-20">
          <div className="mx-auto max-w-[1160px]">
            <h1 className="mx-auto mb-4 max-w-[720px] text-3xl font-extrabold tracking-tight !text-[#4552DF] sm:text-4xl md:text-[42px] md:leading-[1.15]">
              One platform instead of eight different tools
            </h1>
            <p className="mx-auto max-w-[560px] text-base leading-relaxed text-[#5B6072] sm:text-[17px]">
              Creator discovery, contracts, payments, creator sales tracking, messaging, deadline
              tracking, tasks, and reporting. All in one place.
            </p>
          </div>
        </section>

        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={`border-b border-[#E6E8F2] px-4 py-16 sm:px-8 md:py-20 ${
              index % 2 === 1 ? "bg-[#F6F7FC]" : "bg-white"
            }`}
          >
            <div className="mx-auto max-w-[1160px]">
              <div className="mb-10 max-w-[640px]">
                <h2 className="mb-3 text-[28px] font-extrabold tracking-tight !text-[#4552DF] sm:text-[34px] sm:leading-snug">
                  {section.title}
                </h2>
                <p className="m-0 text-base text-[#5B6072]">{section.subtitle}</p>
              </div>

              <div
                className={`grid grid-cols-1 items-start gap-10 lg:gap-14 ${
                  section.wideMedia
                    ? "lg:grid-cols-[2.1fr_1fr]"
                    : "lg:grid-cols-[1.3fr_1fr]"
                }`}
              >
                <div className="lg:sticky lg:top-[110px]">
                  <FeatureMedia media={section.media} />
                </div>
                <div className="flex flex-col gap-[22px]">
                  {section.items.map((item) => (
                    <div key={item.title}>
                      <h4 className="mb-1 text-[15.5px] font-bold !text-[#15171F]">{item.title}</h4>
                      <p className="m-0 text-sm leading-relaxed text-[#5B6072]">{item.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        <section
          className="relative overflow-hidden px-4 py-20 text-center sm:px-8 md:py-24"
          style={{
            background: "linear-gradient(135deg, #2B348F 0%, #4552DF 55%, #7C82F0 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute -left-36 -top-40 h-[520px] w-[520px] rounded-full border border-white/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-36 -right-24 h-[360px] w-[360px] rounded-full border border-white/12"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-[540px]">
            <h2 className="mb-3.5 text-[28px] font-extrabold tracking-tight !text-white sm:text-[32px] sm:leading-snug">
              See it running on your own campaign
            </h2>
            <p className="mb-7 text-[15.5px] text-[#DEE0FA]">
              Try 30 days commission free. No credit card required.
            </p>
            <div className="flex justify-center">
              <CustomButton
                text="Sign Up for Free"
                className="btn !w-auto bg-white px-7 font-bold text-[#4552DF] hover:bg-indigo-50 border-0"
                href="/onboarding"
              />
            </div>
          </div>
        </section>
      </div>
    </HeaderFooterLayout>
  );
}
