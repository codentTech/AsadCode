"use client";

import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import CallToAction from "./components/call-to-action/call-to-action";
import Features from "./components/features/features";
import Hero from "./components/hero/hero";
import HowCleerCutWorks from "./components/how-it-works/how-it-works";
import WhyChooseCleercut from "./components/why-choose-cleercut/why-choose-cleercut";

export default function LandingPage({ isCreatorMode = false }) {
  return (
    <div className="relative min-h-screen bg-white text-gray-800 font-sans">
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
  );
}
