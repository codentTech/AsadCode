"use client";

import HeaderLayout from "@/common/layouts/header.layout";
import AboutUs from "./components/about-us/about-us.component";
import ActiveCampaigns from "./components/active-campaigns/active-campaigns.component";
import ProfileOverview from "./components/profile-overview/profile-overview.component";
import Reviews from "./components/reviews/reviews.component";
import useBrandPortfolio from "./use-brand-portfolio.hook";

export default function BrandPortfolio({ brandId = null }) {
  const {
    brandBasics,
    brandOverview,
    brandPreferences,
    verifiedConnections,
    audienceSummary,
    refreshKey,
    handleEditProfile,
    canEdit,
  } = useBrandPortfolio(brandId);

  return (
    <HeaderLayout className="min-h-screen bg-gray-50">
      <main className="mx-auto flex w-full flex-col gap-3 bg-gray-50 px-2.5 py-3 sm:gap-4 sm:px-4 sm:py-6 md:w-[80%] md:py-8">
        <ProfileOverview
          basics={brandBasics}
          overview={brandOverview}
          connections={verifiedConnections}
          preferences={brandPreferences}
          audienceSummary={audienceSummary}
          onEditProfile={handleEditProfile}
          canEdit={canEdit}
        />

        <AboutUs overview={brandOverview} website={brandBasics.website} />

        <ActiveCampaigns refreshKey={refreshKey} />

        <Reviews />
      </main>
    </HeaderLayout>
  );
}
