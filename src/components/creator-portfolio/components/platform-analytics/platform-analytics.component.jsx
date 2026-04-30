"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlatformAnalytics,
  setCurrentPlatform,
} from "@/provider/features/analytics/analytics.slice";
import { TrendingUp, Users, Eye, Heart, MessageCircle, RefreshCw, AlertCircle } from "lucide-react";

export default function PlatformAnalytics({ platform }) {
  const dispatch = useDispatch();

  const analyticsState = useSelector((state) => state.analytics) || {};

  const {
    platformAnalytics = {},
    isLoading: globalLoading = false,
    isError: globalError = false,
    message: globalMessage = "",
    currentPlatform = null,
  } = analyticsState;

  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch analytics for this platform
  useEffect(() => {
    if (!platform) return;
    dispatch(setCurrentPlatform(platform));
    dispatch(fetchPlatformAnalytics(platform));
  }, [platform, dispatch]);

  // Update local state when platform data changes
  useEffect(() => {
    if (platformAnalytics && platformAnalytics[platform]) {
      setAnalyticsData(platformAnalytics[platform]);
    } else {
      setAnalyticsData(null);
    }
  }, [platformAnalytics, platform]);

  // Format numbers for display
  const formatNumber = (num) => {
    if (!num && num !== 0) return "-";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // Map metrics to UI per platform
  const getPlatformMetrics = () => {
    if (!analyticsData?.summary) return [];

    const { summary } = analyticsData;
    const metrics = [];

    switch (platform) {
      case "instagram":
        metrics.push(
          {
            label: "Impressions",
            value: formatNumber(summary.total_impressions),
            icon: Eye,
            color: "text-blue-500",
          },
          {
            label: "Reach",
            value: formatNumber(summary.total_reach),
            icon: Users,
            color: "text-green-500",
          },
          {
            label: "Profile Views",
            value: formatNumber(summary.profile_views),
            icon: TrendingUp,
            color: "text-purple-500",
          }
        );
        break;

      case "facebook":
        metrics.push(
          {
            label: "Impressions",
            value: formatNumber(summary.total_impressions),
            icon: Eye,
            color: "text-blue-500",
          },
          {
            label: "Engagement",
            value: formatNumber(summary.total_engagement),
            icon: Heart,
            color: "text-red-500",
          },
          {
            label: "New Followers",
            value: formatNumber(summary.new_followers),
            icon: Users,
            color: "text-green-500",
          }
        );
        break;

      case "tiktok":
        metrics.push(
          {
            label: "Total Videos",
            value: formatNumber(summary.total_videos),
            icon: TrendingUp,
            color: "text-purple-500",
          },
          {
            label: "Total Views",
            value: formatNumber(summary.total_views),
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
            value: formatNumber(summary.total_views),
            icon: Eye,
            color: "text-blue-500",
          },
          {
            label: "Subscribers",
            value: formatNumber(summary.total_subscribers),
            icon: Users,
            color: "text-green-500",
          },
          {
            label: "Total Videos",
            value: formatNumber(summary.total_videos),
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

  // Refresh platform analytics
  const handleRefresh = () => {
    if (platform) dispatch(fetchPlatformAnalytics(platform));
  };

  // Conditional loading/error
  const isLoading = globalLoading && currentPlatform === platform;
  const isError = globalError && currentPlatform === platform;
  const message = globalMessage;

  if (!platform) return null;

  return (
    <div className="rounded-lg bg-white p-3 shadow-md sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold capitalize text-gray-800 sm:text-lg md:text-xl">{platform} Analytics</h3>
          <p className="text-[10px] text-gray-500 sm:text-sm">Detailed metrics and insights</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-600 transition-colors hover:bg-indigo-100 disabled:opacity-50 sm:text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error State */}
      {isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading {platform} analytics:</span>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !analyticsData && (
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
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            {getPlatformMetrics().map((metric, index) => (
              <div key={index} className="rounded-lg bg-gray-50 p-3 text-center sm:p-4">
                <div className="flex items-center justify-center mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <p className="mb-1 text-sm font-bold text-gray-900 sm:text-2xl">{metric.value}</p>
                <p className="text-xs text-gray-600 sm:text-sm">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Raw Metrics */}
          {analyticsData.metrics?.length > 0 && (
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

      {/* No Data */}
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
