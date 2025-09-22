import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import {
  fetchCombinedAnalyticsSummary,
  clearErrors,
} from "@/provider/features/analytics/analytics.slice";

function AudienceAnalytics({ creatorId = null }) {
  const dispatch = useDispatch();
  const { combinedSummary, isLoading, isError, message } = useSelector((state) => state.analytics);

  const [audienceData, setAudienceData] = useState({
    totalFollowers: "0",
    platforms: [],
  });

  // Fetch analytics data on component mount
  useEffect(() => {
    // For now, we'll fetch the current user's analytics regardless of creatorId
    // In the future, this could be modified to fetch specific creator's analytics
    dispatch(fetchCombinedAnalyticsSummary());

    // Cleanup on unmount
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, creatorId]);

  // Update audience data when analytics are fetched
  useEffect(() => {
    if (combinedSummary) {
      setAudienceData({
        totalFollowers: formatNumber(combinedSummary.totalFollowers),
        platforms: combinedSummary.platforms.map((platform) => ({
          name: platform.name,
          followers: formatNumber(platform.followers),
          engagement: `${platform.engagementRate}%`,
          platform: platform.platform,
        })),
      });
    }
  }, [combinedSummary]);

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Refresh analytics data
  const handleRefresh = () => {
    dispatch(fetchCombinedAnalyticsSummary());
  };
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Audience Analytics Snapshot</h3>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error Display */}
      {isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading analytics:</span>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !combinedSummary && (
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mr-3" />
            <span className="text-lg text-gray-600">Loading analytics...</span>
          </div>
        </div>
      )}

      {/* Analytics Content */}
      {!isLoading && combinedSummary && (
        <>
          {/* Total Followers */}
          <div className="mb-8 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Combined Audience</p>
            <p className="text-4xl font-bold text-indigo-600">{audienceData.totalFollowers}</p>
            {combinedSummary.overallEngagementRate > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Overall Engagement Rate: {combinedSummary.overallEngagementRate}%
              </p>
            )}
          </div>

          {/* Platform Breakdown */}
          {audienceData.platforms.length > 0 ? (
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
          ) : (
            <div className="mb-8 text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No connected social media accounts found</p>
              <p className="text-sm text-gray-400 mt-2">
                Connect your social media accounts to see analytics data
              </p>
            </div>
          )}

          {/* Demographics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience Demographics</h3>
            <AudienceDemographics />
          </div>
        </>
      )}

      {/* No Data State */}
      {!isLoading && !combinedSummary && !isError && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-500">
            Connect your social media accounts to start seeing analytics data
          </p>
        </div>
      )}

      <div className="mt-4 text-center text-xs text-gray-500">
        Data sourced from creator's connected social media accounts via API
      </div>
    </section>
  );
}

export default AudienceAnalytics;
