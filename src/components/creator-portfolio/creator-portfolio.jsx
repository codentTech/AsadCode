import HeaderLayout from "@/common/layouts/header.layout";
import AudienceAnalytics from "./components/audience-analytics/audience-analytics";
import BioPricing from "./components/bio-pricing/bio-pricing";
import Gallary from "./components/gallary/gallary";
import ProfileOverview from "./components/profile-overview/profile-overview";
import Reviews from "./components/reviews/reviews";
import { useState, useCallback } from "react";

export default function CreatorPortfolio() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProfileUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <HeaderLayout className="min-h-screen bg-gray-50">
      <main className="flex flex-col gap-4 mx-auto px-4 py-8 w-full md:w-[80%] bg-gray-50">
        {/* Profile Overview Section */}
        <ProfileOverview onProfileUpdate={handleProfileUpdate} refreshKey={refreshKey} />

        {/* Bio & Pricing Section */}
        <BioPricing refreshKey={refreshKey} />

        {/* Portfolio Gallery Section */}
        <Gallary refreshKey={refreshKey} />

        {/* Audience Analytics Section */}
        <AudienceAnalytics />

        {/* Reviews Section */}
        <Reviews />
      </main>
    </HeaderLayout>
  );
}
