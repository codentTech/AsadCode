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
    <div className="space-y-6">
      <div className="bg-primary p-4 rounded-lg text-white">
        <h1 className="text-xl font-bold text-white">Audience insights</h1>
        <p className="text-sm mt-1 text-white/90">
          Performance metrics and audience demographics from your connected platforms.
        </p>
      </div>

      <AudienceAnalytics
        creatorId={id}
        selectedPlatform={selectedPlatform}
        onPlatformSelect={handlePlatformSelect}
      />
      <CreatorMetricsDashboard creatorId={id} selectedPlatform={selectedPlatform} />
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Audience demographics</h3>
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
