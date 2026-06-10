import { getDefaultCreatorPlatformFromConnectedList } from "@/common/utils/generic.util";
import {
  fetchCreatorAudience,
  fetchCreatorStats,
  selectCreatorAudience,
  selectCreatorSocialAccounts,
  selectCreatorStats,
} from "@/provider/features/phyllo/phyllo.slice";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useAudienceAnalytics(
  creatorId,
  externalSelectedPlatform,
  onPlatformSelect
) {
  const dispatch = useDispatch();

  const stats = useSelector(selectCreatorStats);
  const audience = useSelector(selectCreatorAudience);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);

  const connectedPlatforms = useMemo(() => {
    return Array.isArray(socialAccounts?.data)
      ? socialAccounts.data.map((a) => a.platform).filter(Boolean)
      : [];
  }, [socialAccounts?.data]);

  const resolvedPlatform = useMemo(() => {
    if (externalSelectedPlatform) return externalSelectedPlatform;
    if (!socialAccounts.isSuccess || !Array.isArray(socialAccounts.data)) return null;
    return getDefaultCreatorPlatformFromConnectedList(socialAccounts.data);
  }, [externalSelectedPlatform, socialAccounts.isSuccess, socialAccounts.data]);

  useEffect(() => {
    if (creatorId && resolvedPlatform) {
      const payload = { creatorId, platform: resolvedPlatform };
      dispatch(fetchCreatorStats(payload));
      dispatch(fetchCreatorAudience(payload));
    }
  }, [creatorId, resolvedPlatform, dispatch]);

  const isLoading =
    socialAccounts.isLoading ||
    (Boolean(resolvedPlatform) && (stats.isLoading || audience.isLoading));
  const isError = stats.isError || audience.isError || socialAccounts.isError;

  const platforms = useMemo(() => {
    return Array.isArray(socialAccounts?.data)
      ? socialAccounts.data.map((p) => ({
          name: p.platform,
          username: p.username,
          profileUrl: p.profile_url,
          followers: p.follower_count,
          isVerified: p.is_verified,
        }))
      : [];
  }, [socialAccounts?.data]);

  const totalFollowersAllPlatforms = useMemo(() => {
    return platforms.reduce((sum, p) => sum + (Number(p.followers) || 0), 0);
  }, [platforms]);

  const handlePlatformClick = (platform) => {
    if (onPlatformSelect) {
      onPlatformSelect(platform);
    }
  };

  return {
    statsData: stats.data,
    audienceData: audience.data,
    socialData: socialAccounts.data,
    connectedPlatforms,
    selectedPlatform: resolvedPlatform,
    platforms,
    totalFollowersAllPlatforms,
    handlePlatformClick,
    isLoading,
    isError,
    message: stats.message || audience.message || socialAccounts.message,
  };
}
