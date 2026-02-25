import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  reset,
  fetchCreatorAudience,
  fetchCreatorSocialAccounts,
  fetchCreatorStats,
  fetchCreatorMetrics,
  selectCreatorAudience,
  selectCreatorSocialAccounts,
  selectCreatorStats,
  selectCreatorMetrics,
} from "@/provider/features/phyllo/phyllo.slice";

export default function useCreatorPreview(previewCreator) {
  const dispatch = useDispatch();

  const stats = useSelector(selectCreatorStats);
  const audience = useSelector(selectCreatorAudience);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);
  const creatorMetrics = useSelector(selectCreatorMetrics);

  useEffect(() => {
    if (previewCreator?.id) {
      dispatch(fetchCreatorStats(previewCreator.id));
      dispatch(fetchCreatorAudience(previewCreator.id));
      dispatch(fetchCreatorSocialAccounts(previewCreator.id));
      dispatch(fetchCreatorMetrics(previewCreator.id));
    }

    return () => {
      dispatch(reset());
    };
  }, [previewCreator?.id, dispatch]);

  const platformData = () => {
    if (socialAccounts.isLoading || !socialAccounts.data) {
      return [
        { name: "Instagram", followers: "0", loading: true },
        { name: "YouTube", followers: "0", loading: true },
        { name: "Twitter", followers: "0", loading: true },
      ];
    }

    const platformMap = {
      instagram: "Instagram",
      youtube: "YouTube",
      twitter: "Twitter",
      tiktok: "TikTok",
      facebook: "Facebook",
    };

    const platforms = socialAccounts.data.map((account) => {
      const followers =
        account.follower_count ??
        account.followers ??
        account.subscriber_count ??
        account.subscribers ??
        0;
      return {
        name: platformMap[account.platform?.toLowerCase()] || account.platform,
        followers: Number(followers) || 0,
        username: account.username,
        isVerified: account.is_verified,
        profileUrl: account.profile_url,
        profileImage: account.profile_image_url,
      };
    });

    if (platforms.length === 0) {
      return [
        { name: "Instagram", followers: "0", notConnected: true },
        { name: "YouTube", followers: "0", notConnected: true },
        { name: "Twitter", followers: "0", notConnected: true },
      ];
    }

    return platforms;
  };

  const metricsData = () => {
    const payload = creatorMetrics.data?.data;
    const hasMetrics = payload?.hasData && payload?.metrics;
    const metrics = payload?.metrics || {};
    const metadata = payload?.metadata || {};

    if (creatorMetrics.isLoading || !payload) {
      return {
        authenticAudience: 0,
        engagementRate: "—",
        averageReach: "—",
        averageViews: "—",
        postingFrequency: "—",
      };
    }

    if (!hasMetrics) {
      return {
        authenticAudience: 0,
        engagementRate: "N/A",
        averageReach: "N/A",
        averageViews: "N/A",
        postingFrequency: "N/A",
      };
    }

    const engagementRateVal = metrics.engagementRate?.value;
    const averageViewsVal = metrics.averageViews?.value;
    const medianReach = metadata.medianReach;
    const postsPerMonth = metadata.postsPerMonth;

    const formatNum = (n) =>
      n >= 1_000_000
        ? `${(n / 1_000_000).toFixed(1)}M`
        : n >= 1_000
          ? `${(n / 1_000).toFixed(1)}K`
          : String(n ?? "—");

    return {
      authenticAudience: metrics.authenticAudience?.value ?? 0,
      engagementRate:
        engagementRateVal != null ? `${Number(engagementRateVal).toFixed(1)}%` : "N/A",
      averageReach: medianReach != null ? formatNum(medianReach) : "N/A",
      averageViews: averageViewsVal != null ? formatNum(averageViewsVal) : "N/A",
      postingFrequency: postsPerMonth != null ? `${postsPerMonth}/Month` : "N/A",
    };
  };

  const isLoading =
    stats.isLoading || audience.isLoading || socialAccounts.isLoading || creatorMetrics.isLoading;

  return {
    stats,
    audience,
    socialAccounts,
    platformData: platformData(),
    metricsData: metricsData(),
    isLoading,
  };
}
