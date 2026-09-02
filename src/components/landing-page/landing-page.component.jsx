"use client";

import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import CallToAction from "./components/call-to-action/call-to-action";
import CreatorBrandPrompt from "./components/creator-brand-prompt/prompt.component";
import Features from "./components/features/features";
import Hero from "./components/hero/hero";
import HowCleerCutWorks from "./components/how-it-works/how-it-works";
import WhyChooseCleercut from "./components/why-choose-cleercut/why-choose-cleercut";
import useLandingPage from "./use-landing-page.hook";

const SSR_ONLY_STYLE = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export default function LandingPage({ audience }) {
  const { creatorMode, handleSelectMode, hasSelectedMode } = useLandingPage(audience);
  const isCreatorMode = creatorMode === true;
  const isRouteAudience = audience === "brand" || audience === "creator";

  return (
    <div className="relative min-h-screen bg-white text-gray-800 font-sans">
      {!isRouteAudience && !hasSelectedMode ? (
        <CreatorBrandPrompt handleSelectMode={handleSelectMode} />
      ) : null}

      <div style={!isRouteAudience && !hasSelectedMode ? SSR_ONLY_STYLE : undefined}>
        <HeaderFooterLayout>
          <Hero isCreatorMode={isCreatorMode} />
          <HowCleerCutWorks isCreatorMode={isCreatorMode} />
          <Features isCreatorMode={isCreatorMode} />
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>
          <WhyChooseCleercut isCreatorMode={isCreatorMode} />
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>
          <CallToAction />
        </HeaderFooterLayout>
      </div>
    </div>
  );
}
