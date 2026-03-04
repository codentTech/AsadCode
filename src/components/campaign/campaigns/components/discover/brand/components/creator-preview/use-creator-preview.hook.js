import { useEffect, useMemo, useState } from "react";
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
import { PLATFORM_PRIORITY } from "@/common/constants/genaric.constant";

export default function useCreatorPreview(previewCreator) {
  const dispatch = useDispatch();
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const stats = useSelector(selectCreatorStats);
  const audience = useSelector(selectCreatorAudience);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);
  const creatorMetrics = useSelector(selectCreatorMetrics);

  // Fetch stats + social accounts when creator changes
  useEffect(() => {
    if (!previewCreator?.id) return;
    dispatch(fetchCreatorStats(previewCreator.id));
    dispatch(fetchCreatorSocialAccounts(previewCreator.id));
    setSelectedPlatform(null);
    return () => {
      dispatch(reset());
    };
  }, [previewCreator?.id, dispatch]);

  // Derive connected platform names from social accounts
  const connectedPlatforms = useMemo(() => {
    if (!Array.isArray(socialAccounts.data)) return [];
    return socialAccounts.data.map((a) => String(a.platform).toLowerCase());
  }, [socialAccounts.data]);

  // Auto-select default platform once accounts are loaded
  useEffect(() => {
    if (!connectedPlatforms.length) return;
    const def =
      PLATFORM_PRIORITY.find((p) => connectedPlatforms.includes(p)) || connectedPlatforms[0];
    setSelectedPlatform(def);
  }, [connectedPlatforms]);

  // Fetch metrics + audience whenever selected platform changes
  useEffect(() => {
    if (!previewCreator?.id || !selectedPlatform) return;
    dispatch(fetchCreatorMetrics({ creatorId: previewCreator.id, platform: selectedPlatform }));
    dispatch(fetchCreatorAudience({ creatorId: previewCreator.id, platform: selectedPlatform }));
  }, [previewCreator?.id, selectedPlatform, dispatch]);

  const platformData = useMemo(() => {
    if (socialAccounts.isLoading || !socialAccounts.data) {
      return [
        { name: "Instagram", key: "instagram", followers: 0, loading: true },
        { name: "YouTube", key: "youtube", followers: 0, loading: true },
        { name: "TikTok", key: "tiktok", followers: 0, loading: true },
      ];
    }

    const LABEL = {
      instagram: "Instagram",
      youtube: "YouTube",
      twitter: "Twitter",
      tiktok: "TikTok",
      facebook: "Facebook",
    };

    return socialAccounts.data.map((account) => {
      const key = String(account.platform).toLowerCase();
      return {
        key,
        name: LABEL[key] || account.platform,
        followers: Number(
          account.follower_count ?? account.followers ?? account.subscriber_count ?? 0
        ),
        username: account.username,
        isVerified: account.is_verified,
        profileUrl: account.profile_url,
      };
    });
  }, [socialAccounts.data, socialAccounts.isLoading]);

  const metricsData = useMemo(() => {
    const payload = creatorMetrics.data?.data;
    const hasMetrics = payload?.hasData && payload?.metrics;
    const metrics = payload?.metrics || {};
    const metadata = payload?.metadata || {};

    if (creatorMetrics.isLoading || !payload) {
      return {
        authenticAudience: null,
        engagementRate: "N/A",
        averageReach: "N/A",
        averageViews: "N/A",
        postingFrequency: "N/A",
      };
    }

    if (!hasMetrics) {
      return {
        authenticAudience: null,
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
          : String(n ?? "N/A");

    return {
      authenticAudience: metrics.authenticAudience?.value ?? null,
      engagementRate:
        engagementRateVal != null ? `${Number(engagementRateVal).toFixed(1)}%` : "N/A",
      averageReach: medianReach != null ? formatNum(medianReach) : "N/A",
      averageViews: averageViewsVal != null ? formatNum(averageViewsVal) : "N/A",
      postingFrequency: postsPerMonth != null ? `${postsPerMonth}/Month` : "N/A",
    };
  }, [creatorMetrics.data, creatorMetrics.isLoading]);

  // Full-page loading only on initial open (before social accounts arrive)
  const hasSocialAccounts = Array.isArray(socialAccounts.data);
  const isInitialLoading = !previewCreator?.id || (socialAccounts.isLoading && !hasSocialAccounts);

  return {
    stats,
    audience,
    socialAccounts,
    platformData,
    metricsData,
    isInitialLoading,
    metricsLoading: creatorMetrics.isLoading,
    audienceLoading: audience.isLoading,
    selectedPlatform,
    setSelectedPlatform,
    connectedPlatforms,
    creatorMetrics,
  };
}
