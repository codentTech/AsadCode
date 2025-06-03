import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { TrendingUp } from "lucide-react";

function AudienceAnalytics() {
  const audienceData = {
    totalFollowers: "156K",
    platforms: [
      { name: "Instagram", followers: "85.4K", engagement: "3.2%" },
      { name: "TikTok", followers: "63.7K", engagement: "5.8%" },
      { name: "YouTube", followers: "7.2K", engagement: "4.1%" },
    ],
  };
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h3 className="mb-6">Audience Analytics Snapshot</h3>

      {/* Total Followers */}
      <div className="mb-8 text-center">
        <p className="text-sm font-medium text-gray-700 mb-1">Combined Audience</p>
        <p className="text-4xl font-bold text-indigo-600">{audienceData.totalFollowers}</p>
      </div>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {audienceData.platforms.map((platform, index) => (
          <div key={index} className="bg-indigo-50 rounded-lg p-4 text-center">
            <p className="font-medium text-gray-700">{platform.name}</p>
            <p className="text-2xl font-bold text-indigo-600 my-1">{platform.followers}</p>
            <div className="flex items-center justify-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">{platform.engagement} engagement</span>
            </div>
          </div>
        ))}
      </div>

      {/* Demographics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience Demographics</h3>
        <div className="px-20">
          <AudienceDemographics />
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Data sourced from creator's connected social media accounts
      </div>
    </section>
  );
}

export default AudienceAnalytics;
