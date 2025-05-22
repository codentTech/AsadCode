import Header from "@/components/header/header";
import Footer from "../home/footer/footer.component";
import CallToAction from "./components/call-to-action/call-to-action";
import CreatorBrandPrompt from "./components/creator-brand-prompt/prompt.component";
import Features from "./components/features/features";
import Hero from "./components/hero/hero";
import HowCleerCutWorks from "./components/how-it-works/how-it-works";
import WhyChooseCleercut from "./components/why-choose-cleercut/why-choose-cleercut";
import useLandingPageHook from "./use-landing-page.hook";

export default function LandinPage() {
  const { isCreatorMode, handleSelectMode } = useLandingPageHook();

  return (
    <div className="relative min-h-screen bg-white text-gray-800 font-sans">
      {isCreatorMode || isCreatorMode === false ? (
        <>
          {/* Navigation */}

          {/* Hero Section */}
          <Hero isCreatorMode={isCreatorMode} />

          {/* How It Works Section */}
          <HowCleerCutWorks isCreatorMode={isCreatorMode} />

          {/* Features Section */}
          <Features isCreatorMode={isCreatorMode} />
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>

          <WhyChooseCleercut isCreatorMode={isCreatorMode} />
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>

          {/* CTA Section */}
          <CallToAction />
        </>
      ) : (
        <CreatorBrandPrompt handleSelectMode={handleSelectMode} />
      )}
    </div>
  );
}
