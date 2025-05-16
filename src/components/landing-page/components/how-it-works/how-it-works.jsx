import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

function HowCleerCutWorks({ isCreatorMode }) {
  const [activeStep, setActiveStep] = useState(0);
  const [disableAutoRotate, setDisableAutoRotate] = useState(false);

  // Auto-rotate through steps every 5 seconds
  useEffect(() => {
    // if (!disableAutoRotate) {
    //   console.log(disableAutoRotate);
    //   const interval = setInterval(() => {
    //     setActiveStep((prev) => (prev + 1) % steps.length);
    //   }, 5000);
    //   return () => clearInterval(interval);
    // }
  }, [disableAutoRotate]);

  const steps = [
    {
      title: isCreatorMode ? "Set Up Your Portfolio" : "Create a Campaign",
      description: isCreatorMode
        ? "Build a clean, professional portfolio in minutes. Showcase your past work, audience data, and reviews — no Canva or graphic design needed."
        : "Set deliverables, and budget in minutes.",
      image: isCreatorMode
        ? "/assets/images/landing/portfolio Photoshopped.png"
        : "/assets/images/landing/create campaign on iphone perfected (1).png",
    },
    {
      title: isCreatorMode
        ? "Discover Campaigns you Love"
        : "Discover the Right Creators",
      description: isCreatorMode
        ? "Quick-apply to campaigns that match your audience and rates. No more hours lost to cold pitch emails"
        : "Invite creators to apply or browse applicants using advanced filters — sort by niche, platform, follower count, engagement rate and more, including audience demographics",
      image: isCreatorMode
        ? "/assets/images/landing/9170B750-8380-4C96-BFAC-BDF63FF035DF.png"
        : "/assets/images/landing/Discover Perfect.png",
    },
    {
      title: isCreatorMode ? null : "Review & Compare",
      description:
        "Instantly view creator profiles, rates, content samples, audience data, and verified brand reviews — all in one place.",
      image: "/assets/images/landing/portfolio Photoshopped.png",
    },
    {
      title: isCreatorMode
        ? "Collaborate with Smart Campaign Management"
        : "Collaborate Inside the Smart Inbox",
      description: isCreatorMode
        ? "Negotiate deals, track deliverables, and manage deadlines — all in one organized inbox. With your new Smart Inbox, keep cold pitches, active projects, and ongoing negotiations separated, yet easy to navigate."
        : "Message creators, assign deliverables, track revisions, and manage deadlines — all within a single, campaign-organized thread. You can also sort through message requests from creators who cold-pitch you directly, making it easy to spot high-potential inbound talent.",
      image: isCreatorMode
        ? "/assets/images/landing/Creator inbox Completed.png"
        : "/assets/images/landing/inbox on macbook office perfect (1).png",
    },
    {
      title: isCreatorMode
        ? "Get Paid with Peace of Mind"
        : "Finalize, Protect, and Pay",
      description: isCreatorMode
        ? "CleerCut holds payments in escrow as soon as the contract is signed — you deliver the work, we guarantee the rest. No more ghosting, chasing invoices, or revision traps."
        : "Secure payments via escrow, auto-generated customizable  contracts, and streamlined dispute management.",
      image: isCreatorMode
        ? "/assets/images/landing/hero-bg-3.jpeg"
        : "/assets/images/landing/reports on mac Perfect (1).png",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-tr from-blue-300/30 to-transparent overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-4xl font-bold mb-4 inline-block relative text-primary">
            Collaborate in {isCreatorMode ? 4 : 5} easy steps
          </h2>
        </div>

        <div className="lg:flex items-start gap-12">
          {/* Left side: Step navigation */}
          <div className="lg:w-2/5">
            <div className="space-y-4 mb-8 lg:mb-0">
              {steps.map(
                (step, idx) =>
                  step.title && (
                    <div
                      key={idx}
                      onClick={() => setActiveStep(idx)}
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
                          activeStep === idx
                            ? "bg-primary text-white"
                            : "bg-primary text-white"
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
                          <p className="text-gray-600 text-sm">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Right side: Image showcase */}
          <div className="lg:w-3/4 relative">
            <div className="bg-white p-4 rounded-2xl shadow-xl h-auto min-h-96">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    activeStep === idx
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="h-full flex items-center justify-center">
                    <img
                      src={step.image}
                      alt={`${isCreatorMode ? "Creator" : "Brand"} - ${step.title || "Step"}`}
                      className={`max-w-full max-h-96 ${
                        [1, 3, 4].includes(idx) && !isCreatorMode
                          ? "object-contain"
                          : "object-contain"
                      } rounded-lg mx-auto`}
                    />

                    {isCreatorMode && step.image.includes("hero-bg-3") && (
                      <React.Fragment>
                        <div className="w-40 absolute top-24 right-2 md:right-28 transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500">
                          <div className="relative bg-primary rounded-lg py-1 px-2 shadow-lg">
                            <div className="flex items-center">
                              <div>
                                <span className="text-[10px] text-white">
                                  Campaign marked complete
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-36 absolute top-44 left-2 md:left-28 transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500">
                          <div className="relative bg-white/90 backdrop-blur-sm rounded-lg py-1 px-2 shadow-lg">
                            <div className="flex items-center">
                              <div>
                                <span className="text-[10px] text-black">
                                  $550 payment received
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-52 absolute top-56 right-2 lg:right-28 transform rotate-6 translate-y-0 hover:translate-y-2 transition-all duration-500">
                          <div className="relative bg-primary rounded-lg py-1 px-2 shadow-lg">
                            <div className="flex items-center">
                              <div>
                                <span className="text-[10px] text-white">
                                  You received a new rating ⭐️⭐️⭐️⭐️⭐ It
                                  was pleasure working with ..
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowCleerCutWorks;
