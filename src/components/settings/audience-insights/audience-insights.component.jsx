import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import AudienceAnalytics from "@/components/creator-portfolio/components/audience-analytics/audience-analytics.component";
import CreatorMetricsDashboard from "@/components/creator-portfolio/components/matrix-dashboard/matrix-dashboard.component";
import useAudienceInsights from "./use-audience-insights.hook";

const AudienceInsightsPage = () => {
  const { id, selectedPlatform, audienceState, handlePlatformSelect } = useAudienceInsights();

  if (!id) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
        Sign in as a creator to view audience insights.
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-lg bg-primary p-3 text-white sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Audience insights</h1>
        <p className="mt-1 text-[10px] text-white/90 sm:text-xs md:text-sm">
          Performance metrics and audience demographics from your connected platforms.
        </p>
      </div>

      <AudienceAnalytics
        creatorId={id}
        selectedPlatform={selectedPlatform}
        onPlatformSelect={handlePlatformSelect}
      />
      <CreatorMetricsDashboard creatorId={id} selectedPlatform={selectedPlatform} />
      <section className="rounded-lg bg-white p-3 shadow-md sm:p-6">
        <h3 className="mb-3 text-sm font-semibold text-primary sm:mb-4 sm:text-lg md:text-xl">
          Audience demographics
        </h3>
        <AudienceDemographics
          audienceData={audienceState?.data}
          loading={audienceState?.isLoading}
          platform={selectedPlatform}
        />
      </section>
    </div>
  );
};

export default AudienceInsightsPage;
