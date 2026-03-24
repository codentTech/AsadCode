import HeaderLayout from "@/common/layouts/header.layout";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import AudienceAnalytics from "./components/audience-analytics/audience-analytics.component";
import BioPricing from "./components/bio-pricing/bio-pricing.component";
import Gallary from "./components/gallary/gallary.component";
import CreatorMetricsDashboard from "./components/matrix-dashboard/matrix-dashboard.component";
import ProfileOverview from "./components/profile-overview/profile-overview.component";
import Reviews from "./components/reviews/reviews.component";
import useCreatorPortfolio from "./use-creator-portfolio.hook";

export default function CreatorPortfolio({ creatorId = null }) {
  const {
    id,
    refreshKey,
    selectedPlatform,
    audienceState,
    handleProfileUpdate,
    handlePlatformSelect,
  } = useCreatorPortfolio(creatorId);

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
