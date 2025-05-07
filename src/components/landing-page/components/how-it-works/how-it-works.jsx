import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

function HowCleerCutWorks({ isCreatorMode }) {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-rotate through steps every 5 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveStep((prev) => (prev + 1) % steps.length);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  const steps = [
    {
      title: isCreatorMode ? "Set Up Your Portfolio" : "Create a Campaign",
      description: isCreatorMode
        ? "Build a clean, professional portfolio in minutes. Showcase your past work, audience data, and reviews — no Canva or graphic design needed."
        : "Create a campaign, set your budget, and define your goals in 5 quick steps.",
      image: isCreatorMode
        ? "/assets/images/landing/portfolio Photoshopped.png"
        : "/assets/images/landing/create campaign on iphone perfected (1).png",
    },
    {
      title: isCreatorMode
        ? "Discover Campaigns you Love"
        : "Find Top Creators",
      description: isCreatorMode
        ? "Quick-apply to campaigns that match your audience and rates. No more hours lost to cold pitch emails"
        : "Invite creators to apply or sort through applications easily with advanced filters for niche, audience, engagement and more.",
      image: isCreatorMode
        ? "/assets/images/landing/9170B750-8380-4C96-BFAC-BDF63FF035DF.png"
        : "/assets/images/landing/Discover Perfect.png",
    },
    {
      title: isCreatorMode ? null : "Analyze Your Best Options",
      description:
        "Preview creator's rates, past work, audience demographics, and reviews from previous collabs - in one powerful page.",
      image: "/assets/images/landing/portfolio Photoshopped.png",
    },
    {
      title: isCreatorMode
        ? "Collaborate with Smart Campaign Management"
        : "Collaborate Seamlessly",
      description: isCreatorMode
        ? "Manage deadlines, track payments, and move all your communication to one organized place"
        : "Keep all communication organized with the Smart Inbox, track deliverables, and manage your budget with ease.",
      image: isCreatorMode
        ? "/assets/images/landing/Creator inbox Completed.png"
        : "/assets/images/landing/inbox on macbook office perfect (1).png",
    },
    {
      title: isCreatorMode
        ? "Get Paid with Peace of Mind"
        : "Payment & Contracts Simplified",
      description: isCreatorMode
        ? "CleerCut holds payments in escrow — no more endless revisions, ghosting or chasing down payments"
        : "Secure payments via escrow, auto-generate contracts, and streamlined dispute management.",
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

        <div className="lg:flex items-center gap-12">
          {/* Left side: Step navigation */}
          <div className="lg:w-2/5">
            <div className="space-y-4 mb-8 lg:mb-0">
              {steps.map(
                (step, idx) =>
                  step.title && (
                    <div
                      key={idx}
                      onClick={() => setActiveStep(idx)}
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
          <div className="lg:w-3/5 relative">
            <div className="bg-white p-4 rounded-2xl shadow-xl overflow-hidden aspect-[4/3]">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    activeStep === idx
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={step.image}
                    alt={`${isCreatorMode ? "Creator" : "Brand"} - ${step.title}`}
                    className={`w-full h-full ${[1, 3, 4].includes(idx) && !isCreatorMode ? "object-cover" : "object-contain"}  rounded-lg`}
                  />
                </div>
              ))}
            </div>

            {/* Navigation dots for mobile */}
            <div className="flex justify-center gap-2 mt-4 lg:hidden">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-3 h-3 rounded-full ${
                    activeStep === idx ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowCleerCutWorks;
