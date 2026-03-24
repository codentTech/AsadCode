import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectCreatorAudience } from "@/provider/features/phyllo/phyllo.slice";
import { getUser, isCreatorMode } from "@/common/utils/users.util";

export default function useCreatorPortfolio(creatorId = null) {
  const user = getUser();
  const id = isCreatorMode() ? user?.id : creatorId;
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const audienceState = useSelector(selectCreatorAudience);

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
