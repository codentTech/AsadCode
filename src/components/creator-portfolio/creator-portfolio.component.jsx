import HeaderLayout from "@/common/layouts/header.layout";
import ProfileOverview from "./components/profile-overview/profile-overview.component";
import BioPricing from "./components/bio-pricing/bio-pricing.component";
import Gallary from "./components/gallary/gallary.component";
import AudienceAnalytics from "./components/audience-analytics/audience-analytics.component";
import Reviews from "./components/reviews/reviews.component";
import { useState, useCallback } from "react";

export default function CreatorPortfolio({ creatorId = null }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProfileUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <HeaderLayout className="min-h-screen bg-gray-50">
      <main className="flex flex-col gap-4 mx-auto px-4 py-8 w-full md:w-[80%] bg-gray-50">
        <ProfileOverview
          creatorId={creatorId}
          refreshKey={refreshKey}
          onProfileUpdate={handleProfileUpdate}
        />
        <BioPricing creatorId={creatorId} refreshKey={refreshKey} />
        <Gallary creatorId={creatorId} refreshKey={refreshKey} />
        <AudienceAnalytics creatorId={creatorId} />
        <Reviews creatorId={creatorId} />
      </main>
    </HeaderLayout>
  );
}
