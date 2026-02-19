import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatorStats,
  fetchCreatorAudience,
  fetchCreatorSocialAccounts,
  selectCreatorStats,
  selectCreatorAudience,
  selectCreatorSocialAccounts,
} from "@/provider/features/phyllo/phyllo.slice";

export default function useAudienceAnalytics(creatorId) {
  const dispatch = useDispatch();

  const stats = useSelector(selectCreatorStats);
  const audience = useSelector(selectCreatorAudience);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);

  useEffect(() => {
    if (creatorId) {
      dispatch(fetchCreatorStats(creatorId));
      dispatch(fetchCreatorAudience(creatorId));
      dispatch(fetchCreatorSocialAccounts(creatorId));
    }
  }, [creatorId, dispatch]);

  const isLoading = stats.isLoading || audience.isLoading || socialAccounts.isLoading;
  const isError = stats.isError || audience.isError || socialAccounts.isError;

  return {
    statsData: stats.data,
    audienceData: audience.data,
    socialData: socialAccounts.data,
    isLoading,
    isError,
    message: stats.message || audience.message || socialAccounts.message,
  };
}
