import { getDefaultCreatorPlatformFromConnectedList } from "@/common/utils/generic.util";
import { isActiveSocialAccount } from "@/common/utils/creator-platforms.utils";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import {
  fetchCreatorSocialAccounts,
  resetAudience,
  resetMetrics,
  resetSocialAccounts,
  resetStats,
  selectCreatorAudience,
  selectCreatorSocialAccounts,
} from "@/provider/features/phyllo/phyllo.slice";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useCreatorPortfolio(creatorId = null) {
  const dispatch = useDispatch();
  const user = getUser();
  const id = isCreatorMode() ? user?.id : creatorId;
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const audienceState = useSelector(selectCreatorAudience);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);

  useLayoutEffect(() => {
    setSelectedPlatform(null);
    dispatch(resetSocialAccounts());
    dispatch(resetStats());
    dispatch(resetAudience());
    dispatch(resetMetrics());
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchCreatorSocialAccounts(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedPlatform != null) return;
    if (!socialAccounts.isSuccess || !Array.isArray(socialAccounts.data)) return;
    const def = getDefaultCreatorPlatformFromConnectedList(socialAccounts.data);
    if (def) setSelectedPlatform(def);
  }, [id, selectedPlatform, socialAccounts.isSuccess, socialAccounts.data]);

  const hasConnectedSocialAccounts = useMemo(() => {
    if (!socialAccounts.isSuccess || !Array.isArray(socialAccounts.data)) return null;
    return socialAccounts.data.some(isActiveSocialAccount);
  }, [socialAccounts.isSuccess, socialAccounts.data]);

  const showMediaKitPrompt =
    !creatorId && isCreatorMode() && hasConnectedSocialAccounts === false;

  const handleProfileUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handlePlatformSelect = useCallback((platform) => {
    setSelectedPlatform(platform);
  }, []);

  return {
    id,
    refreshKey,
    selectedPlatform,
    audienceState,
    handleProfileUpdate,
    handlePlatformSelect,
    showMediaKitPrompt,
  };
}
