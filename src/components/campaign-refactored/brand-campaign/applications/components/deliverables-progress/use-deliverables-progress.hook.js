import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { avatar } from "@/common/constants/auth.constant";
import { formatCreatorLocation } from "@/common/utils/creator-location.util";
import { getAge } from "@/common/utils/date.utils";
import {
  fetchCreatorMetrics,
  fetchCreatorAudience,
  fetchCreatorSocialAccounts,
  selectCreatorMetrics,
  selectCreatorAudience,
  selectCreatorSocialAccounts,
  resetMetrics,
  resetAudience,
} from "@/provider/features/phyllo/phyllo.slice";

import { PLATFORM_PRIORITY } from "@/common/constants/genaric.constant";
import { mapConnectedPlatformsForDisplay } from "@/common/utils/creator-platforms.utils";

const useDeliverablesProgress = (selectedCreator, isIndividualCreator) => {
  const dispatch = useDispatch();
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const creatorMetricsState = useSelector(selectCreatorMetrics);
  const creatorAudienceState = useSelector(selectCreatorAudience);
  const socialAccountsState = useSelector(selectCreatorSocialAccounts);

  const getCreatorData = () => {
    if (!selectedCreator) return null;

    if (selectedCreator.creator) {
      const creator = selectedCreator?.creator;
      const profile = creator?.creator_profile;
      const appliedDate = selectedCreator.applied_at || selectedCreator.created_at;

      return {
        id: selectedCreator.id || creator.id,
        name: `${creator.first_name || ""} ${creator.last_name || ""}`.trim(),
        image: profile?.profile_photo_url || avatar,
        location:
          formatCreatorLocation({
            city: creator.city,
            country: creator.country,
            state: creator.state,
            stateShort: creator.state_short,
          }) || "Location not specified",
        rating: parseFloat(profile?.rating) || 0,
        appliedDate: appliedDate ? new Date(appliedDate).toLocaleDateString() : "",
        pitch: selectedCreator.custom_message || selectedCreator.pitch || "",
        status: selectedCreator.status || "PENDING",
        profile: profile,
        bio: profile?.bio || "",
        age: getAge(creator.date_of_birth),
        reviewCount: profile?.review_count || 0,
      };
    }

    return selectedCreator;
  };

  const creatorData = useMemo(() => getCreatorData(), [selectedCreator]);

  const creatorProfileId = useMemo(() => {
    if (!selectedCreator) return null;
    return (
      selectedCreator?.creator?.creator_profile?.id || selectedCreator?.creator_profile?.id || null
    );
  }, [selectedCreator]);

  const creatorUserId = useMemo(() => {
    if (!selectedCreator) return null;
    return selectedCreator?.creator?.id || selectedCreator?.id || null;
  }, [selectedCreator]);

  const handleViewCreatorPortfolio = useCallback(() => {
    if (creatorUserId) {
      window.open(`/creator-profile/${creatorUserId}`, "_blank", "noopener,noreferrer");
    }
  }, [creatorUserId]);

  // Fetch social accounts whenever the creator changes; also reset platform + data
  useEffect(() => {
    if (!creatorUserId) return;
    setSelectedPlatform(null);
    dispatch(fetchCreatorSocialAccounts(creatorUserId));
    return () => {
      dispatch(resetMetrics());
      dispatch(resetAudience());
    };
  }, [creatorUserId, dispatch]);

  // Derive connected platform names (used for disabled check + auto-select)
  const connectedPlatforms = useMemo(() => {
    const accounts = socialAccountsState?.data;
    if (!Array.isArray(accounts)) return [];
    return accounts.filter((a) => a.is_active).map((a) => String(a.platform).toLowerCase());
  }, [socialAccountsState?.data]);

  // Enriched platform list: all known platforms with username + followers
  const platforms = useMemo(() => {
    const accounts = socialAccountsState?.data;
    const loading = socialAccountsState?.isLoading && !Array.isArray(accounts);
    return mapConnectedPlatformsForDisplay(accounts, { loading }).map((platform) => ({
      name: platform.key,
      username: platform.username,
      followers: platform.followers,
      profileUrl: platform.profileUrl,
      isConnected: true,
    }));
  }, [socialAccountsState?.data, socialAccountsState?.isLoading]);

  // Auto-select default platform: Instagram first, then first available
  useEffect(() => {
    if (connectedPlatforms.length === 0) return;
    const def =
      PLATFORM_PRIORITY.find((p) => connectedPlatforms.includes(p)) || connectedPlatforms[0];
    setSelectedPlatform(def);
  }, [connectedPlatforms]);

  // Fetch metrics + audience whenever creator or selected platform changes
  useEffect(() => {
    if (!creatorUserId || !selectedPlatform) return;
    dispatch(fetchCreatorMetrics({ creatorId: creatorUserId, platform: selectedPlatform }));
    dispatch(fetchCreatorAudience({ creatorId: creatorUserId, platform: selectedPlatform }));
  }, [creatorUserId, selectedPlatform, dispatch]);

  const metricsPayload = creatorMetricsState?.data?.data ?? null;
  const performanceMetrics = useMemo(() => {
    if (!metricsPayload?.metrics) return null;
    const m = metricsPayload.metrics;
    const meta = metricsPayload.metadata ?? {};
    return {
      engagement_rate:
        m.engagementRate?.value != null ? `${Number(m.engagementRate.value).toFixed(1)}%` : null,
      average_reach:
        meta.medianReach != null
          ? Number(meta.medianReach).toLocaleString()
          : m.reachEfficiency?.value != null
            ? `${Number(m.reachEfficiency.value).toFixed(1)}%`
            : null,
      average_views:
        m.averageViews?.value != null ? Number(m.averageViews.value).toLocaleString() : null,
      posting_frequency:
        meta.postsPerMonth != null ? `${Number(meta.postsPerMonth).toFixed(1)}/mo` : null,
    };
  }, [metricsPayload]);

  const audienceData = creatorAudienceState?.data ?? null;
  const audienceLoading = creatorAudienceState?.isLoading ?? false;

  return {
    creatorData,
    creatorProfileId,
    creatorUserId,
    handleViewCreatorPortfolio,
    performanceMetrics,
    performanceMetricsLoading: creatorMetricsState?.isLoading ?? false,
    audienceData,
    audienceLoading,
    selectedPlatform,
    setSelectedPlatform,
    connectedPlatforms,
    platforms,
  };
};

export default useDeliverablesProgress;
