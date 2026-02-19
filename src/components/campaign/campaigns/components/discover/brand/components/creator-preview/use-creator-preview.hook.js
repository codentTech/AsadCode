import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  reset,
  fetchCreatorAudience,
  fetchCreatorSocialAccounts,
  fetchCreatorStats,
  selectCreatorAudience,
  selectCreatorSocialAccounts,
  selectCreatorStats,
} from "@/provider/features/phyllo/phyllo.slice";

export default function useCreatorPreview(previewCreator) {
  const dispatch = useDispatch();

  const stats = useSelector(selectCreatorStats);
  const audience = useSelector(selectCreatorAudience);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);

  useEffect(() => {
    if (previewCreator?.id) {
      dispatch(fetchCreatorStats(previewCreator.id));
      dispatch(fetchCreatorAudience(previewCreator.id));
      dispatch(fetchCreatorSocialAccounts(previewCreator.id));
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

    const platforms = socialAccounts.data.map((account) => ({
      name: platformMap[account.platform.toLowerCase()] || account.platform,
      followers: account.follower_count || 0,
      username: account.username,
      isVerified: account.is_verified,
      profileUrl: account.profile_url,
      profileImage: account.profile_image_url,
    }));

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
    if (stats.isLoading || !stats.data) {
      return {
        authenticAudience: 0,
        engagementRate: "0%",
        averageReach: "0",
        averageViews: 0,
        postingFrequency: "0/Month",
      };
    }

    return {
      authenticAudience: 0,
      engagementRate: "N/A",
      averageReach: "N/A",
      averageViews: 0,
      postingFrequency: "N/A",
    };
  };

  const isLoading = stats.isLoading || audience.isLoading || socialAccounts.isLoading;

  return {
    stats,
    audience,
    socialAccounts,
    platformData: platformData(),
    metricsData: metricsData(),
    isLoading,
  };
}
