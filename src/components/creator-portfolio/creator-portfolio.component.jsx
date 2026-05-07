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
    <HeaderLayout className="bg-gray-50">
      <main className="mx-auto flex w-full flex-col gap-3 bg-gray-50 px-2.5 py-3 sm:gap-4 sm:px-4 sm:py-6 md:w-[80%] md:py-8">
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
        <section className="rounded-lg bg-white p-3 shadow-md sm:p-6">
          <h3 className="mb-3 text-sm font-semibold text-primary sm:mb-4 sm:text-lg md:text-xl">
            Audience Demographics
          </h3>
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
