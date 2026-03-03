import HeaderLayout from "@/common/layouts/header.layout";
import ProfileOverview from "./components/profile-overview/profile-overview.component";
import BioPricing from "./components/bio-pricing/bio-pricing.component";
import Gallary from "./components/gallary/gallary.component";
import AudienceAnalytics from "./components/audience-analytics/audience-analytics.component";
import Reviews from "./components/reviews/reviews.component";
import { useState, useCallback } from "react";
import CreatorMetricsDashboard from "./components/matrix-dashboard/matrix-dashboard.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import { useSelector } from "react-redux";
import { selectCreatorAudience } from "@/provider/features/phyllo/phyllo.slice";
import { getUser } from "@/common/utils/users.util";
import { isCreatorMode } from "@/common/utils/users.util";

export default function CreatorPortfolio({ creatorId = null }) {
  const user = getUser();
  console.log(user);
  const id = isCreatorMode() ? user?.id : creatorId;
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const audienceState = useSelector(selectCreatorAudience);

  const handleProfileUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handlePlatformSelect = useCallback((platform) => {
    setSelectedPlatform(platform);
  }, []);

  console.log(id);

  return (
    <HeaderLayout className="min-h-screen bg-gray-50">
      <main className="flex flex-col gap-4 mx-auto px-4 py-8 w-full md:w-[80%] bg-gray-50">
        <ProfileOverview
          creatorId={id}
          refreshKey={refreshKey}
          onProfileUpdate={handleProfileUpdate}
        />

        <AudienceAnalytics
          creatorId={id}
          selectedPlatform={selectedPlatform}
          onPlatformSelect={handlePlatformSelect}
        />
        <CreatorMetricsDashboard creatorId={id} selectedPlatform={selectedPlatform} />
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Audience Demographics</h3>
          <AudienceDemographics
            audienceData={audienceState?.data}
            loading={audienceState?.isLoading}
            platform={selectedPlatform}
          />
        </section>

        <Reviews creatorId={id} />
        <Gallary creatorId={id} refreshKey={refreshKey} />
        <BioPricing creatorId={id} refreshKey={refreshKey} />
      </main>
    </HeaderLayout>
  );
}
