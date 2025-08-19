import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlatformAnalytics,
  setCurrentPlatform,
} from "@/provider/features/analytics/analytics.slice";
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

function PlatformAnalytics({ platform }) {
  const dispatch = useDispatch();
  const { platformAnalytics, isLoading, isError, message, currentPlatform } = useSelector(
    (state) => state.analytics
  );

  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch platform-specific analytics
  useEffect(() => {
    if (platform) {
      dispatch(setCurrentPlatform(platform));
      dispatch(fetchPlatformAnalytics(platform));
    }
  }, [platform, dispatch]);

  // Update local state when analytics are fetched
  useEffect(() => {
    if (platformAnalytics[platform]) {
      setAnalyticsData(platformAnalytics[platform]);
    }
  }, [platformAnalytics, platform]);

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Get platform-specific metrics
  const getPlatformMetrics = () => {
    if (!analyticsData?.summary) return [];

    const { summary } = analyticsData;
    const metrics = [];

    switch (platform) {
      case "instagram":
        metrics.push(
          {
            label: "Impressions",
            value: formatNumber(summary.total_impressions || 0),
            icon: Eye,
            color: "text-blue-500",
          },
          {
            label: "Reach",
            value: formatNumber(summary.total_reach || 0),
            icon: Users,
            color: "text-green-500",
          },
          {
            label: "Profile Views",
            value: formatNumber(summary.profile_views || 0),
            icon: TrendingUp,
            color: "text-purple-500",
          }
        );
        break;
      case "facebook":
        metrics.push(
          {
            label: "Impressions",
            value: formatNumber(summary.total_impressions || 0),
            icon: Eye,
            color: "text-blue-500",
          },
          {
            label: "Engagement",
            value: formatNumber(summary.total_engagement || 0),
            icon: Heart,
            color: "text-red-500",
          },
          {
            label: "New Followers",
            value: formatNumber(summary.new_followers || 0),
            icon: Users,
            color: "text-green-500",
          }
        );
        break;
      case "twitter":
        metrics.push(
          {
            label: "Total Tweets",
            value: formatNumber(summary.total_tweets || 0),
            icon: MessageCircle,
            color: "text-blue-500",
          },
          {
            label: "Total Likes",
            value: formatNumber(summary.total_likes || 0),
            icon: Heart,
            color: "text-red-500",
          },
          {
            label: "Engagement Rate",
            value: `${summary.engagement_rate || 0}%`,
            icon: TrendingUp,
            color: "text-green-500",
          }
        );
        break;
      case "tiktok":
        metrics.push(
          {
            label: "Total Videos",
            value: formatNumber(summary.total_videos || 0),
            icon: TrendingUp,
            color: "text-purple-500",
          },
          {
            label: "Total Views",
            value: formatNumber(summary.total_views || 0),
            icon: Eye,
            color: "text-blue-500",
          },
          {
            label: "Engagement Rate",
            value: `${summary.engagement_rate || 0}%`,
            icon: Heart,
            color: "text-red-500",
          }
        );
        break;
      case "youtube":
        metrics.push(
          {
            label: "Total Views",
            value: formatNumber(summary.total_views || 0),
            icon: Eye,
            color: "text-blue-500",
          },
          {
            label: "Subscribers",
            value: formatNumber(summary.total_subscribers || 0),
            icon: Users,
            color: "text-green-500",
          },
          {
            label: "Total Videos",
            value: formatNumber(summary.total_videos || 0),
            icon: TrendingUp,
            color: "text-red-500",
          }
        );
        break;
      default:
        break;
    }

    return metrics;
  };

  // Refresh analytics for this platform
  const handleRefresh = () => {
    dispatch(fetchPlatformAnalytics(platform));
  };

  if (!platform) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 capitalize">{platform} Analytics</h3>
          <p className="text-sm text-gray-500">Detailed metrics and insights</p>
        </div>
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
      {isError && currentPlatform === platform && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading {platform} analytics:</span>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && currentPlatform === platform && (
        <div className="mb-6 text-center py-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mr-3" />
            <span className="text-gray-600">Loading {platform} analytics...</span>
          </div>
        </div>
      )}

      {/* Analytics Content */}
      {!isLoading && analyticsData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getPlatformMetrics().map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Raw Metrics Data */}
          {analyticsData.metrics && analyticsData.metrics.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3">Raw Metrics Data</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(analyticsData.metrics, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !analyticsData && !isError && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {platform} Analytics</h3>
          <p className="text-gray-500">Connect your {platform} account to see analytics data</p>
        </div>
      )}
    </div>
  );
}

export default PlatformAnalytics;
