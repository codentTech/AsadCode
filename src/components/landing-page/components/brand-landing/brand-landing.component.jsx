"use client";

import BrandBroaderFeatures from "./brand-broader-features/brand-broader-features.component";
import BrandDemo from "./brand-demo/brand-demo.component";
import BrandFaq from "./brand-faq/brand-faq.component";
import BrandHero from "./brand-hero/brand-hero.component";
import BrandIntegrations from "./brand-integrations/brand-integrations.component";
import BrandOfferCta from "./brand-offer-cta/brand-offer-cta.component";
import BrandTrustBar from "./brand-trust-bar/brand-trust-bar.component";
import BrandWalkthrough from "./brand-walkthrough/brand-walkthrough.component";
import BrandWhyItMatters from "./brand-why-it-matters/brand-why-it-matters.component";

export default function BrandLanding() {
  return (
    <>
      <BrandHero />
      <BrandTrustBar />
      <BrandWalkthrough />
      <BrandIntegrations />
      <BrandWhyItMatters />
      <BrandDemo />
      <BrandOfferCta />
      <BrandBroaderFeatures />
      <BrandFaq />
    </>
  );
}
