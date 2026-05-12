import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  reset,
  fetchCreatorAudience,
  fetchCreatorSocialAccounts,
  fetchCreatorMetrics,
  selectCreatorAudience,
  selectCreatorSocialAccounts,
  selectCreatorMetrics,
} from "@/provider/features/phyllo/phyllo.slice";
import { KNOWN_PLATFORMS, PLATFORM_PRIORITY } from "@/common/constants/genaric.constant";

export default function useCreatorPreview(previewCreator) {
  const dispatch = useDispatch();
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const audience = useSelector(selectCreatorAudience);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);
  const creatorMetrics = useSelector(selectCreatorMetrics);

  useEffect(() => {
    if (!previewCreator?.id) return;
    dispatch(fetchCreatorSocialAccounts(previewCreator.id));
    setSelectedPlatform(null);
    return () => {
      dispatch(reset());
    };
  }, [previewCreator?.id, dispatch]);

  // Derive connected platform names from social accounts
  const connectedPlatforms = useMemo(() => {
    const accounts = socialAccounts.data;
    if (!Array.isArray(accounts)) return [];
    return accounts.filter((a) => a.is_active).map((a) => String(a.platform).toLowerCase());
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
    const accounts = socialAccounts.data;
    const accountMap = {};
    if (Array.isArray(accounts)) {
      accounts
        .filter((a) => a.is_active)
        .forEach((a) => {
          const key = String(a.platform).toLowerCase();
          accountMap[key] = {
            username: a.username || a.profile_data?.username || null,
            followers: Number(
              a.follower_count ??
                a.profile_data?.follower_count ??
                a.profile_data?.subscriber_count ??
                0
            ),
            isVerified: a.is_verified,
            profileUrl: a.profile_url,
          };
        });
    }

    const LABEL = {
      instagram: "Instagram",
      youtube: "YouTube",
      twitter: "Twitter",
      tiktok: "TikTok",
      facebook: "Facebook",
    };

    const loading = socialAccounts.isLoading && !Array.isArray(accounts);

    return KNOWN_PLATFORMS.map((key) => ({
      key,
      name: LABEL[key] || key,
      followers: accountMap[key]?.followers ?? 0,
      username: accountMap[key]?.username ?? null,
      isVerified: accountMap[key]?.isVerified ?? false,
      profileUrl: accountMap[key]?.profileUrl ?? null,
      loading,
    }));
  }, [socialAccounts.data, socialAccounts.isLoading]);

  const metricsData = useMemo(() => {
    const payload = creatorMetrics.data?.data;
    const hasMetrics = payload?.hasData && payload?.metrics;
    const metrics = payload?.metrics || {};
    const metadata = payload?.metadata || {};

    if (creatorMetrics.isLoading || !payload) {
      return {
        authenticAudience: null,
        typicalViews: "N/A",
        engagementRate: "N/A",
        performanceConsistency: "N/A",
        growthRate30d: "N/A",
      };
    }

    if (!hasMetrics) {
      return {
        authenticAudience: null,
        typicalViews: "N/A",
        engagementRate: "N/A",
        performanceConsistency: "N/A",
        growthRate30d: "N/A",
      };
    }

    const engagementRateVal = metrics.engagementRate?.value;
    const performanceConsistencyVal = metrics.performanceConsistency?.value;
    const growthRate30dVal = metrics.growthRate30d?.value;
    const typicalViewsVal = metrics.averageViews?.value;

    const formatNum = (n) =>
      n >= 1_000_000
        ? `${(n / 1_000_000).toFixed(1)}M`
        : n >= 1_000
          ? `${(n / 1_000).toFixed(1)}K`
          : String(n ?? "N/A");

    return {
      authenticAudience: metrics.authenticAudience?.value ?? null,
      typicalViews: typicalViewsVal != null ? formatNum(typicalViewsVal) : "N/A",
      engagementRate:
        engagementRateVal != null ? `${Number(engagementRateVal).toFixed(1)}%` : "N/A",
      performanceConsistency:
        performanceConsistencyVal != null
          ? `${Number(performanceConsistencyVal).toFixed(0)}`
          : "N/A",
      growthRate30d:
        growthRate30dVal != null
          ? `${growthRate30dVal > 0 ? "+" : ""}${Number(growthRate30dVal).toFixed(1)}%`
          : "N/A",
    };
  }, [creatorMetrics.data, creatorMetrics.isLoading]);

  // Full-page loading only on initial open (before social accounts arrive)
  const hasSocialAccounts = Array.isArray(socialAccounts.data);
  const isInitialLoading = !previewCreator?.id || (socialAccounts.isLoading && !hasSocialAccounts);

  return {
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
