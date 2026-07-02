"use client";

import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import CallToAction from "./components/call-to-action/call-to-action";
import CreatorBrandPrompt from "./components/creator-brand-prompt/prompt.component";
import Features from "./components/features/features";
import Hero from "./components/hero/hero";
import HowCleerCutWorks from "./components/how-it-works/how-it-works";
import WhyChooseCleercut from "./components/why-choose-cleercut/why-choose-cleercut";
import useLandingPage from "./use-landing-page.hook";

export default function LandingPage() {
  const { creatorMode, handleSelectMode } = useLandingPage();

  return (
    <div className="relative min-h-screen bg-white text-gray-800 font-sans">
      {creatorMode || creatorMode === false ? (
        <HeaderFooterLayout>
          <Hero isCreatorMode={creatorMode} />


          <HowCleerCutWorks isCreatorMode={creatorMode} />


          <Features isCreatorMode={creatorMode} />
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>

          <WhyChooseCleercut isCreatorMode={creatorMode} />
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>

          <CallToAction />
        </HeaderFooterLayout>
      ) : (
        <CreatorBrandPrompt handleSelectMode={handleSelectMode} />
      )}
    </div>
  );
}
