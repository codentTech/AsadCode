import Header from "@/components/header/header";
import { useState } from "react";
import Footer from "../home/footer/footer.component";
import CallToAction from "./components/call-to-action/call-to-action";
import Showcase from "./components/creator-showcase/creator-showcase";
import Features from "./components/features/features";
import Hero from "./components/hero/hero";
import HowCleerCutWorks from "./components/how-it-works/how-it-works";
import Testimonials from "./components/testimonials/testimonials";

export default function LandinPage() {
  const [isCreatorMode, setIsCreatorMode] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero isCreatorMode={isCreatorMode} setIsCreatorMode={setIsCreatorMode} />

      {/* Creator Showcase Section */}
      <Showcase isCreatorMode={isCreatorMode} />

      {/* How It Works Section */}
      <HowCleerCutWorks isCreatorMode={isCreatorMode} />

      {/* Features Section */}
      <Features isCreatorMode={isCreatorMode} />

      {/* Testimonial Section */}
      <Testimonials />

      {/* CTA Section */}
      <CallToAction />

      <Footer />
    </div>
  );
}
