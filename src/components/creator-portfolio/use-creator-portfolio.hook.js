import { getDefaultCreatorPlatformFromConnectedList } from "@/common/utils/generic.util";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import {
  selectCreatorAudience,
  selectCreatorSocialAccounts,
} from "@/provider/features/phyllo/phyllo.slice";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useCreatorPortfolio(creatorId = null) {
  const user = getUser();
  const id = isCreatorMode() ? user?.id : creatorId;
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const audienceState = useSelector(selectCreatorAudience);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);

  useEffect(() => {
    setSelectedPlatform(null);
  }, [id]);

  useEffect(() => {
    if (selectedPlatform != null) return;
    if (!socialAccounts.isSuccess || !Array.isArray(socialAccounts.data)) return;
    const def = getDefaultCreatorPlatformFromConnectedList(socialAccounts.data);
    if (def) setSelectedPlatform(def);
  }, [id, selectedPlatform, socialAccounts.isSuccess, socialAccounts.data]);

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
  };
}
