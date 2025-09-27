import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import { isCreatorMode } from "@/common/utils/users.util";
import { useEffect } from "react";
import CallToAction from "./components/call-to-action/call-to-action";
import Features from "./components/features/features";
import Hero from "./components/hero/hero";
import HowCleerCutWorks from "./components/how-it-works/how-it-works";
import WhyChooseCleercut from "./components/why-choose-cleercut/why-choose-cleercut";

export default function LandinPage() {
  const creatorMode = isCreatorMode();
  useEffect(() => {
    if (typeof window !== undefined) {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash.slice(1));
          el?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  }, []);

  return (
    <HeaderFooterLayout>
      <div className="relative min-h-screen bg-white text-gray-800 font-sans">
        {/* Navigation */}

        {/* Hero Section */}
        <Hero isCreatorMode={creatorMode} />

        {/* How It Works Section */}
        <HowCleerCutWorks isCreatorMode={creatorMode} />

        {/* Features Section */}
        <Features isCreatorMode={creatorMode} />
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>

        <WhyChooseCleercut isCreatorMode={creatorMode} />
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>

        {/* CTA Section */}
        <CallToAction />
      </div>
    </HeaderFooterLayout>
  );
}
