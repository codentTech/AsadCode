import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

function HowCleerCutWorks({ isCreatorMode }) {
  const [activeStep, setActiveStep] = useState(0);
  const [activeFrame, setActiveFrame] = useState(0);
  const [disableAutoRotate, setDisableAutoRotate] = useState(false);

  const steps = [
    {
      title: isCreatorMode ? "Set Up Your Portfolio" : "Create a Campaign",
      description: isCreatorMode
        ? "Build a clean, professional portfolio in minutes. Showcase your past work, audience data, and reviews — no Canva or graphic design needed."
        : "Set deliverables, and budget in minutes.",
      images: isCreatorMode
        ? [
            "/assets/images/landing/creator-step-1-set-up-your-portfolio-1.jpeg",
            "/assets/images/landing/creator-step-1-set-up-your-portfolio-2.jpeg",
          ]
        : ["/assets/images/landing/step-1-create-a-campaign.jpeg"],
    },
    {
      title: isCreatorMode ? "Discover Campaigns you Love" : "Discover the Right Creators",
      description: isCreatorMode
        ? "Quick-apply to campaigns that match your audience and rates. No more hours lost to cold pitch emails"
        : "Invite creators to apply or browse applicants using advanced filters — sort by niche, platform, follower count, engagement rate and more, including audience demographics",
      images: isCreatorMode
        ? ["/assets/images/landing/creator-step-2-discover-campaigns-you-love.jpeg"]
        : [
            "/assets/images/landing/step-2-discover-the-right-creators-1.jpeg",
            "/assets/images/landing/step-2-discover-the-right-creators-2.jpeg",
            "/assets/images/landing/step-2-discover-the-right-creators-3.jpeg",
          ],
    },
    {
      title: isCreatorMode ? null : "Review & Compare",
      description:
        "Instantly view creator profiles, rates, content samples, audience data, and verified brand reviews — all in one place.",
      images: ["/assets/images/landing/step-3-review-and-compare.jpeg"],
    },
    {
      title: isCreatorMode
        ? "Collaborate with Smart Campaign Management"
        : "Automated Creator Pipeline",
      description: isCreatorMode
        ? "Negotiate deals, track deliverables, and manage deadlines — all in one organized pipeline. Keep cold pitches, active projects, and ongoing negotiations separated, yet easy to navigate."
        : "Manage campaigns on a visual board and track each creator’s progress — from application through active deliverables — in one streamlined pipeline.",
      images: isCreatorMode
        ? [
            "/assets/images/landing/creator-step-3-collaborate-with-smart-campaign-management.jpeg",
          ]
        : [
            "/assets/images/landing/step-4-automated-creator-pipeline-1.jpeg",
            "/assets/images/landing/step-4-automated-creator-pipeline-2.jpeg",
          ],
    },
    {
      title: isCreatorMode ? "Get Paid with Peace of Mind" : "Finalize, Protect, and Pay",
      description: isCreatorMode
        ? "CleerCut holds payments in escrow as soon as the contract is signed — you deliver the work, we guarantee the rest. No more ghosting, chasing invoices, or revision traps."
        : "Secure payments via escrow, auto-generated customizable  contracts, and streamlined dispute management.",
      images: isCreatorMode
        ? [
            "/assets/images/landing/creator-step-4-get-paid-with-peace-of-mind-1.jpeg",
            "/assets/images/landing/creator-step-4-get-paid-with-peace-of-mind-2.jpeg",
          ]
        : [
            "/assets/images/landing/step-5-finalize-protect-and-pay-1.jpeg",
            "/assets/images/landing/step-5-finalize-protect-and-pay-2.jpeg",
          ],
    },
  ].filter((s) => s.title);

  useEffect(() => {
    if (!disableAutoRotate) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
        setActiveFrame(0);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [disableAutoRotate, steps.length]);

  useEffect(() => {
    setActiveFrame(0);
  }, [activeStep]);

  const activeFrameCount = steps[activeStep]?.images?.length ?? 1;

  useEffect(() => {
    if (activeFrameCount <= 1) return undefined;
    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % activeFrameCount);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeStep, activeFrameCount]);

  return (
    <section className="py-24 bg-gradient-to-tr from-blue-300/30 to-transparent overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-4xl font-bold mb-4 inline-block relative text-primary">
            Collaborate in {isCreatorMode ? 4 : 5} easy steps
          </h2>
        </div>

        <div className="lg:flex items-start gap-12">
          <div className="lg:w-2/5">
            <div className="space-y-4 mb-8 lg:mb-0">
              {steps.map(
                (step, idx) =>
                  step.title && (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveStep(idx);
                        setActiveFrame(0);
                      }}
                      onMouseEnter={() => setDisableAutoRotate(true)}
                      onMouseLeave={() => setDisableAutoRotate(false)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 flex gap-4 items-start ${
                        activeStep === idx
                          ? "bg-white shadow-lg border-l-4 border-primary"
                          : "hover:bg-white/50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          activeStep === idx ? "bg-primary text-white" : "bg-primary text-white"
                        }`}
                      >
                        {activeStep === idx ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-bold mb-1 ${activeStep === idx ? "text-blue-600" : "text-gray-800"}`}
                        >
                          {step.title}
                        </h4>
                        {activeStep === idx && (
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>

          <div className="lg:w-3/4 relative">
            <div className="relative group perspective-1000 transform transition-all duration-700 hover:rotate-y-12">
              <div
                className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-indigo-300/50 blur-3xl opacity-80 group-hover:opacity-95 transition-opacity duration-500"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -inset-3 rounded-3xl bg-indigo-200/45 blur-2xl"
                aria-hidden
              />
              <div className="relative z-10 rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(129,140,248,0.35)]">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`transition-opacity duration-500 ${
                      activeStep === idx
                        ? "relative opacity-100"
                        : "absolute inset-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      {step.images.map((src, frameIdx) => (
                        <img
                          key={src}
                          src={src}
                          alt={`${isCreatorMode ? "Creator" : "Brand"} - ${step.title || "Step"}`}
                          className={`w-full h-auto max-h-[28rem] md:max-h-[32rem] object-contain transition-all duration-500 group-hover:scale-105 ${
                            step.images.length > 1 ? "absolute inset-0 m-auto" : ""
                          } ${
                            activeStep === idx && activeFrame === frameIdx
                              ? "opacity-100 relative"
                              : step.images.length > 1
                                ? "opacity-0"
                                : "opacity-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowCleerCutWorks;
