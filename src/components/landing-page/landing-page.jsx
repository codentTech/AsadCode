import Header from "@/components/header/header";
import { useState } from "react";
import Footer from "../home/footer/footer.component";
import CallToAction from "./components/call-to-action/call-to-action";
import Features from "./components/features/features";
import Hero from "./components/hero/hero";
import HowCleerCutWorks from "./components/how-it-works/how-it-works";
import WhyChooseCleercut from "./components/why-choose-cleercut/why-choose-cleercut";

export default function LandinPage() {
  const [isCreatorMode, setIsCreatorMode] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero isCreatorMode={isCreatorMode} setIsCreatorMode={setIsCreatorMode} />

      {/* How It Works Section */}
      <HowCleerCutWorks isCreatorMode={isCreatorMode} />

      {/* Features Section */}
      <Features isCreatorMode={isCreatorMode} />
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>

      <WhyChooseCleercut />
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-0.5"></div>

      {/* CTA Section */}
      <CallToAction />

      <Footer />
    </div>
  );
}
