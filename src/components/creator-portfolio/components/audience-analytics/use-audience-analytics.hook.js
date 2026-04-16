import { getDefaultCreatorPlatformFromConnectedList } from "@/common/utils/generic.util";
import {
  fetchCreatorAudience,
  fetchCreatorSocialAccounts,
  fetchCreatorStats,
  selectCreatorAudience,
  selectCreatorSocialAccounts,
  selectCreatorStats,
} from "@/provider/features/phyllo/phyllo.slice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PLATFORM_ORDER = ["instagram", "tiktok", "youtube"];

function getDefaultPlatform(connectedPlatforms) {
  if (!Array.isArray(connectedPlatforms) || connectedPlatforms.length === 0) return null;
  const normalized = connectedPlatforms.map((p) => (typeof p === "string" ? p.toLowerCase() : p));
  for (const platform of PLATFORM_ORDER) {
    if (normalized.includes(platform)) return platform;
  }
  return normalized[0] || null;
}

export default function useAudienceAnalytics(
  creatorId,
  externalSelectedPlatform,
  onPlatformSelect
) {
  const dispatch = useDispatch();
  const [internalPlatform, setInternalPlatform] = useState(null);

  const stats = useSelector(selectCreatorStats);
  const audience = useSelector(selectCreatorAudience);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);

  const connectedPlatforms = useMemo(() => {
    return Array.isArray(socialAccounts?.data)
      ? socialAccounts.data.map((a) => a.platform).filter(Boolean)
      : [];
  }, [socialAccounts?.data]);

  useEffect(() => {
    if (creatorId) {
      dispatch(fetchCreatorSocialAccounts(creatorId));
    }
  }, [creatorId, dispatch]);

  useEffect(() => {
    setInternalPlatform(null);
  }, [creatorId]);

  useEffect(() => {
    if (connectedPlatforms.length > 0 && !internalPlatform) {
      const defaultPlatform = getDefaultCreatorPlatformFromConnectedList(connectedPlatforms);
      setInternalPlatform(defaultPlatform);
      if (onPlatformSelect && defaultPlatform) {
        onPlatformSelect(defaultPlatform);
      }
    }
  }, [connectedPlatforms.length, internalPlatform, onPlatformSelect]);

  const selectedPlatform = externalSelectedPlatform || internalPlatform;

  useEffect(() => {
    if (creatorId && selectedPlatform) {
      const payload = { creatorId, platform: selectedPlatform };
      dispatch(fetchCreatorStats(payload));
      dispatch(fetchCreatorAudience(payload));
    }
  }, [creatorId, selectedPlatform, dispatch]);

  const isLoading = stats.isLoading || audience.isLoading || socialAccounts.isLoading;
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
    selectedPlatform,
    platforms,
    totalFollowersAllPlatforms,
    handlePlatformClick,
    isLoading,
    isError,
    message: stats.message || audience.message || socialAccounts.message,
  };
}
